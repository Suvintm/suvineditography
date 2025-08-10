import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const BgOwnModel = () => {
  const { token } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: "20px" }}>
      <h2>Background Removal</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Remove Background"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {image && (
          <div>
            <h4>Original Image:</h4>
            <img
              src={URL.createObjectURL(image)}
              alt="Original"
              style={{ maxWidth: "300px" }}
            />
          </div>
        )}

        {processedImage && (
          <div>
            <h4>Processed Image:</h4>
            <img
              src={processedImage}
              alt="Processed"
              style={{ maxWidth: "300px" }}
            />
            <a href={processedImage} download="processed.png">
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BgOwnModel;
