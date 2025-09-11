// Import necessary React and Swiper modules
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper CSS for layout, pagination, navigation
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Optional custom styles (for bounce effect)
import "./carousel.css";

// Import your tool data (images, names, etc.)
import tools from "../Data/tools";

// Import custom icons from lucide-react (you can use others if you want)
import { ChevronLeft, ChevronRight } from "lucide-react";

// Function to scroll to the tool container section and highlight it
const scrollToTool = (toolName) => {
  const target = document.getElementById(
    `tool-${toolName.replace(/\s+/g, "")}`
  );
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("bounce-highlight");

    // Remove highlight after animation ends
    setTimeout(() => {
      target.classList.remove("bounce-highlight");
    }, 1400);
  }
};

const Carousel = () => {
  return (
    <div className="relative w-11/12 sm:w-auto py-5  px-4 sm:py-14 sm:px-10 sm:mx-10 bg-gradient-to-t from-black to-indigo-600 m-auto mt-30 rounded-2xl">
      {/* Heading */}
      <h2 className="text-center text-[20px] sm:text-3xl font-bold mb-2 sm:mb-6 text-white">
        Explore Our Powerful <br /> Tools
      </h2>

      {/* Custom Left Arrow */}
      <button className="custom-swiper-prev absolute top-1/2 -translate-y-1/2 left-2 z-20 p-2 bg-gradient-to-r from-black to-indigo-600 text-white rounded-full font-bold shadow hover:bg-gray-200 transition-all">
        <ChevronLeft size={24} />
      </button>

      {/* Custom Right Arrow */}
      <button className="custom-swiper-next absolute top-1/2 -translate-y-1/2 right-2 z-20 p-2 bg-gradient-to-r from-black to-indigo-600   text-white rounded-full shadow hover:bg-gray-200 transition-all">
        <ChevronRight size={24} />
      </button>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]} // Enable auto-slide, pagination dots, navigation
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-scroll every 3s
        pagination={{ clickable: true }}
        navigation={{
          nextEl: ".custom-swiper-next",
          prevEl: ".custom-swiper-prev",
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="px-2"
      >
        {/* Render each tool as a slide */}
        {tools.map((tool, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white border border-white  rounded-2xl shadow-md p-2 sm:p-6 pb-6 sm:pb-10 text-center hover:shadow-xl transition duration-300">
              {/* Tool image */}
              <img
                src={tool.image}
                alt={tool.name}
                className="w-50 h-40 object-cover rounded-2xl mb-4 m-auto border border-gray-300"
              />

              {/* Tool name and description */}
              <h3 className="text-xl font-semibold text-pink-800">
                {tool.name}
              </h3>
              <p className="text-gray-500 text-sm mt-2">{tool.desc}</p>

              {/* Scroll-to-container button */}
              <button
                onClick={() => scrollToTool(tool.name)}
                className="mt-2 px-4 py-2 font-bold bg-gradient-to-r from-black to-indigo-600 text-white rounded-full text-sm hover:bg-purple-700 transition"
              >
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
