import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

const AdminPackUpload = () => {
  const [packs, setPacks] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    credits: "",
    price: "",
    description: "",
    bgColor: "",
  });
  const [loading, setLoading] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Fetch all packs
  const fetchPacks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/packs`);
      setPacks(res.data);
    } catch (err) {
      toast.error("Failed to fetch packs");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  // Handle form input change
  const handleChange = (e, isUpdate = false) => {
    const { name, value } = e.target;
    if (isUpdate) {
      setUpdateData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create new pack
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.credits || !formData.price) {
      toast.error("Name, Credits, and Price are required");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/admin/packs/create`,
        formData
      );
      toast.success(res.data.message);
      setFormData({
        name: "",
        credits: "",
        price: "",
        description: "",
        bgColor: "",
      });
      fetchPacks();
      setActiveTab("all");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating pack");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete pack
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pack?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/packs/${id}`);
      toast.success("Pack deleted successfully");
      fetchPacks();
    } catch (err) {
      toast.error("Failed to delete pack");
      console.error(err);
    }
  };

  // Open update modal
  const openUpdateModal = (pack) => {
    setUpdateData({ ...pack });
  };

  // Close update modal
  const closeUpdateModal = () => {
    setUpdateData(null);
  };

  // Handle update pack
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updateData.name || !updateData.credits || !updateData.price) {
      toast.error("Name, Credits, and Price are required");
      return;
    }
    try {
      setUpdateLoading(true);
      const res = await axios.put(
        `${API_URL}/api/admin/packs/${updateData._id}`,
        updateData
      );
      toast.success(res.data.message);
      fetchPacks();
      closeUpdateModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating pack");
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Credit Packs
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Packs
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition ${
            activeTab === "create"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create New Pack
        </button>
      </div>

      {/* All Packs Section */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-10">
          {packs.length > 0 ? (
            packs.map((pack) => (
              <div
                key={pack._id}
                className={`relative rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition duration-300 ${pack.bgColor}`}
              >
                <span className="absolute top-3 right-3 bg-black/30 px-2 py-1 rounded-full text-xs">
                  {pack.name}
                </span>
                <h2 className="text-2xl font-bold">{pack.name}</h2>
                <p className="mt-2 text-lg">{pack.description}</p>
                <p className="mt-4 text-4xl font-extrabold">
                  {pack.credits} Credits
                </p>
                <p className="mt-1 text-xl font-semibold">₹{pack.price}</p>

                <div className="flex justify-end mt-5 gap-2">
                  <button
                    onClick={() => openUpdateModal(pack)}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition"
                  >
                    <PencilIcon className="w-4 h-4" /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(pack._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                  >
                    <TrashIcon className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No packs available. Create a new one!
            </p>
          )}
        </div>
      )}

      {/* Create New Pack Form */}
      {activeTab === "create" && (
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Pack Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Credits *</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Background Color (Tailwind class)
            </label>
            <input
              type="text"
              name="bgColor"
              value={formData.bgColor}
              onChange={handleChange}
              placeholder="e.g., bg-gradient-to-r from-green-400 to-blue-600"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className={`mt-2 h-12 rounded-lg border ${
                formData.bgColor || "bg-gray-200"
              }`}
            ></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <PlusCircleIcon className="w-5 h-5" />
            {loading ? "Creating..." : "Create Pack"}
          </button>
        </form>
      )}

      {/* Update Pack Modal */}
      {updateData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            <button
              onClick={closeUpdateModal}
              className="absolute top-3 right-3 text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Update Pack</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Pack Name *</label>
                <input
                  type="text"
                  name="name"
                  value={updateData.name}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Credits *</label>
                <input
                  type="number"
                  name="credits"
                  value={updateData.credits}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={updateData.price}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={updateData.description}
                  onChange={(e) => handleChange(e, true)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Background Color (Tailwind class)
                </label>
                <input
                  type="text"
                  name="bgColor"
                  value={updateData.bgColor}
                  onChange={(e) => handleChange(e, true)}
                  placeholder="e.g., bg-gradient-to-r from-green-400 to-blue-600"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className={`mt-2 h-12 rounded-lg border ${
                    updateData.bgColor || "bg-gray-200"
                  }`}
                ></div>
              </div>

              <button
                type="submit"
                disabled={updateLoading}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                {updateLoading ? "Updating..." : "Update Pack"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackUpload;
