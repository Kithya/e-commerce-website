import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className=" bg-white border-t">
      <Container>
        <FooterTop />

        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-5 ">
            <Logo />
            <SubText className="text-gray-600 text-sm">
              Discover curated furniture collections at Shopcartyt, blending
              style and comfort to elevate your living spaces.
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>
          <div>
            <SubTitle>Quick Links</SubTitle>
            {quickLinksData.map((item, index) => (
              <ul key={item.title} className="space-y-4 mt-4">
                <li>
                  <Link
                    href={item.href}
                    className="hover:text-shop_light_green font-medium hoverEffect"
                  >
                    {item.title}
                  </Link>
                </li>
              </ul>
            ))}
          </div>
          <div>
            <SubTitle>Categories</SubTitle>
            {categoriesData.map((item, index) => (
              <ul key={item.title} className="space-y-4 mt-4">
                <li>
                  <Link
                    href={`/category/${item.href}`}
                    className="hover:text-shop_light_green font-medium hoverEffect"
                  >
                    {item.title}
                  </Link>
                </li>
              </ul>
            ))}
          </div>
          <div className="space-y-4">
            <SubTitle>Newsletter</SubTitle>
            <SubText className="text-gray-600 text-sm">
              Subscribe to our newsletter for exclusive offers and updates.
            </SubText>
            <form action="" className="space-x-3">
              <Field>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  required
                  className="h-10"
                />
                <Button className={"w-full"}>Subscribe</Button>
              </Field>
            </form>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />. All
            rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
