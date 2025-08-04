// src/pages/BackgroundRemover.jsx
import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsDownload, BsImage } from "react-icons/bs";

const BgRemover = () => {
  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginal(URL.createObjectURL(file));
      setResult(null);

      // Simulate processing
      setLoading(true);
      setTimeout(() => {
        // Normally you'd send file to backend & get response
        setResult(URL.createObjectURL(file)); // For demo, same image
        setLoading(false);
      }, 2000);
    }
  };

  const handleTryAnother = () => {
    setOriginal(null);
    setResult(null);
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-purple-100 to-blue-100 font-roboto">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-purple-800">
          Background Remover
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8">
          Upload your image to instantly remove the background. Transparent grid
          preview enabled.
        </p>

        {!original && (
          <div className="border-4 border-dashed border-purple-300 rounded-2xl p-10 bg-white shadow-xl">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-4 text-purple-600">
                <FiUploadCloud className="text-5xl" />
                <p className="text-lg font-semibold">Click to Upload Image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {original && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="p-4 rounded-2xl bg-white shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2 text-lg">
                Original Image
              </h3>
              <div className="relative bg-white rounded-xl overflow-hidden">
                <img
                  src={original}
                  alt="Original"
                  className="rounded-xl w-full object-contain"
                />
              </div>
            </div>

            {/* Processed Image */}
            <div className="p-4 rounded-2xl bg-white shadow-lg">
              <h3 className="font-bold text-gray-700 mb-2 text-lg">
                Output (Transparent)
              </h3>
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {loading ? (
                  <div className="flex justify-center items-center h-60">
                    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-purple-600" />
                  </div>
                ) : result ? (
                  <img
                    src={result}
                    alt="Processed"
                    className="rounded-xl w-full object-contain"
                  />
                ) : (
                  <div className="flex justify-center items-center h-60 text-gray-400">
                    <BsImage className="text-4xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {original && !loading && (
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {result && (
              <button
                onClick={handleDownload}
                className="bg-bg-gradient-to-l from-purple-700  to-black  text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                <BsDownload /> Download
              </button>
            )}
            <button
              onClick={handleTryAnother}
              className="border border-black text-purple-700 hover:bg-purple-100 px-6 py-3 rounded-full font-semibold"
            >
              Try Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BgRemover;
