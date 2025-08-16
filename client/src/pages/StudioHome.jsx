// src/pages/StudioHome.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const StudioHome = () => {
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);

  const [renamingProjectId, setRenamingProjectId] = useState(null);
  const [renamingName, setRenamingName] = useState("");

  // Progress simulation
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 5));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setProjects(res.data.projects || []);
      else setError("Failed to fetch projects");
    } catch (err) {
      console.error(err);
      setError("Unable to load projects. Please try again.");
    } finally {
      setProgress(100);
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    if (token) fetchProjects();
  }, [token, backendUrl]);

  // Create new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      setCreating(true);
      const res = await axios.post(
        `${backendUrl}/api/projects`,
        { projectName: newProjectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success("🎉 Project created!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          style: { fontSize: "0.85rem", padding: "6px 12px" },
        });
        navigate(`/studio/editor/${res.data.project._id}`);
      } else {
        toast.error("❌ Failed to create project", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          style: { fontSize: "0.85rem", padding: "6px 12px" },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating project", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        style: { fontSize: "0.85rem", padding: "6px 12px" },
      });
    } finally {
      setCreating(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const res = await axios.delete(`${backendUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
        toast.success("🔥 Project deleted!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          style: { fontSize: "0.85rem", padding: "6px 12px" },
        });
      } else {
        toast.error("❌ Failed to delete project", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          style: { fontSize: "0.85rem", padding: "6px 12px" },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting project", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        style: { fontSize: "0.85rem", padding: "6px 12px" },
      });
    }
  };

  // Rename project
  const handleRenameProject = async () => {
    if (!renamingName.trim()) return;
    try {
      const res = await axios.put(
        `${backendUrl}/api/projects/${renamingProjectId}`,
        { projectName: renamingName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setProjects(
          projects.map((p) =>
            p._id === renamingProjectId
              ? { ...p, projectName: renamingName }
              : p
          )
        );
        setRenamingProjectId(null);
        setRenamingName("");
        toast.success("💪 Project renamed!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          style: { fontSize: "0.85rem", padding: "6px 12px" },
        });
      } else {
        toast.error("❌ Failed to rename project", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          style: { fontSize: "0.85rem", padding: "6px 12px" },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error renaming project", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        style: { fontSize: "0.85rem", padding: "6px 12px" },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-500 to-black  text-white p-6">
      <ToastContainer limit={3} newestOnTop />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold">🎨 Suvin Studio</h1>
        </div>

        {/* New Project Button */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-3 bg-indigo-600 border-white border-2 hover:bg-indigo-500 rounded-2xl font-semibold shadow-lg transform transition hover:scale-105"
          >
            ➕ Create New Project
          </button>

          {showForm && (
            <form
              onSubmit={handleCreateProject}
              className="flex flex-col sm:flex-row gap-4 items-center mt-4 w-full max-w-md"
            >
              <input
                type="text"
                placeholder="Enter Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-black flex-1 border-2 border-white focus:border-indigo-800 outline-none transition"
              />
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-gradient-to-l from-black to-purple-500 hover:bg-green-500 rounded-3xl font-medium transition flex items-center gap-1"
              >
                {creating ? (
                  "Creating..."
                ) : (
                  <>
                    <FaSave /> Create
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-3xl  font-medium transition flex items-center gap-1"
              >
                <FaTimes /> Cancel
              </button>
            </form>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Progress Bar */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <p className="text-gray-300 font-medium">
              Loading your projects...
            </p>
            <div className="w-2/3 bg-gray-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-white to-green-900 h-4 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">{progress}%</span>
          </div>
        )}

        {/* Projects Layout */}
        {!loading && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-3 animate-pulse col-span-2">
                  <div className="w-full h-40 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-center">
                      🖼 Your project preview will appear here
                    </span>
                  </div>
                  <div className="mt-3">
                    <h2 className="font-semibold text-lg truncate">
                      Example Project
                    </h2>
                    <p className="text-gray-400 text-sm">No edits yet</p>
                  </div>
                </div>
              )}

              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition p-3 transform hover:-translate-y-1 hover:scale-105"
                >
                  <div
                    className="w-full h-40 bg-gray-500 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() => navigate(`/studio/editor/${project._id}`)}
                  >
                    <img
                      src={project.imageURL || "/default-thumbnail.png"}
                      alt={project.projectName}
                      className="object-cover w-full h-full transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-3  flex flex-col space-y-1">
                    {renamingProjectId === project._id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={renamingName}
                          onChange={(e) => setRenamingName(e.target.value)}
                          className="px-2 py-1 flex-1 rounded-lg text-black"
                          placeholder="Rename project"
                        />
                        <button
                          onClick={handleRenameProject}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500"
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={() => setRenamingProjectId(null)}
                          className="flex text-white items-center gap-1 px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-semibold text-lg truncate">
                          {project.projectName}
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Last edited:{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => {
                              setRenamingProjectId(project._id);
                              setRenamingName(project.projectName);
                            }}
                            className="flex items-center rounded-2xl gap-1 px-1 sm:px-3 py-1 bg-yellow-600 sm:text-2xl text-[10px]  hover:bg-yellow-500"
                          >
                            <FaEdit /> Rename
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="flex text-white items-center rounded-2xl gap-1 px-1 sm:px-3 py-1  bg-red-600 sm:text-2xl text-[10px]  hover:bg-red-500"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioHome;
