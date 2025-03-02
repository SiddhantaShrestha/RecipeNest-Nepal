import React from "react";
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS/navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice1";
import { userApiSlice } from "../../redux/api/userApiSlice";

const Navigation = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log("Auth state:", { user, isAuthenticated });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      // Clear user data from cache when logging out
      dispatch(userApiSlice.util.resetApiState());
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <div className="span hidden nav-item-name mt-[3rem]">HOME</div>
        </Link>
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <div className="span hidden nav-item-name mt-[3rem]">Shop</div>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={26} />
          <div className="span hidden nav-item-name mt-[3rem]">Cart</div>
        </Link>
        <Link
          to="/favorite"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart className="mr-2 mt-[3rem]" size={26} />
          <div className="span hidden nav-item-name mt-[3rem]">Favorite</div>
        </Link>

        {/* Add User Management link for admin users */}
        {isAuthenticated && user?.isAdmin && (
          <Link
            to="/admin/users"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
            <div className="span hidden nav-item-name mt-[3rem]">Users</div>
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-8000 focus:outline-none"
        >
          {isAuthenticated && user ? (
            <span className="text-white">
              {user.name ||
                user.username ||
                user.email?.split("@")[0] ||
                "User"}
            </span>
          ) : (
            <span className="text-white">Guest</span>
          )}
          {user && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {/* Add dropdown menu for logged-in users */}
        {dropdownOpen && isAuthenticated && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-black hover:bg-gray-100"
            >
              Profile
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin/users"
                className="block px-4 py-2 text-black hover:bg-gray-100"
              >
                User Management
              </Link>
            )}
            <button
              onClick={logoutHandler}
              className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Auth links - conditionally render based on authentication status */}
      <ul>
        {!isAuthenticated ? (
          <>
            <li>
              <Link
                to="/login"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
                <div className="span hidden nav-item-name mt-[3rem]">Login</div>
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd className="mr-2 mt-[3rem]" size={26} />
                <div className="span hidden nav-item-name mt-[3rem]">
                  Register
                </div>
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={logoutHandler}
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2 mt-[3rem]" size={26} />
              <div className="span hidden nav-item-name mt-[3rem]">Logout</div>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
