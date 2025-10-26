import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
 // npm install jwt-decode
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now();

      // Check token expiry
      if (decoded.exp * 1000 < currentTime) {
        localStorage.removeItem("adminToken");
        toast.warn("Session expired. Please login again.");
        setIsAuthenticated(false);
        return;
      }

      // Check if isAdmin flag exists
      if (!decoded.isAdmin) {
        localStorage.removeItem("adminToken");
        toast.error("Access denied. Not an admin.");
        setIsAuthenticated(false);
        return;
      }

      // Auto logout when token expires
      const remainingTime = decoded.exp * 1000 - currentTime;
      const timeout = setTimeout(() => {
        localStorage.removeItem("adminToken");
        toast.info("Session expired. Please log in again.");
        window.location.href = "/admin-login";
      }, remainingTime);

      setIsAuthenticated(true);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("adminToken");
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">
          Verifying admin access...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
