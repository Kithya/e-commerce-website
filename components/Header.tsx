import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded } from "@clerk/nextjs";

const Header = async () => {
  const user = await currentUser();

  return (
    <header className="bg-white py-5">
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
            <SignIn />
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
