import React, { useState } from "react";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setOriginalImage(file);
    setProcessedImage(null);
    setError("");
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setProcessedImage(null);

    const formData = new FormData();
    formData.append("image", originalImage);

    try {
      const response = await fetch("http://localhost:8000/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Something went wrong.");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
    } catch (err) {
      setError(
        err.message || "Something went wrong while removing background."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Background Remover Tool</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />
      {originalImage && (
        <div style={styles.imageSection}>
          <div style={styles.imageBox}>
            <h4>Original Image</h4>
            <img
              src={URL.createObjectURL(originalImage)}
              alt="Original"
              style={styles.image}
            />
          </div>
          <div style={styles.buttonBox}>
            <button onClick={handleRemoveBackground} style={styles.button}>
              Remove Background
            </button>
            {loading && <p>Processing...</p>}
          </div>
          <div style={styles.imageBox}>
            <h4>Result Image</h4>
            {processedImage && (
              <img
                src={processedImage}
                alt="Result"
                style={{ ...styles.image, backgroundColor: "transparent" }}
              />
            )}
          </div>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
  },
  imageSection: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    marginTop: "1rem",
  },
  imageBox: {
    flex: 1,
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    objectFit: "contain",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  buttonBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "1rem",
  },
};

export default BackgroundRemover;
