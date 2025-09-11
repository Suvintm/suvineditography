import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { StudioContext } from "../context/StudioContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import defaultThumbnail from "../assets/logo.png"; 
import { ArrowDownCircleIcon, Edit, Trash2Icon } from "lucide-react";
import { RiTimeFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";

const StudioHome = () => {
  const { backendUrl, token } = useContext(AppContext);
  const { projects, setProjects, setSelectedProject } = useContext(StudioContext);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // rename + delete modals
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [deletingId, setDeletingId] = useState(null);

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

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setPageLoading(false), 300);
      }, remaining > 0 ? remaining : 0);
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
        setProjects(projects.map((p) => (p._id === id ? { ...p, projectName: newName } : p)));
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
    try {
      const res = await axios.delete(`${backendUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setProjects(projects.filter((p) => p._id !== id));
        setDeletingId(null);
        toast.success("Project deleted 🗑️");
      }
    } catch (err) {
      console.error("Delete project error:", err.response?.data || err.message);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-black shadow-md rounded-b-3xl">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="text-white text-xl font-bold tracking-wide">
            SuvinEditography
          </span>
        </Link>
      </nav>

      {/* Header */}
      <header className="flex flex-col text-center justify-center-safe items-center py-10">
        <h2 className="text-3xl font-bold text-gray-800 p-4">
          Bring your <span className="text-indigo-600">Creativity</span> here
        </h2>
        <p className="text-gray-500 mt-2 flex items-center justify-center-safe gap-2">
          Start creating amazing edits in minutes{" "}
          <RiTimeFill className="text-green-400 w-8 h-6" />
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-6 py-2 rounded-full text-white font-semibold 
          bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
          animate-gradient-x transition-all duration-300 
          hover:scale-105 shadow-lg flex justify-center-safe items-center gap-2"
        >
          <IoMdAdd /> New Project
        </button>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-10">
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin border-black"></div>
              <img src={logo} alt="Loading Logo" className="w-12 h-12 rounded-full absolute inset-0 m-auto" />
            </div>
            <div className="w-64 h-4 bg-black rounded-full overflow-hidden border-2">
              <div
                className="h-full bg-gradient-to-l from-green-600 via-green-400 to-white border-1 rounded-3xl transition-all duration-100"
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
            <h3 className="text-lg font-bold text-gray-700 sm:text-[25px] gap-2 flex flex-row mb-4">
              Your Projects <ArrowDownCircleIcon />
            </h3>
            <div className="grid grid-cols-2 bg-green-200 p-4 rounded-3xl sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
              {projects.map((p) => (
                <div
                  key={p._id}
                  className="bg-white max-h-100 sm:min-h-80 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <img
                    src={p.imageURL || defaultThumbnail}
                    alt={p.projectName}
                    className="w-full h-30 sm:h-40 object-cover rounded-lg border-2 border-zinc-300 cursor-pointer"
                    onClick={() => {
                      setSelectedProject(p);
                      navigate(`/studio/editor/${p._id}`);
                    }}
                  />
                  <h3
                    className="mt-3 font-semibold text-gray-800 cursor-pointer"
                    onClick={() => {
                      setSelectedProject(p);
                      navigate(`/studio/editor/${p._id}`);
                    }}
                  >
                    {p.projectName}
                  </h3>
                  <div className="flex justify-between mt-3 text-sm">
                    <button
                      onClick={() => {
                        setRenamingId(p._id);
                        setNewName(p.projectName);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Edit size={16} /> Rename
                    </button>
                    <button
                      onClick={() => setDeletingId(p._id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2Icon size={16} /> Delete
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleCreateProject}
            className="bg-white p-6 m-6 rounded-xl shadow-lg w-96"
          >
            <h2 className="text-xl font-bold px-1 mx-8 bg-green-300 rounded-3xl py-4 mb-10 text-white text-center">
              Create New Project
            </h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border rounded-3xl border-zinc-600 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-3xl bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-3xl bg-indigo-600 text-white hover:bg-green-700"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rename Modal */}
      {renamingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Rename Project</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRenamingId(null)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRenameProject(renamingId)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-red-600">Delete Project</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deletingId)}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioHome;
