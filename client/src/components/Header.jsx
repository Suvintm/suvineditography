import React from "react";

const Header = () => {
  return (
    <div className=" h-64 m-4 rounded-3xl shadow-lg flex-col p-4 sm:6 items-center justify-center bg-gray-200  ">
      <h1 className="text-4xl font-bold p-4">Welcome to Suvineditography</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition">
        Get Started
      </button>
    </div>
  );
};

export default Header;
