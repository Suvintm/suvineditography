// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in, show the page
  return children;
}
