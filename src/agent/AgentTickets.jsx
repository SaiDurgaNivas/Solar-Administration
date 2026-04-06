import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle, Zap } from "lucide-react";
import { useTickets } from "../context/TicketContext";
import api from "../api/axiosConfig";

function AgentTickets() {
  const { tickets, resolveTicket, assignTicket } = useTickets();
  const [team, setTeam] = useState([]);
  const [assignSelect, setAssignSelect] = useState({});

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("solar_user"));
        if (!user) return;
        const res = await api.get(`users/?agent_id=${user.id}`);
        setTeam(res.data || []);
      } catch (err) {
        console.error("Agent team fetch err:", err);
      }
    };
    fetchTeam();
  }, []);

  const handleAssign = (ticketId) => {
    const workerId = assignSelect[ticketId];
    if (!workerId) return alert("Please select a worker first.");
    const worker = team.find(w => w.id.toString() === workerId.toString());
    assignTicket(ticketId, worker.id, worker.username);
    alert(`Ticket dispatched to ${worker.username}!`);
  };

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white font-sans">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500/20 to-pink-500/5 border border-red-500/20 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert className="w-48 h-48 text-red-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Maintenance Tickets</h1>
        <p className="text-gray-400 text-lg mt-2">Active support and maintenance requests</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {tickets.length === 0 ? (
          <div className="col-span-2 h-64 flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-white/20 rounded-2xl">
            <ShieldAlert className="w-12 h-12 mb-2" />
            <p className="font-semibold text-lg">No Active Tickets</p>
          </div>
        ) : tickets.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`border p-6 rounded-2xl flex flex-col transition-all ${t.status === 'Resolved' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#0f172a]/80 border-red-500/30'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-lg text-white uppercase">{t.type}</p>
                <p className="text-gray-500 text-sm">Client: <span className="text-gray-300">{t.customerName}</span></p>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                t.status === 'Resolved' ? 'text-green-400 border-green-500/30 bg-green-500/10'
                : t.status === 'Dispatched' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                : 'text-red-400 border-red-500/30 bg-red-500/10'
              }`}>{t.status}</span>
            </div>
            <p className="text-gray-400 text-sm italic mb-4 border-l-2 border-white/10 pl-3 py-1">"{t.description}"</p>
            
            <div className="mt-auto pt-4 flex flex-col justify-end">
              {t.status === "Pending" ? (
                 <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Dispatch Field Ops</label>
                    <div className="flex gap-2">
                       <select 
                          className="flex-1 bg-[#020617] border border-white/10 p-2 outline-none focus:border-red-500 rounded-lg text-xs text-white"
                          value={assignSelect[t.id] || ""}
                          onChange={(e) => setAssignSelect({...assignSelect, [t.id]: e.target.value})}
                       >
                           <option value="">- Select Technician -</option>
                           {team.map(w => <option key={w.id} value={w.id}>{w.username} ({w.subworker_profile?.job_title})</option>)}
                       </select>
                       <button onClick={() => handleAssign(t.id)} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-3 rounded-lg transition-all flex items-center justify-center">
                          <Zap className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              ) : t.status === "Dispatched" ? (
                 <div className="flex justify-between items-center bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl">
                    <div className="text-xs text-gray-400">Deployed to: <span className="font-bold text-blue-400 capitalize">{t.assignedWorkerName}</span></div>
                    <button onClick={() => resolveTicket(t.id)}
                      className="bg-green-500 hover:bg-green-400 text-black text-xs px-4 py-2 rounded-lg uppercase font-bold flex items-center gap-2 transition">
                      <CheckCircle className="w-4 h-4" /> Force Resolve
                    </button>
                 </div>
              ) : (
                 <div className="flex justify-between items-center border-t border-white/5 pt-2">
                   <span className="text-xs text-gray-600 font-mono">ID: {t.id}</span>
                   <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                     <CheckCircle className="w-3 h-3" /> Cleared at {t.resolvedAt ? new Date(t.resolvedAt).toLocaleTimeString() : ''}
                   </span>
                 </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AgentTickets;
