import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        "http://localhost:4000/api/admin/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      localStorage.removeItem("adminToken");
      toast.success("Logged out successfully");
      navigate("/admin-login");
    }
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
