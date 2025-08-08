// src/components/ToolContainer.jsx
import React from "react";
import { Link } from "react-router-dom";
import tools from "../Data/tools";

const Cardcontainer = () => {
  return (
    <section
      id="tool-container"
      className="py-10 px-4 sm:px-8 rounded-3xl bg-zinc-800 mb-10"
    >
      <h2 className="text-center text-3xl sm:text-4xl font-bold text-white mb-8">
        Editing Tools
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool, index) => (
          <Link
            id={`tool-${tool.name.replace(/\s+/g, "")}`}
            to={tool.link}
            key={index}
            className="bg-white hover:bg-gradient-to-br from-purple-200 hover:to-purple-500 rounded-2xl shadow-2xl transition-all duration-300 p-5 text-center group border-2 border-gray-300 shadow-black"
          >
            <img
              src={tool.image}
              alt={tool.name}
              className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
            />
            <h3 className="text-xl font-semibold text-gray-800">{tool.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
            <button className="text-white bg-gradient-to-r bg-purple-600 to-black px-4 sm:px-8 font-bold py-2 rounded-2xl mt-3">
              Go
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Cardcontainer;
