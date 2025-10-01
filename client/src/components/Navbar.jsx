import React, { useState, useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import { IoMdClose, IoIosPricetags, IoIosOptions } from "react-icons/io";
import { RiHeartFill, RiHome7Line, RiProfileFill } from "react-icons/ri";
import {
  Gift,
  Gem,
  WalletIcon,
  IndianRupee,
  InfoIcon,
  LogOutIcon,
  LucideUserCheck2,
  Boxes,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Header background images
import header1 from "../assets/header1.jpg";
import header2 from "../assets/header2.jpg";
import header3 from "../assets/header3.jpg";
import header4 from "../assets/header4.jpg";
import header5 from "../assets/header5.jpg";
import header6 from "../assets/header6.jpg";
import header7 from "../assets/header7.jpg";

const HEADER_IMAGES = [
  header1,
  header4,
  header5,
  header6,
  header2,
  header3,
  header7,
];

// mobile menu items
const MOBILE_MENU = [
  {
    name: "Studio",
    icon: <RiHome7Line className="w-5 h-5" />,
    action: "scroll",
    targetId: "studio-go",
  },
  { name: "Stocks", icon: <Boxes className="w-5 h-5" />, action: "navigate" },
  {
    name: "FreeTools",
    icon: <Gift className="w-5 h-5" />,
    action: "scroll",
    targetId: "freetools-go",
  },
  {
    name: "ProTools",
    icon: <Gem className="w-5 h-5" />,
    action: "scroll",
    targetId: "protools-go",
  },
  {
    name: "Pricing",
    icon: <IoIosPricetags className="w-5 h-5" />,
    action: "scroll",
    targetId: "pricing-go",
  },
];

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const Navigate = useNavigate();
  const { user, credits } = useContext(AppContext);

  // Cycle background images every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HEADER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Reusable scroll function
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative w-full">
      {/* Background slideshow */}
      <div className="absolute inset-0 sm:h-80 h-40 overflow-hidden ">
        {HEADER_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentBg
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-100"></div>
      </div>

      {/* Navbar content */}
      <nav className="relative px-4 sm:px-20 py-3 pt-4 flex justify-between items-center w-full z-10 text-white">
        <div className="flex sm:m-4 sm:border-white/50 sm:rounded-4xl sm:border-2 sm:p-4 sm:gap-4 gap-3 items-center">
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-white rounded-3xl"
          />
          <span className="font-bold text-[14px] sm:text-[24px] text-white">
            SuvinEditography
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center sm:gap-6 sm:pr-20">
          <Link
            to="/buy-credit"
            className="flex gap-1 sm:gap-2 text-[12px] bg-black-400/20 border items-center justify-center mr-2 border-white/50 text-white px-2 py-2 rounded-full font-medium"
          >
            <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Credits: {credits}
          </Link>
          <button onClick={toggleSidebar} className="text-white text-2xl">
            <IoIosOptions />
          </button>
        </div>
      </nav>

      {/* Desktop menu */}
      <div className="hidden relative justify-center sm:flex item-center">
        <ul className="flex flex-row gap-6 font-bold">
          <li
            onClick={() => handleScrollTo("studio-go")}
            className="flex gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white/40 cursor-pointer"
          >
            <RiHome7Line className="w-6 h-6" />
            Studio
          </li>
          <li
            onClick={() => handleScrollTo("freetools-go")}
            className="flex gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white/70 cursor-pointer"
          >
            <Gift /> FreeTools
          </li>
          <li
            onClick={() => handleScrollTo("protools-go")}
            className="flex gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white/70 cursor-pointer"
          >
            <Gem /> ProTools
          </li>
          <li
            onClick={() => handleScrollTo("pricing-go")}
            className="flex gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white/70 cursor-pointer"
          >
            <IoIosPricetags className="w-6 h-6" /> Pricing
          </li>
          <li
            onClick={() => Navigate("/stocks")}
            className="flex gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white/70 cursor-pointer"
          >
            <Boxes className="w-6 h-6" /> Stocks
          </li>
        </ul>
      </div>

      {/* ✅ Mobile scroll menu */}
      <div className="relative sm:hidden justify-center items flex px-2 pt-6 pb-2 z-10">
        <ul className="flex space-x-2 overflow-x-auto  scrollbar-hidden">
          {MOBILE_MENU.map((item, i) => (
            <li
              key={i}
              onClick={
                item.action === "scroll"
                  ? () => handleScrollTo(item.targetId)
                  : item.action === "navigate"
                  ? () => Navigate("/stocks")
                  : null
              }
              className="flex items-center gap-2 px-2 text-[10px] sm:px-3 py-2 rounded-full bg-black border border-white/30 text-white text-sm font-semibold whitespace-nowrap hover:bg-white/40 cursor-pointer"
            >
              {item.icon}
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen rounded-3xl ml-4 mt-0 mb-4 w-64 sm:w-120 bg-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } z-50 p-4`}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleSidebar}
            className="text-2xl text-black font-extrabold"
          >
            <IoMdClose />
          </button>
        </div>
        <div>
          <h1 className="font-bold text-center mx-8 p-1 bg-blue-100 sm:mx-15 rounded-2xl sm:p-2 sm:text-2xl">
            Profile & Menu{" "}
          </h1>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col border-white border-1 rounded-3xl shadow-2xl  shadow-blue-300 text-black  items-center mt-6 p-4">
          <div className="flex items-center gap-2 sm:gap-6 w-full">
            <div className="rounded-full border-2 border-zinc-500 overflow-hidden max-w-16 max-h-16 sm:max-w-20 sm:max-h-20 items-center-safe text-center">
              <img
                src={user?.avatar || logo}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex sm:gap-2 gap-0 text-[12px] sm:text-[18px] text-zinc-600">
                <LucideUserCheck2 className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>{user?.username || "Guest"}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold mt-2 sm:text-2xl">
                  {user?.name || "Guest"}
                </h2>
              </div>
              {/* Total Uploads */}
              <div className="mt-2 text-zinc-700 text-[12px] sm:text-[16px] font-medium flex items-center gap-2">
                <RiProfileFill className="text-blue-600 sm:w-5 sm:h-5" />
                <span>Total Uploads: {user?.uploads?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-zinc-400 flex items-center rounded-3xl w-full mt-4">
            <RiHeartFill className="text-red-600 sm:w-6 sm:h-6 m-2" />
            <div className="w-full">
              <p className="text-zinc-700 text-[8px] p-1 font-bold sm:text-[15px]">
                Thank you for being a SuvinEditography user...
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Links */}
        <div className="mt-8 flex flex-col items-center justify-center-safe space-y-4 px-4">
          <Link
            to="/pricing"
            className="flex justify-center bg-black min-w-40 sm:min-w-60 p-1 sm:p-2 rounded-3xl font-semibold text-center text-white hover:text-black hover:bg-white hover:border hover:border-black sm:gap-2 gap-1 items-center-safe"
          >
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" /> Pricing
          </Link>
          <Link
            to="/about"
            className="flex justify-center bg-black min-w-40 sm:min-w-60 p-1 sm:p-2 rounded-3xl  font-semibold text-center text-white hover:text-black hover:bg-white hover:border hover:border-black sm:gap-2 gap-1 items-center-safe"
          >
            <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5" /> About
          </Link>
          <button
            onClick={() => {
              Navigate("/login");
              console.log("Logged out");
            }}
            className="flex justify-center bg-black min-w-40 sm:min-w-60 p-1 sm:p-2 rounded-3xl   font-semibold text-center text-white hover:text-black hover:bg-white hover:border hover:border-black sm:gap-2 gap-1 items-center-safe"
          >
            <LogOutIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Logout
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
    </div>
  );
};

export default Navbar;
