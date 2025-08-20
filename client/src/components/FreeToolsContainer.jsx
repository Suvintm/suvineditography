// src/components/FreeToolsContainer.jsx
import React from "react";
import bg from "../assets/bg.jpg";

const freeTools = [
  {
    name: "Image Resizer",
    desc: "Quickly resize your images online without losing quality.",
    image: bg,
  },
  {
    name: "PDF Merger",
    desc: "Combine multiple PDF files into a single document in seconds.",
    image: bg,
  },
  {
    name: "Text Formatter",
    desc: "Format and clean your text instantly for better readability.",
    image: bg,
  },
];

const FreeToolsContainer = () => {
  return (
    <section className="relative py-10 px-4 sm:px-8 rounded-3xl bg-gradient-to-r from-black to-indigo-600 mb-5">
      {/* Free Tools Label */}
      <div className="absolute top-2 left-4 sm:left-8 bg-gradient-to-r from-black to-green-400 text-white pl-3 sm:pl-4 py-2 w-[180px] sm:w-[200px] rounded-xl shadow-lg">
        <h4 className="text-base sm:text-lg font-bold">Free Tools</h4>
        <p className="text-[9px] sm:text-[10px] mt-1 text-gray-100">
          100% free to use with unlimited access.
        </p>
      </div>

      {/* Heading */}
      <h2 className="text-center text-2xl sm:text-4xl mt-9 sm:mt-4 font-bold text-white mb-8">
        Free Editing Tools
      </h2>

      {/* Card Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 mx-4 sm:mx-0">
        {freeTools.map((tool, index) => (
          <div
            key={index}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 p-3 sm:p-5 text-center border-2 border-gray-300"
          >
            <img
              src={tool.image}
              alt={tool.name}
              className="w-full h-32 sm:h-40 object-cover rounded-lg sm:rounded-xl mb-3 sm:mb-4"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreeToolsContainer;
