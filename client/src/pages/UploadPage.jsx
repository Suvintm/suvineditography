import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "image",
    category: "nature",
    subcategory: "landscape",
    tags: "",
    status: "free",
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadedStocks, setUploadedStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // stock to delete

  const categories = {
    image: {
      category: ["nature", "people", "technology", "art", "other"],
      subcategory: ["landscape", "portrait", "macro", "wildlife"],
    },
    video: {
      category: ["travel", "lifestyle", "business", "education"],
      subcategory: ["shorts", "tutorials", "ads", "documentary"],
    },
    music: {
      category: ["lofi", "rock", "classical", "jazz"],
      subcategory: ["instrumental", "vocals", "beats"],
    },
    background: {
      category: ["abstract", "solid", "pattern"],
      subcategory: ["light", "dark", "gradient"],
    },
    font: {
      category: ["serif", "sans-serif", "display"],
      subcategory: ["bold", "italic", "regular"],
    },
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsAdmin(storedUser.isAdmin === true || storedUser.isAdmin === "true");
      fetchUploads(storedUser);
    }
  }, []);

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isAdmin) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/stocks/search`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data.success) setUploadedStocks(res.data.data);
      } else {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/stocks/my`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data.success) setUploadedStocks(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch uploads");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.warning("Please select a file");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const uploadData = new FormData();
      uploadData.append("file", formData.file);
      uploadData.append("name", formData.name);
      uploadData.append("description", formData.description);
      uploadData.append("type", formData.type);
      uploadData.append("category", formData.category);
      uploadData.append("subcategory", formData.subcategory);
      uploadData.append("tags", formData.tags);

      if (isAdmin) {
        uploadData.append("status", formData.status);
        uploadData.append("adminUpload", "true");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/stocks/upload`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Upload successful!");
        fetchUploads(user);
        setFormData({
          name: "",
          description: "",
          type: "image",
          category: "nature",
          subcategory: "landscape",
          tags: "",
          status: "free",
          file: null,
        });
        setPreview(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteStock = (stock) => {
    setConfirmDelete(stock);
  };

  const deleteStock = async () => {
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/stocks/${confirmDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Deleted successfully");
        setConfirmDelete(null);
        fetchUploads(user);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (stockId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/stocks/${stockId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Status updated");
        fetchUploads(user);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" className="h-8 w-8" />
          <span className="font-bold text-xl">SuvinEditography</span>
        </div>
      </nav>

      {/* Upload Form */}
      {/* ... keep your existing form code ... */}

      {/* Uploaded Stocks Layout */}
      <div className="max-w-6xl mx-auto p-6">
        <h3 className="text-xl font-semibold mb-4">
          {isAdmin ? "All Uploads" : "Your Uploads"}
        </h3>
        {uploadedStocks.length === 0 ? (
          <p className="text-gray-500">
            {isAdmin
              ? "No uploads yet."
              : "Your uploads appear here after you upload."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedStocks.map((stock) => (
              <div
                key={stock._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col"
              >
                {stock.type === "image" ? (
                  <img
                    src={stock.url}
                    alt={stock.name}
                    className="h-48 w-full object-cover rounded"
                  />
                ) : stock.type === "video" ? (
                  <video
                    src={stock.url}
                    controls
                    className="h-48 w-full object-cover rounded"
                  />
                ) : stock.type === "music" ? (
                  <audio controls src={stock.url} className="w-full" />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-200 rounded">
                    <span>{stock.type}</span>
                  </div>
                )}

                <div className="mt-3 space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    {stock.adminUpload
                      ? "SuvinEditography"
                      : stock.uploadedByName}
                    {stock.adminUpload && (
                      <span className="text-blue-600 text-sm">✔</span>
                    )}
                  </p>
                  <p className="text-lg">{stock.name}</p>
                  <p className="text-sm text-gray-600">{stock.description}</p>
                  <p className="text-sm">
                    <span className="font-medium">Category:</span>{" "}
                    {stock.category} → {stock.subcategory}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Tags:</span> {stock.tags}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        stock.status === "premium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {stock.status}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => toggleStatus(stock._id)}
                        className="ml-2 text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Toggle
                      </button>
                    )}
                  </p>

                  {/* Delete Button */}
                  <button
                    onClick={() => confirmDeleteStock(stock)}
                    className="mt-2 text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm Popover */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-sm mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium">{confirmDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteStock}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
