import React, { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "../../CSS/navigation.css";

const Navigation = () => {
  // States
  const [authToken, setAuthToken] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    contact: "",
    email: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
    if (token) {
      fetchProfile();
    }
  }, []);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/users/my-profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setProfile(response.data.data);
      setFormData({
        name: response.data.data.name,
        username: response.data.data.username,
        contact: response.data.data.contact,
        email: response.data.data.email,
      });
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data.message);
    }
  };

  // Toggle functions
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  // Handle profile click
  const handleProfileClick = () => {
    navigate("/my-profile");
    setDropdownOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    setAuthToken(null);
    // If using Redux, dispatch logout action
    // dispatch(logout());
    navigate("/login");
    setDropdownOpen(false);
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
      </div>

      {/* User Profile and Dropdown */}
      <div className="relative mb-24">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-white focus:outline-none mt-[-4px]"
        >
          <FaUserCircle className="mr-2" size={20} />
          <span className="text-white hidden nav-item-name">
            {authToken ? profile.username || "User" : "Guest"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 hidden nav-item-name mt-[-4px] ${
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
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && authToken && (
          <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700 z-20">
            <button
              onClick={handleProfileClick}
              className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
            >
              My Profile
            </button>

            {/* Admin Options */}
            {profile.isAdmin && (
              <>
                <div className="px-4 py-1 bg-gray-700 text-sm font-semibold text-gray-300">
                  Admin Options
                </div>
                <Link
                  to="/admin/dashboard"
                  className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/productlist"
                  className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/admin/categorylist"
                  className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Category
                </Link>
                <Link
                  to="/admin/orderlist"
                  className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/userlist"
                  className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Users
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Auth links */}
      {!authToken ? (
        <ul className="mb-8">
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2 mb-4"
            >
              <AiOutlineLogin className="mr-2" size={26} />
              <div className="span hidden nav-item-name">Login</div>
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd className="mr-2" size={26} />
              <div className="span hidden nav-item-name">Register</div>
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="mb-8">
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin className="mr-2" size={26} />
              <div className="span hidden nav-item-name">Logout</div>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
