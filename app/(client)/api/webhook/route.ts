import { Metadata } from "@/actions/createCheckoutSession";
import { stripe } from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    try {
      await createOrderInSanity(session, invoice);
    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(
  session: Stripe.Checkout.Session,
  invoice: Stripe.Invoice | null,
) {
  const {
    id,
    amount_total,
    customer,
    customer_details,
    currency,
    metadata,
    payment_intent,
    total_details,
  } = session;

  if (!metadata?.orderNumber || !metadata.customerEmail) {
    throw new Error(`Checkout session ${id} is missing required order metadata`);
  }

  const { orderNumber, customerName, customerEmail, clerkUserId, address } =
    metadata as unknown as Metadata & { address: string };
  const parsedAddress = parseAddress(address);
  const stripeCustomerId =
    typeof customer === "string" ? customer : customer?.id || customerEmail;
  const stripePaymentIntentId =
    typeof payment_intent === "string"
      ? payment_intent
      : payment_intent?.id || "";

  if (!stripePaymentIntentId) {
    throw new Error(`Checkout session ${id} is missing a payment intent`);
  }

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] },
  );

  // Create Sanity product references and prepare stock updates
  const sanityProducts = [];
  const stockUpdates = [];
  for (const item of lineItemsWithProduct.data) {
    const productId = (item.price?.product as Stripe.Product).metadata.id;
    const quantity = item.quantity || 0;

    if (!productId) continue;

    sanityProducts.push({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: productId,
      },
      quantity,
    });
    stockUpdates.push({
      productId,
      quantity,
    });
  }

  // Create order in sanity
  const order = await backendClient.createIfNotExists({
    _id: `order.${id}`,
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId,
    customerName: customerName || customer_details?.name || "Unknown",
    stripeCustomerId,
    clerkUserId: clerkUserId || "guest",
    email: customerEmail || customer_details?.email || "",
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,

    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    invoice: invoice
      ? {
          id: invoice.id,
          number: invoice.number,
          hosted_invoice_url: invoice.hosted_invoice_url,
        }
      : null,
    address: parsedAddress
      ? {
          state: parsedAddress.state,
          zip: parsedAddress.zip,
          city: parsedAddress.city,
          address: parsedAddress.address,
          name: parsedAddress.name,
        }
      : null,
  });

  // Update stock level in sanity
  await updateStockLevels(stockUpdates);
  return order;
}

function parseAddress(address?: string | null) {
  if (!address || address === "null") {
    return null;
  }

  try {
    return JSON.parse(address);
  } catch (error) {
    console.warn("Failed to parse checkout address metadata:", error);
    return null;
  }
}

async function updateStockLevels(
  stockUpdates: { productId: string; quantity: number }[],
) {
  for (const { productId, quantity } of stockUpdates) {
    try {
      // Fetch the product from Sanity
      const product = await backendClient.getDocument(productId);

      if (!product || typeof product.stock !== "number") {
        console.warn(
          `Product with ID ${productId} not found or stock is invalid.`,
        );
        continue;
      }

      const newStock = Math.max(product.stock - quantity, 0);

      await backendClient.patch(productId).set({ stock: newStock }).commit();
    } catch (error) {
      console.error(`Failed to update stock for product ${productId}:`, error);
    }
  }
}
