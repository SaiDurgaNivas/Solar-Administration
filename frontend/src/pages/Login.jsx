import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = () => {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // 🔥 Agent Login
    if (role === "agent") {
      if (email === "agent@gmail.com" && password === "123456") {
        alert("Agent Login Successful ✅");

        sessionStorage.setItem("role", "agent"); // 🔥 MUST ADD

        navigate("/agent-dashboard"); // 🔥 redirect
      } else {
        alert("Invalid Agent Credentials ❌");
      }
    }

    // 🔥 Admin Login
    else if (role === "admin") {
      sessionStorage.setItem("role", "admin"); // optional
      alert("Admin Login Clicked");
    }

    // 🔥 Customer Login
    else if (role === "customer") {
      sessionStorage.setItem("role", "customer"); // optional
      alert("Customer Login Clicked");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg w-80">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h2>

        <div className="flex justify-center gap-2 mb-4">
          {["admin", "customer", "agent"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded text-sm ${
                role === r
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={handleLogin}
          className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600 mb-3"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full py-2 border rounded hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
