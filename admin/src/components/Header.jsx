import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn("Logout request failed:", err.message);
    } finally {
      localStorage.removeItem("adminToken");
      toast.info("You have been logged out.");
      navigate("/admin-login");
    }
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Logout
      </button>
    </header>
  );
}
