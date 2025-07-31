import logo from "../assets/logo.png";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, credits }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <nav className="bg-[#fafafa] shadow-md shadow-black px-4 py-3 flex justify-between items-center w-full rounded-b-3xl ">
      <div className="text-xl font-bold text-blue-600 flex gap-2 items-center justify-center  ">
        <img className="w-10 sm:w-20" src={logo} alt="" />
        <h1 className="logoname text-black text-[15px] sm:text-3xl">
          suvineditography
        </h1>
      </div>

      {/* Credit Box & Profile */}
      <div className="flex items-center space-x-4">
        {/* Credit Box */}
        <div className="bg-blue-100 text-blue-700 px-3 py-1 sm:px-6 sm:py-3 sm:bg-amber-400 rounded-md text-sm font-medium">
          Credits: {credits}
        </div>

        {/* Profile Icon */}
        <button onClick={toggleSidebar} className="text-gray-700 text-2xl ">
          <FaUserCircle />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } z-50 p-4`}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={toggleSidebar} className="text-2xl text-gray-600">
            <IoMdClose />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col items-center mt-6 ">
          <img
            src={user?.profileImage || "https://via.placeholder.com/80"}
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
            className="text-black hover:text-blue-600 border-2 border-blue-500 rounded-2xl"
          >
            Pricing
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <button
            onClick={() => {
              // Call logout function here
              console.log("Logged out");
            }}
            className="text-red-500 hover:text-red-700 text-left"
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
