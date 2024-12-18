import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Icons
import { BiSearch } from "react-icons/bi"; // Search icon
import { AuthContext } from "../AuthContext";
import navImage2 from "../Images/RecipeNest Logo 2.png";

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menu state
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
    setMenuOpen(false);
  };

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleProfileClick = () => {
    navigate("/my-profile");
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownVisible(false);
  };

  return (
    <nav className="bg-orange-100 p-4 shadow-md relative">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img
            src={navImage2}
            alt="RecipeNest Logo"
            className="h-10 w-auto object-contain"
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

        {/* Search Bar */}
        <div className="hidden lg:flex items-center space-x-2">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white p-1 border rounded-lg"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 focus:outline-none rounded-l-lg"
            />
            <button
              type="submit"
              className="bg-gray-300 p-2 rounded-r-lg flex items-center justify-center"
            >
              <BiSearch size={20} />
            </button>
          </form>
        </div>

        {/* Right Section: Hamburger Menu & Auth */}
        {/* Right Section: User Auth & Hamburger Menu */}
        <div className="flex items-center space-x-4">
          {/* Profile Dropdown for Larger Screens */}
          {authState.isAuthenticated && (
            <div className="hidden lg:flex relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full text-gray-700 hover:text-gray-900"
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
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Sign-In Button for Large Screens */}
          {!authState.isAuthenticated && (
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
        </div>
      </div>

      {/* Mobile Search Bar */}
      {menuOpen && (
        <div className="flex lg:hidden mt-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center bg-white p-1 border rounded-lg"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 flex-grow focus:outline-none rounded-l-lg"
            />
            <button
              type="submit"
              className="bg-gray-300 p-2 rounded-r-lg flex items-center justify-center"
            >
              <BiSearch size={20} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
