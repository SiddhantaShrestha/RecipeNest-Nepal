import React from "react";

const CheckDesign = () => {
  return (
    <div className="w-screen h-auto bg-white overflow-hidden">
      {/* Main Container */}
      <div className="relative">
        {/* Section 1: Hero Image and Title */}
        <div className="relative">
          <img
            className="w-[1233px] h-[475px] mx-auto mt-8"
            src="https://via.placeholder.com/1233x475"
            alt="Hero"
          />
          <div className="flex justify-center mt-4">
            <button className="bg-[#8bdf57] text-neutral-100 text-[21px] font-bold px-8 py-2 rounded-[10px] mr-4">
              Premium
            </button>
            <button className="border border-[#8bdf57] text-[#8bdf57] text-[21px] font-bold px-8 py-2 rounded-[10px]">
              Bookmark
            </button>
          </div>
          <h1 className="text-center text-black text-[40px] font-bold mt-8">
            Fried Rice
          </h1>
        </div>

        {/* Section 2: Details */}
        <div className="mt-8 flex justify-around">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Preparation Time</h2>
            <p className="text-xl">1 hour 15 minutes</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Serving Size</h2>
            <p className="text-xl">lorem ipsum</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Ingredients Required</h2>
            <p className="text-xl">
              Lorem ipsum donor
              <br />
              Lorem ipsum donor
            </p>
          </div>
        </div>

        {/* Section 3: Steps */}
        <div className="mt-12 px-8">
          <div className="text-center text-2xl font-bold mb-4">
            Ingredients Required
          </div>
          <div className="text-[#1f1f1f] text-xl">
            Step 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <br />
            <br />
            Step 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <br />
            <br />
            Step 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <br />
            <br />
            Step 4: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>

        {/* Section 4: Ingredients */}
        <div className="mt-12">
          <h2 className="text-center text-2xl font-bold">
            Don’t have the ingredients? Buy Now!
          </h2>
          <div className="flex justify-center mt-8 space-x-8">
            <div className="border border-black p-4">
              <img
                src="https://via.placeholder.com/282x236"
                alt="Green Peas"
                className="w-full h-60"
              />
              <h3 className="text-2xl font-bold mt-2">Green Peas</h3>
              <p className="text-xl">Rs600</p>
            </div>
            <div className="border border-black p-4">
              <img
                src="https://via.placeholder.com/282x236"
                alt="Gate Rice"
                className="w-full h-60"
              />
              <h3 className="text-2xl font-bold mt-2">Gate Rice 1Kg</h3>
              <p className="text-xl">Rs600</p>
            </div>
          </div>
        </div>

        {/* Section 5: Ratings and Reviews */}
        <div className="mt-12 px-8">
          <h2 className="text-center text-2xl font-bold">
            Ratings and Reviews
          </h2>
          <div className="mt-4">
            <h3 className="text-[22px] font-bold">Johny</h3>
            <p className="text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white border-t border-black py-8">
          <div className="text-center text-xl">
            <p>Home | About | Blog | Marketplace | Contact | Terms of Use</p>
            <p>Facebook | Twitter | Instagram | Github</p>
          </div>
          <p className="text-center mt-4 text-black">
            &copy; 2025 Lorem Ipsum. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckDesign;
