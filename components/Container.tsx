import { cn } from "@/lib/utils";
import React from "react";

const Container = ({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-4", classname)}>{children}</div>
  );
};

export default Container;
