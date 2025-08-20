// src/components/CanvasWorkspace.jsx
import { useEffect, useRef } from "react";
import { fabric } from "fabric";

const CanvasWorkspace = ({ onInit }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#111",
      selection: true,
      preserveObjectStacking: true,
    });

    // Responsive canvas
    const resizeCanvas = () => {
      const parentWidth = canvasRef.current.parentNode.offsetWidth;

      // allow bigger width for laptops/desktops
      let newWidth = parentWidth - 40;
      if (newWidth > 1000) newWidth = 1000; // max width on large screens
      if (newWidth < 320) newWidth = 320; // min width for very small screens

      canvas.setWidth(newWidth);
      canvas.setHeight(newWidth * 0.6); // keep a 16:10 style ratio
      canvas.renderAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (onInit) onInit(canvas);

    return () => {
      canvas.dispose();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onInit]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg border border-gray-700 shadow-lg"
    />
  );
};

export default CanvasWorkspace;
