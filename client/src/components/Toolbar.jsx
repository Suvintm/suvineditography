import { useContext } from "react";
import { StudioContext } from "../context/StudioContext";
import {
  Image as ImageIcon,
  Type,
  Scissors,
  Wand2,
  Shapes,
  Crop,
  Sparkles,
  Contrast,
  Eraser,
  Palette,
  RectangleHorizontal,
  ZoomIn,
} from "lucide-react";

const Toolbar = () => {
  const { activeTool, setActiveTool } = useContext(StudioContext);

  const tools = [
    { name: "addImage", label: "Image", icon: ImageIcon },
    { name: "ratio", label: "Ratio", icon: RectangleHorizontal },
    { name: "zoom", label: "Zoom", icon: ZoomIn },
    { name: "text", label: "Text", icon: Type },
    { name: "crop", label: "Crop", icon: Crop },
    { name: "adjust", label: "Adjust", icon: Contrast },
    { name: "effects", label: "Effects", icon: Sparkles },
    { name: "filter", label: "Filter", icon: Wand2 },
    { name: "shapes", label: "Shapes", icon: Shapes },
    { name: "erase", label: "Erase", icon: Eraser },
    { name: "scissor", label: "Scissor", icon: Scissors },
    { name: "background", label: "BG Color", icon: Palette },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-zinc-900 border-t border-gray-700 p-2 z-40">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {tools.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            onClick={() => setActiveTool((t) => (t === name ? null : name))}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
              activeTool === name
                ? "bg-zinc-700 text-white"
                : "text-gray-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Icon size={22} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
