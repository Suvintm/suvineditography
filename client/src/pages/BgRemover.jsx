import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import "./BgRemover.css";
import { IoMdReturnLeft } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";

const BgRemover = () => {
  const { backendUrl, token, credits, setCredits } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();

  const navigate=useNavigate()

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(1);
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 99) {
            clearInterval(interval);
            return oldProgress;
          }
          return oldProgress + 1;
        });
      }, 50);
    } else {
      setProgress(0);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    setResultImage(null);
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    if (credits <= 0) {
      toast.error("You have no credits left");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
        }
      );

      if (res.data.success) {
        setResultImage(res.data.data);
        setCredits(res.data.creditBalance);
        toast.success("Background removed successfully!");
      } else {
        toast.error(res.data.message || "Failed to remove background");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnother = () => {
    setSelectedImage(null);
    setResultImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click(); // Open file selector automatically
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "bg-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bgremover-container">
      <IoMdReturnLeft
        onClick={() => navigate("/")}
        className="absolute bg-black ml-2 rounded-3xl border-2 border-zinc-500 border-dashed w-8 h-8 p-2 mt-4"
      />
      <h2 className="title">Background Remover</h2>
      <p className="credits">
        Available Credits: <strong>{credits}</strong>
      </p>

      <label htmlFor="fileUpload" className="custom-upload-btn">
        Choose Image
      </label>
      <input
        id="fileUpload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="file-input"
      />

      {(selectedImage || resultImage) && (
        <div className="preview-container">
          <div className="preview-box">
            <h3>Original Image</h3>
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Original"
                className="preview-image fadeIn"
              />
            ) : (
              <p>No image selected</p>
            )}
          </div>

          <div className="preview-box">
            <h3>Result</h3>
            {loading && (
              <div className="loader-container">
                <div className="loader"></div>
                <p className="loading-text">Processing...</p>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="progress-percent">{progress}%</p>
              </div>
            )}
            {!loading && resultImage ? (
              <div className="result-image-wrapper fadeIn">
                <div className="checkerboard-bg" />
                <img
                  src={resultImage}
                  alt="Background Removed"
                  className="preview-image result-image"
                />
              </div>
            ) : !loading ? (
              <p>Result will appear here</p>
            ) : null}
          </div>
        </div>
      )}

      {/* Buttons row on desktop */}
      <div className="buttons-row desktop-buttons">
        <button
          className="btn btn-primary"
          onClick={handleRemoveBackground}
          disabled={loading || !selectedImage}
        >
          Remove Background
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTryAnother}
          disabled={loading && !resultImage && !selectedImage}
        >
          Try Another
        </button>

        <button
          className="btn btn-download"
          onClick={handleDownload}
          disabled={!resultImage}
        >
          Download Image
        </button>
      </div>

      {/* Buttons row on mobile */}
      <div className="buttons-row mobile-buttons">
        <button
          className="btn btn-primary"
          onClick={handleRemoveBackground}
          disabled={loading || !selectedImage}
        >
          Remove Background
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleTryAnother}
          disabled={loading && !resultImage && !selectedImage}
        >
          Try Another
        </button>

        <button
          className="btn btn-download"
          onClick={handleDownload}
          disabled={!resultImage}
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

export default BgRemover;
