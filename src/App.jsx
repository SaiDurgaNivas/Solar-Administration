import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { TicketProvider } from "./context/TicketContext";

function App() {

  // 🔐 USER STATE (from sessionStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("solar_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // 🔄 Sync with sessionStorage Safely
  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem("solar_user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("solar_user");
      }
    } catch (error) {
      console.warn("Session storage sync failed:", error);
    }
  }, [user]);

  // ✅ LOGIN
  const handleLogin = (userData) => {
    setUser(userData);
    try {
      // 🔥 ensure save immediately for rapid navigation
      sessionStorage.setItem("solar_user", JSON.stringify(userData));
    } catch (error) {
      console.warn("Could not save user session:", error);
    }
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem("solar_user"); // 🔥 important
    } catch (error) {
      console.warn("Could not remove user session:", error);
    }
  };

  return (
    <TicketProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
      </Router>
    </TicketProvider>
  );
}

export default App;
