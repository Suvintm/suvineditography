// src/components/Footer.jsx
import React from "react";
import logo from "../assets/logo.png"; // adjust path if needed
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500 text-white py-10 px-6 sm:px-12">
      {/* Top Grid: Logo + Links */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-10">
        {/* Logo and brand */}
        <div className="flex flex-col items-start">
          <img src={logo} alt="Suvin Logo" className="w-16 mb-2" />
          <h2 className="text-xl font-bold">SuvinEditography</h2>
          <p className="text-sm mt-2">
            Seamless, Stunning, Smart Editing Tools.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-1">Quick Links</h3>
          <Link to="/" className="hover:text-gray-200 text-sm">
            Home
          </Link>
          <Link to="/tools" className="hover:text-gray-200 text-sm">
            Tools
          </Link>
          <Link to="/pricing" className="hover:text-gray-200 text-sm">
            Pricing
          </Link>
          <Link to="/about" className="hover:text-gray-200 text-sm">
            About
          </Link>
        </div>

        {/* Contact + Social */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-1">Get in Touch</h3>
          <p className="text-sm">support@suvineditography.com</p>
          <p className="text-sm">© {new Date().getFullYear()} Suvin TM</p>
          <div className="flex gap-4 mt-2">
            {/* Add your social links or icons */}
            <a href="#" className="hover:text-gray-200 text-sm underline">
              Instagram
            </a>
            <a href="#" className="hover:text-gray-200 text-sm underline">
              GitHub
            </a>
            <a href="#" className="hover:text-gray-200 text-sm underline">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-purple-300 mt-10 pt-6 text-center text-sm text-gray-200">
        Made with 💜 by Suvin | Powered by AI & Creativity
      </div>
    </footer>
  );
};

export default Footer;
