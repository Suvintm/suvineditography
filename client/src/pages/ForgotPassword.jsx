import React, { useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { backendUrl } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email,
      });
      if (res.data.success) {
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-indigo-500 to-black px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-black text-white font-semibold rounded-xl"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
