// src/pages/StudioEditor.jsx
import React, { useContext } from "react";
import { StudioProvider, StudioContext } from "../context/StudioContext";
import StudioHeader from "../components/StudioHeader";
import CanvasWorkspace from "../components/CanvasWorkspace";
import Toolbar from "../components/Toolbar";
import TextTool from "../components/TextTool";
import AddImageTool from "../components/AddImageTool";
import CropTool from "../components/CropTool";

const StudioEditor = () => {
  const { activeTool } = useContext(StudioContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StudioHeader />
      <div className="flex-1 container mx-auto px-4 py-4">
        <CanvasWorkspace />
      </div>

      {/* Tool Panel */}
      <div className="container mx-auto px-4">
        {activeTool === "text" && <TextTool />}
        {activeTool === "addImage" && <AddImageTool />}
        {activeTool === "crop" && <CropTool />}
      </div>

      {/* Toolbar */}
      <Toolbar />
    </div>
  );
};

// Wrap with Provider
export default function StudioEditorWrapper() {
  return (
    <StudioProvider>
      <StudioEditor />
    </StudioProvider>
  );
}
