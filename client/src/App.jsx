import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import BgRemover from "./pages/BgRemover.jsx";
import BgOwnModel from "./pages/BgOwnModel.jsx";
import StudioHome from "./pages/StudioHome.jsx";
import StudioEditor from "./pages/StudioEditor.jsx"; // <-- you forgot this import earlier
import StockUpload from "./pages/StockUpload.jsx"; // <-- new
import StockPage from "./pages/StockPage.jsx"; // <-- new

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pages/toast.css";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/background-remover" element={<BgRemover />} />
        <Route path="/svn-bg-remover" element={<BgOwnModel />} />
        {/* Studio Routes */}
        <Route path="/studio" element={<StudioHome />} />
        <Route path="/studio/editor" element={<StudioEditor />} />
        <Route path="/studio/editor/:id" element={<StudioEditor />} />
        {/* Stock Routes */}
        <Route path="/stocks" element={<StockPage />} /> {/* public browsing */}
        <Route path="/stocks/upload" element={<StockUpload />} />{" "}
        {/* logged-in users */}
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default App;
