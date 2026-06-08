"use client";
import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import NoAccess from "@/components/NoAccess";
import { Address } from "@/sanity.types";
import useStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { ShoppingBag, Trash } from "lucide-react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddToWishlistButton from "@/components/AddToWishlistButton";
import { toast } from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButton from "@/components/QuantityButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import createCheckoutSession from "@/actions/createCheckoutSession";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    let cancelled = false;
    const query = `*[_type=="address"] | order(createdAt desc)`;

    client
      .fetch<Address[]>(query)
      .then((data) => {
        if (cancelled) {
          return;
        }

        setAddresses(data);
        const defaultAddress = data.find((addr: Address) => addr.default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (data.length > 0) {
          setSelectedAddress(data[0]); // Optional: select first address if no default
        }
      })
      .catch((error) => {
        console.log("Addresses fetching error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure you want to reset cart?");
    if (!confirmed) return;
    resetCart();
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName || "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress || "Unknown",
        clerkUserId: user?.id,
        address: selectedAddress,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      console.log("Checkout URL:", checkoutUrl);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag className="text-darkColor" />
                <Title>Shopping Cart</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {groupedItems.map(({ product }) => {
                      const itemCount = getItemCount(product._id);
                      return (
                        <div
                          key={product._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                            {product.images && (
                              <Link
                                href={`/product/${product.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product.images[0]).url()}
                                  alt="productImage"
                                  height={500}
                                  width={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}

                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="flex flex-col gap-0.5 md:gap-1.5">
                                <h2 className="text-base font-semibold line-clamp-1">
                                  {product.name}
                                </h2>
                                <p className="text-sm capitalize">
                                  Variant:{" "}
                                  <span className="font-semibold">
                                    {product.variant}
                                  </span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {product.status}
                                  </span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AddToWishlistButton
                                        product={product}
                                        className="relative top-0 right-0"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className={"font-bold"}>
                                      Add To Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => {
                                          deleteCartProduct(product._id);
                                          toast.success(
                                            "Product deleted successfully!",
                                          );
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 mr-1 to-gray-500 hover:text-red-500 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent
                                      className={"font-semibold text-red-400"}
                                    >
                                      Delete Product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                            <PriceFormatter
                              amount={(product.price as number) * itemCount}
                              className="font-bold text-lg"
                            />
                            <QuantityButton product={product} />
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      className={"m-5 p-5 font-semibold"}
                      onClick={handleResetCart}
                      variant={"destructive"}
                    >
                      Reset Cart
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="lg:col-span-1">
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      {" "}
                      <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>SubTotal</span>
                          <PriceFormatter amount={getSubTotalPrice()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <PriceFormatter
                            amount={getSubTotalPrice() - getTotalPrice()}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold text-lg">
                          <span>Total</span>
                          <PriceFormatter amount={getTotalPrice()} />
                        </div>
                        <Button
                          className={
                            "w-full rounded-full font-medium tracking-wide hoverEffect bg-green-800"
                          }
                          onClick={handleCheckout}
                          disabled={loading}
                          size={"lg"}
                        >
                          {loading ? "Please wait..." : "Proceed to Checkout"}
                        </Button>
                      </div>
                    </div>
                    <div>
                      {addresses && (
                        <div className="bg-white rounded-md mt-5">
                          <Card>
                            <CardHeader>
                              <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <RadioGroup
                                value={selectedAddress?._id}
                                onValueChange={(value) => {
                                  const address = addresses.find(
                                    (address) => address._id === value,
                                  );
                                  if (address) {
                                    setSelectedAddress(address);
                                  }
                                }}
                              >
                                {addresses.map((address) => (
                                  <div
                                    key={address._id}
                                    onClick={() => setSelectedAddress(address)}
                                    className={`flex items-center space-x-2 mb-4 cursor-pointer ${selectedAddress?._id === address?._id && "text-shop_dark_green"}`}
                                  >
                                    <RadioGroupItem
                                      id={`address-${address._id}`}
                                      value={address._id.toString()}
                                    />
                                    <Label
                                      htmlFor={`address-${address._id}`}
                                      className="grid gap-1.5 flex-1 cursor-pointer"
                                    >
                                      <span className="font-semibold">
                                        {address.name}
                                      </span>
                                      <span className="text-sm text-black/60">
                                        {address.address}, {address.city},{" "}
                                        {address.state} {address.zip}
                                      </span>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              <Button variant="outline" className="w-full mt-4">
                                Add New Address
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order summary for mobile view */}
                <div className="md:hidden">
                  <div className="w-full bg-white p-6 rounded-lg border">
                    {" "}
                    <h2 className="text-xl font-semibold mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>SubTotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubTotalPrice() - getTotalPrice()}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total</span>
                        <PriceFormatter amount={getTotalPrice()} />
                      </div>
                      <Button
                        className={
                          "w-full rounded-full font-medium tracking-wide hoverEffect bg-green-800"
                        }
                        onClick={handleCheckout}
                        disabled={loading}
                        size={"lg"}
                      >
                        {loading ? "Please wait..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;
