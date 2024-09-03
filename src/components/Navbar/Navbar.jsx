import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/freshcart-logo.svg";
import { FaHeart } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { PiSignInBold, PiSignOut } from "react-icons/pi";
import { userContext } from "../../Context/userContext";
import { CartContext } from "../../Context/CartContext";
import { WishlistContext } from "../../Context/WishlistContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { userLogin, setuserLogin } = useContext(userContext);
  const { cartItemsNo, cartItemsTotal, getCartItems } = useContext(CartContext);
  const { wishlistItemsNo } = useContext(WishlistContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);

  const handleSignout = () => {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setCartOpen(false);
  };

  const toggleCart = (e) => {
    e.stopPropagation();
    setCartOpen(!cartOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userLogin) {
      getCartItems();
    }
  }, [userLogin, getCartItems]);

  const renderCartContent = () => (
    <div className="card-body">
      <span className="text-lg font-bold">{cartItemsNo} Items</span>
      <span className="text-green-800">Subtotal: {cartItemsTotal}</span>
      <div className="card-actions">
        <Link
          className="btn bg-emerald-400 btn-block"
          to="/cart"
          onClick={() => { setCartOpen(false); setDropdownOpen(false); }}
        >
          View cart
        </Link>
        <Link
          className="btn bg-light-green btn-block mt-2"
          to="/allorders"
          onClick={() => { setCartOpen(false); setDropdownOpen(false); }}
        >
          My Orders
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown" ref={dropdownRef}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
              onClick={toggleDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {dropdownOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
              >
                {userLogin ? (
                  <>
                    <li><Link to="" onClick={() => setDropdownOpen(false)}>Home</Link></li>
                    <li><Link to="/products" onClick={() => setDropdownOpen(false)}>Products</Link></li>
                    <li><Link to="/categories" onClick={() => setDropdownOpen(false)}>Categories</Link></li>
                    <li><Link to="/brands" onClick={() => setDropdownOpen(false)}>Brands</Link></li>
                    <li className="menu-title">
                      <span>Cart ({cartItemsNo})</span>
                    </li>
                    <li>
                      <Link to="/cart" onClick={() => setDropdownOpen(false)}>View Cart</Link>
                    </li>
                    <li>
                      <Link to="/allorders" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                    </li>
                    <li className="menu-title">
                      <span>Wishlist ({wishlistItemsNo})</span>
                    </li>
                    <li>
                      <Link to="/wishlist" onClick={() => setDropdownOpen(false)}>View Wishlist</Link>
                    </li>
                    <li>
                      <button onClick={handleSignout} className="text-red-500">
                        <PiSignOut /> Signout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" onClick={() => setDropdownOpen(false)}>
                        <PiSignInBold /> Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" onClick={() => setDropdownOpen(false)}>
                        <FaUserPlus /> Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
          <Link className="btn" to="">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          {userLogin && (
            <ul className="menu menu-horizontal px-1">
              <li><Link to="">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/brands">Brands</Link></li>
            </ul>
          )}
        </div>

        <div className="navbar-end">
          {userLogin && (
            <>
              <div className="hidden lg:block relative" ref={cartRef}>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={toggleCart}
                >
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {cartItemsNo > 0 && (
                      <span className="badge badge-sm indicator-item bg-dark-green text-white">
                        {cartItemsNo}
                      </span>
                    )}
                  </div>
                </button>
                {cartOpen && (
                  <div className="absolute right-0 mt-2 w-52 card card-compact dropdown-content bg-base-100 z-[50] shadow">
                    {renderCartContent()}
                  </div>
                )}
              </div>
              <Link className="hidden lg:flex btn btn-circle" to="/wishlist">
                <div className="indicator">
                  <FaHeart className="text-lg" />
                  {wishlistItemsNo > 0 && (
                    <span
                      className="badge badge-sm indicator-item bg-dark-green text-white"
                      style={{ top: "-4px", right: "-5px" }}
                    >
                      {wishlistItemsNo}
                    </span>
                  )}
                </div>
              </Link>
            </>
          )}

          {userLogin ? (
            <button
              className="hidden lg:flex btn btn-ghost bg-red-400 text-white ms-3 hover:bg-red-600"
              onClick={handleSignout}
            >
              <PiSignOut />
              Signout
            </button>
          ) : (
            <div className="hidden lg:flex">
              <Link
                className="btn btn-ghost bg-light-green text-white ms-3 hover:bg-green-600"
                to="/login"
              >
                <PiSignInBold />
                Login
              </Link>
              <Link
                className="btn btn-ghost bg-light-green text-white ms-3 hover:bg-green-600"
                to="/register"
              >
                <FaUserPlus />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}