import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import logo from "../assets/logo.png";
import banner from "../assets/bg2.jpg"
import { IoIosReturnLeft, IoMdReturnLeft } from "react-icons/io";
import { RiSendBackward } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";

const BgOwnModel = () => {
  const { token } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  // Python API endpoint
  const PYTHON_API_URL = "http://127.0.0.1:8000/remove-bg";

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setProcessedImage(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }
    if (!token) {
      alert("No token found! Please log in.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", image); // must match FastAPI's "file" param

      const res = await fetch(PYTHON_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Don't set Content-Type, browser sets it
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const blob = await res.blob();
      setProcessedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Background removal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gradient-to-b from-black via-indigo-950 to-black min-h-screen text-white items-center text-center justify-center ">
      <IoMdReturnLeft 
      onClick={() => navigate("/")} className="absolute bg-black ml-2 rounded-3xl border-2 border-zinc-500 border-dashed w-8 h-8 p-2 mt-4" />
       
      <h2 className="text-white text-3xl pt-6">
        {" "}
        <span className="text-green-500 font-bold text-4xl">FREE </span>{" "}
        Background <br></br> <span className="text-5xl font-bold">Remover</span>
      </h2>

      <div className="bg-white rounded-4xl mx-8 mt-8 p-4 pt-6 sm:mx-150 text-white">
        <label
          htmlFor="fileinput"
          className=" text-black bg-amber-300 rounded-3xl w-100 p-2 sm:p-4 text-center border-2 border-dashed border-black "
        >
          <input
            id="fileinput"
            className="hidden text-black bg-amber-300 rounded-3xl w-100 p-4 sm:p-4 text-center "
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span className="font-bold text-zinc-800" >Select Image</span>
        </label>
        <p className="text-black font-bold text-2xl mt-5">
          Choose Your <span className="text-orange-400 text-4xl">Image</span>{" "}
        </p>
      </div>
      <br />

      <div className="flex-col sm:flex-row  gap-4 text-center items-center justify-center ">
        {image && (
          <div className="border-1 border-white rounded-4xl items-center text-center justify-center sm:mx-150  m-6 sm:m-4   p-8 flex flex-col">
            <h4 className="text-green-500 text-2xl font-bold pb-2">
              Original Image:
            </h4>
            <img
              src={URL.createObjectURL(image)}
              alt="Original"
              style={{ maxWidth: "300px" }}
            />
          </div>
        )}

        {processedImage && (
          <div
            className="border-1 border-white rounded-4xl items-center text-center justify-center sm:mx-150   m-6 p-8 flex flex-col bg-cover bg-center  "
            style={{ backgroundImage: `url(${logo})` }}
          >
            {/* <h4 className="text-orange-500 text-2xl font-bold"></h4> */}
            <img
              src={processedImage}
              alt="Processed"
              style={{ maxWidth: "300px" }}
            />
          </div>
        )}
        {processedImage ? (
          <a
            className="bg-white rounded-3xl p-2 text-green-700 font-bold mt-1 m-4 "
            href={processedImage}
            download="processed.png"
          >
            Download
          </a>
        ) : (
          ""
        )}
        {image && !processedImage ? (
          <button
            className="bg-gradient-to-l from-orange-500 to-yellow-300 rounded-3xl p-2 font-extrabold mb-4 text-black border-1 border-zinc-700 "
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Remove"}
          </button>
        ) : (
          ""
        )}
        {!image && !processedImage ? (
          <div className="flex flex-col text-center items-center border-6 border-dotted border-zinc-400 rounded-4xl mx-10 sm:mx-160 ">
            <span className="text-orange-500 font-bold text-3xl">Quality</span>
            <span className="font-bold mb-2">Output</span>
            <img className="sm:w-100 sm:mb-6 rounded-4xl" src={banner} alt="" />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BgOwnModel;
