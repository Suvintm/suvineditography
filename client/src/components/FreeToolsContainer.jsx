// src/components/FreeToolsContainer.jsx
import React from "react";
import bg from "../assets/bg.jpg";
import { Link } from "react-router-dom";
import { FerrisWheelIcon } from "lucide-react";
import { RiGiftFill } from "react-icons/ri";

const freeTools = [
  {
    name: "Image Resizer",
    desc: "Quickly resize your images online without losing quality.",
    image: bg,
    path:"/svn-bg-remover"
  },
  {
    name: "PDF Merger",
    desc: "Combine multiple PDF files into a single document in seconds.",
    image: bg,
    path:"",
  },
  {
    name: "Text Formatter",
    desc: "Format and clean your text instantly for better readability.",
    image: bg,
    path:"",
  },
];

const FreeToolsContainer = () => {
  return (
    <section className="relative py-10 px-4 sm:px-8 rounded-3xl bg-gradient-to-b from-black via-green-900 to-black mb-5">
      <div className="border-2 border-zinc-400 pb-4 sm:p-8 rounded-3xl">
        {/* Free Tools Label */}
        <div className="absolute top-2 left-8 sm:left-15 sm:border-8  bg-black border-4 border-zinc-500  text-white pl-3 sm:pl-4 py-2 w-[180px] sm:w-[200px] rounded-3xl shadow-lg">
          <h4 className="text-base sm:text-lg font-bold">Free Tools</h4>
          <p className="text-[9px] sm:text-[10px] mt-1 text-gray-100">
            100% free to use with unlimited access.
          </p>
        </div>

        {/* Heading */}
        <div className="w-full text-center items-center-safe justify-center flex mt-2 ">
          <h2 className=" flex gap-2 items-center-safe text-center text-2xl sm:text-4xl mt-9 sm:mt-4 font-bold text-white mb-8">
            <RiGiftFill className="text-green-500" /> <span className="text-green-400">Free</span> Editing
            Tools
          </h2>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 mx-4 sm:mx-0">
          {freeTools.map((tool, index) => (
            <Link
              to={tool.path}
              key={index}
              className="bg-white rounded-xl 
            items-center  sm:rounded-2xl shadow-2xl transition-all duration-300 p-3 sm:p-5 text-center border-2 border-gray-300"
            >
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-32 sm:h-40  object-cover rounded-lg sm:rounded-xl mb-3 sm:mb-4"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                {tool.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeToolsContainer;
