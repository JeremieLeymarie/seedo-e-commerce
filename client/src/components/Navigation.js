import React from "react";
import User from "../assets/userGreen.png";
import Shop from "../assets/shopGreen.png";
import Logo from "../assets/logoSeedo.png";
import Search from "../assets/searchWhite.png";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { useState } from "react";

export default function Navbar(props) {
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);

  const handleCart = () => {
    setOpenCart(!openCart);
  };

  return (
    <div id="navbar">
      <div id="logo" onClick={() => navigate("/")}>
        <img id="graine" src={Logo} alt="Seed_logo" />
      </div>
      <form className="search_bar">
        <input
          className="search"
          id="search"
          type="text"
          placeholder="Search"
        />
        <img id="loupe" src={Search} alt="search_logo" />
      </form>
      <div id="icon">
        <img id="Shop" src={Shop} alt="Shop_logo" onClick={handleCart} />
        <img
          id="User"
          src={User}
          onClick={() => navigate("/profile")}
          alt="User_logo"
        />
        {openCart && <Cart cart={props.cart} />}
      </div>
    </div>
  );
}