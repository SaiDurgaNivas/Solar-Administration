import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, ShieldAlert, Users, Target, BarChart2 } from "lucide-react";
import api from "../api/axiosConfig";

const AgentTeamReports = () => {
  const [team, setTeam] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("solar_user"));
      const [teamRes, attRes, tasksRes] = await Promise.all([
        api.get(`users/?agent_id=${user.id}`),
        api.get("attendance/"),
        api.get("teamtasks/")
      ]);
      setTeam(teamRes.data || []);
      setAllAttendance(attRes.data || []);
      // Filter tasks managed by this agent
      setTasks((tasksRes.data || []).filter(t => t.agent === user.id));
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(sessionStorage.getItem("solar_user"));
  
  // ✅ 1. Agent's Own Monthly Attendance
  const myAttendance = allAttendance.filter(a => a.worker === user.id);
  const myPresentDays = myAttendance.filter(a => a.status === 'Present').length;
  const myAbsentDays = myAttendance.filter(a => a.status === 'Absent').length;
  
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  // ✅ 2. Team Performance Aggregation
  const getWorkerStats = (workerId) => {
    const wAtt = allAttendance.filter(a => a.worker === workerId);
    const present = wAtt.filter(a => a.status === 'Present').length;
    
    const wTasks = tasks.filter(t => t.sub_worker === workerId);
    const completed = wTasks.filter(t => t.status === 'Completed').length;
    
    return { present, totalTasks: wTasks.length, completed };
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
          <BarChart2 className="w-10 h-10 text-orange-400" /> Duty Logs & Reports
        </h1>
        <p className="text-gray-400 text-sm mt-2 font-medium uppercase tracking-widest">Tracking Your Performance & Field Squad</p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 relative z-10">
        
        {/* COLUMN 1: Agent's Monthly Attendance */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-1 border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl h-fit border-l-4 border-l-orange-500"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500/10 rounded-xl">
               <Calendar className="w-6 h-6 text-orange-400" />
            </div>
            <div>
               <h2 className="text-xl font-bold">My Ledger</h2>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{currentMonthName} Roll</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#020617] p-4 rounded-xl border border-green-500/20 text-center shadow-inner">
               <span className="block text-3xl font-black text-green-400 mb-1">{myPresentDays}</span>
               <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Days Present</span>
            </div>
            <div className="bg-[#020617] p-4 rounded-xl border border-red-500/20 text-center shadow-inner">
               <span className="block text-3xl font-black text-red-400 mb-1">{myAbsentDays}</span>
               <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Days Absent</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-white/5 pb-2">Recent Log History</h3>
            {loading ? <p className="text-gray-500 text-sm">Loading ledger...</p> : myAttendance.length === 0 ? <p className="text-gray-500 text-xs">No records found for this month.</p> : myAttendance.slice().reverse().slice(0, 7).map((rec, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 text-sm">
                 <span className="font-mono text-gray-300">{rec.date}</span>
                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    rec.status === 'Present' ? 'bg-green-500/10 text-green-400' : 
                    rec.status === 'Absent' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                 }`}>
                   {rec.status}
                 </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* COLUMN 2 & 3: Field Worker Tracking */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
               <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
               <h2 className="text-xl font-bold">Worker Reports & Tracking</h2>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Monitor Field Squad Productivity</p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="animate-pulse space-y-4">
                 <div className="h-24 border border-white/10 rounded-xl bg-white/5"></div>
                 <div className="h-24 border border-white/10 rounded-xl bg-white/5"></div>
               </div>
            ) : team.length === 0 ? (
               <div className="text-center py-12">
                 <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                 <h3 className="text-gray-400 font-semibold">No assigned field workers found.</h3>
                 <p className="text-xs text-gray-500 mt-1">Add them via your dashboard.</p>
               </div>
            ) : team.map(worker => {
               const stats = getWorkerStats(worker.id);
               // Find their current duty task if any
               const activeTask = tasks.find(t => t.sub_worker === worker.id && t.status !== 'Completed');

               return (
                 <div key={worker.id} className="bg-[#020617] border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row gap-6 items-center shadow-lg hover:border-cyan-500/30 transition-all">
                    
                    {/* Worker Identity */}
                    <div className="flex flex-col items-center justify-center min-w-[120px] pr-6 md:border-r border-white/5">
                        <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-black text-[#020617] mb-2 shadow-lg">
                           {worker.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white text-center capitalize">{worker.username.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-1">
                           {worker.subworker_profile?.job_title || 'Worker'}
                        </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                       <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-green-400">{stats.present}</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Days Logged</span>
                       </div>
                       <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-blue-400">{stats.totalTasks}</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Total Assigned</span>
                       </div>
                       <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-purple-400">{stats.completed}</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Jobs Closed</span>
                       </div>
                       <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                          <span className="text-xl font-black text-yellow-400">{stats.totalTasks > 0 ? Math.round((stats.completed / (stats.totalTasks || 1)) * 100) + '%' : 'N/A'}</span>
                          <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">Efficiency</span>
                       </div>
                    </div>

                    {/* Live Tracking */}
                    <div className="min-w-[180px] bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/20 w-full md:w-auto">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2">
                           <Target className="w-3 h-3" /> Live Protocol
                        </span>
                        {activeTask ? (
                           <div className="text-sm font-semibold text-gray-200">
                              <span className="text-cyan-300 block mb-1">Status: {activeTask.status}</span>
                              <span className="text-gray-400 text-xs">At: {activeTask.location_link}</span>
                           </div>
                        ) : (
                           <div className="text-xs text-gray-500 font-semibold italic flex items-center gap-2">
                              <Clock className="w-4 h-4"/> Awaiting Dispatch
                           </div>
                        )}
                    </div>
                 </div>
               );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AgentTeamReports;
