import React from "react";
import { NavLink } from "react-router-dom";

const SubNavbar = () => {
  return (
    <div className="w-full bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-around items-center">
        <NavLink
          to="/my-profile"
          className={({ isActive }) =>
            `text-gray-700 font-medium hover:text-blue-500 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
            }`
          }
        >
          Profile Overview
        </NavLink>

        <NavLink
          to="/saved-recipes"
          className={({ isActive }) =>
            `text-gray-700 font-medium hover:text-blue-500 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
            }`
          }
        >
          Saved Recipes
        </NavLink>

        <NavLink
          to="/subscriptions"
          className={({ isActive }) =>
            `text-gray-700 font-medium hover:text-blue-500 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
            }`
          }
        >
          Subscriptions
        </NavLink>

        <NavLink
          to="/my-orders"
          className={({ isActive }) =>
            `text-gray-700 font-medium hover:text-blue-500 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
            }`
          }
        >
          My Orders
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            `text-gray-700 font-medium hover:text-blue-500 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600" : ""
            }`
          }
        >
          Change Password
        </NavLink>
      </div>
    </div>
  );
};

export default SubNavbar;
