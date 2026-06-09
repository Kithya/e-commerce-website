"use server";

import { createOrderInSanity } from "@/lib/createOrderInSanity";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Stripe } from "stripe";

export async function syncCheckoutSessionOrder(sessionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to sync an order.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error(`Checkout session ${sessionId} has not been paid.`);
  }

  if (session.metadata?.clerkUserId !== userId) {
    throw new Error("This checkout session does not belong to the signed-in user.");
  }

  const invoice = session.invoice
    ? await stripe.invoices.retrieve(session.invoice as string)
    : null;

  await createOrderInSanity(session as Stripe.Checkout.Session, invoice);
  revalidatePath("/orders");
}
