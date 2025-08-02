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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#2066cf] to-[#e3f0ff] font-roboto">
        <div className="login-box bg-white bg-opacity-70 rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
          <img src={logo} alt="Logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-6">Login</h2>
          <form onSubmit={onLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border bg-[#f7f7f7] outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border bg-[#f7f7f7] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-semibold rounded-2xl ${
                loading ? "bg-gray-600" : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-700">
            New user?{" "}
            <span
              className="text-blue-600 cursor-pointer"
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
