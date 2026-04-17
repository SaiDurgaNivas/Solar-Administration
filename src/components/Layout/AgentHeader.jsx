import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LogOut, ChevronDown, Sun, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import UserProfilePhoto from "../UserProfilePhoto";
import api from "../../api/axiosConfig";

function AgentHeader({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.agent_profile?.phone || "",
    address: user?.agent_profile?.address || "",
    status: user?.agent_profile?.status || "ON DUTY"
  });

  const handleEditSubmit = async () => {
    try {
      setEditLoading(true);
      const res = await api.post('agent/update-profile/', {
        user_id: user.id,
        ...formData
      });
      alert("Profile updated successfully!");
      setShowEditModal(false);
      // We should ideally refresh local user state here, but for now we rely on the next refresh/login
      // In a real app, we'd use a context update function.
      if (window.location) window.location.reload(); 
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const handleHomeClick = () => {
    setShowHomeConfirm(true);
    setShowProfile(false);
  };

  const confirmGoHome = () => {
    setShowHomeConfirm(false);
    if (onLogout) onLogout();
    navigate("/");
  };

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
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
                    <span className="font-semibold text-gray-200">{user?.agent_profile?.phone || "Pending Assignment"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Address</span>
                    <span className="font-semibold text-gray-200">{user?.agent_profile?.address || "HQ Base Deployment"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500">Status</span>
                    <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">● {user?.agent_profile?.status || "ON DUTY"}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowEditModal(true); setShowProfile(false); }}
                  className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl border border-white/10 transition"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Home Button */}
          <button
            onClick={handleHomeClick}
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

      {/* 🔒 Logout Confirmation Modal */}
      <AnimatePresence>
        {showHomeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
            >
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <AlertCircle className="w-7 h-7 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Leave Portal?</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                You are about to leave the <span className="text-orange-400 font-semibold">Agent Portal</span> and return to the public home page.<br />
                <span className="text-white/60">This will log you out.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowHomeConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-semibold transition-all text-sm"
                >
                  Stay Here
                </button>
                <button
                  onClick={confirmGoHome}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all text-sm shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📝 Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
               <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Modify Agent Credentials</h2>
               
               <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">Contact Telemetry</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 transition"
                      placeholder="Enter mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">Current Sector/Address</label>
                    <textarea 
                      className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 transition h-24 resize-none"
                      placeholder="Enter physical address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">Operational Status</label>
                    <select 
                      className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 transition"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                        <option value="ON DUTY">ON DUTY</option>
                        <option value="OFF DUTY">OFF DUTY</option>
                        <option value="FIELD DEPLOYED">FIELD DEPLOYED</option>
                        <option value="IDLE">IDLE</option>
                    </select>
                  </div>
               </div>

               <div className="flex gap-4 mt-8">
                  <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition">Cancel</button>
                  <button 
                    onClick={handleEditSubmit} 
                    disabled={editLoading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-extrabold shadow-lg shadow-orange-500/20 active:scale-95 transition disabled:opacity-50"
                  >
                    {editLoading ? "Syncing..." : "Update Vault"}
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AgentHeader;

