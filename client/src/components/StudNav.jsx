import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import logo from "../assets/logo.png";

export default function StudNav() {
  const { user } = useContext(AppContext);

  return (
    <nav className="bg-black shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => (window.location.href = "/")}
          className="flex items-center cursor-pointer"
        >
          <img src={logo} alt={logo} className="h-10 w-10 mr-2" />
          <span className="text-[15px] sm:text-xl font-bold text-white">
            SuvinEditography
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Hi, {user?.name || "Guest"}</span>
          <img
            src="/user-avatar.png"
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-gray-200"
          />
        </div>
      </div>
    </nav>
  );
}
