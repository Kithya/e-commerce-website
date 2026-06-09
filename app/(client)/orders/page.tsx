import { getMyOrders } from "@/sanity/queries";
import { auth } from "@clerk/nextjs/server";
import Container from "@/components/Container";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrdersComponent from "@/components/OrdersComponent";
import { ShoppingBag } from "lucide-react";

const OrderPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);

  return (
    <div>
      <Container classname="py-10">
        {orders.length ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Order List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] md:w-auto">
                        Order Number
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Invoice Number
                      </TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders} />
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your completed purchases will show up here after checkout.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-shop_dark_green px-5 py-2.5 text-sm font-semibold text-white hover:bg-shop_light_green"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrderPage;
