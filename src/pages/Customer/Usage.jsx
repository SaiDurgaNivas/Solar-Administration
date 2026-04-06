import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, TrendingUp, Sun } from "lucide-react";
import api from "../../api/axiosConfig";

function Usage() {
  const [telemetry, setTelemetry] = useState({
    total_units: 0,
    monthly_avg: 0,
    efficiency: 0,
    timestamp: "Synchronizing..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = sessionStorage.getItem("solar_user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    api.get(`telemetry/?client_id=${user.id}`)
      .then(res => {
        if (res.data.length > 0) {
            // Get the most recent telemetry
            setTelemetry(res.data[res.data.length - 1]);
        }
      })
      .catch(err => console.error("Telemetry Sync Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen p-6 font-sans text-white">

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-indigo-600/10 border border-blue-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Activity className="w-48 h-48 text-blue-500 blur-sm" />
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Telemetry Stream ⚡
            </h1>
            <p className="text-gray-400 text-lg mt-2 font-medium">Monitor your node energy consumption and grid efficiency metrics in real-time.</p>
        </div>
      </motion.div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex items-center gap-6"
        >
          <div className="bg-blue-500/20 p-4 rounded-full">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Cumulated Output</p>
            {loading ? <div className="h-8 w-20 bg-white/5 animate-pulse mt-2 rounded"></div> : <h2 className="text-3xl font-extrabold text-white mt-1">{telemetry.total_units} <span className="text-lg text-gray-500 font-medium tracking-normal">kWh</span></h2>}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex items-center gap-6"
        >
          <div className="bg-purple-500/20 p-4 rounded-full">
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">30-Day Mean Yield</p>
            {loading ? <div className="h-8 w-16 bg-white/5 animate-pulse mt-2 rounded"></div> : <h2 className="text-3xl font-extrabold text-white mt-1">{telemetry.monthly_avg} <span className="text-lg text-gray-500 font-medium tracking-normal">kWh</span></h2>}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex items-center gap-6"
        >
          <div className="bg-green-500/20 p-4 rounded-full">
            <Sun className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase">Photovoltaic Sync</p>
            {loading ? <div className="h-8 w-12 bg-white/5 animate-pulse mt-2 rounded"></div> : <h2 className="text-3xl font-extrabold text-green-400 mt-1">{telemetry.efficiency}%</h2>}
          </div>
        </motion.div>

      </div>

      {/* PROGRESS BAR */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
            System Network Efficiency
          </h2>
          <span className="text-green-400 flex items-center gap-2 font-semibold">
              <Activity className="w-5 h-5 animate-pulse" /> Optimal Sync
          </span>
        </div>

        <div className="w-full bg-white/5 rounded-full h-6 border border-white/10 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${telemetry.efficiency}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full shadow-[0_0_15px_rgba(74,222,128,0.5)] relative"
          >
             <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500 font-medium">
            Your hardware layer is operating at <strong className="text-green-400">{telemetry.efficiency}%</strong> capacity relative to theoretical max.
            </p>
            <p className="text-xs text-gray-600 font-mono">Last Sync: {new Date(telemetry.timestamp).toLocaleString() || "N/A"}</p>
        </div>

      </motion.div>

    </div>
  );
}

export default Usage;
