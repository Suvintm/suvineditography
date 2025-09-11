import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png"; // your logo.png path

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  // simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          return 100;
        }
        return old + 1;
      });
    }, 50); // adjust speed here
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {/* Logo */}
      <img src={logo} alt="Suvin Logo" className="w-24 h-24 mb-6" />

      {/* Progress Bar */}
      <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-gray-400 font-semibold">loading....</span>
        <span className="text-white font-bold">{progress}%</span>
      </div>
    </div>
  );
};

export default LoadingScreen;