import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";
import { SmileIcon } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, token, loadingUser } = useContext(AppContext);

  if (loadingUser) {
    // Show a loading spinner or nothing while checking auth
    return (
      <div className="bg-black text-2xl items-center justify-center font-bold   min-h-screen w-full text-white text-center flex">
        <div className="flex-row flex gap-1 text-center">
          <span className="animate-pulse">Loading..</span>
          <SmileIcon className="animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
