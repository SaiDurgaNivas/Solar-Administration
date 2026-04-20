import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserCheck, UserX, UserMinus, HardHat, PlusCircle, CheckCircle, X, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../api/axiosConfig";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [newWorker, setNewWorker] = useState({ username: '', email: '', password: '', role: 'sub_worker' });
  const [submitting, setSubmitting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Tracking visibility per worker ID


  const fetchData = async () => {
    try {
      const [workersRes, attendanceRes] = await Promise.all([
        api.get('users/?role=sub_worker'),
        api.get('attendance/')
      ]);
      setWorkers(workersRes.data || []);
      setAttendance(attendanceRes.data || []);
    } catch (err) {
      console.error("Failed to load workers:", err);
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

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Django's strict username validator blocks spaces
      const safeUsername = newWorker.username.trim().replace(/\s+/g, '_').toLowerCase();
      
      await api.post('users/', { ...newWorker, username: safeUsername });
      showToast("Worker added to grid successfully!");
      setShowModal(false);
      setNewWorker({ username: '', email: '', password: '', role: 'sub_worker' });
      fetchData();
    } catch (err) {
      console.error("Error creating worker:", err);
      showToast("Failed to create worker.");
    } finally {
      setSubmitting(false);
    }
  };

  const markAttendance = async (workerId, status) => {
    try {
      await api.post('attendance/', {
        worker: workerId,
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

  const handleRemoveWorker = async (id) => {
    if (!Number.isInteger(id)) return console.error("Invalid ID");
    if (!window.confirm("Are you sure you want to remove this field worker? This cannot be undone.")) return;
    try {
      await api.delete(`users/${id}/`);
      showToast("Worker removed successfully!");
      fetchData();
    } catch(error) {
      console.error(error);
      const errMsg = error.response?.data?.detail || error.response?.statusText || "Network Error";
      showToast(`Failed to remove worker: ${errMsg}`);
    }
  };

  const updatePassword = async (id, newPass) => {
    if (!newPass) return;
    try {
      await api.patch(`users/${id}/`, { password: newPass });
      showToast("Password updated for worker!");
      fetchData();
    } catch (err) {
      showToast("Failed to update password.");
    }
  };

  // Helper to find today's status for a worker
  const getTodayStatus = (workerId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const record = attendance.find(a => a.worker === workerId && a.date === todayStr);
    return record ? record.status : "Unmarked";
  };

  const generateCredentials = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setNewWorker({
      username: `Worker_${randomId}`,
      email: `wrk${randomId}@solar.com`,
      password: `pass${randomId}!`,
      role: 'sub_worker'
    });
  };

  const handleUpdateWorkerProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`users/${selectedWorker.id}/`, {
        subworker_profile: {
          phone: selectedWorker.subworker_profile.phone,
          address: selectedWorker.subworker_profile.address,
          experience: selectedWorker.subworker_profile.experience
        }
      });
      showToast("Worker profile updated!");
      setShowViewModal(false);
      fetchData();
    } catch (err) {
      showToast("Update failed.");
    }
  };


  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
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

      {/* Add Worker Modal */}
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
              
              <h2 className="text-2xl font-bold text-white mb-2">Provision Field Worker</h2>
              <p className="text-sm text-gray-400 mb-6 font-semibold">Generate an ID & Password block to grant access.</p>
              
              <button 
                  type="button" 
                  onClick={generateCredentials}
                  className="w-full mb-6 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"
              >
                 <PlusCircle className="w-5 h-5" /> Auto-Generate Credentials
              </button>

              <form onSubmit={handleAddWorker} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Worker Deployment Name</label>
                  <input type="text" required value={newWorker.username} onChange={e => setNewWorker({...newWorker, username: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none" placeholder="e.g. Site Supervisor X" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Generated ID (Email Login)</label>
                  <input type="email" required value={newWorker.email} onChange={e => setNewWorker({...newWorker, email: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-cyan-400 font-mono tracking-widest focus:ring-2 focus:ring-cyan-500/50 outline-none" placeholder="worker20@solar.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Access Passcode</label>
                  <input type="text" required value={newWorker.password} onChange={e => setNewWorker({...newWorker, password: e.target.value})} className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-cyan-400 font-mono tracking-widest focus:ring-2 focus:ring-cyan-500/50 outline-none" placeholder="••••••••" />
                </div>
                
                <button type="submit" disabled={submitting} className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-extrabold tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition duration-300 disabled:opacity-50 uppercase">
                  {submitting ? "Deploying..." : "Assign Worker Role"}
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
                 <HardHat className="w-10 h-10 text-cyan-400"/> Field Workers Roll
              </h1>
              <p className="text-gray-400 text-lg mt-2 font-medium">Manage deployment teams and track daily attendance</p>
            </div>
            
            {/* Quick Stats & Actions */}
            <div className="flex gap-4 items-center">
               <div className="bg-[#0f172a] border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                  <Users className="w-6 h-6 text-cyan-400"/>
                  <div>
                     <p className="text-xl font-bold">{workers.length}</p>
                     <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Active Workers</p>
                  </div>
               </div>
               <button onClick={() => setShowModal(true)} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 px-5 py-3.5 rounded-2xl flex items-center gap-2 font-bold transition shadow-inner">
                  <PlusCircle className="w-5 h-5"/> Provision Worker
               </button>
            </div>
        </motion.div>

        {/* Workers Table */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
           className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">Daily Attendance Roster</h2>
          </div>

          <div className="p-6 md:p-8">
            {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-16">
                <HardHat className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">No Field Workers Found</h3>
                <p className="text-gray-500 mt-2">Click Add Worker above to provision your first field agent onto the grid.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                      <th className="py-4 px-4 font-semibold w-1/5">Worker Identity</th>
                      <th className="py-4 px-4 font-semibold w-1/5">Credentials</th>
                      <th className="py-4 px-4 font-semibold">Today's Status</th>
                      <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {workers.map((worker) => {
                      const todayStatus = getTodayStatus(worker.id);
                      
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
                        <tr key={worker.id} className="hover:bg-white/5 transition group">
                          
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
                                    {worker.username.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-bold text-gray-200 text-lg capitalize">{worker.username.replace(/_/g, ' ')}</h3>
                             </div>
                          </td>

                          <td className="py-5 px-4">
                              <div className="space-y-1">
                                 <p className="text-xs text-cyan-400 font-mono italic">ID: {worker.email}</p>
                                 <div className="flex items-center gap-2">
                                     <span className="text-[10px] text-gray-400 font-bold uppercase">Pass:</span>
                                     <div className="flex items-center gap-1 border-b border-white/10">
                                         <input 
                                            type={visiblePasswords[worker.id] ? "text" : "password"}
                                            defaultValue={worker.subworker_profile?.raw_password || "pass123!"}
                                            onBlur={(e) => {
                                                const newV = e.target.value;
                                                if (newV && newV !== worker.subworker_profile?.raw_password) {
                                                    updatePassword(worker.id, newV);
                                                }
                                            }}
                                            className="bg-transparent text-xs text-white font-mono focus:border-cyan-500 outline-none w-24 tracking-widest"
                                            title="Click to reset password"
                                         />
                                         <button 
                                            onClick={() => setVisiblePasswords(prev => ({...prev, [worker.id]: !prev[worker.id]}))}
                                            className="p-1 hover:text-cyan-400 text-gray-500 transition-colors"
                                         >
                                            {visiblePasswords[worker.id] ? <EyeOff size={12}/> : <Eye size={12}/>}
                                         </button>
                                     </div>
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
                                    onClick={() => { setSelectedWorker(worker); setShowViewModal(true); }}
                                    className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-xs font-bold transition"
                                >
                                    Details
                                </button>
                                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                                <button 
                                    onClick={() => markAttendance(worker.id, "Present")}
                                    className="px-3 py-2 hover:bg-green-500 hover:text-white border border-green-500/30 text-green-400 rounded-lg text-xs font-bold transition"
                                >
                                    P
                                </button>
                                <button 
                                    onClick={() => markAttendance(worker.id, "Absent")}
                                    className="px-3 py-2 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 rounded-lg text-xs font-bold transition"
                                >
                                    A
                                </button>
                                <button
                                    onClick={() => handleRemoveWorker(worker.id)}
                                    className="p-2 ml-1 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-400 rounded-lg transition"
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

      {/* View/Edit Worker Details Modal */}
      <AnimatePresence>
        {showViewModal && selectedWorker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-[2rem] shadow-2xl w-full max-w-lg relative">
                <button onClick={() => setShowViewModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition"><X className="w-5 h-5"/></button>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-black text-[#020617] shadow-xl">{selectedWorker.username[0].toUpperCase()}</div>
                   <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight capitalize">{selectedWorker.username.replace(/_/g, ' ')}</h2>
                      <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest">{selectedWorker.subworker_profile?.job_title || 'Field Worker'}</p>
                   </div>
                </div>

                <form onSubmit={handleUpdateWorkerProfile} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Phone Number</label>
                        <input 
                           type="text" 
                           value={selectedWorker.subworker_profile?.phone || ''} 
                           onChange={e => setSelectedWorker({...selectedWorker, subworker_profile: {...selectedWorker.subworker_profile, phone: e.target.value}})}
                           className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none transition" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Experience</label>
                        <select 
                           value={selectedWorker.subworker_profile?.experience || ''} 
                           onChange={e => setSelectedWorker({...selectedWorker, subworker_profile: {...selectedWorker.subworker_profile, experience: e.target.value}})}
                           className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none transition"
                        >
                           <option value="Junior">Junior</option>
                           <option value="Intermediate">Intermediate</option>
                           <option value="Senior">Senior</option>
                        </select>
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Full Address</label>
                      <textarea 
                         value={selectedWorker.subworker_profile?.address || ''} 
                         onChange={e => setSelectedWorker({...selectedWorker, subworker_profile: {...selectedWorker.subworker_profile, address: e.target.value}})}
                         className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none h-24 resize-none transition" 
                      />
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">System Login Details</p>
                      <p className="text-sm font-mono text-cyan-400 border-b border-white/5 pb-1 mb-1">Email: {selectedWorker.email}</p>
                      <p className="text-sm font-mono text-gray-300">Access: {selectedWorker.subworker_profile?.raw_password || "********"}</p>
                   </div>
                   <button type="submit" className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black py-4 rounded-xl shadow-xl hover:shadow-cyan-500/20 transition-all uppercase tracking-widest">Commit Profile Changes</button>
                </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default Workers;
