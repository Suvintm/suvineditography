// src/pages/StudioHome.jsx
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { StudioContext } from "../context/StudioContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

const StudioHome = () => {
  const { backendUrl, token } = useContext(AppContext);
  const { projects, setProjects, setSelectedProject } =
    useContext(StudioContext);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();

  // fetch projects
  const fetchProjects = async () => {
    if (!token) return;
    try {
      setPageLoading(true);
      setProgress(0);
      const startTime = Date.now();
      const minDuration = 2000;

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 2 : prev));
      }, 100);

      const res = await axios.get(`${backendUrl}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setProjects(res.data.projects);
      }

      const elapsed = Date.now() - startTime;
      const remaining = minDuration - elapsed;

      setTimeout(
        () => {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => setPageLoading(false), 300);
        },
        remaining > 0 ? remaining : 0
      );
    } catch (err) {
      console.error("Fetch projects error:", err.response?.data || err.message);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  // create project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Project name is required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/projects`,
        { projectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newProject = res.data.project;
        setProjects([newProject, ...projects]);
        setProjectName("");
        setShowModal(false);

        setSelectedProject(newProject);
        toast.success("Project created successfully 🎉");
        navigate(`/studio/editor/${newProject._id}`);
      } else {
        toast.error(res.data.message || "Failed to create project");
      }
    } catch (err) {
      console.error("Create project error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  // rename project
  const handleRenameProject = async (id) => {
    if (!newName.trim()) {
      toast.error("New name cannot be empty");
      return;
    }
    try {
      const res = await axios.put(
        `${backendUrl}/api/projects/${id}`,
        { projectName: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setProjects(
          projects.map((p) =>
            p._id === id ? { ...p, projectName: newName } : p
          )
        );
        setRenamingId(null);
        setNewName("");
        toast.success("Project renamed ✅");
      }
    } catch (err) {
      console.error("Rename project error:", err.response?.data || err.message);
      toast.error("Failed to rename project");
    }
  };

  // delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const res = await axios.delete(`${backendUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
        toast.success("Project deleted 🗑️");
      }
    } catch (err) {
      console.error("Delete project error:", err.response?.data || err.message);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-black shadow-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-white text-xl font-bold tracking-wide">
            SuvinEditography
          </span>
        </div>
      </nav>

      {/* Header */}
      <header className="text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Bring your <span className="text-indigo-600">Creativity</span> here
        </h2>
        <p className="text-gray-500 mt-2">
          Start creating amazing edits in minutes 🚀
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-6 py-2 rounded-full text-white font-semibold 
          bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
          animate-gradient-x transition-all duration-300 
          hover:scale-105 shadow-lg"
        >
          ➕ New Project
        </button>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-10">
        {pageLoading ? (
          // Loader
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-indigo-500"></div>
              <img
                src={logo}
                alt="Loading Logo"
                className="w-12 h-12 rounded-full absolute inset-0 m-auto"
              />
            </div>
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium animate-pulse">
              Loading projects... {progress}%
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-500 bg-white shadow-sm">
            No projects yet. Click{" "}
            <span className="font-semibold text-indigo-600">New Project</span>{" "}
            to get started!
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Your Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={p.imageURL || "https://via.placeholder.com/300x200"}
                    alt={p.projectName}
                    className="w-full h-40 object-cover rounded-lg"
                    onClick={() => {
                      setSelectedProject(p);
                      navigate(`/studio/editor/${p._id}`);
                    }}
                  />
                  {renamingId === p._id ? (
                    <div className="flex items-center mt-3 gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => handleRenameProject(p._id)}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="px-2 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <h3
                      className="mt-3 font-semibold text-gray-800 cursor-pointer"
                      onClick={() => {
                        setSelectedProject(p);
                        navigate(`/studio/editor/${p._id}`);
                      }}
                    >
                      {p.projectName}
                    </h3>
                  )}
                  <div className="flex justify-between mt-3 text-sm">
                    <button
                      onClick={() => {
                        setRenamingId(p._id);
                        setNewName(p.projectName);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleCreateProject}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Create New Project
            </h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudioHome;
