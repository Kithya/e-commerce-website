import { productType } from "@/constants/data";
import Link from "next/link";
import React from "react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-5">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        {productType.map((item, index) => (
          <button
            onClick={() => onTabSelect(item.title)}
            key={item.title}
            className={`border border-shop_light_green/20 rounded-full px-4 py-1.5 md:px-6 md:py-2 hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item.title ? "bg-shop_light_green text-white border-shop_light_green" : "bg-shop_light_green/20"}`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <Link
        href="/shop"
        className={`border border-shop_light_green/30 rounded-full px-4 py-1.5 md:px-6 md:py-2 hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect`}
      >
        See All
      </Link>
    </div>
  );
};

export default HomeTabBar;
