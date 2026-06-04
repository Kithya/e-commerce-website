"use client";
import useStore from "@/store";
import React, { useState } from "react";
import Container from "./Container";
import { ChevronDown, ChevronUp, Heart, RotateCcw, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";

const INITIAL_VISIBLE_PRODUCTS = 7;
const PRODUCTS_PER_PAGE = 5;

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(
    INITIAL_VISIBLE_PRODUCTS,
  );
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const showingProducts = Math.min(visibleProducts, favoriteProduct.length);
  const canLoadMore = visibleProducts < favoriteProduct.length;
  const canLoadLess = visibleProducts > INITIAL_VISIBLE_PRODUCTS;

  const loadMore = () => {
    setVisibleProducts((prev) =>
      Math.min(prev + PRODUCTS_PER_PAGE, favoriteProduct.length),
    );
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your wishlist?",
    );
    if (confirmReset) {
      resetFavorite();
      setVisibleProducts(INITIAL_VISIBLE_PRODUCTS);
      toast.success("Wishlist reset successfully");
    }
  };

  return (
    <Container>
      {favoriteProduct.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left hidden md:table-cell">
                    Category
                  </th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-center md:text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  .slice(0, visibleProducts)
                  .map((product: Product) => (
                    <tr key={product._id} className="border-b">
                      <td className="px-2 py-4 flex items-center gap-2">
                        <X
                          size={18}
                          onClick={() => {
                            removeFromFavorite(product._id);
                            toast.success("Product removed from wishlist");
                          }}
                          className="hover:text-red-600 hover:cursor-pointer hoverEffect"
                        />
                        {product.images && (
                          <Link
                            href={`/product/${product.slug?.current}`}
                            className="border rounded-md group hidden md:inline-flex"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt="ProductImage"
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain"
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1">{product.name}</p>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product.variant}
                      </td>
                      <td
                        className={`p-2 w-24 ${
                          (product?.stock as number) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-medium text-sm hidden md:table-cell`}
                      >
                        {(product?.stock as number) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price} />
                      </td>
                      <td className="p-2">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="my-6 flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {showingProducts}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {favoriteProduct.length}
              </span>{" "}
              saved items
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {(canLoadMore || canLoadLess) && (
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  {canLoadMore && (
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      className="w-full sm:w-auto"
                    >
                      <ChevronDown />
                      Load More
                    </Button>
                  )}
                  {canLoadLess && (
                    <Button
                      onClick={() =>
                        setVisibleProducts(INITIAL_VISIBLE_PRODUCTS)
                      }
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <ChevronUp />
                      Load Less
                    </Button>
                  )}
                </div>
              )}
              <Button
                onClick={handleResetWishlist}
                className="w-full font-semibold sm:w-auto"
                variant="destructive"
                size="lg"
              >
                <RotateCcw />
                Reset Wishlist
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground">
              Items added to your wishlist will appear here
            </p>
          </div>
          <Button className={"p-5 bg-green-800"}>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
