import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, token, loadingUser } = useContext(AppContext);

  if (loadingUser) {
    // Show a loading spinner or nothing while checking auth
    return <div>Loading...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
