import React from "react";
import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { CheckBadgeIcon } from "@heroicons/react/24/solid"; // badge icon
import logo from "../assets/logo.png";
import unsplashLogo from "../assets/unplash.png";
import pixabayLogo from "../assets/pixabay.png";

// Header images
import header1 from "../assets/header1.jpg";
import header2 from "../assets/header2.jpg";
import header3 from "../assets/header3.jpg";

const HEADER_IMAGES = [header1, header2, header3];

// Add logos for each source
const SOURCE_CONFIG = {
  suvineditography: {
    name: "SuvinEditography",
    logo: logo,
    verified: true,
  },
  unsplash: { name: "Unsplash", logo: unsplashLogo, verified: false },
  pixabay: { name: "Pixabay", logo: pixabayLogo, verified: false },
};

const SOURCES = Object.keys(SOURCE_CONFIG);

export default function StockMainPage() {
  const location = useLocation();

  const [currentBg, setCurrentBg] = React.useState(0);

  // Cycle header images every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HEADER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // If user is at /stocks, redirect to default source
  if (location.pathname === "/stocks") {
    return <Navigate to="/stocks/suvineditography" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Header with animated background */}
      <div className="relative w-full h-40 flex flex-col justify-end overflow-hidden">
        {HEADER_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBg ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-70"></div>

        {/* Nav bar */}
        <nav className="relative px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={logo}
              alt="logo"
              className="w-8 h-8 border-2 border-white rounded-3xl"
            />
            <span className="font-bold text-lg text-white">
              SuvinEditography
            </span>
          </div>
        </nav>

        {/* "Choose your source" text */}
        <div className="relative text-center text-white/50 text-xs mb-2">
          Choose your source
        </div>

        {/* Scrollable source selector */}
        <div className="relative flex space-x-2 overflow-x-auto px-2 pb-2 mt-2 mb-4">
          {SOURCES.map((src) => {
            const { name, logo, verified } = SOURCE_CONFIG[src];
            return (
              <NavLink
                key={src}
                to={`/stocks/${src}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-1 py-2 rounded-full whitespace-nowrap transition text-[12px] ${
                    isActive
                      ? "bg-black border border-white/50 text-white"
                      : "bg-white font-bold text-black hover:bg-white/90"
                  }`
                }
              >
                <img
                  src={logo}
                  alt={name}
                  className="w-5 h-5 rounded-full border-2 border-white"
                />
                <span>{name}</span>
                {verified && (
                  <CheckBadgeIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Render selected stock page */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
