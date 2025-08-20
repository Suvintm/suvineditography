import React, { useContext, useState } from "react";
import { StudioContext } from "../context/StudioContext";

const ToolPanel = () => {
  const { activeTool, selectedObject, canvasInstance, setProjectCanvasState } =
    useContext(StudioContext);

  const [brightness, setBrightness] = useState(0);

  // Update brightness
  const handleBrightness = (value) => {
    if (!selectedObject) return;
    selectedObject.filters = [
      new fabric.Image.filters.Brightness({ brightness: parseFloat(value) }),
    ];
    selectedObject.applyFilters();
    canvasInstance.renderAll();
    setProjectCanvasState(canvasInstance.toJSON());
    setBrightness(value);
  };

  if (!activeTool || !selectedObject) return null;

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-col gap-4">
      {activeTool === "adjust" && (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Adjust</h3>
          <label>Brightness</label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={brightness}
            onChange={(e) => handleBrightness(e.target.value)}
          />
        </div>
      )}

      {activeTool === "text" && selectedObject.type === "i-text" && (
        <div className="flex flex-col gap-2">
          <label>Text</label>
          <input
            type="text"
            value={selectedObject.text}
            onChange={(e) => {
              selectedObject.text = e.target.value;
              canvasInstance.renderAll();
              setProjectCanvasState(canvasInstance.toJSON());
            }}
          />
          <label>Font Size</label>
          <input
            type="number"
            value={selectedObject.fontSize}
            onChange={(e) => {
              selectedObject.fontSize = parseInt(e.target.value);
              canvasInstance.renderAll();
              setProjectCanvasState(canvasInstance.toJSON());
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ToolPanel;
