       import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserCheck, UserX, UserMinus, Briefcase, PlusCircle, CheckCircle, X, Trash2 } from "lucide-react";
import api from "../../api/axiosConfig";

function Agents() {
  const [agents, setAgents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ username: '', email: '', password: '', role: 'agent' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [agentsRes, attendanceRes] = await Promise.all([
        api.get('users/?role=agent'),
        api.get('attendance/')
      ]);
      setAgents(agentsRes.data || []);
      setAttendance(attendanceRes.data || []);
    } catch (err) {
      console.error("Failed to load agents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Django's strict username validator blocks spaces
      const safeUsername = newAgent.username.trim().replace(/\s+/g, '_').toLowerCase();
      
      await api.post('users/', { ...newAgent, username: safeUsername });
      showToast("Agent provisioned successfully!");
      setShowModal(false);
      setNewAgent({ username: '', email: '', password: '', role: 'agent' });
      fetchData();
    } catch (err) {
      console.error("Error creating agent:", err);
      const errMsg = err.response?.data?.detail || err.response?.statusText || "Network Error";
      showToast(`Failed to create agent: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const markAttendance = async (agentId, status) => {
    try {
      await api.post('attendance/', {
        worker: agentId,  // backend still uses 'worker' foreign key name
        status: status
      });
      showToast(`Successfully marked ${status}!`);
      fetchData(); // Refresh to show updated log
    } catch (error) {
      if (error.response && error.response.status === 400) {
        showToast("Attendance already logged for today!");
      } else {
        showToast("Error processing attendance.");
      }
    }
  };

  const handleRemoveAgent = async (id) => {
    if (!window.confirm("Are you sure you want to remove this Agent? This cannot be undone.")) return;
    try {
      await api.delete(`users/${id}/`);
      showToast("Agent removed successfully!");
      fetchData();
    } catch(error) {
      console.error(error);
      const errMsg = error.response?.data?.detail || error.response?.statusText || "Network Error";
      showToast(`Failed to remove agent: ${errMsg}`);
    }
  };

  // Helper to find today's status for an agent
  const getTodayStatus = (agentId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const record = attendance.find(a => a.worker === agentId && a.date === todayStr);
    return record ? record.status : "Unmarked";
  };

  const generateCredentials = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setNewAgent({
      username: `Agent_${randomId}`,
      email: `agt${randomId}@solar.com`,
      password: `pass${randomId}!`,
      role: 'agent'
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
            <motion.div 
                initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-gray-900 border border-white/20 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-bold text-gray-200">{toast}</span>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Add Agent Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-2">Provision Elite Agent</h2>
              <p className="text-sm text-gray-400 mb-6 font-semibold">Generate a secure ID & Password block.</p>
              
              <button 
                  type="button" 
                  onClick={generateCredentials}
                  className="w-full mb-6 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"
              >
                 <PlusCircle className="w-5 h-5" /> Auto-Generate Credentials
              </button>

              <form onSubmit={handleAddAgent} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Agent Profile Name</label>
                  <input type="text" required value={newAgent.username} onChange={e => setNewAgent({...newAgent, username: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="e.g. Regional Manager A" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Generated ID (Email Login)</label>
                  <input type="email" required value={newAgent.email} onChange={e => setNewAgent({...newAgent, email: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-orange-400 font-mono tracking-widest focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="agent101@solar.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Access Passcode</label>
                  <input type="text" required value={newAgent.password} onChange={e => setNewAgent({...newAgent, password: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-orange-400 font-mono tracking-widest focus:ring-2 focus:ring-orange-500/50 outline-none" placeholder="••••••••" />
                </div>
                
                <button type="submit" disabled={submitting} className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-extrabold tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition duration-300 disabled:opacity-50 uppercase">
                  {submitting ? "Deploying..." : "Assign Agent Role"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                 <Briefcase className="w-10 h-10 text-orange-400"/> Remote Agents Command
              </h1>
              <p className="text-gray-400 text-lg mt-2 font-medium">Manage corporate agents and track participation</p>
            </div>
            
            {/* Quick Stats & Actions */}
            <div className="flex gap-4 items-center">
               <div className="bg-[#0f172a] border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                  <Users className="w-6 h-6 text-orange-400"/>
                  <div>
                     <p className="text-xl font-bold">{agents.length}</p>
                     <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Active Agents</p>
                  </div>
               </div>
               <button onClick={() => setShowModal(true)} className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 px-5 py-3.5 rounded-2xl flex items-center gap-2 font-bold transition shadow-inner">
                  <PlusCircle className="w-5 h-5"/> Provision Agent
               </button>
            </div>
        </motion.div>

        {/* Agents Table */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
           className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">Agent Directory</h2>
          </div>

          <div className="p-6 md:p-8">
            {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">No Corporate Agents Found</h3>
                <p className="text-gray-500 mt-2">Click Provision Agent above to recruit your first agent into the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                      <th className="py-4 px-4 font-semibold w-1/3">Agent Identity</th>
                      <th className="py-4 px-4 font-semibold">Today's Presence</th>
                      <th className="py-4 px-4 font-semibold text-right">Log Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {agents.map((agent) => {
                      const todayStatus = getTodayStatus(agent.id);
                      
                      // Compute Badge Color Based on Live Status
                      let badgeColor = "bg-gray-500/10 text-gray-400 border-gray-500/20";
                      let StatusIcon = Users;
                      if (todayStatus === "Present") {
                          badgeColor = "bg-green-500/10 text-green-400 border-green-500/20";
                          StatusIcon = UserCheck;
                      } else if (todayStatus === "Absent") {
                          badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                          StatusIcon = UserX;
                      } else if (todayStatus === "On Leave") {
                          badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                          StatusIcon = UserMinus;
                      }

                      return (
                        <tr key={agent.id} className="hover:bg-white/5 transition group">
                          
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black shadow-lg">
                                    {agent.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-200 text-lg capitalize">{agent.username.replace(/_/g, ' ')}</p>
                                    <p className="text-sm text-gray-500">{agent.email}</p>
                                </div>
                             </div>
                          </td>

                          <td className="py-5 px-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold shadow-inner ${badgeColor}`}>
                               <StatusIcon className="w-4 h-4" /> {todayStatus}
                            </div>
                          </td>

                          <td className="py-5 px-4 text-right">
                             <div className="flex justify-end gap-2 items-center">
                                <button 
                                    onClick={() => markAttendance(agent.id, "Present")}
                                    className="px-3 py-2 hover:bg-green-500 hover:text-white border border-green-500/30 text-green-400 rounded-lg text-xs font-bold transition"
                                >
                                    Present
                                </button>
                                <button 
                                    onClick={() => markAttendance(agent.id, "Absent")}
                                    className="px-3 py-2 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 rounded-lg text-xs font-bold transition"
                                >
                                    Absent
                                </button>
                                <button 
                                    onClick={() => markAttendance(agent.id, "On Leave")}
                                    className="px-3 py-2 hover:bg-yellow-500 hover:text-black border border-yellow-500/30 text-yellow-400 rounded-lg text-xs font-bold transition"
                                >
                                    Leave
                                </button>
                                <button
                                    onClick={() => handleRemoveAgent(agent.id)}
                                    className="p-2 ml-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 rounded-lg transition"
                                    title="Remove Agent"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Agents;
