import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, token, loadingUser } = useContext(AppContext);

  if (loadingUser) {
    // Show a loading spinner or nothing while checking auth
    return <div className="bg-black text-2xl items-center justify-center font-bold animate-pulse min-h-screen w-full text-white text-center flex">Loading...</div>;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
