import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogOut, ChevronDown, Sun } from "lucide-react";
import UserProfilePhoto from "../UserProfilePhoto";

function AgentHeader({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-sm text-white">
      <div className="flex justify-between items-center px-6 py-4">

        {/* 🔹 Left: Branding & Date */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sun className="text-orange-500 w-6 h-6" />
              <h1 className="text-lg font-bold tracking-wide hidden sm:block">
                Solar<span className="text-orange-500">Administration</span>
              </h1>
              <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] sm:text-xs rounded-md border border-orange-500/20 font-bold uppercase tracking-widest hidden md:inline-block">Agent Portal</span>
            </div>
          </div>
          <p className="hidden md:block text-sm text-gray-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {dateString}
          </p>
        </div>

        {/* RIGHT: Profile + Actions */}
        <div className="flex items-center gap-3">

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-2 rounded-xl transition border border-white/10"
            >
              <UserProfilePhoto user={user} size="sm" clickable={false} />
              <span className="text-sm font-bold text-gray-200 capitalize hidden sm:block">
                {user?.username?.replace(/_/g, ' ') || "Agent"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown */}
            {showProfile && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-5 z-50">
                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Agent ID Card</h3>
                <div className="flex justify-center mb-4">
                  <UserProfilePhoto user={user} size="xl" clickable={true} />
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Full Name</span>
                    <span className="font-semibold text-gray-200 capitalize">{user?.username?.replace(/_/g, ' ') || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Email</span>
                    <span className="font-semibold text-gray-200">{user?.email || "No Email"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Mobile Number</span>
                    <span className="font-semibold text-gray-200">{user?.customer_profile?.phone || "Pending Assignment"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Address</span>
                    <span className="font-semibold text-gray-200">{user?.customer_profile?.address || "HQ Base Deployment"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Status</span>
                    <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">● On Duty</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Home Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30 text-blue-400 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white px-4 py-2 rounded-xl font-semibold transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
}

export default AgentHeader;

