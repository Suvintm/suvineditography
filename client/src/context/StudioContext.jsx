// src/context/StudioContext.jsx
import React, { createContext, useState } from "react";

export const StudioContext = createContext();

export const StudioProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  return (
    <StudioContext.Provider
      value={{
        canvas,
        setCanvas,
        selectedObject,
        setSelectedObject,
        activeTool,
        setActiveTool,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};
