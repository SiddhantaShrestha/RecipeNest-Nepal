import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SubNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Nav items
  const navItems = [
    { path: "/my-profile", label: "Profile Overview" },
    { path: "/saved-recipes", label: "Saved Recipes" },
    { path: "/my-recipes", label: "My Recipes" },
    { path: "/my-blogs", label: "My Blogs" },
    { path: "/my-products", label: "My Products" },
    { path: "/premium-subscription", label: "Subscriptions" },
    { path: "/my-orders", label: "My Orders" },
    { path: "/change-password", label: "Change Password" },
  ];

  return (
    <div className="w-full bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-10">
      {/* Desktop Navigation */}
      <div className="container mx-auto px-4 py-1 hidden md:flex justify-between items-center overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `text-gray-300 font-medium px-3 py-3 whitespace-nowrap hover:text-blue-400 transition-colors ${
                isActive ? "text-blue-400 border-b-2 border-blue-500" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 py-2 flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium">Account Menu</span>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-2 flex flex-col bg-gray-700 rounded-lg overflow-hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 text-gray-300 ${
                    isActive
                      ? "bg-gray-600 text-blue-400 border-l-4 border-blue-500"
                      : "hover:bg-gray-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubNavbar;
