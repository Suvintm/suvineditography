import { useRef } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

const ZoomToolPanel = ({ canvasRef }) => {
  const workspaceRef = canvasRef?.current;

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => workspaceRef?.zoomOut()}
        className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
      >
        <Minus size={18} />
      </button>

      <button
        onClick={() => workspaceRef?.resetZoom()}
        className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
      >
        <RotateCcw size={18} />
      </button>

      <button
        onClick={() => workspaceRef?.zoomIn()}
        className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

export default ZoomToolPanel;
