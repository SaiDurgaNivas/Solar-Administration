import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings as SettingsIcon, Save, RefreshCw, Activity, Moon, Zap, Globe, Check, 
  Bell, Mail, Phone, Shield, Key, Database, Server, CreditCard
} from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = sessionStorage.getItem('solar_admin_settings');
    return saved ? JSON.parse(saved) : {
      // General
      realtime: true,
      autoRefresh: true,
      darkMode: true,
      efficiency: 75,
      timezone: "IST (UTC+5:30)",
      
      // Dispatch
      alertsEnabled: true,
      adminEmail: "admin@solarsystem.com",
      adminPhone: "+91-9999999999",

      // Security
      twoFactor: false,
      sessionTimeout: "30",
      
      // API Integrations
      paymentGateway: "Stripe",
      stripePubKey: "pk_test_solarsystem_001",
      
      // Infrastructure
      autoBackup: true,
      dataRegion: "ap-south-1"
    };
  });
  
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleToggle = (key) => setSettings({ ...settings, [key]: !settings[key] });
  const handleSlider = (e) => setSettings({ ...settings, efficiency: e.target.value });
  const handleInput = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleSave = () => {
    sessionStorage.setItem('solar_admin_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans overflow-hidden relative pb-32">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <SettingsIcon className="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enterprise Preferences</h1>
            <p className="text-gray-400 text-sm">Configure your global solar network variables</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-2">
                {[
                    { id: "general", label: "General Config", icon: Activity },
                    { id: "dispatch", label: "Dispatch Routing", icon: Bell },
                    { id: "security", label: "Access & Security", icon: Shield },
                    { id: "api", label: "API Integrations", icon: Globe },
                    { id: "database", label: "Data Architecture", icon: Database }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition font-semibold text-sm tracking-wide ${
                            activeTab === tab.id 
                            ? "bg-white/10 border border-white/20 text-orange-400 shadow-inner" 
                            : "text-gray-400 hover:bg-white/5 border border-transparent hover:border-white/5"
                        }`}
                    >
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-orange-400" : "text-gray-500"}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Settings Panel */}
            <div className="lg:col-span-3 bg-[#0f172a]/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="space-y-2 relative z-10 min-h-[500px]">

                    {/* 🔹 GENERAL CONFIG */}
                    {activeTab === "general" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="w-6 h-6 text-orange-400"/> Core Settings</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-white/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Live Telemetry</p>
                                    <p className="text-gray-500 text-sm">Stream panel status data in real-time</p>
                                </div>
                                <button onClick={() => handleToggle("realtime")} className={`min-w-[60px] h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.realtime ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-gray-700"}`}>
                                    <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${settings.realtime ? "translate-x-7" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Auto Refresh Analytics</p>
                                    <p className="text-gray-500 text-sm">Automatically sync hardware diagnostics every 30s</p>
                                </div>
                                <button onClick={() => handleToggle("autoRefresh")} className={`min-w-[60px] h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.autoRefresh ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-gray-700"}`}>
                                    <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${settings.autoRefresh ? "translate-x-7" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Critical Efficiency Threshold</p>
                                    <p className="text-gray-500 text-sm">Alert dispatch when system generation drops below value</p>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                    <span className="text-orange-400 font-bold bg-orange-500/10 px-3 py-1 rounded-lg min-w-[3rem] text-center">{settings.efficiency}%</span>
                                    <input type="range" min="50" max="100" value={settings.efficiency} onChange={handleSlider} className="w-full sm:w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 🔹 DISPATCH ROUTING */}
                    {activeTab === "dispatch" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Bell className="w-6 h-6 text-orange-400"/> Notification Logic</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-white/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Customer Provisioning Alerts</p>
                                    <p className="text-gray-500 text-sm">Fire an SMS or Email payload to Admin whenever a client books hardware.</p>
                                </div>
                                <button onClick={() => handleToggle("alertsEnabled")} className={`min-w-[60px] h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.alertsEnabled ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-gray-700"}`}>
                                    <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${settings.alertsEnabled ? "translate-x-7" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 transition-opacity duration-300 ${settings.alertsEnabled ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Mail className="w-3 h-3"/> Internal Admin Email</label>
                                    <input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleInput} className="w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-300 font-mono shadow-inner border-orange-500/20" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Phone className="w-3 h-3"/> Executive SMS Endpoint</label>
                                    <input type="text" name="adminPhone" value={settings.adminPhone} onChange={handleInput} className="w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-300 font-mono shadow-inner border-orange-500/20" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 🔹 ACCESS & SECURITY */}
                    {activeTab === "security" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-orange-400"/> Authentication Matrix</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100 flex items-center gap-2"><Key className="w-4 h-4 text-green-400"/> Enforce 2FA Protocol</p>
                                    <p className="text-gray-500 text-sm">Require Time-based One-Time Password (TOTP) for Admin actions</p>
                                </div>
                                <button onClick={() => handleToggle("twoFactor")} className={`min-w-[60px] h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.twoFactor ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-gray-700"}`}>
                                    <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${settings.twoFactor ? "translate-x-7" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Global Session Timeout</p>
                                    <p className="text-gray-500 text-sm">Automatically log out inactive instances across the grid</p>
                                </div>
                                <select value={settings.sessionTimeout} name="sessionTimeout" onChange={handleInput} className="bg-[#020617] border border-white/10 text-gray-300 font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none text-center">
                                    <option value="15">15 Minutes</option>
                                    <option value="30">30 Minutes</option>
                                    <option value="60">1 Hour</option>
                                    <option value="999">Never</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* 🔹 API INTEGRATIONS */}
                    {activeTab === "api" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Globe className="w-6 h-6 text-orange-400"/> External Connections</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Revenue Gateway</p>
                                    <p className="text-gray-500 text-sm">Select the primary system for parsing billing payments</p>
                                </div>
                                <select value={settings.paymentGateway} name="paymentGateway" onChange={handleInput} className="bg-[#020617] border border-white/10 text-gray-300 font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none text-center">
                                    <option value="Stripe">Stripe API</option>
                                    <option value="Razorpay">Razorpay API</option>
                                    <option value="PayPal">PayPal Commerce</option>
                                </select>
                            </div>

                            <div className="mt-6">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Gateway Public Key</label>
                                <input type="password" name="stripePubKey" placeholder="pk_test_xxxxxxxxxx" value={settings.stripePubKey} onChange={handleInput} className="w-full bg-[#020617] border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-emerald-400 font-mono shadow-inner tracking-widest" />
                            </div>
                        </motion.div>
                    )}

                    {/* 🔹 ARCHITECTURE */}
                    {activeTab === "database" && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Server className="w-6 h-6 text-orange-400"/> Infrastructure & Storage</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Daily Django DB Replication</p>
                                    <p className="text-gray-500 text-sm">Clone the core db.sqlite3 to emergency isolated servers via cron</p>
                                </div>
                                <button onClick={() => handleToggle("autoBackup")} className={`min-w-[60px] h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.autoBackup ? "bg-gradient-to-r from-orange-500 to-yellow-500" : "bg-gray-700"}`}>
                                    <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${settings.autoBackup ? "translate-x-7" : "translate-x-0"}`} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 border-b border-light/5">
                                <div>
                                    <p className="text-lg font-semibold text-gray-100">Primary Origin Region</p>
                                    <p className="text-gray-500 text-sm">Set the main geographical storage boundary for telemetry</p>
                                </div>
                                <select value={settings.dataRegion} name="dataRegion" onChange={handleInput} className="bg-[#020617] border border-white/10 text-gray-300 font-medium px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none text-center">
                                    <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                                    <option value="us-east-1">US East (N. Virginia)</option>
                                    <option value="eu-central-1">Europe (Frankfurt)</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                </div>

                {/* 🔹 ACTION BOTTOM BAR */}
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-orange-500 text-black font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] w-full sm:w-auto"
                    >
                        {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saved ? "Configurations Locked!" : "Store Operations"}
                    </button>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Settings;
