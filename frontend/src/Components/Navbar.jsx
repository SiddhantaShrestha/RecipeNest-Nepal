import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHeart,
  FaUtensils,
  FaBlog,
  FaSignOutAlt,
  FaChartLine,
} from "react-icons/fa";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import navImage2 from "../Images/RecipeNest Logo 2.png";
import FavoritesCount from "./Products/FavoritesCount";

const Navbar = () => {
  const [authToken, setAuthToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    contact: "",
    email: "",
  });
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const profileBtnRef = useRef(null);
  const adminBtnRef = useRef(null);

  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
    if (token) {
      fetchProfile();
    }
  }, []);

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

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAdminDropdown = () => setAdminDropdownOpen((prev) => !prev);

  const handleProfileClick = () => {
    navigate("/my-profile");
    setDropdownVisible(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    setAuthToken(null);
    navigate("/login");
    setDropdownVisible(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownVisible &&
        !event.target.closest(".profile-dropdown-container") &&
        event.target !== profileBtnRef.current
      ) {
        setDropdownVisible(false);
      }
      if (
        adminDropdownOpen &&
        !event.target.closest(".admin-dropdown-container") &&
        event.target !== adminBtnRef.current
      ) {
        setAdminDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible, adminDropdownOpen]);

  const isAdmin = profile.isAdmin || false;

  return (
    <nav className="bg-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img
                src={navImage2}
                alt="RecipeNest Logo"
                className="object-contain rounded-lg border border-gray-700 shadow-md transform transition-transform duration-300 group-hover:scale-110"
                style={{ width: "50px", height: "30px" }}
              />
              <span className="ml-3 text-xl font-bold text-gray-100 hidden sm:block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                RecipeNest
              </span>
            </Link>
          </div>

          {/* Centered Links */}
          <div className="hidden lg:flex items-center justify-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            >
              <AiOutlineHome
                className="mr-2 group-hover:text-yellow-400 transition-colors"
                size={18}
              />
              <span className="group-hover:translate-x-0.5 transition-transform">
                Home
              </span>
            </Link>
            <Link
              to="/recipes"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            >
              <FaUtensils
                className="mr-2 group-hover:text-yellow-400 transition-colors"
                size={16}
              />
              <span className="group-hover:translate-x-0.5 transition-transform">
                Recipes
              </span>
            </Link>
            <Link
              to="/shop"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            >
              <AiOutlineShopping
                className="mr-2 group-hover:text-yellow-400 transition-colors"
                size={18}
              />
              <span className="group-hover:translate-x-0.5 transition-transform">
                Marketplace
              </span>
            </Link>
            <Link
              to="/blog"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            >
              <FaBlog
                className="mr-2 group-hover:text-yellow-400 transition-colors"
                size={16}
              />
              <span className="group-hover:translate-x-0.5 transition-transform">
                Blogs
              </span>
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            >
              <AiOutlineInfoCircle
                className="mr-2 group-hover:text-yellow-400 transition-colors"
                size={18}
              />
              <span className="group-hover:translate-x-0.5 transition-transform">
                About Us
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            {authToken && !isAdmin && (
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 group"
              >
                <AiOutlineShoppingCart
                  size={22}
                  className="text-gray-300 group-hover:text-yellow-400 transition-colors"
                />
                {cartItems && cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-yellow-500 text-gray-900 text-xs font-bold rounded-full shadow-md transform group-hover:scale-110 transition-transform">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
            )}

            {/* Favorites Button */}
            {authToken && !isAdmin && (
              <Link
                to="/favorite"
                className="relative p-2 rounded-full hover:bg-gray-800 transition-colors duration-200 group"
              >
                <FaHeart
                  size={20}
                  className="text-gray-300 group-hover:text-yellow-400 transition-colors"
                />
                <FavoritesCount />
              </Link>
            )}

            {/* Profile Dropdown */}
            {authToken && (
              <div className="hidden lg:flex relative profile-dropdown-container">
                <button
                  ref={profileBtnRef}
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 p-1 pr-2 rounded-full hover:bg-gray-800 transition-colors duration-200 group"
                  aria-expanded={dropdownVisible}
                  aria-haspopup="true"
                >
                  <div className="relative">
                    <FaUserCircle
                      size={26}
                      className="text-gray-300 group-hover:text-yellow-400 transition-colors"
                    />
                    {dropdownVisible && (
                      <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white hidden xl:inline">
                    {profile.username}
                  </span>
                </button>

                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 shadow-xl rounded-xl border border-gray-700 z-30 overflow-hidden">
                    <div className="px-4 py-3 text-gray-200 bg-gray-700 border-b border-gray-600 flex items-center">
                      <FaUserCircle
                        className="mr-3 text-yellow-400"
                        size={18}
                      />
                      <div>
                        <p className="font-medium truncate">
                          {profile.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleProfileClick}
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 flex items-center border-b border-gray-700"
                    >
                      <FaUserCircle className="mr-3" size={16} />
                      My Profile
                    </button>

                    {/* New User Dashboard Option */}
                    <Link
                      to="/user-sales"
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 flex items-center border-b border-gray-700"
                      onClick={() => setDropdownVisible(false)}
                    >
                      <FaChartLine className="mr-3" size={16} />
                      User Dashboard
                    </Link>

                    {profile.isAdmin && (
                      <>
                        <div className="px-4 py-2 bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Admin Panel
                        </div>

                        <Link
                          to="/admin/dashboard"
                          className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 pl-8"
                          onClick={() => setDropdownVisible(false)}
                        >
                          Dashboard
                        </Link>

                        <Link
                          to="/admin/productlist"
                          className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 pl-8"
                          onClick={() => setDropdownVisible(false)}
                        >
                          Products
                        </Link>

                        <Link
                          to="/admin/categorylist"
                          className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 pl-8"
                          onClick={() => setDropdownVisible(false)}
                        >
                          Categories
                        </Link>

                        <Link
                          to="/admin/orderlist"
                          className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 pl-8"
                          onClick={() => setDropdownVisible(false)}
                        >
                          Orders
                        </Link>

                        <Link
                          to="/admin/userlist"
                          className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 pl-8 border-b border-gray-700"
                          onClick={() => setDropdownVisible(false)}
                        >
                          Users
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-left hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors duration-150 flex items-center"
                    >
                      <FaSignOutAlt className="mr-3" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {!authToken && (
              <div className="hidden lg:flex space-x-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 rounded-lg bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 transition-all duration-200 flex items-center shadow-md hover:shadow-yellow-500/30"
                >
                  <AiOutlineLogin className="mr-2" />
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 flex items-center shadow-md hover:shadow-yellow-500/30 font-medium"
                >
                  <AiOutlineUserAdd className="mr-2" />
                  Register
                </button>
              </div>
            )}

            {/* Admin Quick Access */}
            {authToken && profile.isAdmin && (
              <div className="relative admin-dropdown-container">
                <button
                  ref={adminBtnRef}
                  onClick={toggleAdminDropdown}
                  className="text-gray-300 hover:text-white flex items-center p-2 rounded-lg hover:bg-gray-800 transition-all duration-200 group"
                  aria-expanded={adminDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="hidden md:inline mr-2 font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Admin
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 text-gray-400 group-hover:text-yellow-400 ${
                      adminDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={adminDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                </button>

                {adminDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-gray-800 text-gray-300 shadow-xl rounded-xl border border-gray-700 z-30 overflow-hidden w-48">
                    <div className="px-4 py-2 bg-gray-700 text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-gray-600">
                      Quick Access
                    </div>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-3 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 border-b border-gray-700"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-3 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 border-b border-gray-700"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-3 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 border-b border-gray-700"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Categories
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-3 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150 border-b border-gray-700"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-3 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-150"
                      onClick={() => setAdminDropdownOpen(false)}
                    >
                      Users
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <FaTimes size={22} className="text-yellow-400" />
              ) : (
                <FaBars
                  size={22}
                  className="text-gray-300 hover:text-yellow-400"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-1 sm:px-6 border-t border-gray-800 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
          <Link
            to="/"
            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            onClick={() => setMenuOpen(false)}
          >
            <AiOutlineHome
              className="mr-3 group-hover:text-yellow-400"
              size={18}
            />
            Home
          </Link>
          <Link
            to="/recipes"
            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            onClick={() => setMenuOpen(false)}
          >
            <FaUtensils
              className="mr-3 group-hover:text-yellow-400"
              size={16}
            />
            Recipes
          </Link>
          <Link
            to="/shop"
            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            onClick={() => setMenuOpen(false)}
          >
            <AiOutlineShopping
              className="mr-3 group-hover:text-yellow-400"
              size={18}
            />
            Marketplace
          </Link>
          <Link
            to="/blog"
            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            onClick={() => setMenuOpen(false)}
          >
            <FaBlog className="mr-3 group-hover:text-yellow-400" size={16} />
            Blogs
          </Link>
          <Link
            to="/about"
            className="block px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 flex items-center group"
            onClick={() => setMenuOpen(false)}
          >
            <AiOutlineInfoCircle
              className="mr-3 group-hover:text-yellow-400"
              size={18}
            />
            About Us
          </Link>

          {!authToken && (
            <div className="mt-4 pt-4 space-y-3 border-t border-gray-800">
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 transition-all duration-200 font-medium"
              >
                <AiOutlineLogin className="mr-2" />
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 font-medium"
              >
                <AiOutlineUserAdd className="mr-2" />
                Register
              </button>
            </div>
          )}

          {authToken && (
            <div className="mt-4 pt-4 space-y-3 border-t border-gray-800">
              <div className="px-4 py-3 mb-2 text-gray-300 bg-gray-800 font-medium border border-gray-700 rounded-lg flex items-center">
                <FaUserCircle className="mr-3 text-yellow-400" size={20} />
                <div>
                  <p className="font-medium">{profile.username}</p>
                  {profile.email && (
                    <p className="text-xs text-gray-400 truncate">
                      {profile.email}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
              >
                <FaUserCircle className="mr-3" size={18} />
                My Profile
              </button>

              {/* New User Dashboard Option in Mobile Menu */}
              <Link
                to="/user-sales"
                className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                <FaChartLine className="mr-3" size={18} />
                User Dashboard
              </Link>

              {!isAdmin && (
                <div className="flex flex-col space-y-2 mt-2">
                  <Link
                    to="/cart"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <AiOutlineShoppingCart className="mr-3" size={18} />
                    Cart
                    {cartItems && cartItems.length > 0 && (
                      <span className="ml-auto bg-yellow-500 text-gray-900 rounded-full px-2 py-1 text-xs font-bold">
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/favorite"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaHeart className="mr-3" size={18} />
                    Favorites
                    <FavoritesCount className="ml-auto" />
                  </Link>
                </div>
              )}

              {profile.isAdmin && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-700">
                  <div className="px-4 py-3 bg-gray-800 text-sm font-semibold text-gray-200 border-b border-gray-700">
                    Admin Options
                  </div>
                  <div className="bg-gray-900 rounded-b-xl space-y-1 p-1">
                    <Link
                      to="/admin/dashboard"
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-lg transition-all duration-200 pl-6"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-lg transition-all duration-200 pl-6"
                      onClick={() => setMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/categorylist"
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-lg transition-all duration-200 pl-6"
                      onClick={() => setMenuOpen(false)}
                    >
                      Categories
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-lg transition-all duration-200 pl-6"
                      onClick={() => setMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/userlist"
                      className="block w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-800 hover:text-yellow-400 rounded-lg transition-all duration-200 pl-6"
                      onClick={() => setMenuOpen(false)}
                    >
                      Users
                    </Link>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 mt-3 text-left text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-all duration-200"
              >
                <FaSignOutAlt className="mr-3" size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
