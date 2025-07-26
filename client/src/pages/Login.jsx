import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1100);
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 480px) {
            .login-box {
              margin: 22px;
              max-width: 100% !important;
              padding: 22px 12px !important;
            }
          }
        `}
      </style>
      <div
        className="bg-gradient-to-b from-[#2066cf] to-[#e3f0ff]"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontFamily: "'Roboto', Arial, sans-serif",
        }}
      >
        <div
          className="login-box"
          style={{
            background: "rgba(255,255,255,0.7)",
            borderRadius: "32px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
            padding: "38px 26px",
            width: "100%",
            maxWidth: "370px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: 80, marginBottom: 4 }} />
          <h2
            style={{
              fontWeight: 700,
              fontSize: "2rem",
              margin: "0 0 30px 0",
              color: "#181818",
              textAlign: "center",
            }}
          >
            Login
          </h2>
          <form style={{ width: "100%" }} onSubmit={onLogin}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  outline: "none",
                  background: "#f7f7f7",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={user.password}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  border: "1px solid #e0e0e0",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  outline: "none",
                  background: "#f7f7f7",
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px 0",
                borderRadius: "24px",
                background: "#181818",
                color: "#fff",
                fontWeight: 500,
                fontSize: "1.1rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                marginBottom: 16,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <p className="text-green-500">Logging in...</p>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div
            style={{
              fontSize: "0.95rem",
              color: "#606060",
              textAlign: "center",
            }}
          >
            <span>
              New user?{" "}
              <span
                style={{ color: "#1a73e8", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
