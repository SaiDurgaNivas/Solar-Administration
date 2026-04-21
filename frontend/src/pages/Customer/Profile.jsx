import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Phone, MapPin, Calendar, CheckCircle, Fingerprint, Settings, Camera, Save, X } from "lucide-react";
import UserProfilePhoto from "../../components/UserProfilePhoto";
import api from "../../api/axiosConfig";

function Profile() {
  const userStr = sessionStorage.getItem("solar_user");
  const initialUser = userStr ? JSON.parse(userStr) : { 
    username: "Valued Customer", 
    email: "customer@solar.local", 
    role: "customer", 
    first_name: "John", 
    last_name: "Doe",
    customer_profile: { phone: "", address: "" }
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    phone: user.customer_profile?.phone || "",
    address: user.customer_profile?.address || ""
  });
  const [loading, setLoading] = useState(false);

  const fullName = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user.username || "Customer");

  const handleSave = async () => {
    setLoading(true);
    try {
        // Prepare payload for partial update
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            customer_profile: {
                phone: formData.phone,
                address: formData.address
            }
        };

        const res = await api.patch(`users/${user.id}/`, payload);
        const updatedUser = { ...user, ...res.data };
        
        sessionStorage.setItem("solar_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to update profile. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans animate-in fade-in duration-700 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full">
        
        {/* Profile Hero Header */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-48 md:h-64 rounded-[3rem] overflow-hidden relative shadow-2xl mb-24 border border-white/10"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500/40 to-yellow-500/10 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548611716-e41fb00c4316?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            
            <div className="absolute top-8 right-8 z-20 flex gap-3">
                <button className="p-3.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all shadow-lg">
                    <Settings className="w-5 h-5 text-white" />
                </button>
            </div>
        </motion.div>

        {/* Primary Profile Identity Card */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] p-8 md:p-14 -mt-56 relative z-20 mx-4 md:mx-10"
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                {/* Profile Photo Wrapper */}
                <div className="relative shrink-0 -mt-28 md:-mt-28 z-30">
                    <div className="w-36 h-36 md:w-44 md:h-44 bg-[#0a0a0a] rounded-[2.5rem] p-2.5 shadow-[0_15px_50px_rgba(249,115,22,0.4)] border border-white/10">
                        <div className="w-full h-full rounded-[2rem] overflow-hidden">
                            <UserProfilePhoto user={user} size="2xl" clickable={true} />
                        </div>
                    </div>
                    {/* Status Orb */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-[6px] border-[#0a0a0a] z-40 shadow-lg"></div>
                </div>

                <div className="flex-1 text-center md:text-left pt-2">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6">
                        <div className="w-full md:w-auto">
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                                        placeholder="First Name"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                    />
                                    <input 
                                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                                        placeholder="Last Name"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2 highlight-text">
                                        {fullName}
                                    </h1>
                                    <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                                        <span className="bg-orange-500/10 text-orange-500 font-black tracking-widest text-[10px] uppercase py-1.5 px-4 rounded-full border border-orange-500/20 flex items-center gap-2">
                                            <Shield className="w-3 h-3" /> Solar Customer Account
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-8 md:mt-0 flex gap-3">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3.5 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                                    >
                                        <X className="w-4 h-4 inline mr-2" /> Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    Edit Profile details
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent my-8"></div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm">
                        <div className="flex items-center gap-3 text-gray-400">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Calendar className="w-4 h-4 text-orange-400/60" />
                            </div>
                            <span className="font-semibold">Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 font-black uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-2xl bg-green-500/10 border border-green-500/20">
                            <CheckCircle className="w-4 h-4" />
                            Account Verified
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 px-4 md:px-10">
            
            {/* Contact Information */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl group"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-500/10 rounded-[1.25rem]">
                        <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Contact Info</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-black/20 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 hover:border-orange-500/40 transition-all">
                        <div className="p-4 bg-white/5 rounded-2xl">
                            <Mail className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">Email Address</p>
                            {isEditing ? (
                                <input 
                                    className="w-full bg-transparent border-b border-white/10 focus:border-orange-500 outline-none text-lg font-bold text-gray-200 py-1"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            ) : (
                                <p className="text-lg font-bold text-gray-200">{user.email || "Add your email"}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 hover:border-orange-500/40 transition-all">
                        <div className="p-4 bg-white/5 rounded-2xl">
                            <Phone className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">Mobile Number</p>
                            {isEditing ? (
                                <input 
                                    className="w-full bg-transparent border-b border-white/10 focus:border-orange-500 outline-none text-lg font-bold text-gray-200 py-1"
                                    placeholder="+91 00000 00000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            ) : (
                                <p className="text-lg font-bold text-gray-200">{user.customer_profile?.phone || "Personal contact needed"}</p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Installation Details */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-10 shadow-2xl group"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-orange-500/10 rounded-[1.25rem]">
                        <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Installation Details</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-black/20 border border-white/5 p-6 rounded-[2rem] flex items-start gap-6 hover:border-orange-500/40 transition-all">
                        <div className="p-4 bg-white/5 rounded-2xl mt-1">
                            <MapPin className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">Service Address</p>
                            {isEditing ? (
                                <textarea 
                                    className="w-full bg-transparent border-b border-white/10 focus:border-orange-500 outline-none text-lg font-bold text-gray-200 py-1 resize-none"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    rows="2"
                                />
                            ) : (
                                <p className="text-lg font-bold text-gray-200 leading-snug">
                                    {user.customer_profile?.address || "Assigned Residential Grid"}<br/>
                                    <span className="text-xs text-orange-500/70 font-bold uppercase tracking-wider">Primary Installation Point</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 p-8 bg-gradient-to-br from-orange-500/10 to-transparent border-l-4 border-orange-500 rounded-3xl">
                    <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-4 h-4 text-orange-500" />
                        <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest">Ownership Status</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                        Your account is fully verified. You have full administrative access to your solar performance metrics, billing records, and direct support channels.
                    </p>
                </div>

            </motion.div>

        </div>

      </div>
    </div>
  );
}

export default Profile;
