import React, { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { FaHeart, FaUserCircle, FaUtensils, FaBlog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "../../CSS/navigation.css";
import FavoritesCount from "../Products/FavoritesCount";

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

  const { cartItems } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
    if (token) {
      fetchProfile();
    }
  }, [auth.token]);

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
      className="fixed flex flex-col h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 w-20 hover:w-64 group overflow-hidden"
      id="navigation-container"
    >
      {/* Logo Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <svg
          className="w-8 h-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h1 className="ml-3 text-xl font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
          SHOP
        </h1>
      </div>

      {/* User Profile Section (No Logout) - At Top */}
      <div className="border-b border-gray-800 py-4 px-4">
        {!authToken ? (
          <div className="space-y-4">
            <Link
              to="/login"
              className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
            >
              <AiOutlineLogin size={24} />
              <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                Login
              </span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
            >
              <AiOutlineUserAdd
                size={24}
                className="min-w-6 min-h-6 text-gray-300"
              />

              <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                Register
              </span>
            </Link>
          </div>
        ) : (
          <div>
            {/* User Profile Button */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center w-full px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
              >
                <FaUserCircle size={24} className="text-indigo-500" />
                <div className="ml-4 text-left opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="font-medium text-white">
                    {profile.username || "User"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {profile.isAdmin ? "Admin" : "Member"}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute left-0 w-64 mt-2 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700 z-50">
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

                  <div className="border-t border-gray-700 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden py-8">
        <nav className="px-4 space-y-6">
          <Link
            to="/"
            className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
          >
            <AiOutlineHome
              size={24}
              className="min-w-6 min-h-6 text-gray-300"
            />
            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              Home
            </span>
          </Link>

          {/* Recipes Link - NEW */}
          <Link
            to="/recipes"
            className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
          >
            <FaUtensils size={22} className="min-w-6 min-h-6 text-gray-300" />
            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              Recipes
            </span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1 "
          >
            <AiOutlineShopping
              size={24}
              className="min-w-6 min-h-6 text-gray-300"
            />

            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              Shop
            </span>
          </Link>

          {/* Blog Link - NEW */}
          <Link
            to="/blog"
            className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
          >
            <FaBlog size={22} className="min-w-6 min-h-6 text-gray-300" />
            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              Blogs
            </span>
          </Link>

          {/* About Us Link - NEW */}
          <Link
            to="/about"
            className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
          >
            <AiOutlineInfoCircle
              size={24}
              className="min-w-6 min-h-6 text-gray-300"
            />
            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              About Us
            </span>
          </Link>

          {/* Cart Link - Only show when logged in */}
          {authToken && (
            <Link
              to="/cart"
              className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1 relative"
            >
              <div className="relative">
                <AiOutlineShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs font-bold rounded-full">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </div>
              <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                Cart
              </span>
            </Link>
          )}

          {/* Favorites Link - Only show when logged in */}
          {authToken && (
            <Link
              to="/favorite"
              className="flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all transform hover:translate-x-1"
            >
              <FaHeart size={22} className="min-w-6 min-h-6 text-gray-300" />
              <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                Favorites <FavoritesCount />
              </span>
            </Link>
          )}
        </nav>
      </div>

      {/* Logout Section - At Bottom */}
      {authToken && (
        <div className="border-t border-gray-800 py-4 px-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 rounded-lg text-gray-300 hover:bg-red-900 hover:text-white transition-all transform hover:translate-x-1"
          >
            <AiOutlineLogin size={24} />
            <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
              Logout
            </span>
          </button>
        </div>
      )}

      {/* Mobile sidebar toggle */}
      <button
        className="fixed md:hidden top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default Navigation;
