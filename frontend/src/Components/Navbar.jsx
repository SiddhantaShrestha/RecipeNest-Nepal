import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // User profile icon
import { AuthContext } from "../AuthContext"; // Import AuthContext

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
    <nav className="bg-orange-100 p-4 flex justify-between items-center relative">
      {/* Logo on the left side */}
      <div className="flex items-center">
        <img
          src="../Images/RecipeNestLogo.webp"
          alt="RecipeNest Logo"
          className="mr-4"
        />
        <div className="space-x-4">
          <a href="/" className="text-black">
            Home
          </a>
          <a href="/recipes" className="text-black">
            Recipes
          </a>
          <a href="/marketplace" className="text-black">
            Marketplace
          </a>
          <a href="/about" className="text-black">
            About Us
          </a>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          type="text"
          className="p-2 mr-2 border rounded-lg"
          placeholder="Search for recipes, ingredients"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="bg-gray-300 p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.742a6 6 0 1 0-1.414 1.415 5.973 5.973 0 0 0 1.414-1.415zM12 6a6 6 0 1 1-6-6 6 6 0 0 1 6 6z" />
          </svg>
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
