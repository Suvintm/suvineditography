import React from "react";
import { useNavigate } from "react-router-dom";

export default function GoToStudioCard() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-black">
      <div
        onClick={() => navigate("/studio")}
        className="cursor-pointer bg-gradient-to-r from-black to-indigo-600 p-2 sm:p-6 m-4 border-2 border-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-white hover:text-green-400 w-[445px] sm:max-w-full text-center"
      >
        <h2 className="text-2xl font-bold mb-2">🎨 Suvin Studio</h2>
        <p className="text-sm opacity-90">
          Edit your photos with our advanced tools — crop, filters, text,
          stickers & more.
        </p>
        <div className="mt-4 inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100">
          Start Editing
        </div>
      </div>
    </div>
  );
}
