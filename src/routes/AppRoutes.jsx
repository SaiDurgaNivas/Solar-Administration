import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🌐 Public Pages
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdvantageDetails from "../pages/AdvantageDetails";

// 👤 Customer Pages
import CustomerDashboard from "../pages/Customer/CustomerDashboard";
import Profile from "../pages/Customer/Profile";
import CustomerBookings from "../pages/Customer/CustomerBookings";
import Bills from "../pages/Customer/Bills";
import Usage from "../pages/Customer/Usage";
import Support from "../pages/Customer/Support";
import Maintenance from "../pages/Customer/Maintenance";
import HardwareCatalog from "../pages/Customer/HardwareCatalog";
import About from "../pages/About";
import Features from "../pages/Features";
import Payment from "../pages/Customer/Payment";

// 🛠 Admin Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Customer from "../pages/dashboard/Customer";
import SolarPanels from "../pages/dashboard/SolarPanels";
import Installations from "../pages/dashboard/Installations";
import Billing from "../pages/dashboard/Billing";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Complaints from "../pages/dashboard/Complaints";
import Settings from "../pages/Settings";
import AddCustomer from "../pages/dashboard/AddCustomer";
import AdminBookings from "../pages/dashboard/AdminBookings";
import Workers from "../pages/dashboard/Workers";
import AttendanceReport from "../pages/dashboard/AttendanceReport";
import WorkingStatus from "../pages/dashboard/WorkingStatus";

import NotFound from "../pages/NotFound";

// 🛠 Agent Pages
import AgentDashboard from "../agent/AgentDashboard";
import AgentCustomers from "../agent/AgentCustomers";
import AgentInstallations from "../agent/AgentInstallations";
import AgentTickets from "../agent/AgentTickets";

// 👷 Worker Pages
import WorkerDashboard from "../worker/WorkerDashboard";

// Layouts
import Header from "../components/Layout/Header";
import CustomerHeader from "../components/Layout/CustomerHeader";
import AgentHeader from "../components/Layout/AgentHeader";
import WorkerHeader from "../components/Layout/WorkerHeader";
import Sidebar from "../components/Layout/Sidebar";
import CustomerSidebar from "../components/Layout/CustomerSidebar";
import AgentSidebar from "../components/Layout/AgentSidebar";
import WorkerSidebar from "../components/Layout/WorkerSidebar";
import Footer from "../components/Layout/Footer";


// 🔒 Protected Layout
const ProtectedLayout = ({ children, user, onLogout, role }) => {

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Ensure role is case insensitive to prevent accidental redirects on refresh
  const userRole = user.role ? user.role.toLowerCase().trim() : "customer";
  const requiredRole = role ? role.toLowerCase() : null;

  // Redirect if user tries to access a dashboard they don't have the role for
  if (requiredRole && userRole !== requiredRole) {
    if (userRole === "admin") return <Navigate to="/dashboard" />;
    if (userRole === "agent") return <Navigate to="/agent-dashboard" />;
    if (userRole === "sub_worker") return <Navigate to="/worker-dashboard" />;
    return <Navigate to="/customer-dashboard" />;
  }

  return (
    <div className="flex bg-[#020617] text-white">

      {role === "admin" && <Sidebar user={user} onLogout={onLogout} />}
      {role === "customer" && <CustomerSidebar user={user} onLogout={onLogout} />}
      {role === "agent" && <AgentSidebar user={user} onLogout={onLogout} />}
      {role === "sub_worker" && <WorkerSidebar user={user} onLogout={onLogout} />}

      <div className={`${(role === "admin" || role === "customer" || role === "agent" || role === "sub_worker") ? "ml-64" : ""} w-full min-h-screen flex flex-col`}>

        {role === "admin" && <Header user={user} onLogout={onLogout} />}
        {role === "customer" && <CustomerHeader user={user} onLogout={onLogout} />}
        {role === "agent" && <AgentHeader user={user} onLogout={onLogout} />}
        {role === "sub_worker" && <WorkerHeader user={user} onLogout={onLogout} />}

        <main className="flex-grow p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};


function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>

      {/* 🌐 Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} /> 
      <Route path="/features" element={<Features />} />
      <Route path="/advantage/:slug" element={<AdvantageDetails />} />

      {/* 👤 CUSTOMER */}
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <CustomerDashboard />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/profile"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <Profile />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/bookings"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <CustomerBookings />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/bills"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <Bills />
          </ProtectedLayout>
        }
      />

      <Route
        path="/payment/:id"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <Payment />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/usage"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <Usage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/support"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <Support />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/maintenance"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <Maintenance />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/hardware"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <HardwareCatalog />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer-dashboard/about"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="customer">
            <About />
          </ProtectedLayout>
        }
      />

      {/* 🛠 ADMIN */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Dashboard />
          </ProtectedLayout>
        }
      />

      <Route
        path="/customer"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Customer />
          </ProtectedLayout>
        }
      />

      <Route
        path="/workers"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Workers />
          </ProtectedLayout>
        }
      />

      <Route
        path="/attendance-report"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <AttendanceReport />
          </ProtectedLayout>
        }
      />

      <Route
        path="/working-status"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <WorkingStatus />
          </ProtectedLayout>
        }
      />

      <Route
        path="/add-customer"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <AddCustomer />
          </ProtectedLayout>
        }
      />

      <Route
        path="/bookings"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <AdminBookings />
          </ProtectedLayout>
        }
      />

      <Route
        path="/solarpanels"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <SolarPanels />
          </ProtectedLayout>
        }
      />

      <Route
        path="/installations"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Installations />
          </ProtectedLayout>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Billing />
          </ProtectedLayout>
        }
      />

      <Route
        path="/complaints"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Complaints />
          </ProtectedLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Reports />
          </ProtectedLayout>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Notifications />
          </ProtectedLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedLayout user={user} onLogout={onLogout} role="admin">
            <Settings />
          </ProtectedLayout>
        }
      />
      
      {/* 🛠 AGENT */}
      <Route path="/agent-dashboard" element={<ProtectedLayout user={user} onLogout={onLogout} role="agent"><AgentDashboard /></ProtectedLayout>} />
      <Route path="/agent-dashboard/customers" element={<ProtectedLayout user={user} onLogout={onLogout} role="agent"><AgentCustomers /></ProtectedLayout>} />
      <Route path="/agent-dashboard/installations" element={<ProtectedLayout user={user} onLogout={onLogout} role="agent"><AgentInstallations /></ProtectedLayout>} />
      <Route path="/agent-dashboard/tickets" element={<ProtectedLayout user={user} onLogout={onLogout} role="agent"><AgentTickets /></ProtectedLayout>} />

      {/* 👷 WORKER */}
      <Route path="/worker-dashboard" element={<ProtectedLayout user={user} onLogout={onLogout} role="sub_worker"><WorkerDashboard /></ProtectedLayout>} />

      {/* ❌ 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;
