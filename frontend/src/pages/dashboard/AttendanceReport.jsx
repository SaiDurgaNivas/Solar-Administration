import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, UserCheck, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import api from "../../api/axiosConfig";

function AttendanceReport() {
  const [agents, setAgents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to current month
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, attendanceRes] = await Promise.all([
          api.get('users/'),
          api.get('attendance/')
        ]);
        
        // Filter agents and sub_workers
        const relevantUsers = (usersRes.data || []).filter(
          u => u.role === 'agent' || u.role === 'sub_worker'
        );
        
        setAgents(relevantUsers);
        setAttendance(attendanceRes.data || []);
      } catch (err) {
        console.error("Failed to load attendance report data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, year]);

  const getMonthlyStats = (workerId) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthlyRecords = attendance.filter(
      a => a.worker === workerId && a.date.startsWith(monthStr)
    );

    const present = monthlyRecords.filter(a => a.status === 'Present').length;
    const absent = monthlyRecords.filter(a => a.status === 'Absent').length;
    const leave = monthlyRecords.filter(a => a.status === 'On Leave').length;

    return { present, absent, leave, total: monthlyRecords.length };
  };

  const getDaysInMonth = () => {
    return new Date(year, month, 0).getDate();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                 <Calendar className="w-10 h-10 text-orange-400"/> Monthly Attendance Report
              </h1>
              <p className="text-gray-400 text-lg mt-2 font-medium">Review aggregated monthly attendance for all Agents and Workers</p>
            </div>
            
            <div className="flex gap-4 items-center bg-[#0f172a] border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                <select 
                    value={month} 
                    onChange={e => setMonth(parseInt(e.target.value))} 
                    className="bg-transparent border-none text-xl font-bold font-sans text-white focus:ring-0 outline-none"
                >
                    {Array.from({length: 12}).map((_, i) => (
                        <option key={i} value={i+1} className="bg-gray-800 text-sm">
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <div className="w-px h-6 bg-gray-700"></div>
                <select 
                    value={year} 
                    onChange={e => setYear(parseInt(e.target.value))} 
                    className="bg-transparent border-none text-xl font-bold font-sans text-white focus:ring-0 outline-none"
                >
                    {[2024, 2025, 2026, 2027].map(y => (
                        <option key={y} value={y} className="bg-gray-800 text-sm">{y}</option>
                    ))}
                </select>
            </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
           className="bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">Agents & Workers Overview</h2>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{getDaysInMonth()} Days in Month</span>
          </div>

          <div className="p-6 md:p-8">
            {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl"></div>)}
                </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-16">
                <UserCheck className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400">No Personnel Found</h3>
              </div>
            ) : (
              <div className="space-y-12">
                {/* AGENTS SECTION */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-px flex-1 bg-white/5"></div>
                     <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]">Agent Personnel</h3>
                     <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                          <th className="py-4 px-6 font-black w-1/3">Official Name</th>
                          <th className="py-4 px-4 font-black">Designation</th>
                          <th className="py-4 px-4 font-black text-center text-green-400">Present (Days)</th>
                          <th className="py-4 px-4 font-black text-center text-red-400">Absent (Days)</th>
                          <th className="py-4 px-4 font-black text-center text-yellow-400">Leaves</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agents.filter(u => u.role === 'agent').length === 0 ? (
                          <tr><td colSpan="5" className="py-10 text-center text-gray-600 text-sm font-bold">No Agents Logged</td></tr>
                        ) : agents.filter(u => u.role === 'agent').map((user) => {
                          const stats = getMonthlyStats(user.id);
                          return (
                            <tr key={user.id} className="hover:bg-white/5 transition group">
                              <td className="py-5 px-6 flex items-center gap-4 border-l-2 border-transparent group-hover:border-blue-500 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white shadow-lg transform group-hover:rotate-6 transition-transform">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-bold text-gray-200 capitalize tracking-tight">{user.username.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{user.email}</p>
                                </div>
                              </td>
                              <td className="py-5 px-4"><span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20 uppercase tracking-widest shadow-inner">Regional Agent</span></td>
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 font-black text-xs shadow-inner">
                                    <CheckCircle className="w-3.5 h-3.5"/> {stats.present}
                                </div>
                              </td>
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 font-black text-xs shadow-inner">
                                    <XCircle className="w-3.5 h-3.5"/> {stats.absent}
                                </div>
                              </td>
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20 font-black text-xs shadow-inner">
                                    <AlertCircle className="w-3.5 h-3.5"/> {stats.leave}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* WORKERS SECTION */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-px flex-1 bg-white/5"></div>
                     <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20 shadow-[0_0_15px_rgba(251,146,60,0.1)]">Field Specialists (Workers)</h3>
                     <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                          <th className="py-4 px-6 font-black w-1/3">Professional Name</th>
                          <th className="py-4 px-4 font-black">Status Rank</th>
                          <th className="py-4 px-4 font-black text-center text-green-400">Present (Days)</th>
                          <th className="py-4 px-4 font-black text-center text-red-400">Absent (Days)</th>
                          <th className="py-4 px-4 font-black text-center text-yellow-400">Leaves</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agents.filter(u => u.role === 'sub_worker').length === 0 ? (
                          <tr><td colSpan="5" className="py-10 text-center text-gray-600 text-sm font-bold">No Workers Logged</td></tr>
                        ) : agents.filter(u => u.role === 'sub_worker').map((user) => {
                          const stats = getMonthlyStats(user.id);
                          return (
                            <tr key={user.id} className="hover:bg-white/5 transition group">
                              <td className="py-5 px-6 flex items-center gap-4 border-l-2 border-transparent group-hover:border-orange-500 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center font-black text-white shadow-lg transform group-hover:-rotate-6 transition-transform">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-bold text-gray-200 capitalize tracking-tight">{user.username.replace(/_/g, ' ')}</p>
                                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{user.email}</p>
                                </div>
                              </td>
                              <td className="py-5 px-4"><span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-3 py-1 rounded-md border border-orange-500/20 uppercase tracking-widest shadow-inner">Field Op</span></td>
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 font-black text-xs shadow-inner">
                                    <CheckCircle className="w-3.5 h-3.5"/> {stats.present}
                                </div>
                              </td>
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 font-black text-xs shadow-inner">
                                    <XCircle className="w-3.5 h-3.5"/> {stats.absent}
                                </div>
                              </td>
                              <td className="py-5 px-4 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20 font-black text-xs shadow-inner">
                                    <AlertCircle className="w-3.5 h-3.5"/> {stats.leave}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AttendanceReport;
