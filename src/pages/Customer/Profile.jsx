import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Phone, MapPin, Calendar, CheckCircle, Fingerprint, Settings, Camera } from "lucide-react";
import UserProfilePhoto from "../../components/UserProfilePhoto";

function Profile() {
  const userStr = sessionStorage.getItem("solar_user");
  const user = userStr ? JSON.parse(userStr) : { username: "Valued Customer", email: "customer@solar.local", role: "customer" };

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans animate-in fade-in duration-700 relative overflow-hidden">
      
      {/* Premium Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full">
        
        {/* Massive Hero Banner */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-48 md:h-64 rounded-3xl overflow-hidden relative shadow-2xl mb-24 border border-white/5"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 opacity-20 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548611716-e41fb00c4316?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
            
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5 text-gray-300" />
                </button>
            </div>
        </motion.div>

        {/* Profile Head Card */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f172a]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-8 md:p-12 -mt-48 relative z-20 mx-4 md:mx-12"
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Overlapping Avatar */}
                <div className="relative shrink-0 -mt-24 md:-mt-24 z-30 group">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-[#020617] rounded-full p-2 shadow-[0_0_40px_rgba(249,115,22,0.3)] inline-block">
                        <UserProfilePhoto user={user} size="2xl" clickable={true} />
                    </div>
                    {/* Online Indicator */}
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-[#020617] z-40 pointer-events-none"></div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 capitalize">
                                {user.username || user.name || "Customer"}
                            </h1>
                            <p className="text-orange-400 font-bold tracking-widest text-sm uppercase flex items-center justify-center md:justify-start gap-2">
                                <Fingerprint className="w-4 h-4" /> Validated Protocol
                            </p>
                        </div>
                        <span className="mt-4 md:mt-0 px-5 py-2 bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-black tracking-widest uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                            <Shield className="w-4 h-4" /> Clearance: {user.role}
                        </span>
                    </div>

                    <div className="h-px w-full bg-white/5 my-6"></div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>Member Since {new Date().getFullYear()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-bold">Active Account</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Detailed Metrics / Credentials */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 px-4 md:px-12">
            
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0f172a]/40 border border-white/5 rounded-[2rem] p-8 shadow-xl"
            >
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Communication Links</h2>
                
                <div className="space-y-4">
                    <div className="bg-[#020617]/50 border border-white/5 p-5 rounded-2xl flex items-center gap-5 hover:border-orange-500/30 hover:bg-white/5 transition-all group">
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <Mail className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Primary Email</p>
                            <p className="text-lg font-medium text-gray-200">{user.email || "Pending Assignment"}</p>
                        </div>
                    </div>

                    <div className="bg-[#020617]/50 border border-white/5 p-5 rounded-2xl flex items-center gap-5 hover:border-orange-500/30 hover:bg-white/5 transition-all group">
                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                            <Phone className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Encrypted Handheld</p>
                            <p className="text-lg font-medium text-gray-500 italic">Unassigned (Require Admin Override)</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0f172a]/40 border border-white/5 rounded-[2rem] p-8 shadow-xl"
            >
                <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Physical Infrastructure</h2>
                
                <div className="space-y-4">
                    <div className="bg-[#020617]/50 border border-white/5 p-5 rounded-2xl flex items-start gap-5 hover:border-orange-500/30 hover:bg-white/5 transition-all group">
                        <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors mt-1">
                            <MapPin className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">Registered Coordinates</p>
                            <p className="text-lg font-medium text-gray-200 leading-snug">
                                Secure Grid Location<br/>
                                <span className="text-sm text-gray-400">Sector Authorization Required</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-transparent border-l-4 border-orange-500 rounded-r-2xl">
                    <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-2">Account Status</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Your account holds active customer clearance. You have full access to billing, live telemetry, and direct support lines.
                    </p>
                </div>

            </motion.div>

        </div>

      </div>
    </div>
  );
}

export default Profile;
