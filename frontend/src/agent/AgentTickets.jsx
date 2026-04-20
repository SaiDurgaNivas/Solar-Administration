import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, Zap, User, Clock, MapPin, Send, Filter, AlertCircle, Briefcase, Activity, History } from "lucide-react";
import { useTickets } from "../context/TicketContext";
import api from "../api/axiosConfig";

function AgentTickets() {
  const { tickets, resolveTicket, assignTicket, fetchTickets } = useTickets();
  const [team, setTeam] = useState([]);
  const [assignSelect, setAssignSelect] = useState({});
  const [activeTab, setActiveTab] = useState("Active"); // "Active" or "History"

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get(`users/?role=sub_worker`);
        setTeam(res.data || []);
      } catch (err) {
        console.error("Agent team fetch err:", err);
      }
    };
    fetchTeam();
    // Refresh tickets every 10 seconds for urgency
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  const handleAssign = (ticketId) => {
    const workerId = assignSelect[ticketId];
    if (!workerId) return alert("Identify a technician before initiating dispatch protocol.");
    
    const worker = team.find(w => w.id.toString() === workerId.toString());
    assignTicket(ticketId, worker.id, worker.username);
    alert(`STRIKE TEAM DISPATCHED: ${worker.username} is now assigned to Ticket ${ticketId}.`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* 🔮 Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto p-10 space-y-12 relative z-10">
        
        {/* 📟 Header Array */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldAlert className="w-56 h-56 text-red-500 rotate-12" />
            </div>
            
            <div className="text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-red-500/20">
                    Neural Support Link: Active
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Maintenance Tickets</h1>
                <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                    Monitor system anomalies and deploy field engineering units. Emergency signals take priority over scheduled maintenance.
                </p>
            </div>

            <div className="flex gap-4">
                <div className="bg-[#020617] border border-white/10 px-8 py-6 rounded-[2rem] text-center min-w-[140px] shadow-xl">
                    <p className="text-red-500 text-3xl font-black">{tickets.filter(t => t.status !== 'Resolved').length}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Critical Queue</p>
                </div>
                <div className="bg-[#020617] border border-white/10 px-8 py-6 rounded-[2rem] text-center min-w-[140px] shadow-xl">
                    <p className="text-green-500 text-3xl font-black">{tickets.filter(t => t.status === 'Resolved').length}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Nodes Cleared</p>
                </div>
            </div>
        </motion.div>

        {/* 🛠 Command Tabs */}
        <div className="flex justify-center md:justify-start">
            <div className="flex gap-2 bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-xl">
               <button 
                  onClick={() => setActiveTab("Active")} 
                  className={`px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'Active' ? 'bg-red-500 text-white shadow-2xl shadow-red-500/20' : 'text-gray-500 hover:text-white'}`}
               >
                  <Activity className="w-4 h-4" /> Active Array
               </button>
               <button 
                  onClick={() => setActiveTab("History")} 
                  className={`px-10 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'History' ? 'bg-green-500 text-white shadow-2xl shadow-green-500/20' : 'text-gray-500 hover:text-white'}`}
               >
                  <History className="w-4 h-4" /> Archive Retrieval
               </button>
            </div>
        </div>

        {/* 🎟 Ticket Feed */}
        <div className="grid lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
          {tickets.filter(t => activeTab === 'Active' ? t.status !== 'Resolved' : t.status === 'Resolved').length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="lg:col-span-2 h-[400px] flex flex-col items-center justify-center text-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem]"
            >
              <div className="p-8 bg-white/5 rounded-full mb-6">
                <ShieldAlert className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-500 uppercase tracking-widest">No Signals Detected</h3>
              <p className="text-gray-600 text-sm mt-2">All grid nodes are operating within nominal parameters.</p>
            </motion.div>
          ) : tickets.filter(t => activeTab === 'Active' ? t.status !== 'Resolved' : t.status === 'Resolved').map((t, i) => (
          <motion.div 
            key={t.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`group relative p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col h-full ${
                t.type === 'EMERGENCY' && t.status === 'Pending'
                ? 'bg-red-500/10 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.15)] animate-pulse-slow' 
                : t.status === 'Resolved' 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-[#0f172a]/60 backdrop-blur-3xl border-white/10 hover:border-white/20 shadow-xl'
            }`}
          >
            {t.type === 'EMERGENCY' && t.status === 'Pending' && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
                    Immediate Attention Required
                </div>
            )}

            <div className="flex justify-between items-start mb-8 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <p className={`font-black text-2xl tracking-tighter uppercase ${t.type === 'EMERGENCY' ? 'text-red-400' : 'text-white'}`}>{t.type}</p>
                    <span className="text-[10px] font-mono text-gray-500">#{t.ticket_no}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    <p className="text-xs font-bold uppercase tracking-widest">{t.client_name}</p>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                t.status === 'Resolved' ? 'text-green-400 border-green-500/30 bg-green-500/10'
                : t.status === 'Dispatched' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                : 'text-red-400 border-red-500/30 bg-red-500/10'
              }`}>{t.status}</div>
            </div>

            <div className="flex-grow">
                <div className="bg-[#020617]/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden group-hover:bg-[#020617] transition-colors mb-8">
                    <AlertCircle className={`absolute -right-2 -bottom-2 w-12 h-12 opacity-5 ${t.type === 'EMERGENCY' ? 'text-red-400' : 'text-blue-400'}`} />
                    <p className="text-gray-300 text-sm leading-relaxed italic font-medium relative z-10">"{t.description}"</p>
                </div>
            </div>
            
            <div className="mt-auto">
              {t.status === "Pending" ? (
                 <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-5">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> Select Field Engineering Unit
                        </label>
                        <span className="text-[10px] font-bold text-gray-700 uppercase">{team.length} Ready</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                       <div className="flex-grow relative group/sel">
                          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover/sel:text-red-400 transition-colors" />
                          <select 
                             className="w-full bg-[#020617] border border-white/5 group-hover/sel:border-red-500/30 pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-red-500/5 rounded-2xl text-xs font-bold text-white appearance-none cursor-pointer"
                             value={assignSelect[t.id] || ""}
                             onChange={(e) => setAssignSelect({...assignSelect, [t.id]: e.target.value})}
                          >
                              <option value="">- Identify Technician -</option>
                              {team.map(w => <option key={w.id} value={w.id}>{w.username} • {w.subworker_profile?.job_title.toUpperCase()}</option>)}
                          </select>
                       </div>
                       <button 
                         onClick={() => handleAssign(t.id)} 
                         className="group bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/10"
                       >
                          <span className="text-[10px] font-black uppercase tracking-widest">Dispatch</span>
                          <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                       </button>
                    </div>
                 </div>
              ) : t.status === "Dispatched" ? (
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-blue-500/5 border border-blue-500/20 p-8 rounded-[2rem]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 animate-pulse">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Deployment Unit</p>
                            <p className="text-blue-400 font-black tracking-tight">{t.assignedWorkerName || "Unit Delta"}</p>
                        </div>
                    </div>
                    <button onClick={() => resolveTicket(t.id)}
                      className="w-full md:w-auto bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/30 px-8 py-4 rounded-2xl uppercase text-[10px] font-black tracking-widest flex items-center justify-center gap-3 transition">
                       Finalize Resolution
                    </button>
                 </div>
              ) : (
                 <div className="flex justify-between items-center border-t border-white/5 pt-8 mt-4">
                    <div className="flex flex-col">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Resolution Stamp</p>
                        <p className="text-xs text-gray-500 font-mono italic">{t.resolved_at ? new Date(t.resolved_at).toLocaleString() : ''}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Cleared</span>
                    </div>
                 </div>
              )}
            </div>
          </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* 🛸 Bottom Status */}
        <div className="pt-20 text-center">
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[1em]">Support Node Link • Hyderabad Hub 01</p>
        </div>
      </div>
    </div>
  );
}

export default AgentTickets;
