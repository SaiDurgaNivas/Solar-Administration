import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, MapPin, CheckCircle, Clock, Save } from "lucide-react";
import api from "../api/axiosConfig";

function AgentInstallations() {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstallations = () => {
    api.get('installations/').then(res => setInstallations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInstallations(); }, []);

  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : 'Completed';
    try {
      await api.patch(`installations/${id}/`, { status: nextStatus });
      alert(`Status updated to ${nextStatus}!`);
      fetchInstallations();
    } catch {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white font-sans">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500/20 to-yellow-500/5 border border-orange-500/20 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Wrench className="w-48 h-48 text-orange-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Installation Queue</h1>
        <p className="text-gray-400 text-lg mt-2">Manage and update live installation statuses</p>
      </motion.div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : installations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-white/20 rounded-2xl">
            <Wrench className="w-12 h-12 mb-2" />
            <p className="font-semibold text-lg">No Installations Found</p>
          </div>
        ) : installations.map((inst, i) => (
          <motion.div key={inst.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#0f172a]/80 border border-white/10 p-6 rounded-2xl hover:bg-white/5 transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-lg text-gray-200">{inst.system}</p>
                <p className="text-gray-500 text-sm mt-1">Client: <span className="text-gray-300 capitalize">{inst.client_name}</span></p>
              </div>
              {inst.status === "Completed"
                ? <div className="bg-green-500/10 text-green-400 p-2 rounded-full border border-green-500/20"><CheckCircle className="w-5 h-5" /></div>
                : <div className="bg-orange-500/10 text-orange-400 p-2 rounded-full border border-orange-500/20"><Clock className="w-5 h-5" /></div>
              }
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {inst.location || "Pending Address"}
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  inst.status === 'Completed' ? 'text-green-400 border-green-500/30 bg-green-500/10'
                  : inst.status === 'In Progress' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                  : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                }`}>{inst.status}</span>
                {inst.status !== "Completed" && (
                  <button onClick={() => updateStatus(inst.id, inst.status)}
                    className="bg-blue-500 hover:bg-blue-400 text-white text-xs px-3 py-1.5 rounded-lg uppercase font-bold flex items-center gap-1 transition">
                    <Save className="w-3 h-3" /> Update
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AgentInstallations;
