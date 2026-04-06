import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { TicketProvider } from "./context/TicketContext";

function App() {

  // 🔐 USER STATE (from sessionStorage)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("solar_user"));
    } catch {
      return null;
    }
  });

  // 🔄 Sync with sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("solar_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("solar_user");
    }
  }, [user]);

  // ✅ LOGIN
  const handleLogin = (userData) => {
    setUser(userData);
    // 🔥 ensure save immediately
    sessionStorage.setItem("solar_user", JSON.stringify(userData));
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("solar_user"); // 🔥 important
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
