import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Icons
import navImage2 from "../Images/RecipeNest Logo 2.png";
import axios from "axios";

const Navbar = () => {
  const [authToken, setAuthToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menu state
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    // status: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
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
      console.log(response.data.data);
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

  //for navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage on component mount
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAdminDropdown = () => setDropdownOpen((prev) => !prev);

  const handleProfileClick = () => {
    navigate("/my-profile");
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from localStorage
    localStorage.removeItem("user"); // Also remove user data
    localStorage.removeItem("tokenExpiration"); // And token expiration
    setAuthToken(null); // Update the state
    navigate("/login");
    setDropdownVisible(false);
  };

  return (
    <nav className="bg-white p-4 shadow-md relative" style={{ height: "60px" }}>
      <div className="flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img
            src={navImage2}
            alt="RecipeNest Logo"
            className="object-contain"
            style={{ width: "50px", height: "30px", borderRadius: "15px" }}
          />
        </div>

        {/* Centered Links (Hidden on small screens) */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } lg:flex flex-col lg:flex-row lg:items-center lg:space-x-6 absolute lg:relative top-full left-0 lg:top-0 lg:left-auto bg-orange-100 w-full lg:w-auto lg:bg-transparent z-10`}
        >
          <Link
            to="/"
            className="block px-4 py-2 text-black hover:text-orange-600"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/recipes"
            className="block px-4 py-2 text-black hover:text-orange-600"
            onClick={() => setMenuOpen(false)}
          >
            Recipes
          </Link>
          <Link
            to="/marketplace"
            className="block px-4 py-2 text-black hover:text-orange-600"
            onClick={() => setMenuOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            to="/blog"
            className="block px-4 py-2 text-black hover:text-orange-600"
            onClick={() => setMenuOpen(false)}
          >
            Blogs
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-black hover:text-orange-600"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
        </div>

        {/* Right Section: Hamburger Menu & Auth */}
        <div className="flex items-center space-x-4">
          <p>
            <strong></strong> {profile.username}
          </p>

          {/* Profile Dropdown for Larger Screens */}
          {authToken && (
            <div className="hidden lg:flex relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full text-gray-700 hover:text-gray-900 flex items-center"
              >
                <FaUserCircle size={28} />
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border z-20">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    My Profile
                  </button>

                  {/* Admin-only options */}
                  {profile.isAdmin && (
                    <>
                      <div className="px-4 py-1 bg-gray-100 text-sm font-semibold">
                        Admin Options
                      </div>

                      <Link
                        to="/admin/dashboard"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/admin/productlist"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Products
                      </Link>

                      <Link
                        to="/admin/categorylist"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Category
                      </Link>

                      <Link
                        to="/admin/orderlist"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Orders
                      </Link>

                      <Link
                        to="/admin/userlist"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => setDropdownVisible(false)}
                      >
                        Users
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sign-In Button for Large Screens */}
          {!authToken && (
            <button
              onClick={() => navigate("/login")}
              className="hidden lg:inline-block px-4 py-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Sign In
            </button>
          )}

          {/* Hamburger Menu for Small Screens */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="text-black">
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Admin dropdown toggle button */}
          {authToken && profile.isAdmin && (
            <button onClick={toggleAdminDropdown}>
              {/* SVG Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>

              {/* Admin quick-access dropdown */}
              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 -top-80 shadow-md rounded-lg border z-20 p-2">
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Users
                    </Link>
                  </li>
                </ul>
              )}
            </button>
          )}

          {/* Mobile menu profile options */}
          {menuOpen && authToken && (
            <div className="lg:hidden absolute top-full right-0 bg-orange-100 w-full pt-2 border-t border-orange-200 mt-4 z-20">
              <button
                onClick={handleProfileClick}
                className="block w-full px-4 py-2 text-left hover:bg-orange-200"
              >
                My Profile
              </button>

              {/* Admin-only options for mobile */}
              {profile.isAdmin && (
                <>
                  <div className="px-4 py-1 bg-orange-200 text-sm font-semibold">
                    Admin Options
                  </div>

                  <Link
                    to="/admin/dashboard"
                    className="block w-full px-4 py-2 text-left hover:bg-orange-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/productlist"
                    className="block w-full px-4 py-2 text-left hover:bg-orange-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Products
                  </Link>

                  <Link
                    to="/admin/categorylist"
                    className="block w-full px-4 py-2 text-left hover:bg-orange-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Category
                  </Link>

                  <Link
                    to="/admin/orderlist"
                    className="block w-full px-4 py-2 text-left hover:bg-orange-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/admin/userlist"
                    className="block w-full px-4 py-2 text-left hover:bg-orange-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Users
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left hover:bg-orange-200 text-red-600"
              >
                Logout
              </button>
            </div>
          )}

          {/* Sign-In Button for Small Screens */}
          {!authToken && menuOpen && (
            <div className="lg:hidden absolute top-full right-0 bg-orange-100 w-full pt-2 border-t border-orange-200 mt-4 z-20">
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-center bg-yellow-400 hover:bg-yellow-500 mx-auto my-2"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
