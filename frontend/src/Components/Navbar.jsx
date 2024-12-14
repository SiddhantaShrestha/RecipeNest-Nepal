import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // User profile icon
import { BiSearch } from "react-icons/bi"; // Search icon
import { AuthContext } from "../AuthContext"; // Import AuthContext
// import navImage from "../Images/RecipeNestLogo.png";
import navImage2 from "../Images/RecipeNest Logo 2.png";

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext); // Access auth state and logout function
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false); // Track dropdown visibility
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission (search)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`); // Redirect to search results page
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  // Navigate to the profile page
  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the user's profile page
    setDropdownVisible(false); // Hide the dropdown
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/login"); // Redirect to home
    setDropdownVisible(false); // Hide the dropdown
  };

  return (
    <nav className="bg-orange-100 p-4 flex items-center relative">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0">
        <img
          src={navImage2}
          alt="RecipeNest Logo"
          className="mr-4 h-12 w-auto object-contain"
        />
      </div>

      {/* Navigation Links - Centered */}
      <div className="flex-grow flex justify-center space-x-8">
        <Link to="/" className="text-black">
          Home
        </Link>
        <Link to="/recipes" className="text-black">
          Recipes
        </Link>
        <Link to="/marketplace" className="text-black">
          Marketplace
        </Link>
        <Link to="/blog" className="text-black">
          Blogs
        </Link>
        <Link to="/about" className="text-black">
          About Us
        </Link>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center ml-auto mr-4"
      >
        <input
          type="text"
          className="p-2 mr-2 border rounded-lg"
          placeholder="Search for recipes, ingredients"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          type="submit"
          className="bg-gray-300 p-2 rounded-lg flex items-center justify-center"
        >
          <BiSearch size={20} /> {/* React-icon search icon */}
        </button>
      </form>

      {/* Sign In / User Icon */}
      {authState.isAuthenticated ? (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="ml-4 px-4 py-2 rounded-lg bg-green-500 flex items-center"
          >
            <FaUserCircle size={24} color="white" />
          </button>

          {/* Dropdown menu */}
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border">
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
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="ml-4 px-4 py-2 rounded-lg bg-yellow-400"
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Navbar;
