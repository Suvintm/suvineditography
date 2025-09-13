import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminHome from "./pages/AdminHome";
import UploadStocks from "./pages/UploadStocks";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import the CSS

export default function App() {
  return (
    < >
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadStocks />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
