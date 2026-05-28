import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { Flame, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToWishlistButton from "./AddToWishlistButton";
import { Title } from "./ui/text";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="text-sm border rounded-md border-dark-blue/20 group bg-white">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product.images && (
          <Link href={`/product/${product.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="ProductImage"
              width={500}
              height={500}
              priority
              className={`wfull h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg hoverEffect ${product.stock !== 0 ? "group-hover:scale-110" : "opacity-50"}`}
            />
          </Link>
        )}
        <AddToWishlistButton product={product} />
        {product.status === "sale" && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-dark-color/50 px-2 rounded-full hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">
            Sale!
          </p>
        )}

        {product.status === "new" && (
          <p className="absolute top-2 left-2 z-10 text-xs border border-dark-color/50 px-2 rounded-full hover:border-shop_light_green group-hover:text-shop_light_green hoverEffect">
            New!
          </p>
        )}

        {product.status === "hot" && (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={16}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-light-text">
            {product.categories?.map((category) => category).join(", ")}
          </p>
        )}
        <Title className="text-sm line-clamp-2">{product?.name}</Title>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className={
                  index < 4 ? "text-shop_light_green" : " text-light-text"
                }
                fill={index < 4 ? "#93D991" : "#ababab"}
              />
            ))}
          </div>
          <p className="text-xs text-light-text tracking-wide">Reviews</p>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product.stock === 0 ? "text-red-500" : "text-shop_dark_green/80 font-semibold"}`}
          >
            {(product.stock as number) > 0 ? product.stock : "Out of Stock"}
          </p>
        </div>
        <PriceView
          price={product.price}
          discount={product.discount}
          className="text-sm"
        />

        <AddToCartButton product={product} className={"w-36 rounded-full"} />
      </div>
    </div>
  );
};

export default ProductCard;
