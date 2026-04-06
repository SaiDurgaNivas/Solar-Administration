import React, { useState } from "react";
import { Bell, UserCircle, ArrowLeft, Sun, Home } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserProfilePhoto from "../UserProfilePhoto";

function Header({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Don't show back button on the main dashboard itself
  const showBackButton = location.pathname !== "/dashboard" && location.pathname !== "/agent-dashboard";

  return (
    <header className="w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-sm text-white">

      <div className="flex justify-between items-center px-6 py-4">

        {/* 🔹 Left: Back Button + Branding */}
        <div className="flex items-center gap-6">
          
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white"
                title="Go Back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <Sun className="text-orange-500 w-6 h-6" />
              <h1 className="text-lg font-bold tracking-wide">
                Solar<span className="text-orange-500">Administration</span>
              </h1>
            </div>
          </div>

          {/* 🏠 Dedicated Home Button */}
          <button 
            onClick={() => navigate("/")}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]"
            title="Go to Public Portal"
          >
            <Home size={16} />
            <span className="text-sm font-bold tracking-wider uppercase">Home</span>
          </button>

          <p className="hidden md:block text-sm text-gray-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {dateString}
          </p>
        </div>

        {/* 🔹 Right Section */}
        <div className="flex items-center gap-6">

          {/* About Link */}
          <Link
            to="/about"
            className="text-sm font-semibold text-gray-400 hover:text-orange-400 transition-colors"
          >
            About Hub
          </Link>

          {/* 🔔 Notification */}
          <div className="relative cursor-pointer group">
            <div onClick={() => setShowNotifs(!showNotifs)} className={`p-2 rounded-full transition-colors ${showNotifs ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <Bell size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            </div>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#020617] pointer-events-none">
              3
            </span>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-4 w-80 bg-[#0f172a] shadow-2xl rounded-2xl p-5 z-50 border border-white/10 text-left">
                <div className="flex justify-between items-center mb-4">
                   <p className="font-bold text-white">Notifications</p>
                   <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">3 New</span>
                </div>
                <div className="space-y-3">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                      <p className="text-sm font-bold text-gray-200">New Installation Requested</p>
                      <p className="text-xs text-gray-400 mt-1">Customer has requested a 5kW setup.</p>
                      <p className="text-[10px] text-gray-500 mt-2">Just now</p>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                      <p className="text-sm font-bold text-gray-200">Invoice Issued</p>
                      <p className="text-xs text-gray-400 mt-1">A bill of ₹12000 was generated.</p>
                      <p className="text-[10px] text-gray-500 mt-2">1 hr ago</p>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                      <p className="text-sm font-bold text-gray-200">Escalated Appointment</p>
                      <p className="text-xs text-gray-400 mt-1">Agent forwarded a request requiring check.</p>
                      <p className="text-[10px] text-gray-500 mt-2">2 hrs ago</p>
                   </div>
                </div>
                <button onClick={() => { setShowNotifs(false); navigate('/dashboard'); }} className="w-full mt-4 text-xs font-bold text-orange-400 hover:text-orange-300 transition py-2 bg-orange-500/10 rounded-lg">
                  View All Activity
                </button>
              </div>
            )}
          </div>

          {/* 👤 Profile */}
          <div className="relative">

            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <UserProfilePhoto user={user} size="md" />
              <span className="hidden sm:block font-medium text-sm text-gray-200 pr-2">
                {user?.name || user?.username || "Administrator"}
              </span>
            </div>

            {/* 🔻 Dropdown */}
            {open && (
              <div className="absolute right-0 mt-4 w-64 bg-[#0f172a] shadow-2xl rounded-2xl p-5 z-50 border border-white/10">

                <p className="font-bold mb-4 text-white">Account Details</p>

                <div className="flex justify-center mb-6">
                    <UserProfilePhoto user={user} size="xl" clickable={true} />
                </div>

                <div className="text-sm text-gray-400 mb-4 space-y-3 bg-[#020617] p-3 rounded-xl border border-white/5">
                  <p><strong className="text-gray-200 font-medium">Name:</strong><br/>{user?.name || user?.username || "Administrator"}</p>
                  <p><strong className="text-gray-200 font-medium">Email:</strong><br/>{user?.email || "admin@gmail.com"}</p>
                  <p className="capitalize"><strong className="text-gray-200 font-medium">Role:</strong><br/>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-md border border-orange-500/20">
                      {user?.role || "Admin"}
                    </span>
                  </p>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full bg-white/5 text-red-400 hover:text-white border border-white/5 hover:bg-red-500 font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-all shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
