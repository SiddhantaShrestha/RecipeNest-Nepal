import React from "react";
// import "../CSS/home.css"; // You can add some styling if needed

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-[600px] bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-[#8b5e34] mb-6">
          Welcome to RecipeNest Nepal!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Discover new recipes, explore Nepali cuisine, and buy ingredients
          directly from our platform.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Join our community of home cooks and chefs.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => (window.location.href = "/login")}
            className="py-2 px-6 text-lg bg-[#8b5e34] text-white rounded-md cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => (window.location.href = "/signup")}
            className="py-2 px-6 text-lg bg-[#d9e85e] rounded-md cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
