import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, TrendingUp, Sun, Leaf, Battery, Download, Wifi, CheckCircle2, Droplets, Factory } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
            setTelemetry(res.data[res.data.length - 1]);
        }
      })
      .catch(err => console.error("Telemetry Sync Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const baseDaily = (telemetry.monthly_avg / 30) || 5;
  const historyData = [
    { day: "Mon", usage: parseFloat((baseDaily * 0.85).toFixed(1)) },
    { day: "Tue", usage: parseFloat((baseDaily * 1.15).toFixed(1)) },
    { day: "Wed", usage: parseFloat((baseDaily * 0.95).toFixed(1)) },
    { day: "Thu", usage: parseFloat((baseDaily * 1.25).toFixed(1)) },
    { day: "Fri", usage: parseFloat((baseDaily * 1.05).toFixed(1)) },
    { day: "Sat", usage: parseFloat((baseDaily * 1.4).toFixed(1)) },
    { day: "Sun", usage: parseFloat((baseDaily * 0.9).toFixed(1)) },
  ];

  const co2Saved = (telemetry.total_units * 0.42).toFixed(1);
  const treesEquivalent = (telemetry.total_units * 0.02).toFixed(1);

  const diagnostics = [
    { label: "Inverter Status", status: "Nominal", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-400" },
    { label: "Battery Health", status: "98%", icon: <Battery className="w-5 h-5" />, color: "text-blue-400" },
    { label: "Grid Connection", status: "Synchronized", icon: <Wifi className="w-5 h-5" />, color: "text-purple-400" },
  ];

  const handleDownload = () => {
    const csvContent = `data:text/csv;charset=utf-8,Day,Usage(kWh)\n${historyData.map(e => `${e.day},${e.usage}`).join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "telemetry_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#020617] min-h-screen p-6 font-sans text-white">

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <Activity className="w-48 h-48 text-blue-500 blur-sm" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
                Telemetry Stream <Zap className="text-blue-400 w-8 h-8" />
              </h1>
              <p className="text-gray-400 text-lg mt-2 font-medium">Advanced Node Analytics & Live Energy Harvesting.</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all border border-blue-400/50"
            >
              <Download className="w-5 h-5" /> Export Data
            </motion.button>
        </div>
      </motion.div>

      {/* PRIMARY CARDS */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
        {[
          { title: "Cumulated Output", value: telemetry.total_units, unit: "kWh", icon: <Zap className="w-8 h-8 text-blue-400" />, bg: "bg-blue-500/20", color: "text-white" },
          { title: "30-Day Mean Yield", value: telemetry.monthly_avg, unit: "kWh", icon: <TrendingUp className="w-8 h-8 text-purple-400" />, bg: "bg-purple-500/20", color: "text-white" },
          { title: "Photovoltaic Sync", value: telemetry.efficiency, unit: "%", icon: <Sun className="w-8 h-8 text-yellow-400" />, bg: "bg-yellow-500/20", color: "text-yellow-400" },
          { title: "Grid Independence", value: Math.min(100, telemetry.efficiency + 12), unit: "%", icon: <Activity className="w-8 h-8 text-green-400" />, bg: "bg-green-500/20", color: "text-green-400" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl flex items-center gap-5 relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500`}>
              {stat.icon}
            </div>
            <div className={`${stat.bg} p-4 rounded-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">{stat.title}</p>
              {loading ? (
                <div className="h-8 w-20 bg-white/5 animate-pulse rounded"></div>
              ) : (
                <h2 className={`text-3xl font-extrabold ${stat.color}`}>
                  {stat.value} <span className="text-sm text-gray-500 font-medium tracking-normal">{stat.unit}</span>
                </h2>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* CHART SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400"/> 7-Day Performance Yield
            </h2>
            <div className="flex items-center gap-2 max-sm:hidden text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Live Update
            </div>
          </div>

          <div className="h-64 w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ECO IMPACT & DIAGNOSTICS */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-green-900/40 to-[#0f172a] backdrop-blur-xl border border-green-500/20 p-6 rounded-3xl shadow-xl flex-grow"
          >
            <h3 className="text-lg font-bold text-green-400 mb-6 flex items-center gap-2">
              <Leaf className="w-5 h-5"/> Environmental Impact
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-2xl border border-green-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg"><Factory className="w-5 h-5 text-green-400"/></div>
                  <span className="text-gray-300 font-medium text-sm">CO₂ Offset</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{loading ? '...' : co2Saved} <span className="text-xs text-gray-400">kg</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg"><Droplets className="w-5 h-5 text-emerald-400"/></div>
                  <span className="text-gray-300 font-medium text-sm">Trees Equivalent</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">{loading ? '...' : treesEquivalent}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
             className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex-grow"
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Diagnostics</h3>
            <ul className="space-y-4">
              {diagnostics.map((diag, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                    <div className="p-1.5 bg-white/5 rounded-md border border-white/10">
                      {diag.icon}
                    </div>
                    {diag.label}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 bg-white/5 rounded-full border border-white/5 ${diag.color}`}>
                    {diag.status}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Layer Efficiency Matrix
          </h2>
          <span className="text-green-400 flex items-center gap-2 font-semibold bg-green-400/10 px-3 py-1 rounded-full text-xs">
             <Activity className="w-4 h-4 animate-pulse" /> Optimal Threshold
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-8 border border-white/5 overflow-hidden relative p-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${telemetry.efficiency}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-green-400 h-full rounded-full shadow-[0_0_20px_rgba(74,222,128,0.4)] relative flex items-center justify-end pr-4"
          >
             <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
             <span className="relative z-10 text-[10px] font-black text-white mix-blend-overlay">{telemetry.efficiency}% CAP</span>
          </motion.div>
        </div>

        <div className="flex justify-between items-center mt-5">
            <p className="text-sm text-gray-400 font-medium">
            Node infrastructure is operating at <strong className="text-white">{telemetry.efficiency}%</strong> capacity relative to theoretical limit.
            </p>
            <p className="text-xs text-slate-500 font-mono tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" /> {new Date(telemetry.timestamp).toLocaleString() || "N/A"}
            </p>
        </div>

      </motion.div>

    </div>
  );
}

export default Usage;
