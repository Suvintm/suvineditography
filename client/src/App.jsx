import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import BgRemover from "./pages/BgRemover.jsx";
import BgOwnModel from "./pages/BgOwnModel.jsx";
import StudioHome from "./pages/StudioHome.jsx";
import StudioEditor from "./pages/StudioEditor.jsx";
import StockUpload from "./pages/StockUpload.jsx";
import StockMainPage from "./pages/StockMainPage.jsx";
import UnsplashStock from "./pages/UnsplashStock.jsx";
import PixabayStock from "./pages/PixabayStock.jsx";
import StockPage from "./pages/StockPage.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pages/toast.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/background-remover" element={<BgRemover />} />
        <Route path="/svn-bg-remover" element={<BgOwnModel />} />

        {/* 🔒 Protected Studio Routes */}
        <Route
          path="/studio"
          element={
            <ProtectedRoute>
              <StudioHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studio/editor"
          element={
            <ProtectedRoute>
              <StudioEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studio/editor/:id"
          element={
            <ProtectedRoute>
              <StudioEditor />
            </ProtectedRoute>
          }
        />

        {/* Stock Routes (public browsing allowed) */}
        <Route path="/stocks" element={<StockMainPage />}>
          <Route path="suvineditography" element={<StockPage />} />
          <Route path="unsplash" element={<UnsplashStock />} />
          <Route path="pixabay" element={<PixabayStock />} />
        </Route>

        {/* 🔒 Protected Upload Page */}
        <Route
          path="/stocks/upload"
          element={
            <ProtectedRoute>
              <StockUpload />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
 
export default App;
