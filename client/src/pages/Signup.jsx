import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import logo from "../assets/logo.png";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, setToken, backendUrl } = useContext(AppContext);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/user/register`, form);
      const data = res.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);

        toast.success("Account created successfully!");
        setTimeout(() => navigate("/"), 1200);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#2066cf] to-[#e3f0ff] font-roboto">
        <div className="signup-box bg-white bg-opacity-70 rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
          <img src={logo} alt="Logo" className="w-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-6">Create Account</h2>
          <form onSubmit={onSignup} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
              className="w-full px-4 py-2 rounded-xl border bg-[#f7f7f7] outline-none"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded-xl border bg-[#f7f7f7] outline-none"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Password"
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
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-700">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
