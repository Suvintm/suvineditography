// src/components/ToolContainer.jsx
import React from "react";
import { Link } from "react-router-dom";
import tools from "../Data/tools";

const Cardcontainer = () => {
  return (
    <section
      id="tool-container"
      className="relative py-10 px-4 sm:px-8 rounded-3xl bg-zinc-800 mb-10"
    >
      {/* Pro Tools Label */}
      <div className="absolute top-2 left-4 sm:left-8 bg-purple-600 text-white pl-3 sm:pl-4 py-2 w-[250px] sm:w-[310px] rounded-xl shadow-lg">
        <h4 className="text-base sm:text-lg font-bold">Pro Tools⚡</h4>
        <p className="text-[9px] sm:text-[10px] mt-1 text-gray-400">
          These premium tools require credits for usage. Credits can be
          purchased securely through our payment system.
        </p>
      </div>

      <h2 className="text-center text-2xl sm:text-4xl mt-16 font-bold text-white mb-8">
        Editing Tools
      </h2>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-4 sm:mx-0">
        {tools.map((tool, index) => (
          <Link
            id={`tool-${tool.name.replace(/\s+/g, "")}`}
            to={tool.link}
            key={index}
            className="bg-white hover:bg-gradient-to-br from-purple-200 hover:to-purple-500 rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 p-3 sm:p-5 text-center group border-2 border-gray-300 shadow-black"
          >
            <img
              src={tool.image}
              alt={tool.name}
              className="w-full h-32 sm:h-40 object-cover rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{tool.desc}</p>
            <button className="text-white bg-gradient-to-r bg-purple-600 to-black px-3 sm:px-8 font-bold py-1.5 sm:py-2 rounded-xl sm:rounded-2xl mt-3 text-xs sm:text-sm">
              Go
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Cardcontainer;
