// src/components/PaymentPacksSection.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { WalletIcon, StarIcon, RocketIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentPacksSection = () => {
  const { backendUrl } = useContext(AppContext);
  const [packs, setPacks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Fetch packs from backend
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/packs`);
        setPacks(res.data);
      } catch (err) {
        console.error("Failed to fetch packs:", err);
      }
    };
    fetchPacks();
  }, [backendUrl]);

  const handleBuy = (pack) => {
    navigate("/buy-credits", { state: { pack } });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Upgrade Your Plan</h2>
        <p className="mt-2 text-gray-600 text-lg">
          Choose a credit pack and unlock premium tools for better productivity!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {packs.map((pack, index) => (
          <button
            key={pack._id}
            onClick={() => setActiveIndex(index)}
            className={`px-5 py-2 rounded-full font-semibold transition-colors ${
              activeIndex === index
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {pack.name}
          </button>
        ))}
      </div>

      {/* 3D Carousel */}
      <div className="relative flex justify-center items-center overflow-hidden h-[400px]">
        {packs.map((pack, index) => {
          const offset = index - activeIndex; // relative position
          const absOffset = Math.abs(offset);

          // Adjust scale, opacity, zIndex
          const scale = offset === 0 ? 1 : 0.8;
          const opacity = offset === 0 ? 1 : 0.5;
          const zIndex = offset === 0 ? 10 : 10 - absOffset;
          const translateX = offset * 260; // spacing between cards

          return (
            <div
              key={pack._id}
              className="absolute transition-all duration-500 ease-in-out cursor-pointer"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                minWidth: "280px",
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className={`p-6 rounded-2xl shadow-2xl ${
                  pack.bgColor ||
                  "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                } border-2 border-white/20`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{pack.name}</h3>
                  <WalletIcon className="w-6 h-6" />
                </div>
                <p className="mb-4 text-gray-100">{pack.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <StarIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-4xl font-extrabold">
                    {pack.credits}
                  </span>
                  <span className="text-gray-200">Credits</span>
                </div>
                <div className="text-xl font-semibold mb-4">₹{pack.price}</div>
                <button
                  className="w-full bg-white text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
                  onClick={() => handleBuy(pack)}
                >
                  Buy Now
                </button>
                {offset === 0 && (
                  <div className="mt-3 flex justify-end">
                    <RocketIcon className="w-6 h-6 text-white animate-bounce" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-24 text-center text-gray-400 text-sm">
        Click on tabs or cards to view different plans
      </div>
    </section>
  );
};

export default PaymentPacksSection;
