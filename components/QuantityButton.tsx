import { Product } from "@/sanity.types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButton = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product._id);
    if (itemCount > 1) {
      toast.success("Quantity Decreased successfully!");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

  const handleAddToCart = () => {
    if ((product.stock as number) > itemCount) {
      addItem(product);
      toast.success(`${product.name?.substring(0, 12)}... added to cart`);
    } else {
      toast.error("Can not add more than available stock");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
        variant={"outline"}
        disabled={itemCount === 0 || isOutOfStock}
        onClick={handleRemoveProduct}
      >
        <MinusIcon />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
        variant={"outline"}
        disabled={isOutOfStock}
        onClick={handleAddToCart}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default QuantityButton;
