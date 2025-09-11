import React, { useEffect, useState } from "react";
import StockDetailModal from "../components/StockDetailModal";
import {
  uploadStock,
  getMyStocks,
  deleteStock,
  updateStock,
} from "../services/stockService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_TYPES = ["image", "video", "audio", "icon", "png"];

const CATEGORY_MAP = {
  image: ["nature", "people", "technology", "travel", "animals"],
  video: ["shorts", "animation", "tutorials", "travel", "events"],
  audio: ["music", "podcast", "effects", "voiceover"],
  icon: ["ui", "social", "arrows", "business"],
  png: ["transparent", "stickers", "logos", "illustrations"],
};

export default function StockUpload() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    type: "image",
    category: "",
    subcategory: "",
    status: "free",
  });
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    fetchMy();
  }, []);

  const fetchMy = async () => {
    setLoading(true);
    try {
      const data = await getMyStocks(token);
      const arr = Array.isArray(data) ? data : data.stocks || [];
      setStocks(arr);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch uploads");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.category) {
      toast.error("Title, type and category required");
      return;
    }
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (form.type === "image" && !file.type.startsWith("image/"))
      return toast.error("Please select an image file");
    if (form.type === "video" && !file.type.startsWith("video/"))
      return toast.error("Please select a video file");
    if (form.type === "audio" && !file.type.startsWith("audio/"))
      return toast.error("Please select an audio file");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("tags", form.tags);
    fd.append("type", form.type);
    fd.append("category", form.category);
    fd.append("subcategory", form.subcategory);
    if (isAdmin) fd.append("status", form.status);
    fd.append("file", file);

    try {
      setLoading(true);
      await uploadStock(fd, token);
      setForm({
        title: "",
        description: "",
        tags: "",
        type: "image",
        category: "",
        subcategory: "",
        status: "free",
      });
      setFile(null);
      await fetchMy();
      toast.success("Uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast.info("Deleting...");
    try {
      await deleteStock(id, token);
      await fetchMy();
      toast.success("Deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  const handleEditMetadata = async (s) => {
    const newTitle = prompt("Enter new title:", s.title);
    if (!newTitle || newTitle.trim() === "" || newTitle === s.title) {
      toast.info("No changes made");
      return;
    }
    try {
      await updateStock(s._id, { title: newTitle }, token);
      await fetchMy();
      toast.success("Title updated");
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  };

  const openDetail = (s) => setSelected(s);
  const closeDetail = () => setSelected(null);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Upload Stock</h1>
      <form
        onSubmit={handleUpload}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Upload Form */}
        <div className="md:col-span-2 space-y-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            rows="3"
          />
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Tags (comma separated)"
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border px-3 py-2 rounded"
            >
              {DEFAULT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border px-3 py-2 rounded flex-1"
            >
              <option value="">Select Category</option>
              {(CATEGORY_MAP[form.type] || []).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={form.subcategory}
              onChange={(e) =>
                setForm({ ...form, subcategory: e.target.value })
              }
              className="border px-3 py-2 rounded flex-1"
            >
              <option value="">Select Subcategory</option>
              {form.category === "nature" &&
                ["forest", "mountains", "ocean", "flowers"].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              {form.category === "people" &&
                ["portraits", "family", "friends", "business"].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
            {isAdmin && (
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border px-3 py-2 rounded"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            )}
          </div>

          <div>
            <input
              type="file"
              accept={
                form.type === "image"
                  ? "image/*"
                  : form.type === "video"
                  ? "video/*"
                  : form.type === "audio"
                  ? "audio/*"
                  : "*/*"
              }
              onChange={onFileChange}
            />
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* My Uploads Section */}
        <div className="md:col-span-1">
          <h3 className="font-semibold mb-2">Your uploads</h3>

          {loading ? (
            <div>Loading...</div>
          ) : stocks.length === 0 ? (
            <div className="text-gray-500">No uploads found</div>
          ) : (
            <div className="space-y-3">
              {stocks.map((s) => (
                <div key={s._id} className="border rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Show uploaded image if type=image, else placeholder */}
                      <img
                        src={
                          s.type === "image" && s.fileUrl
                            ? s.fileUrl
                            : "/logo.png"
                        }
                        className="w-12 h-12 rounded object-cover"
                        alt={s.title}
                      />
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-gray-500">
                          {s.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditMetadata(s)}
                        className="text-blue-500 text-xs"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openDetail(s)}
                        className="text-sm bg-slate-100 px-2 py-1 rounded"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      {selected && <StockDetailModal stock={selected} onClose={closeDetail} />}
    </div>
  );
}
