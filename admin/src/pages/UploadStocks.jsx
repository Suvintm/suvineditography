import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminStockCard from "../components/AdminStockCard";

const TYPES = ["image", "video", "audio", "music", "png", "icon"];
const CATEGORIES = [
  "Nature",
  "People",
  "Animals",
  "Business",
  "Technology",
  "Art",
  "Sports",
  "Food",
  "Travel",
  "Abstract",
  "Architecture",
  "Fashion",
  "Lifestyle",
  "Music",
];

export default function UploadStocks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState("free");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // Filters
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchStocks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/stocks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStocks(res.data.stocks);
    } catch (err) {
      console.error("Fetch stocks error:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // ✅ Safe Search + Filter logic
  const filteredStocks = stocks.filter((stock) => {
    const matchType = filterType === "all" || stock.type === filterType;
    const matchCategory =
      filterCategory === "all" || stock.category === filterCategory;

    const searchLower = search.toLowerCase();

    const matchSearch =
      (stock.title || "").toLowerCase().includes(searchLower) ||
      (stock.description || "").toLowerCase().includes(searchLower) ||
      (Array.isArray(stock.tags)
        ? stock.tags.some((t) => (t || "").toLowerCase().includes(searchLower))
        : false);

    return matchType && matchCategory && (search === "" || matchSearch);
  });

  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("file", file);
    formData.append("tags", tags.join(","));

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/stocks/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Upload successful!");
      setTitle("");
      setDescription("");
      setFile(null);
      setType(TYPES[0]);
      setCategory(CATEGORIES[0]);
      setStatus("free");
      setTags([]);
      fetchStocks();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (stockId) => {
    if (!window.confirm("Are you sure you want to delete this stock?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/stocks/${stockId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Stock deleted successfully!");
      fetchStocks(); // refresh list
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete stock");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Stock Upload</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-md mb-6 space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Type, Category, Status */}
        <div className="flex gap-4">
          <div>
            <label className="block font-semibold">Type</label>
            <select
              className="border p-2 rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Category</label>
            <select
              className="border p-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Status</label>
            <select
              className="border p-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-semibold">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border p-2 rounded flex-1"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1 bg-green-600 text-white rounded-md"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500 text-white px-2 py-1 rounded-full cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
                title="Click to remove"
              >
                {tag} &times;
              </span>
            ))}
          </div>
        </div>

        {/* File */}
        <div>
          <label className="block font-semibold">Stock File</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Stock"}
        </button>
      </form>

      {/* Navbar Filters */}
      <div className="bg-gray-100 p-4 rounded-md shadow mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label className="font-semibold mr-2">Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold mr-2">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, or tags..."
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* Uploaded Stocks */}
      <h2 className="text-xl font-bold mb-4">Uploaded Stocks</h2>
      <div className="grid grid-cols-2 gap-4">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <AdminStockCard
              key={stock._id}
              stock={stock}
              onDelete={handleDeleteStock}
            />
          ))
        ) : (
          <p className="text-gray-600">No stocks found.</p>
        )}
      </div>
    </div>
  );
}
