import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, CheckCircle, Package, ArrowRight, ShieldAlert, MapPin, X } from "lucide-react";
import api from "../../api/axiosConfig";

function WorkingStatus() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingPhoto, setViewingPhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tasksRes] = await Promise.all([
          api.get('users/'),
          api.get('teamtasks/')
        ]);
        
        setUsers(usersRes.data || []);
        setTasks(tasksRes.data || []);
      } catch (err) {
        console.error("Failed to load working status data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserName = (id) => {
    const u = users.find(user => user.id === id);
    return u ? u.username.replace(/_/g, ' ') : 'Unknown';
  };

  const getUserRole = (id) => {
    const u = users.find(user => user.id === id);
    return u ? u.role : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                 <Activity className="w-10 h-10 text-purple-400"/> Live Working Status
              </h1>
              <p className="text-gray-400 text-lg mt-2 font-medium">Real-time status monitor of Agent assignments and Sub-worker tasks</p>
            </div>
            
            <div className="flex gap-4 items-center bg-[#0f172a] border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
               <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">{tasks.length}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Tasks</span>
               </div>
            </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
           className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">Current Task Deployments</h2>
          </div>

          <div className="p-6 md:p-8">
            {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl"></div>)}
                </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16">
                <ShieldAlert className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">No Active Tasks</h3>
                <p className="text-gray-500 mt-2">There are currently no tasks or deployments logged in the system.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/60 transition group">
                      
                      <div className="flex justify-between items-start mb-4">
                         <div className="space-y-1">
                             <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold tracking-wider inline-flex items-center gap-1">
                                <Package className="w-3 h-3" /> {task.task_type || "Installation"}
                             </span>
                             <h3 className="text-xl font-bold text-gray-100">{task.description || "General Task"}</h3>
                         </div>
                         
                         {task.status === 'Completed' ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                         ) : task.status === 'Pending' ? (
                            <Clock className="w-6 h-6 text-yellow-500" />
                         ) : (
                            <Activity className="w-6 h-6 text-orange-500" />
                         )}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-700/50">
                          {/* Target Location */}
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex gap-3 items-center mb-2">
                              <MapPin className="w-4 h-4 text-orange-500" />
                              <div>
                                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Target Location</p>
                                  <p className="text-xs text-gray-300 font-medium">{task.address || "Location Pending"}</p>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {task.agent && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                                        {getUserName(task.agent).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-gray-300 capitalize">{getUserName(task.agent)}</p>
                                       <p className="text-[10px] text-gray-500 tracking-wider font-bold">AGENT</p>
                                    </div>
                                </div>
                            )}

                            {task.sub_worker && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                                        {getUserName(task.sub_worker).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-gray-300 capitalize">{getUserName(task.sub_worker)}</p>
                                       <p className="text-[10px] text-gray-500 tracking-wider font-bold">WORKER</p>
                                    </div>
                                </div>
                            )}
                          </div>

                          {/* MISSION LOGS (Worker Updates) */}
                          {task.updates?.length > 0 && (
                            <div className="mt-2 space-y-2 pt-3 border-t border-white/5">
                                <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                                     <Activity className="w-3 h-3 text-purple-400" /> Live Updates & Photos
                                </h4>
                                <div className="space-y-2">
                                    {task.updates.map((update, idx) => (
                                        <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 flex gap-3 items-center group/log">
                                            {update.photo && (
                                              <div 
                                                onClick={() => setViewingPhoto(update.photo)} 
                                                className="shrink-0 cursor-pointer"
                                              >
                                                <img src={update.photo} className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover/log:border-purple-400 transition-colors shadow-lg" alt="Field" />
                                              </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-gray-200 font-medium leading-tight">{update.description}</p>
                                                <p className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">
                                                    {new Date(update.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                          )}
                      </div>

                  </div>
                ))}
              </div>
            )}
          </div>

      {/* Image Viewer Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10" onClick={() => setViewingPhoto(null)}>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    src={viewingPhoto} 
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] border border-white/10" 
                    alt="Enlarged view" 
                />
                <button 
                  onClick={() => setViewingPhoto(null)}
                  className="absolute top-0 -right-12 bg-white/10 hover:bg-red-500 p-2 rounded-full text-white transition-all backdrop-blur-md"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default WorkingStatus;
