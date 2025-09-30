import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, token } = useContext(AppContext);

  // If not logged in, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the children (the protected page)
  return children;
}
