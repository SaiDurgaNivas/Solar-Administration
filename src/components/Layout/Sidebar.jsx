import React from 'react';
import { NavLink } from 'react-router-dom';
import UserProfilePhoto from '../UserProfilePhoto';

function Sidebar({ user, onLogout }) {

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-orange-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0 flex flex-col shadow-xl">

      {/* 🔹 Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-3xl">☀️</span>
          <h1 className="text-xl font-bold text-white">
            Solar<span className="text-orange-500">Administration</span>
          </h1>
        </div>
      </div>

      {/* 🔹 Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

        {/* 🔥 IMPORTANT: add `end` for exact match */}
        <NavLink to="/dashboard" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/customer" className={linkClass}>
          Customer
        </NavLink>

        <NavLink to="/bookings" className={linkClass}>
          Requests
        </NavLink>

        <NavLink to="/agents" className={linkClass}>
          Agents
        </NavLink>

        <NavLink to="/workers" className={linkClass}>
          Workers
        </NavLink>

        <NavLink to="/working-status" className={linkClass}>
          Working Status
        </NavLink>

        <NavLink to="/attendance-report" className={linkClass}>
          Attendance Report
        </NavLink>

        <NavLink to="/solarpanels" className={linkClass}>
          Solar Panels
        </NavLink>

        <NavLink to="/installations" className={linkClass}>
          Installations
        </NavLink>

        <NavLink to="/billing" className={linkClass}>
          Billing
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          Reports
        </NavLink>

        <NavLink to="/complaints" className={linkClass}>
          Complaints
        </NavLink>

        <NavLink to="/notifications" className={linkClass}>
          Notifications
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          Settings
        </NavLink>
       
        <NavLink to="/customer/about">
          About Us
        </NavLink>
       
      </nav>

      {/* 🔹 User Section */}
      <div className="p-4 border-t border-gray-800">
        {user && (
          <div className="flex items-center gap-3 mb-4">
            <UserProfilePhoto user={user} size="lg" />
            <div>
              <p className="text-white text-sm font-semibold">
                {user?.username || "Admin"}
              </p>
              <p className="text-gray-400 text-xs">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full bg-gray-800 text-gray-300 py-2 rounded hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
