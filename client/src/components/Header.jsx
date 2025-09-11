import React, { useState } from "react";
import logo from "../assets/logo.png";
import { RiGiftFill, RiHomeGearFill, RiPriceTag2Fill, RiVideoChatFill } from "react-icons/ri";
import {
  ArrowBigDownDashIcon,
  ArrowBigRight,
  Edit2,
  Gem,
  GemIcon,
  Gift,
  GitForkIcon,
  ScrollIcon,
  Search,
  SearchIcon,
} from "lucide-react";
import { IoMdClose, IoIosPricetags, IoMdMenu } from "react-icons/io";
import {
  RiHome7Line,
  RiHomeSmileLine,
  RiMenuFold2Fill,
  RiMenuUnfold2Fill,
  RiImageAddFill,RiVideoAddFill,RiVideoOffFill,
} from "react-icons/ri";
import { IoMdPricetag } from "react-icons/io";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { Scrollbar } from "swiper/modules";
import "../components/Header.css";
import { Navigate } from "react-router-dom";

const Header = () => {
  // const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const SearchOptions = [
    {
      name: "images",
      path: "/search",
      icon: RiImageAddFill,
    },
    {
      name: "Videos",
      path: "/videos",
      icon:  RiVideoAddFill,
    },
    {
      name: "GreenSC",
      path: "/green-screen",
      icon: RiVideoOffFill,
    },
    {
      name: "images",
      path: "/images",
      icon: RiImageAddFill,
    },
    {
      name: "images",
      path: "/images",
      icon: RiImageAddFill,
    },
    {
      name: "images",
      path: "/images",
      icon: RiImageAddFill,
    },
    {
      name: "images",
      path: "/images",
      icon: RiImageAddFill,
    },
  ];

  const handlesearch = () => {
    const element = document.getElementById(query.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("No Section found!");
    }
  };

  const handleScrollToTools = () => {
    const element = document.getElementById("tool-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleScrollTostudio = () => {
    const element = document.getElementById("studio-go");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pt-18 h-100 bg-gradient-to-b from-black via-indigo-900 to-black w-full rounded-[12px] sm:pt-28 sm:h-140 items-center-safe justify-center-safe text-center">
      {/* Top Section: Two side-by-side divs */}
      <div className="flex flex-row justify-between sm:gap-4">
        {/* Left: Text Content */}
        <div className="text-center p-2 sm:p-6 w-1/2 sm:w-1/2 flex flex-col justify-center">
          <h1 className="text-[26px] pl-2 sm:text-6xl font-extrabold text-white">
            Suvin
            <br />
            Editography
          </h1>
          <p className="text-white text-[15px] sm:text-3xl">
            Creative editing at your fingertips.
          </p>
        </div>

        {/* Right: Image */}
        <div className="bg-white rotate-45 sm:m-20 sm:absolute sm:w-60 sm:h-60 sm:items-center shadow-2xl shadow-black rounded-2xl mt-8 mr-8 text-center sm:right-30">
          <img
            src={logo}
            alt="Editing Visual"
            className="w-35 rotate-[-45] rounded-lg"
          />
        </div>
      </div>

      {/* Bottom Section: Button and Description */}
      <div className=" text-center p-10 mt-1 items-center-safe text-white">
        <button
          onClick={handleScrollToTools}
          className=" flex sm:ml-195 ml-20 items-center-safe gap-2 bg-gradient-to-r cursor-pointer from-black via-indigo-600 to-black sm:text-[20px] border-1 border-zinc-600 shadow-4xl shadow-black font-semibold px-2 py-2 sm:px-12 sm:py-4 rounded-3xl text-[15px] "
        >
          <ArrowBigDownDashIcon className="animate-bounce" /> Get Started
        </button>
        <p className="mb-4 text-zinc-400 sm:mx-100 text-[6px] sm:text-2xl mt-4">
          Welcome to SuvinEditography — your one-stop platform for seamless,
          stunning, and smart video edits. We bring your content to life with
          intuitive tools and creative power.
        </p>
        {/* <div className="hidden sm:block bg-white w-100  ml-190 rounded-3xl p-2 items-center justify-evenly flex-row gap-3 text-black">
          <Search className="text-black" />
          <input className="border-white border-1 border-none"
            type=" text"
            placeholder="search by words...."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handlesearch}>
            <ArrowBigRight/>
          </button>
        </div> */}
        <div className="scrollbar flex sm:hidden bg-white rounded-3xl text-black  overflow-scroll  text-[10px] p-2 max-h-12 ">
          <ul className="flex gap-2 font-bold">
            <li
              onClick={handleScrollTostudio}
              className="flex gap-1 hover:text-zinc-600 cursor-pointer bg-zinc-200 border-1 border-zinc-600   rounded-2xl flex-row min-w-20 w-auto items-center justify-center text-center p-1"
            >
              <Edit2 className="w-4 h-4 font-bold" /> Studio
            </li>
            <li className="flex gap-1 hover:text-zinc-600 cursor-pointer bg-zinc-200 border-1 border-zinc-600   rounded-2xl flex-row min-w-20 w-auto items-center justify-center text-center p-1">
              <RiGiftFill className="text-green-700 w-4 h-4" /> FreeTools
            </li>
            <li className="flex gap-1 hover:text-zinc-600 cursor-pointer bg-zinc-200 border-1 border-zinc-600   rounded-2xl flex-row min-w-20 w-auto items-center justify-center text-center p-1">
              <GemIcon className="text-yellow-400 w-4 h-4" /> ProTools
            </li>
            <li className="flex gap-1 hover:text-zinc-600 cursor-pointer bg-zinc-200 border-1 border-zinc-600   rounded-2xl flex-row min-w-20 w-auto items-center justify-center text-center p-1">
              <IoMdPricetag className="w-4 h-4" /> Pricing
            </li>
          </ul>
        </div>

        <div className="scrollbar flex text-black sm:bg-white w-auto gap-2 sm:justify-evenly items-center mx-0 sm:mx-50 mt-5 sm:mt-10  sm:p-4 p-1 rounded-3xl  text-[10px] sm:text-[18px] overflow-scroll ">
          {SearchOptions.map((item, index) => (
            <ul
              key={index}
              className="flex font-bold items-center-safe text-center  justify-evenly w-full "
            >
              <li
                onClick={() => navigate(item.path)}
                className="flex sm:gap-2 gap-2 hover:text-white hover:bg-black cursor-pointer bg-white sm:bg-zinc-300  rounded-2xl p-1 sm:p-1 border-1 border-zinc-500 flex-row items-center-safe"
              >
                <item.icon className="w-4 h-4 sm:w-8 sm:h-6" />
                <span>{item.name}</span>
              </li>
            </ul>
          ))}
        </div>
        <div className="w-full items-center flex justify-center">
          <div
            onClick={() => navigate("/stocks")}
            className="bg-white rounded-3xl cursor-pointer sm:mt-4 gap-2 sm:w-100 w-40 flex items-center text-black mt-2 text-center p-2 justify-center"
          >
            {" "}
            <SearchIcon className="w-4 h-4 sm:w-6 sm:h-6" />{" "}
            <p className="text-zinc-500 text-[10px] sm:text-[20px]">
              Search and get your..{" "}
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
