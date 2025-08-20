import logo from "../assets/logo.png";
import React, { useState, useContext } from "react";

import { IoMdClose, IoMdMenu } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

import { AppContext } from "../context/AppContext"; // Adjust the path

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const Navigate = useNavigate();
  const { user, credits } = useContext(AppContext);

  return (
    <nav className="bg-[#fafafa] absolute shadow-md shadow-black px-4 py-3 flex justify-between items-center w-full rounded-b-3xl z-10 ">
      <div className="text-xl font-bold text-blue-600 flex gap-2 items-center justify-center  ">
        <img className="w-10 sm:w-20" src={logo} alt="" />
        <h1 className="logoname text-black text-[15px] sm:text-3xl">
          suvineditography
        </h1>
      </div>

      {/* Credit Box & Profile */}
      <div className="flex items-center sm:gap-6 sm:pr-20 space-x-4">
        {/* Credit Box */}
        <div className="bg-black border-2 border-gray-600 text-white px-3 py-1 sm:px-6 sm:py-3 rounded-2xl sm:text-2xl text-sm font-medium">
          Credits:{credits}
        </div>

        {/* Profile Icon */}
        <button
          onClick={toggleSidebar}
          className="text-black text:[60px] sm:text-6xl "
        >
          <IoMdMenu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-90 bg-gradient-to-b from-purple-600 to-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } z-50 p-4`}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleSidebar}
            className="text-2xl text-white font-extrabold"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col border-purple-400 border-2 rounded-3xl shadow-2xl shadow-black  items-center mt-6 p-4  ">
          <img
            src={logo}
            alt="profile"
            className="w-20 h-20  rounded-full object-cover"
          />
          <h2 className="text-lg font-semibold mt-2">
            Hello, {user?.name || "Guest"}!
          </h2>
        </div>

        {/* Sidebar Links */}
        <div className="mt-8 flex flex-col space-y-4 px-4">
          <Link
            to="/pricing"
            className="border-purple-400 bg-white p-2 border-2 rounded-3xl shadow-2xl  shadow-black font-bold text-center text-black hover:text-blue-700 "
          >
            Pricing
          </Link>
          <Link
            to="/about"
            className="border-purple-400 bg-white p-2 border-2 rounded-3xl shadow-2xl  shadow-black font-bold text-center text-black hover:text-blue-700"
          >
            About
          </Link>
          <button
            onClick={() => {
              Navigate("/login");
              console.log("Logged out");
            }}
            className="border-purple-400 bg-white p-2 border-2 rounded-3xl shadow-2xl  shadow-black font-bold text-center text-red-500 hover:text-red-700 "
          >
            Logout
          </button>
        </div>
      </div>

      {/* Background overlay (for mobile sidebar) */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-30 z-40"
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
