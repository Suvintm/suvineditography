// src/components/RatioToolPanel.jsx
import { X } from "lucide-react";
import { useContext, useState } from "react";
import { StudioContext } from "../context/StudioContext";

const ratios = [
  { label: "1:1", w: 500, h: 500 },
  { label: "16:9", w: 800, h: 450 },
  { label: "9:16", w: 450, h: 800 },
  { label: "4:3", w: 800, h: 600 },
  { label: "3:2", w: 900, h: 600 },
];

const RatioToolPanel = ({ canvas }) => {
  const { setActiveTool } = useContext(StudioContext);
  const [activeRatio, setActiveRatio] = useState(null);

  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  const applyRatio = (w, h, label) => {
    if (!canvas) return;

    if (activeRatio === label) return;

    const parentWidth = canvas.upperCanvasEl.parentNode.offsetWidth;
    let maxWidth = Math.min(parentWidth, 900);

    // 🎯 Dynamic scaling for better look
    let scale = 1;
    if (w > maxWidth) {
      scale = maxWidth / w;
    } else {
      // make small ratios a bit larger but not overflowing
      if (w / h > 0.9 && w / h < 1.2) {
        scale = 1.2; // square-like ratios look bigger
      } else if (h > w) {
        scale = 0.9; // tall ratios look slightly smaller
      } else {
        scale = 1; // normal scaling
      }
    }

    const newWidth = Math.floor(w * scale);
    const newHeight = Math.floor(h * scale);

    canvas.setWidth(newWidth);
    canvas.setHeight(newHeight);
    canvas.renderAll();

    setActiveRatio(label);
  };

  const applyCustom = () => {
    if (!customWidth || !customHeight) return;
    applyRatio(parseInt(customWidth), parseInt(customHeight), "Custom");
  };

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-zinc-900 border border-gray-700 rounded-xl p-4 w-[320px] shadow-lg z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm font-semibold">Choose Ratio</h3>
        <button
          onClick={() => setActiveTool(null)}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Preset Ratios */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {ratios.map((r) => (
          <button
            key={r.label}
            onClick={() => applyRatio(r.w, r.h, r.label)}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              activeRatio === r.label
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-gray-200 hover:bg-zinc-700"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Custom Ratio */}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          placeholder="Width"
          value={customWidth}
          onChange={(e) => setCustomWidth(e.target.value)}
          className="w-1/2 px-2 py-1 rounded bg-zinc-800 text-white text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <input
          type="number"
          placeholder="Height"
          value={customHeight}
          onChange={(e) => setCustomHeight(e.target.value)}
          className="w-1/2 px-2 py-1 rounded bg-zinc-800 text-white text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={applyCustom}
          className={`px-3 py-2 rounded-lg text-sm ${
            activeRatio === "Custom"
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-gray-200 hover:bg-zinc-700"
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default RatioToolPanel;
