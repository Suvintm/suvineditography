// src/pages/StudioEditor.jsx
import { useContext, useState } from "react";
import { StudioContext } from "../context/StudioContext";
import {
  Clapperboard,
  Save,
  Download,
  Image as ImageIcon,
  Crop,
  Type,
  SlidersHorizontal,
  Filter,
  Square,
  Sticker,
  SquareStack,
  Pencil,
  Eraser,
  Layers,
  LayoutTemplate,
} from "lucide-react";
import CanvasWorkspace from "../components/CanvasWorkspace";

const StudioEditor = () => {
  const { selectedProject } = useContext(StudioContext);
  const [activeTool, setActiveTool] = useState(null);

  const handleSave = () => {
    console.log("Save clicked");
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };

  const tools = [
    { name: "Add Image", icon: <ImageIcon size={20} /> },
    { name: "Crop", icon: <Crop size={20} /> },
    { name: "Text", icon: <Type size={20} /> },
    { name: "Adjust", icon: <SlidersHorizontal size={20} /> },
    { name: "Filter", icon: <Filter size={20} /> },
    { name: "Shapes", icon: <Square size={20} /> },
    { name: "Stickers", icon: <Sticker size={20} /> },
    { name: "Frames", icon: <SquareStack size={20} /> },
    { name: "Draw", icon: <Pencil size={20} /> },
    { name: "Eraser", icon: <Eraser size={20} /> },
    { name: "Layers", icon: <Layers size={20} /> },
    { name: "Templates", icon: <LayoutTemplate size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Top Bar */}
      <div className="w-full py-4 border-b border-gray-700 flex items-center justify-between px-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <Save size={18} />
          <span className="hidden sm:inline text-sm font-medium">Save</span>
        </button>

        <div
          className="
            bg-zinc-800 
            px-4 py-2 rounded-3xl flex items-center gap-2
            max-w-[40%] sm:max-w-[60%] md:max-w-[40%] 
            overflow-hidden text-ellipsis whitespace-nowrap
          "
        >
          <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
          <h1 className="text-[15px] sm:text-xl md:text-2xl font-bold text-center truncate">
            {selectedProject ? selectedProject.projectName : "Untitled Project"}
          </h1>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <Download size={18} />
          <span className="hidden sm:inline text-sm font-medium">Download</span>
        </button>
      </div>

      {/* Workspace */}
      <div className="w-full flex justify-center pt-4 bg-zinc-900 flex-1 overflow-auto">
        <CanvasWorkspace />
      </div>

      {/* Bottom Toolbar */}
      <div className="w-full border-t border-gray-700 bg-zinc-950 py-2 px-3 fixed bottom-0 left-0">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {tools.map((tool, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTool(tool.name)}
              className={`flex flex-col items-center gap-1 min-w-[60px] px-2 py-1 rounded-lg transition-colors
                ${
                  activeTool === tool.name
                    ? "bg-zinc-800 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {tool.icon}
              <span className="text-[11px] truncate">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudioEditor;
