import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import logo from "../assets/logo.png";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, setToken, backendUrl } = useContext(AppContext);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, form);
      const data = res.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);

        toast.success("Logged in successfully!");
        setTimeout(() => navigate("/"), 1200);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-indigo-500 to-black px-4">
        <div
          className="login-box bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl 
          p-6 sm:p-10 max-w-md w-full text-center 
          transform scale-95 sm:scale-100"
        >
          {" "}
          {/* 👈 smaller on mobile */}
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-16 sm:w-20 mx-auto mb-6 animate-fadeIn"
          />
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Welcome Back
          </h2>
          {/* Form */}
          <form onSubmit={onLogin} className="space-y-3 sm:space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                border border-gray-300 
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 
                bg-gray-50 outline-none transition-all text-sm sm:text-base"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                border border-gray-300 
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 
                bg-gray-50 outline-none transition-all text-sm sm:text-base"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 text-sm sm:text-base ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-black hover:opacity-90"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {/* Footer */}
          <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-gray-700">
            New user?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
