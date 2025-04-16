import React from "react";
import cookingImage from "../../Images/cooking.jpg";

const AboutUs = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-amber-400">
              Our Culinary Journey
            </h2>
            <p className="text-gray-300">
              Welcome to our culinary haven! We're passionate about bringing
              delicious, accessible recipes to your kitchen while providing the
              highest quality ingredients to make your cooking experience
              seamless and enjoyable.
            </p>
            <p className="text-gray-300">
              What started as a small collection of family recipes has blossomed
              into a comprehensive culinary resource trusted by home cooks and
              food enthusiasts worldwide.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
            <img
              src={cookingImage}
              alt="Cooking Scene"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-amber-400 mb-6">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Recipes Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-white">
                Recipes For Everyone
              </h3>
              <p className="text-gray-300">
                We believe great food should be accessible to all. That's why we
                offer:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>
                  <span className="text-white font-medium">Free Recipes:</span>{" "}
                  A growing collection of tested, delicious recipes available to
                  everyone
                </li>
                <li>
                  <span className="text-white font-medium">
                    Premium Recipes:
                  </span>{" "}
                  Exclusive, chef-developed recipes with detailed video
                  tutorials and advanced techniques
                </li>
              </ul>
            </div>

            {/* Shop Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-white">
                Quality Ingredients
              </h3>
              <p className="text-gray-300">
                Our e-commerce store features carefully curated selections of:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Specialty spices and seasonings</li>
                <li>Hard-to-find ingredients</li>
                <li>Kitchen tools and equipment</li>
                <li>Gourmet gift sets for food lovers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team/Values Section */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-amber-400">
            Our Philosophy
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            We believe that cooking is both an art and a science—a perfect blend
            of creativity and precision. Our mission is to inspire confidence in
            the kitchen, promote sustainability in cooking practices, and build
            a community where food enthusiasts can share their passion.
          </p>

          <div className="pt-8">
            <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-3 px-8 rounded-full transition duration-300">
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
