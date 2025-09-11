// src/components/ToolContainer.jsx
import React from "react";
import { Link } from "react-router-dom";
import tools from "../Data/tools";
import { CloudLightning } from "lucide-react";

const Cardcontainer = () => {
  return (
    <section
      id="tool-container"
      className="relative py-10 px-4 sm:px-8 rounded-3xl  bg-gradient-to-b from-black via-yellow-900 to-black "
    >
      <div className="border-2 border-zinc-400 pb-4 sm:p-8 rounded-3xl">
        {/* Pro Tools Label */}
        <div className="absolute top-2 left-8 sm:left-15 bg-black border-yellow-300 border-4 sm:border-8 text-white pl-3 sm:pl-4 py-2 w-[250px] sm:w-[310px] rounded-3xl shadow-lg">
          <h4 className="text-base sm:text-lg font-bold">Pro Tools⚡</h4>
          <p className="text-[9px] sm:text-[10px] mt-1 text-gray-400">
            These premium tools require credits for usage. Credits can be
            purchased securely through our payment system.
          </p>
        </div>

        <div className="w-full text-center items-center-safe justify-center flex mt-6 ">
          <h2 className=" flex gap-2 items-center-safe text-center justify-center text-2xl sm:text-4xl mt-9 sm:mt-4 font-bold text-white mb-8">
            <CloudLightning className="text-yellow-400 sm:w-8 sm:h-8" /> <span className="font-bold text-orange-400 text-3xl sm:text-5xl" >Pro</span>{" "}
            Editing Tools
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-4 sm:mx-0">
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
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {tool.desc}
              </p>
              <button className="text-white bg-gradient-to-r bg-orange-600 to-black px-3 sm:px-8 font-bold py-1.5 sm:py-2 rounded-xl sm:rounded-2xl mt-3 text-xs sm:text-sm">
                Go
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cardcontainer;
