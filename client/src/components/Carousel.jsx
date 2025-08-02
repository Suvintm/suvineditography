// src/components/ToolCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./carousel.css"; // custom style (optional)
import Bg from "../assets/bg.jpg";

const tools = [
  {
    name: "Background Remover",
    desc: "Remove image background in 1 click.",
    image: Bg,
  },
  {
    name: "AI Image Generator",
    desc: "Turn text into stunning visuals.",
    image: Bg,
  },
  {
    name: "Photo Enhancer",
    desc: "Enhance clarity, brightness & details.",
    image: Bg,
  },
  {
    name: "Object Eraser",
    desc: "Erase unwanted objects from photos.",
    image: Bg,
  },
];

const Carousel = () => {
  return (
    <div className="w-90 sm:w-350 py-6 px-4 sm:py-12 sm:px-10 bg-gradient-to-b from-purple-600 to-white m-auto mt-6 rounded-2xl">
      <h2 className="text-center text-3xl font-bold mb-2 text-white">
        Explore Our Powerful Tools
      </h2>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="px-4 shadow-2xl shadow-black rounded-2xl"
      >
        {tools.map((tool, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md  p-6 text-center hover:shadow-xl transition duration-300">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-60 m-auto border-2 border-gray-300 h-60 object-cover rounded-2xl mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {tool.name}
              </h3>
              <p className="text-gray-500 text-sm mt-2">{tool.desc}</p>
              <button className="mt-4 px-4 py-2 font-bold bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-full text-sm hover:bg-blue-700 transition">
                Try Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
