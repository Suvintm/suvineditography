import React from "react";
import logo from "../assets/logo.png";

const Header = () => {
  const handleScrollToTools = () => {
    const element = document.getElementById("tool-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pt-18 h-100 bg-gradient-to-b from-black to-indigo-600 w-full rounded-[12px] sm:pt-28 sm:h-140">
      {/* Top Section: Two side-by-side divs */}
      <div className="flex flex-row justify-between sm:gap-4">
        {/* Left: Text Content */}
        <div className="text-center p-2 sm:p-6 w-1/2 sm:w-1/2 flex flex-col justify-center">
          <h1 className="text-[26px] pl-2 sm:text-6xl font-extrabold text-white">
            Suvin
            <br />
            Editography
          </h1>
          <p className="text-white text-[15px] sm:text-3xl">
            Creative editing at your fingertips.
          </p>
        </div>

        {/* Right: Image */}
        <div className="bg-white rotate-45 sm:m-20 sm:absolute sm:w-60 sm:h-60 sm:items-center shadow-2xl shadow-black rounded-2xl mt-8 mr-8 text-center sm:right-30">
          <img
            src={logo}
            alt="Editing Visual"
            className="w-35 rotate-[-45] rounded-lg"
          />
        </div>
      </div>

      {/* Bottom Section: Button and Description */}
      <div className="text-center p-10 mt-1 text-white">
        <button
          onClick={handleScrollToTools}
          className="bg-gradient-to-r from-black to-indigo-200 sm:text-[20px] shadow-4xl shadow-black font-semibold px-6 py-2 sm:px-12 sm:py-4 rounded-3xl hover:translate-z-40 transition-all duration-200"
        >
          Get Started
        </button>
        <p className="mb-4 text-[10px] sm:text-2xl mt-4">
          Welcome to SuvinEditography — your one-stop platform for seamless,
          stunning, and smart video edits. We bring your content to life with
          intuitive tools and creative power.
        </p>
      </div>
    </div>
  );
};

export default Header;
