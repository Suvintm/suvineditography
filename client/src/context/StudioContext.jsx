// src/context/StudioContext.jsx
import { createContext, useState } from "react";

export const StudioContext = createContext();

export const StudioProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTool, setActiveTool] = useState(null); // Track active tool

  return (
    <StudioContext.Provider
      value={{
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        activeTool,
        setActiveTool,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};
