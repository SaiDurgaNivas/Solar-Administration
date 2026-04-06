import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, MapPin, CheckCircle, Activity, Power, CalendarCheck, Flag, FileText, User as UserIcon, Bell, Camera, Image as ImageIcon, Send, Clock, CalendarDays } from 'lucide-react';
import api from '../api/axiosConfig';
import { useLiveTime } from '../hooks/useLiveTime';

const Target = MapPin;

function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [updateText, setUpdateText] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [vacationNote, setVacationNote] = useState('');
  
  const user = JSON.parse(sessionStorage.getItem('solar_user')) || {};
  const assignedCount = tasks.filter((task) => ['Dispatched', 'In Progress'].includes(task.status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const { timeString, dateString, greeting } = useLiveTime();

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Welcome to Field Dashboard', message: 'Keep your attendance updated daily. Admin continuously monitors the logs.', date: new Date().toLocaleDateString(), type: 'system' },
    { id: 2, title: 'Safety Guidelines', message: 'Ensure safety harness and helmets are worn during installation.', date: new Date().toLocaleDateString(), type: 'alert' }
  ];

  const fetchTasks = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`teamtasks/?sub_worker=${user.id}`);
      setTasks(res.data);
      
      // Also fetch local maintenance tickets dispatched to this worker
      const savedTickets = JSON.parse(sessionStorage.getItem('solar_tickets')) || [];
      const myTickets = savedTickets.filter(t => t.assignedWorkerId === user.id);
      setTickets(myTickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchAttendance = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`attendance/?worker_id=${user.id}`);
      setAttendance([...res.data].reverse()); // Reverse to show latest first
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAttendance();
  }, [user?.id]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    try {
      await api.patch(`teamtasks/${taskId}/`, { status: newStatus });
      if (newStatus === 'Completed' && task?.booking_details?.id) {
        await api.patch(`bookings/${task.booking_details.id}/`, { status: 'Completed' });
      }
      fetchTasks();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const markTicketResolved = (ticketId) => {
    const savedTickets = JSON.parse(sessionStorage.getItem('solar_tickets')) || [];
    const updated = savedTickets.map(t => 
      t.id === ticketId ? { ...t, status: 'Resolved', resolvedAt: new Date().toISOString() } : t
    );
    sessionStorage.setItem('solar_tickets', JSON.stringify(updated));
    fetchTasks();
    alert("Maintenance Ticket Resolved Successfully!");
  };

  const postAttendance = async (status) => {
    if (!user?.id) return;
    try {
      await api.post('attendance/', { worker: user.id, status });
      await fetchAttendance();
      alert(`Attendance marked as ${status}.`);
    } catch (err) {
      alert('Failed to update attendance. You might have already marked it for today.');
    }
  };

  const requestVacation = async () => {
    if (!vacationNote.trim()) {
      alert('Please describe your vacation request.');
      return;
    }
    try {
      await api.post('attendance/', { worker: user.id, status: 'On Leave' });
      setVacationNote('');
      await fetchAttendance();
      alert('Vacation request submitted.');
    } catch (err) {
      alert('Failed to submit vacation request.');
    }
  };

  const submitUpdate = async (taskId) => {
    if (!updateText || !updatePhoto) {
      alert('Please provide both a description and a photo.');
      return;
    }
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('task', taskId);
    formData.append('description', updateText);
    formData.append('photo', updatePhoto);

    try {
      await api.post('workerupdates/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUpdateText('');
      setUpdatePhoto(null);
      alert('Update uploaded successfully!');
      fetchTasks();
    } catch (err) {
      alert('Failed to post update.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('solar_user');
    window.location.href = '/';
  };

  const statusColor = (status) => {
    if (status === 'Completed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (status === 'In Progress') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (status === 'On Leave') return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    if (status === 'Absent') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (status === 'Present') return 'text-green-400 bg-green-500/10 border-green-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const todayRecord = attendance.find((record) => record.date === today);
  const attendanceStatus = todayRecord ? todayRecord.status : 'Not marked';

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* HEADER NAVBAR */}
      <div className="bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2.5 rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/20">
              <HardHat className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-300">
                {greeting}, {user.username || 'Worker'}
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">Authorized Worker Portal v2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden bg-[#020617] border border-white/10 px-4 py-2.5 rounded-full shadow-inner md:flex items-center gap-3">
              <Clock className="w-4 h-4 text-orange-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
              <span className="text-sm font-semibold tracking-wider font-mono text-cyan-400">{timeString}</span>
              <span className="text-xs tracking-widest uppercase font-bold text-gray-500 border-l border-white/10 pl-3">{dateString}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-red-500/20">
              <Power className="w-4 h-4" /> Disconnect
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TABS NAVIGATION */}
        <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-10 bg-[#0f172a]/50 p-2 rounded-3xl border border-white/5">
          {[
            { id: 'tasks', label: 'Work Assignments', icon: FileText, badge: assignedCount > 0 ? assignedCount : null },
            { id: 'attendance', label: 'Attendance & Leave', icon: CalendarDays },
            { id: 'notifications', label: 'Updates & Alerts', icon: Bell, badge: notifications.length },
            { id: 'profile', label: 'My Data', icon: UserIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[170px] flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-500 text-[#020617] shadow-[0_0_25px_rgba(249,115,22,0.35)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" /> {tab.label}
              {tab.badge ? <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id ? 'bg-[#020617] text-orange-400' : 'bg-orange-500 text-white'}`}>{tab.badge}</span> : null}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Active Deployments</h2>
                <span className="text-sm font-semibold px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/10">
                  <Activity className="w-4 h-4 animate-pulse" /> Live Tracking
                </span>
              </div>

              {loadingTasks ? (
                 <div className="py-20 flex justify-center"><Activity className="w-12 h-12 animate-spin text-orange-500" /></div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-24 bg-[#0f172a] rounded-3xl border border-dashed border-white/10">
                  <div className="inline-block p-6 bg-white/5 rounded-full mb-4 ring-8 ring-white/5">
                    <FileText className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No Deployments Found</h3>
                  <p className="text-gray-400 text-sm">You have no active installation assignments at the moment. Stand by for agent dispatch.</p>
                </div>
              ) : (
                <div className="grid xl:grid-cols-2 gap-8">
                  {tasks.map((task) => (
                     <div key={task.id} className="bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-7 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-500">
                        <div>
                          <div className="flex justify-between items-start mb-5 gap-4">
                            <div>
                              <span className="text-xs font-black uppercase text-orange-500 tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Booking #{task.booking}</span>
                              <h3 className="text-xl font-bold mt-4">Solar Installation Site</h3>
                            </div>
                            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border shadow-lg ${statusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>

                          <div className="bg-[#020617] p-5 rounded-2xl flex items-start gap-4 border border-white/5 mb-6 shadow-inner">
                            <div className="bg-orange-500/10 p-2 rounded-full border border-orange-500/20">
                              <MapPin className="w-5 h-5 text-orange-400 shrink-0" />
                            </div>
                            <p className="text-sm text-gray-300 font-medium leading-relaxed pt-1">{task.location_link || 'Location coordinates pending...'}</p>
                          </div>

                          {/* Existing Updates Log */}
                          {task.updates && task.updates.length > 0 && (
                            <div className="mb-6 space-y-4">
                              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Mission Logs</h4>
                              {task.updates.map((up) => (
                                <div key={up.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                  {up.photo ? <img src={up.photo} alt="log" className="w-16 h-16 object-cover rounded-xl border border-white/10 shadow-md" /> : <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/5"><ImageIcon className="w-6 h-6 text-gray-500"/></div>}
                                  <div>
                                    <p className="text-sm font-medium text-gray-200">{up.description}</p>
                                    <p className="text-[10px] text-gray-500 font-mono mt-1 font-bold">{new Date(up.timestamp).toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action Area */}
                        <div className="mt-4 pt-6 border-t border-white/10">
                          {task.status === 'Dispatched' && (
                            <button onClick={() => handleUpdateStatus(task.id, 'In Progress')} className="w-full py-4 rounded-2xl font-black tracking-wide bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-3">
                              <Target className="w-6 h-6" /> Arrived at Location
                            </button>
                          )}

                          {task.status === 'In Progress' && (
                            <div className="space-y-5">
                              <div className="bg-[#020617] p-5 rounded-3xl border border-white/5 shadow-inner">
                                <h4 className="text-xs font-black text-orange-400 uppercase mb-4 text-center tracking-widest">Log Work Progress</h4>
                                <textarea
                                  placeholder="What was completed today?..."
                                  className="w-full bg-white/5 text-sm p-4 rounded-2xl outline-none border border-white/10 focus:border-orange-500 text-white mb-4 h-28 resize-none transition-colors"
                                  onChange={(e) => setUpdateText(e.target.value)}
                                  value={updateText}
                                />
                                <div className="relative mb-5">
                                  <input type="file" accept="image/*" id={`file-${task.id}`} className="hidden" onChange={(e) => setUpdatePhoto(e.target.files[0])} />
                                  <label htmlFor={`file-${task.id}`} className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-white/20 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/5 rounded-2xl cursor-pointer text-sm font-semibold transition-all text-gray-400">
                                    <Camera className="w-5 h-5 flex-shrink-0" /> <span className="truncate max-w-[200px]">{updatePhoto ? updatePhoto.name : 'Capture Site Photo'}</span>
                                  </label>
                                </div>
                                <button onClick={() => submitUpdate(task.id)} disabled={isUpdating} className="w-full bg-orange-500 hover:bg-orange-400 text-[#020617] font-black tracking-wider py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none">
                                  {isUpdating ? <Activity className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5"/> Submit Mission Log</>}
                                </button>
                              </div>
                              <button onClick={() => handleUpdateStatus(task.id, 'Completed')} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-emerald-500 to-green-500 text-[#020617] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                <CheckCircle className="w-6 h-6" /> Sign Off Assignment
                              </button>
                            </div>
                          )}

                          {task.status === 'Completed' && (
                             <div className="w-full py-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center gap-3">
                               <CheckCircle className="w-6 h-6" /> Installation Cycle Complete
                             </div>
                          )}
                        </div>
                     </div>
                  ))}
                  
                  {/* Maintenance Tickets Section */}
                  {tickets.map(ticket => (
                     <div key={ticket.id} className="bg-gradient-to-b from-red-950/40 to-[#020617] border border-red-500/20 rounded-3xl p-7 shadow-2xl flex flex-col justify-between hover:border-red-500/40 transition-all duration-500">
                        <div>
                          <div className="flex justify-between items-start mb-5 gap-4">
                            <div>
                              <span className="text-xs font-black uppercase text-red-400 tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Maintenance: {ticket.type}</span>
                              <h3 className="text-xl font-bold mt-4">{ticket.customerName}</h3>
                            </div>
                            <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-full border shadow-lg ${ticket.status === 'Resolved' ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-blue-400 bg-blue-500/10 border-blue-500/30'}`}>
                              {ticket.status}
                            </span>
                          </div>

                          <div className="bg-[#020617] p-5 rounded-2xl flex items-start gap-4 border border-red-500/10 mb-6 shadow-inner text-gray-300 text-sm italic">
                            "{ticket.description}"
                          </div>
                        </div>

                        {/* Action Area */}
                        <div className="mt-4 pt-6 border-t border-red-500/20">
                          {ticket.status !== 'Resolved' ? (
                            <button onClick={() => markTicketResolved(ticket.id)} className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-green-500 to-emerald-400 text-[#020617] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3">
                              <CheckCircle className="w-6 h-6" /> Mark Problem Fixed
                            </button>
                          ) : (
                            <div className="w-full py-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center gap-3">
                               <CheckCircle className="w-6 h-6" /> Ticket Closed At Site
                             </div>
                          )}
                        </div>
                     </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
             <motion.div key="attendance" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
               <div className="space-y-8">
                 {/* Mark Attendance */}
                 <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><CalendarCheck className="text-orange-400 w-6 h-6" /> Daily Check-in</h2>
                   <div className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 text-center mb-6 shadow-inner">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Today's Status</p>
                     <p className={`text-3xl font-black ${statusColor(attendanceStatus).split(' ')[0]}`}>{attendanceStatus}</p>
                   </div>
                   <div className="space-y-4">
                     <button onClick={() => postAttendance('Present')} className="w-full py-4 rounded-xl font-black tracking-wide bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-black transition-all shadow-lg hover:shadow-green-500/20 active:scale-95">Verify Present</button>
                     <button onClick={() => postAttendance('Absent')} className="w-full py-4 rounded-xl font-black tracking-wide bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-black transition-all shadow-lg hover:shadow-red-500/20 active:scale-95">Report Absent</button>
                   </div>
                 </div>

                 {/* Leave Request */}
                 <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                   <h2 className="text-xl font-bold mb-4 flex items-center gap-3"><Flag className="text-purple-400 w-6 h-6" /> Request Leave</h2>
                   <p className="text-sm text-gray-400 mb-6 leading-relaxed">Submit a reason to request time off from active assignments. Logs will be updated.</p>
                   <textarea
                     value={vacationNote} onChange={(e) => setVacationNote(e.target.value)}
                     placeholder="State your reason for absence..."
                     className="w-full bg-[#020617] text-sm p-5 rounded-2xl outline-none border border-white/10 focus:border-purple-500 text-white mb-5 h-32 resize-none transition-colors"
                   />
                   <button onClick={requestVacation} className="w-full py-4 rounded-xl font-black tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-black transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-2">
                     <Send className="w-4 h-4" /> Submit Request
                   </button>
                 </div>
               </div>

               {/* Full Attendance List */}
               <div className="bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-[85vh]">
                 <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                   <h2 className="text-2xl font-bold flex items-center gap-3"><CalendarDays className="text-blue-400 w-7 h-7" /> Attendance Register</h2>
                   <p className="text-sm text-gray-400 mt-2">Full historical chronolog of your operational status.</p>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {loadingAttendance ? (
                      <div className="py-20 flex justify-center"><Activity className="w-10 h-10 animate-spin text-blue-500" /></div>
                    ) : attendance.length === 0 ? (
                      <div className="py-20 text-center text-gray-500">No attendance data found.</div>
                    ) : (
                      attendance.map((record, idx) => (
                        <div key={record.id || idx} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#020617] hover:bg-white/5 transition-all duration-300 rounded-2xl border border-white/5 hover:border-white/10">
                           <div className="flex items-center gap-5 mb-3 sm:mb-0">
                             <div className="bg-[#0f172a] w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-colors">
                               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{new Date(record.date).toLocaleString('en-us', { month: 'short' })}</span>
                               <span className="text-lg font-black text-white leading-none mt-1">{new Date(record.date).getDate()}</span>
                             </div>
                             <div>
                               <p className="font-bold text-gray-200 text-lg">{record.date}</p>
                               <span className="text-xs text-gray-500 font-mono tracking-widest">LOG ID: #{record.id || idx + 1000}</span>
                             </div>
                           </div>
                           <span className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-full border shadow-md w-fit ${statusColor(record.status)}`}>{record.status}</span>
                        </div>
                      ))
                    )}
                 </div>
               </div>
             </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
             <motion.div key="notifications" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
               <div className="max-w-4xl mx-auto">
                 <div className="flex items-center gap-3 mb-8">
                    <Bell className="w-8 h-8 text-yellow-400" />
                    <h2 className="text-2xl font-bold">Operations Desk Updates</h2>
                 </div>
                 <div className="space-y-5">
                    {notifications.map((note) => (
                      <div key={note.id} className="bg-[#0f172a] p-7 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row gap-6 hover:border-white/20 transition-colors">
                         <div className={`p-4 rounded-2xl h-fit flex-shrink-0 border ${note.type === 'alert' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                           <Bell className="w-7 h-7" />
                         </div>
                         <div className="w-full">
                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                             <h3 className="text-xl font-bold text-white">{note.title}</h3>
                             <span className="px-3 py-1 bg-[#020617] rounded-full text-[11px] font-black tracking-widest text-gray-400 border border-white/5">{note.date}</span>
                           </div>
                           <p className="text-gray-400 leading-relaxed text-sm bg-[#020617] p-4 rounded-2xl border border-white/5">{note.message}</p>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
             </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
             <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto">
               <div className="bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
                 <div className="h-40 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 flex items-end p-8 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay opacity-30"></div>
                    <div className="w-32 h-32 bg-[#020617] rounded-full border-[6px] border-[#0f172a] flex items-center justify-center transform translate-y-1/2 relative z-10 shadow-2xl">
                      <UserIcon className="w-14 h-14 text-orange-400" />
                    </div>
                 </div>
                 <div className="p-8 pt-20">
                   <h2 className="text-3xl font-black text-white tracking-tight">{user.first_name || user.username || 'Field Specialist'}</h2>
                   <p className="text-orange-400 font-black uppercase tracking-widest text-sm mt-1 mb-10 flex items-center gap-2">
                     <HardHat className="w-4 h-4" /> {user.role || 'Sub Worker'} Division
                   </p>

                   <div className="space-y-4 border-t border-white/10 pt-8">
                     {[
                       { label: 'System ID', value: user.id || 'N/A' },
                       { label: 'Username', value: user.username || 'N/A' },
                       { label: 'Email Access', value: user.email || 'Not configured' },
                       { label: 'Clearance Date', value: user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Active' },
                     ].map((info, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_2fr] items-center p-5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/5">
                          <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">{info.label}</span>
                          <span className="text-white font-bold text-lg">{info.value}</span>
                        </div>
                     ))}
                   </div>
                 </div>
               </div>
             </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

export default WorkerDashboard;
