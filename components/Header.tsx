import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;

  if (userId) {
    orders = await getMyOrders(userId, user?.emailAddresses[0]?.emailAddress);
  }

  return (
    <header className="bg-white/70 py-5 sticky z-50 top-0 backdrop-blur-md">
      <Container classname="flex items-center justify-between text-light-color">
        {/* Logo */}
        <div className="w-auto md:w-1/3 flex items-center gap-3 justify-start md:gap-0 ">
          <MobileMenu />
          <Logo />
        </div>
        {/* Navbutton */}
        <HeaderMenu />
        {/* User Profile */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />
          <ClerkLoaded>
            {user && (
              <Link
                href={"/orders"}
                className="group relative hover:text-shop_light_green hoverEffect"
              >
                <Logs />
                <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {orders?.length ? orders?.length : 0}
                </span>
              </Link>
            )}
            <SignIn />
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
