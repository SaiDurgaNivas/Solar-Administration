import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import api from "../api/axiosConfig";

function AgentCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('installations/').then(res => {
      // Derive unique customers from installations
      const seen = new Set();
      const unique = res.data.filter(i => {
        if (seen.has(i.client_name)) return false;
        seen.add(i.client_name);
        return true;
      });
      setCustomers(unique);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white font-sans">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-indigo-500/5 border border-blue-500/20 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Users className="w-48 h-48 text-blue-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Assigned Customers</h1>
        <p className="text-gray-400 text-lg mt-2">Your active client sites and locations</p>
      </motion.div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-white/20 rounded-2xl">
            <Users className="w-12 h-12 mb-2" />
            <p className="font-semibold text-lg">No Customers Assigned</p>
          </div>
        ) : customers.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#0f172a]/80 border border-white/10 p-6 rounded-2xl flex justify-between items-center hover:bg-white/5 transition">
            <div>
              <p className="font-bold text-lg text-gray-200 capitalize">{c.client_name}</p>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {c.location || "Sector Alpha"}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase border ${
              c.status === "Completed" ? "bg-green-500/10 text-green-400 border-green-500/30"
              : c.status === "Pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
              : "bg-orange-500/10 text-orange-400 border-orange-500/30"
            }`}>{c.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AgentCustomers;
