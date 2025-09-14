// client/src/pages/StockMainPage.jsx
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { CheckBadgeIcon } from "@heroicons/react/24/solid"; // badge icon
import logo from "../assets/logo.png";
import unsplashLogo from "../assets/unplash.png";
import pixabayLogo from "../assets/pixabay.png";


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
  const location = useLocation("/suvineditography");

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Header */}
      <nav className="bg-white px-4 py-3 flex items-center justify-between mb-1 shadow-sm">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-lg">SuvinEditography</span>
        </div>
      </nav>

      {/* Scrollable source selector */}
      <div className="bg-green-200 rounded-3xl text-[12px] px-2 py-2 flex space-x-1 overflow-x-auto">
        {SOURCES.map((src) => {
          const { name, logo, verified } = SOURCE_CONFIG[src];
          return (
            <NavLink
              key={src}
              to={`/stocks/${src}`}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-2 py-2 rounded-full whitespace-nowrap transition ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              {/* Logo */}
              <img src={logo} alt={name} className="w-5 h-5 rounded-full border-2 border-white" />

              {/* Name */}
              <span>{name}</span>

              {/* Verified Badge for SuvinEditography */}
              {verified && (
                <CheckBadgeIcon className="w-3 h-3 text-blue-500 flex-shrink-0" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Render selected stock page */}
      <div className="flex-1">
        {/* If no sub-route is selected, default to suvineditography */}
        {location.pathname === "/stocks" ? (
          <p className="text-center text-gray-500 p-6">Select a source above</p>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
