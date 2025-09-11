import { useContext, useEffect, useRef, useState } from "react";
import { StudioContext } from "../context/StudioContext";
import { AppContext } from "../context/AppContext";
import { Clapperboard, Save, Download, ArrowBigLeftDash } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

import CanvasWorkspace from "../components/CanvasWorkspace";
import Toolbar from "../components/Toolbar";
import RatioToolPanel from "../components/RatioToolPanel";
import ZoomToolPanel from "../components/ZoomToolPanel";
import AddImageToolPanel from "../components/AddImageToolPanel";
import { RiSendBackward } from "react-icons/ri";
import { Link } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";

import logo from "../assets/logo.png"; // ✅ reuse logo from StudioHome

const StudioEditor = () => {
  const { selectedProject, activeTool, setProjects } =
    useContext(StudioContext);
  const { backendUrl, token } = useContext(AppContext);

  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef(null);

  // ✅ Loading overlay state
  const [loading, setLoading] = useState(false);

  // ✅ Canvas-specific loading overlay state
  const [canvasLoading, setCanvasLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // ✅ Load saved canvas state from backend
  useEffect(() => {
    if (!canvas || !selectedProject) return;

    const loadCanvasState = async () => {
      try {
        setCanvasLoading(true); // start loader

        const res = await axios.get(
          `${backendUrl}/api/projects/${selectedProject._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success && res.data.project.canvasState) {
          canvas.loadFromJSON(res.data.project.canvasState, () => {
            canvas.renderAll();
            // fade out effect
            setFadeOut(true);
            setTimeout(() => {
              setCanvasLoading(false);
              setFadeOut(false);
            }, 500); // fade duration
          });
        } else {
          setFadeOut(true);
          setTimeout(() => {
            setCanvasLoading(false);
            setFadeOut(false);
          }, 500);
        }
      } catch (error) {
        console.error("Error loading canvas state:", error);
        toast.error("Failed to load project canvas ❌");
        setCanvasLoading(false);
      }
    };

    loadCanvasState();
  }, [canvas, selectedProject, backendUrl, token]);

  // ✅ Save canvas state + thumbnail to backend
  const handleSave = async () => {
    if (!canvas || !selectedProject) return;

    setLoading(true);
    try {
      const canvasState = canvas.toJSON();
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      const imageDataURL = canvas.toDataURL({
        format: "png",
        quality: 0.8,
        multiplier: 0.5,
      });

      const res = await axios.put(
        `${backendUrl}/api/projects/${selectedProject._id}`,
        { canvasState, canvasWidth, canvasHeight, imageDataURL },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Project saved successfully ✅");
        setProjects((prev) =>
          prev.map((p) =>
            p._id === selectedProject._id ? res.data.project : p
          )
        );
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download as PNG
  const handleDownload = () => {
    if (!canvas) return;

    setLoading(true);
    setTimeout(() => {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${selectedProject?.projectName || "project"}.png`;
      link.click();

      setLoading(false);
    }, 1500); // small delay to show loading
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col">
      <Toaster position="top-right" />

      {/* ✅ Canvas Loading Overlay */}
      {canvasLoading && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black/70 z-[9999] transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6 ">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-green-400 "></div>
              <img
                src={logo}
                alt="Studio Logo"
                className="w-12 h-12 rounded-full absolute inset-0 m-auto animate-ping"
              />
            </div>
            <p className="mt-2 bg-white rounded-3xl px-4 py-2 text-green-500 font-semibold animate-pulse">
              Loading your project canvas…
            </p>
            <Link
              to="/studio"
              className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl shadow transition"
            >
              Back to Studio
            </Link>
          </div>
        </div>
      )}

      {/* ✅ Popover Loading Overlay (for Save/Download) */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-green-400"></div>
              <img
                src={logo}
                alt="Loading Logo"
                className="w-12 h-12 rounded-full absolute inset-0 m-auto"
              />
            </div>
            <p className="mt-2 bg-white rounded-3xl p-2 text-green-500 font-medium animate-pulse">
              Processing...
            </p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-700 flex items-center justify-between sm:justify-evenly px-4 py-4">
        <div className="flex gap-6 items-center-safe justify-center">
          <Link
            to="/studio"
            className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors bg-zinc-800 px-2 py-2 rounded-3xl"
          >
            <ArrowBigLeftDash />
            <p className="hidden sm:flex">Back To Studio</p>
          </Link>
        </div>

        <div className="bg-zinc-800 px-4 py-2 rounded-3xl flex items-center gap-2 max-w-[60%] md:max-w-[40%] overflow-hidden">
          <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
          <h1 className="text-[15px] sm:text-xl md:text-2xl font-bold text-center truncate">
            {selectedProject ? selectedProject.projectName : "Untitled Project"}
          </h1>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <Download className="text-yellow-300" size={18} />
          <span className="hidden sm:inline text-sm font-medium">Download</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <Save className="text-green-300 animate-bounce" size={18} />
          <span className="hidden sm:inline text-sm font-medium">Save</span>
        </button>
      </div>

      <div className="bg-zinc-800 text-white mt-20 sm:mt-25 sm:mb-6 sm:mx-80 rounded-3xl p-2 mx-4 flex items-center justify-start gap-2 sm:gap-8 sm:justify-center mb-2">
        <IoIosWarning className="text-yellow-300 sm:w-8 sm:h-8" />{" "}
        <p className="text-[8px] sm:text-[16px]">
          Unsaved changes will be lost if you navigate away or refresh the page{" "}
          <br />
          TIPS :{" "}
          <span className="font-semibold">Use the Save button frequently!</span>
        </p>
      </div>

      {/* Workspace */}
      <div className="flex-1 overflow-auto flex justify-center bg-zinc-900 pt-20 pb-24">
        <div className="w-full max-w-5xl">
          <CanvasWorkspace
            ref={canvasRef}
            onInit={setCanvas}
            initialJson={selectedProject?.canvasState} // load on first render
          />
        </div>
      </div>

      {/* Tool Panels */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center z-40">
        {activeTool === "ratio" && (
          <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg p-4">
            <RatioToolPanel canvas={canvas} />
          </div>
        )}
        {activeTool === "zoom" && (
          <div className="w-full max-w-sm bg-zinc-800 rounded-xl shadow-lg p-4">
            <ZoomToolPanel canvasRef={canvasRef} />
          </div>
        )}
        {activeTool === "addImage" && (
          <div className="w-full max-w-sm bg-zinc-800 rounded-xl shadow-lg p-4">
            <AddImageToolPanel canvas={canvas} />
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar />
    </div>
  );
};

export default StudioEditor;
