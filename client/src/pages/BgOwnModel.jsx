import React, { useState } from "react";
import "./BgOwnModel.css";

export default function BgOwnModel() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
      setResultUrl(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setError("");
    setLoading(true);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const response = await fetch("http://localhost:8010/remove", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // JWT token from localStorage
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed: ${response.status} ${response.statusText}`);
      }

      // Get processed image as blob
      const blob = await response.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-remover-container">
      <h2>Background Remover</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="preview-container">
          <h4>Preview:</h4>
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}

      {loading ? (
        <p className="loading-text">⏳ Removing background...</p>
      ) : (
        file && (
          <button className="remove-btn" onClick={handleRemoveBackground}>
            Remove Background
          </button>
        )
      )}

      {error && <p className="error-text">⚠️ {error}</p>}

      {resultUrl && (
        <div className="result-container">
          <h4>Result:</h4>
          <img src={resultUrl} alt="Result" className="result-image" />
          <a
            href={resultUrl}
            download="bg_removed.png"
            className="download-link"
          >
            ⬇ Download Result
          </a>
        </div>
      )}
    </div>
  );
}
