import { useState, useEffect, useRef, useContext } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import star from "../assets/star.png";
import close from "../assets/close.png";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { credits } = useContext(AppContext);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center py-4 px-2 bg-white shadow-md rounded-b-3xl relative">
      {/* Logo Section */}
      <div className="flex items-center space-x-0 sm:space-x-4">
        <Link className="flex items-center space-x-1 font-bold" to="/">
          <img className="h-10" src={logo} alt="Logo" />
          <h1>suvineditography</h1>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-4">
        {/* Credits Button */}
        <button className="flex items-center space-x-2 bg-black sm:bg-yellow-500 text-white px-2 py-1 rounded-3xl hover:bg-black transition">
          <img className="h-4" src={star} alt="Star" />
          <p className="font-md text-sm">Credits: {credits}</p>
        </button>

        {/* Account Icon */}
        <div className="relative">
          <span
            className="material-symbols-outlined text-white bg-black p-2 rounded-full sm:p-4 hover:bg-yellow-500 transition cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            account_circle
          </span>

          {/* Account Menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-12 bg-gradient-to-b from-blue-400 to-gray-100  text-black rounded-lg shadow-black shadow-2xl w-40 h-60 z-50"
            >
              <div className="flex justify-end p-2">
                <img
                  className="text-xl cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                  src={close}
                  alt="Close"
                />
              </div>
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/profile">
                Profile
              </Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/pricing">
                Pricing
              </Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" to="/login">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
