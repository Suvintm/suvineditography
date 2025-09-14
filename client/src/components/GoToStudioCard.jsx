import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import studioimage from "../assets/studio.png";
import man from "../assets/man.png" 
import { Gift } from "lucide-react";
export default function GoToStudioCard() {
  const navigate = useNavigate();

  return (
    <div id="studio-go" className="flex items-center justify-center bg-black">
      <img
        onClick={() => navigate("/studio")}
        className="absolute cursor-pointer  hidden  sm:flex z-10 left-110 top-331 w-140 h-90"
        src={man}
        alt="man"
      />
      <img
        onClick={() => navigate("/studio")}
        className="absolute cursor-pointer animate-bounce sm:hidden flex z-10 left-0 top-330 w-50 h-35"
        src={man}
        alt="man"
      />
      <h1
        onClick={() => navigate("/studio")}
        className="absolute cursor-pointer  hidden  sm:flex z-50 bg-green-500 left-300 top-315 px-8 text-white sm:text-[20px] font-bold p-2 gap-2 rounded-2xl"
        src={man}
        alt="man"
      > <Gift/> Free</h1>
       <h1
        onClick={() => navigate("/studio")}
        className="absolute cursor-pointer  sm:hidden  flex z-50 bg-green-500 left-65 top-280 px-4 sm:px-8 text-white sm:text-[20px] text-[15px] font-bold p-2 gap-2 rounded-2xl"
        src={man}
        alt="man"
      > <Gift className="w-5 h-5" /> Free</h1>
      <div
        onClick={() => navigate("/studio")}
        className="cursor-pointer  bg-white p-2 sm:p-6 m-8 border-2 sm:border-4 border-dashed  border-zinc-100 rounded-2xl shadow-lg hover:shadow-xl transition transform   text-black hover:text-zinc-700 w-[445px] sm:w-200 text-center"
      >
        <div className="flex items-center gap-2 justify-center mb-1 bg-gradient-to-b from-purple-300 via-purple-300  border-b-white border-black-400 p-1 rounded-3xl">
          <img className="w-15 sm:w-20" src={logo} alt="logo" />
          <h2 className="text-[20px]  sm:text-2xl font-bold mb-2">
            Suvin Studio
          </h2>
        </div>
        <div className="flex flex-row items-center justify-center gap-4 m-2">
          <div className="w-[40%] font-extrabold  rounded-3xl p-2 bg-gradient-to-b sm:p-6 from-purple-300">
            Edit Image with your Creativity
          </div>
          <div>
            <img
              className="w-32 h-30 sm:w-40 sm:h-40 object-cover"
              src={studioimage}
              alt="studio"
            />
          </div>
        </div>
        <p className="sm:text-sm text-[10px] px-6  opacity-90">
          Edit your photos with our advanced tools — crop, filters, text,
          stickers & more.
        </p>
        <div className="mt-4 inline-block border-1 border-zinc-600 bg-gradient-to-bl from-black via-black/80 to-black text-white px-4 py-2 rounded-3xl font-medium shadow hover:bg-gray-100">
          Start Editing
        </div>
      </div>
    </div>
  );
}
