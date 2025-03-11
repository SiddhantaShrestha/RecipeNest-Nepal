import flowbitePlugin from "flowbite/plugin";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Includes all JS/TS/JSX/TSX files in the src folder
  ],
  theme: {
    extend: {
      // Add custom animations
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        slideIn: "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [flowbitePlugin],
};
