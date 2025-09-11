import { X } from "lucide-react";
import { useContext, useRef } from "react";
import { StudioContext } from "../context/StudioContext";
import { fabric } from "fabric";

const AddImageToolPanel = ({ canvas }) => {
  const { setActiveTool } = useContext(StudioContext);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!canvas || !files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          img.set({
            left: canvas.getWidth() / 2 - img.width / 4,
            top: canvas.getHeight() / 2 - img.height / 4,
            scaleX: 0.5,
            scaleY: 0.5,
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-zinc-900 border border-gray-700 rounded-xl p-4 w-[320px] shadow-lg z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm font-semibold">Add Images</h3>
        <button
          onClick={() => setActiveTool(null)}
          className="text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium"
        >
          Select Images
        </button>
        <p className="text-xs text-gray-400">You can select multiple images</p>
      </div>
    </div>
  );
};

export default AddImageToolPanel;
