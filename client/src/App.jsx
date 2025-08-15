import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import BgRemover from "./pages/BgRemover.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BgOwnModel from "./pages/BgOwnModel.jsx";
import StudHome from "./pages/Studhome.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/background-remover" element={<BgRemover />} />
        <Route path="/svn-bg-remover" element={<BgOwnModel />} />
        <Route path="/studio" element={<StudHome />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default App;
