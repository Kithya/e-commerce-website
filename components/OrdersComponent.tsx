"use client";

import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { ExternalLink, X } from "lucide-react";
import OrderDetailDialog from "./OrderDetailDialog";
import { toast } from "react-hot-toast";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERY_RESULT }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERY_RESULT[number] | null
  >(null);
  const handleDelete = () => {
    toast.error("Delete method applied for Admin");
  };
  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => (
            <Tooltip key={order._id}>
              <TooltipTrigger
                render={
                  <TableRow
                    className="h-12 cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedOrder(order)}
                  />
                }
              >
                <TableCell className="font-medium">
                  {order.orderNumber
                    ? `${order.orderNumber.slice(-10)}...`
                    : "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.orderDate
                    ? format(new Date(order.orderDate), "dd/MM/yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell>{order.customerName ?? "N/A"}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {order.email ?? "N/A"}
                </TableCell>
                <TableCell>
                  <PriceFormatter
                    amount={order.totalPrice}
                    className="text-black font-medium"
                  />
                </TableCell>
                <TableCell>
                  {order.status ? (
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        order.status === "paid" || order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status.replaceAll("_", " ")}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <p className="line-clamp-1 font-medium">
                    {order.invoice?.number ?? "----"}
                  </p>
                </TableCell>
                <TableCell
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete();
                  }}
                  className="flex items-center justify-center group"
                >
                  <X
                    size={20}
                    className="group-hover:text-shop_dark_green hoverEffect"
                  />
                </TableCell>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see order details</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
