import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Wrench, MapPin, CheckCircle, Clock, Save, ShieldAlert, HardHat, PlusCircle, UserPlus, Zap, FileText, X, ArrowRight } from "lucide-react";
import api from "../api/axiosConfig";
import { useTickets } from "../context/TicketContext";
import { useLiveTime } from "../hooks/useLiveTime";

const AgentDashboard = () => {
  const [installations, setInstallations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDates, setConfirmDates] = useState({});
  const [confirmTimes, setConfirmTimes] = useState({});
  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
  ];
  const [team, setTeam] = useState([]);
  const [newWorkerFields, setNewWorkerFields] = useState({ username: '', email: '', password: '', job_title: 'worker' });
  const [dispatchInfo, setDispatchInfo] = useState({}); // { booking_id: { sub_worker_id, location_link } }
  const [configModal, setConfigModal] = useState({ open: false, bookingId: null });
  const [configData, setConfigData] = useState({
      current_bill: null, aadhar_card: null, pan_card: null, bank_details: null, house_tax: null, bank_statement_6m: null,
      panel_type: '', capacity: '', wire_type: '', battery_type: '', inverter_type: '', rod_type: '', rod_count: 0, panel_count: 0
  });

  const { tickets, resolveTicket } = useTickets();
  const { timeString, dateString, greeting } = useLiveTime();
  
  // Attendance State
  const [selfAttendance, setSelfAttendance] = useState(null);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [metricsModal, setMetricsModal] = useState({ open: false, title: '', content: null });

  // Fetch real data from Backend with High-Speed Auto-Refresh (Expo Mode)
  useEffect(() => {
    const fetchAll = () => {
      fetchInstallations();
      fetchAppointments();
      fetchTeam();
      fetchSelfAttendance();
      fetchTeamAttendance();
    };

    fetchAll();
    const interval = setInterval(fetchAll, 3000); // 3-second high-speed sync
    return () => clearInterval(interval);
  }, []);

  const fetchTeamAttendance = async () => {
    try {
      const res = await api.get('attendance/');
      const todayStr = new Date().toISOString().split('T')[0];
      setTeamAttendance(res.data.filter(a => a.date === todayStr));
    } catch (err) { console.error(err); }
  };

  const getUser = () => {
    try {
      const u = sessionStorage.getItem("solar_user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  };

  const fetchSelfAttendance = async () => {
    try {
        const user = getUser();
        if (!user) return;
        const res = await api.get('attendance/');
        const todayStr = new Date().toISOString().split('T')[0];
        const record = res.data.find(a => Number(a.worker) === Number(user.id) && a.date === todayStr);
        setSelfAttendance(record);
    } catch(err) { console.error(err); }
  };

  const logSelfAttendance = async (status) => {
    try {
        const user = getUser();
        if (!user) return;
        await api.post('attendance/', {
            worker: user.id,
            status: status
        });
        alert(`Attendance marked as ${status} for today!`);
        fetchSelfAttendance();
    } catch(err) {
        if(err.response?.status === 400) alert("Attendance already logged.");
        else alert("Failed to log attendance.");
    }
  };

  const handlePunchOut = async () => {
    if(!window.confirm("Are you sure you want to end your shift? Admin will be notified of your leave time.")) return;
    try {
        const leaveTime = new Date().toISOString();
        await api.patch(`attendance/${selfAttendance.id}/`, { 
            status: 'Shift Ended',
            punch_out_time: leaveTime
        });
        alert("Shift Ended successfully. Your leave time has been logged.");
        fetchSelfAttendance();
    } catch(err) {
        alert("Failed to punch out.");
        console.error(err);
    }
  };

  const fetchTeam = async () => {
    try {
        const user = getUser();
        if (!user) return;
        const res = await api.get(`users/?agent_id=${user.id}`);
        setTeam(res.data);
    } catch(err) {
        console.error(err);
    }
  };

  const handleAddWorker = async () => {
    try {
        const user = getUser();
        if (!user) return;
        if (!newWorkerFields.username || !newWorkerFields.email || !newWorkerFields.password) {
            alert("Please fill all worker details.");
            return;
        }
        await api.post('users/', {
            ...newWorkerFields,
            role: 'sub_worker',
            agent_id: user.id
        });
        setNewWorkerFields({ username: '', email: '', password: '', job_title: 'worker' });
        fetchTeam();
        alert("Worker added to your team successfully!");
    } catch(err) {
        console.error(err);
        alert("Failed to add worker. Username/email might already exist.");
    }
  };

  const handleDispatchTeam = async (bookingId) => {
    const info = dispatchInfo[bookingId];
    if (!info || !info.sub_worker_id || !info.location_link) {
        alert("Please set Location & Assign a Lead Worker.");
        return;
    }
    try {
        const user = getUser();
        if (!user) return;
        await api.post('teamtasks/', {
            booking: bookingId,
            agent: user.id,
            sub_worker: info.sub_worker_id,
            location_link: info.location_link,
            status: "Dispatched"
        });
        await api.patch(`bookings/${bookingId}/`, { status: 'Dispatched' });
        alert("Team Dispatched! Worker will see the assignment in their dashboard.");
        fetchAppointments(); // Refresh
    } catch(err) {
        console.error(err);
        alert("Failed to dispatch team.");
    }
  };

  const fetchInstallations = async () => {
    try {
      const response = await api.get('installations/');
      setInstallations(response.data);
    } catch (error) {
      console.error("Error fetching installations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const user = getUser();
      if (!user) return;
      // Show Pending requests, OR requests accepted/forwarded by this exact agent
      const apiUrl = `${api.defaults.baseURL}bookings/`;
      const res = await api.get('bookings/');
      console.log("Expo Sync - Raw Data:", res.data);
      
      // EXPO MODE: Show everything to ensure a smooth demo
      const filtered = res.data.filter(b => {
          const status = (b.status || "").toLowerCase();
          return status === "pending" || 
                 status === "accepted" || 
                 status === "awaiting admin" ||
                 status === "loan approved" ||
                 status === "dispatched" ||
                 Number(b.agent) === Number(user.id);
      });
      setAppointments(filtered);

      // Auto-populate dispatch address for approved bookings if not already set
      setDispatchInfo(prev => {
        const newInfo = { ...prev };
        filtered.forEach(b => {
          if ((b.status === "Loan Approved" || b.status === "Direct Pay Confirmed") && !newInfo[b.id]?.location_link) {
            newInfo[b.id] = { 
              ...newInfo[b.id], 
              location_link: b.address || "" 
            };
          }
        });
        return newInfo;
      });

    } catch (err) {
      console.error(err);
    }
  };

  const formatDisplayTime = (timeString) => {
    if (!timeString) return "";
    if (timeString.includes("AM") || timeString.includes("PM")) return timeString;
    const [hours, minutes] = timeString.split(':');
    const hr = parseInt(hours, 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const displayHour = ((hr % 12) || 12).toString().padStart(2, '0');
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleAcceptAppointment = async (id) => {
    const d = confirmDates[id];
    const t = confirmTimes[id];
    if (!d || !t) { alert("Please select both date and time before accepting."); return; }
    
    const user = getUser();
    if (!user || !user.id) {
      alert("Session expired. Please log in again.");
      return;
    }

    const convertTime = (timeStr) => {
        if (!timeStr || !timeStr.includes(" ")) return timeStr;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
        if (modifier === 'AM' && hours === '12') hours = '00';
        return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    try {
      await api.patch(`bookings/${id}/`, {
         status: "Accepted",
         confirmed_date: d,
         confirmed_time: convertTime(t),
         agent: user.id
      });
      
      // Sync background data
      await fetchAppointments();
      
      // Automatically open next process
      setConfigModal({open: true, bookingId: id});
      
      alert("Appointment Accepted and Confirmation Sent to Client!");
    } catch(err) {
      console.error("Accept appointment error:", err);
      const msg = err.response?.data?.error || err.response?.data?.detail || "Failed to accept appointment.";
      alert(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    }
  };

  const submitConfig = async () => {
    const formData = new FormData();
    formData.append('booking', configModal.bookingId);
    
    if(configData.current_bill) formData.append('current_bill', configData.current_bill);
    if(configData.aadhar_card) formData.append('aadhar_card', configData.aadhar_card);
    if(configData.pan_card) formData.append('pan_card', configData.pan_card);
    if(configData.bank_details) formData.append('bank_details', configData.bank_details);
    if(configData.house_tax) formData.append('house_tax', configData.house_tax);
    if(configData.bank_statement_6m) formData.append('bank_statement_6m', configData.bank_statement_6m);
    
    formData.append('panel_type', configData.panel_type);
    formData.append('capacity', configData.capacity);
    formData.append('wire_type', configData.wire_type);
    formData.append('battery_type', configData.battery_type);
    formData.append('inverter_type', configData.inverter_type);
    formData.append('rod_type', configData.rod_type);
    formData.append('rod_count', configData.rod_count);
    formData.append('panel_count', configData.panel_count);

    try {
        await api.post('bookingdocs/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const user = JSON.parse(sessionStorage.getItem("solar_user"));
        await api.patch(`bookings/${configModal.bookingId}/`, {
            status: "Awaiting Admin",
            agent: user.id
        });
        alert("Configuration uploaded and forwarded to admin for loan check!");
        setConfigModal({open:false, bookingId: null});
        setConfigData({
            current_bill: null, aadhar_card: null, pan_card: null, bank_details: null, house_tax: null, bank_statement_6m: null,
            panel_type: '', capacity: '', wire_type: '', battery_type: '', inverter_type: '', rod_type: '', rod_count: 0, panel_count: 0
        });
        fetchAppointments();
    } catch(err) {
        console.error("Config submit error:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to submit configuration.";
        alert("Submission Failed: " + (typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg));
    }
  };

  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : 'Completed';
    try {
      await api.patch(`installations/${id}/`, { status: nextStatus });
      alert(`Status updated to ${nextStatus}. Admin & Agent synced successfully!`);
      fetchInstallations(); // Refresh data
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  // Derive unique customers from the installations queue
  const customers = Array.from(new Set(installations.map(i => i.client_name))).map((name, index) => {
    const inst = installations.find(i => i.client_name === name);
    return { id: index + 1, name: name, location: inst.location || "Site Address", status: inst.status };
  });

  const completedInstalls = installations.filter(i => i.status === "Completed").length;
  const totalInstalls = installations.length;
  const activeInstalls = totalInstalls - completedInstalls;
  const dailyTargetPerc = totalInstalls > 0 ? Math.round((completedInstalls / totalInstalls) * 100) : 0;

  const totalAppts = appointments.length;
  const handledAppts = appointments.filter(a => a.status !== "Pending").length;
  const totalTickets = tickets.length;
  const handledTickets = tickets.filter(t => t.status === "Resolved").length;

  const totalTasks = totalInstalls + totalAppts + totalTickets;
  const handledTasks = completedInstalls + handledAppts + handledTickets;
  const shiftEfficiencyPerc = totalTasks > 0 ? Math.round((handledTasks / totalTasks) * 100) : 100;

  const handleMetricClick = (stat) => {
    let content = null;
    if (stat.label === "Daily Targets") {
      content = <div className="text-gray-300">You have completed {completedInstalls} out of {totalInstalls} assigned installations, achieving a <strong>{dailyTargetPerc}%</strong> success rate! Keep closing those sites.</div>;
    } else if (stat.label === "Active Sites") {
      const activeInst = installations.filter(i => i.status !== "Completed");
      content = (
        <ul className="text-left space-y-3 text-gray-300 max-h-60 overflow-y-auto pr-2">
          {activeInst.length === 0 ? <li>No active sites right now.</li> : activeInst.map(i => <li key={i.id} className="border-b border-white/10 pb-2 flex justify-between items-center"><span>📍 {i.location || "Pending"}</span> <span className="text-orange-400 text-[10px] uppercase font-bold border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 rounded">{i.status}</span></li>)}
        </ul>
      );
    } else if (stat.label === "Completed") {
      const compInst = installations.filter(i => i.status === "Completed");
      content = (
        <ul className="text-left space-y-3 text-gray-300 max-h-60 overflow-y-auto pr-2">
          {compInst.length === 0 ? <li>No completed sites yet.</li> : compInst.map(i => <li key={i.id} className="border-b border-white/10 pb-2 flex justify-between items-center"><span>✅ {i.location || "Site Registration"}</span> <span className="text-green-400 text-[10px] uppercase font-bold border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded">Done</span></li>)}
        </ul>
      );
    } else if (stat.label === "Shift Efficiency") {
      content = <div className="text-gray-300">Your shift efficiency is rated at <strong>{shiftEfficiencyPerc}%</strong>. This is based on handling {handledTasks} out of {totalTasks} overall tasks (installations, appointments, and maintenance tickets).</div>;
    }
    setMetricsModal({ open: true, title: stat.label, content });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {metricsModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0f172a] border border-white/20 p-8 rounded-3xl w-full max-w-md my-auto shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4 text-white border-b border-white/10 pb-3">{metricsModal.title} Details</h2>
            <div className="mb-6">
               {metricsModal.content}
            </div>
            <div className="flex justify-end">
                <button onClick={() => setMetricsModal({open:false, title:'', content:null})} className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition font-bold tracking-widest uppercase text-[10px]">Close Panel</button>
            </div>
          </div>
        </div>
      )}

      {configModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0f172a] border border-white/20 p-8 rounded-3xl w-full max-w-4xl my-auto shadow-2xl relative">
            <h2 className="text-2xl font-bold mb-6 text-orange-400">Upload Hardware & Documents</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div>
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Required Documents</h3>
                    <div className="space-y-4">
                        {['current_bill', 'aadhar_card', 'pan_card', 'bank_details', 'house_tax', 'bank_statement_6m'].map(field => (
                            <div key={field}>
                                <label className="block text-xs uppercase text-gray-400 font-bold mb-1 tracking-widest">{field.replace(/_/g, ' ')}</label>
                                <input type="file" onChange={e => setConfigData({...configData, [field]: e.target.files[0]})} className="w-full text-gray-300 bg-white/5 border border-white/10 p-2 rounded outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-orange-500/10 file:text-orange-400 font-semibold" />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Hardware Config</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Panel Type</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500 appearance-none cursor-pointer" 
                                    value={configData.panel_type} 
                                    onChange={e=>setConfigData({...configData, panel_type: e.target.value})}
                                >
                                    <option value="">Select Panel Type</option>
                                    <option value="Monocrystalline">Monocrystalline</option>
                                    <option value="Polycrystalline">Polycrystalline</option>
                                    <option value="Bifacial High Efficiency">Bifacial High Efficiency</option>
                                    <option value="Thin Film Nano">Thin Film Nano</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Capacity</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500 appearance-none cursor-pointer" 
                                    value={configData.capacity} 
                                    onChange={e=>setConfigData({...configData, capacity: e.target.value})}
                                >
                                    <option value="">Select Capacity</option>
                                    <option value="3KW System">3KW System</option>
                                    <option value="5KW System">5KW System</option>
                                    <option value="8KW System">8KW System</option>
                                    <option value="10KW System">10KW System</option>
                                    <option value="15KW+ (Commercial)">15KW+ (Commercial)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Wire Type</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500 appearance-none cursor-pointer" 
                                    value={configData.wire_type} 
                                    onChange={e=>setConfigData({...configData, wire_type: e.target.value})}
                                >
                                    <option value="">Select Wire Type</option>
                                    <option value="4mm DC Solar Wire">4mm DC Solar Wire</option>
                                    <option value="6mm DC Solar Wire">6mm DC Solar Wire</option>
                                    <option value="10mm DC High Load">10mm DC High Load</option>
                                    <option value="Armoured AC Main Cable">Armoured AC Main Cable</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Battery Type</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500 appearance-none cursor-pointer" 
                                    value={configData.battery_type} 
                                    onChange={e=>setConfigData({...configData, battery_type: e.target.value})}
                                >
                                    <option value="">Select Battery</option>
                                    <option value="Lithium-ion (LiFePO4)">Lithium-ion (LiFePO4)</option>
                                    <option value="Tubular Lead Acid">Tubular Lead Acid</option>
                                    <option value="Gel Deep Cycle">Gel Deep Cycle</option>
                                    <option value="None (On-Grid Setup)">None (On-Grid Setup)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Inverter Type</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500 appearance-none cursor-pointer" 
                                    value={configData.inverter_type} 
                                    onChange={e=>setConfigData({...configData, inverter_type: e.target.value})}
                                >
                                    <option value="">Select Inverter</option>
                                    <option value="Smart Hybrid Inverter">Smart Hybrid Inverter</option>
                                    <option value="Pure Sine Wave (Off-Grid)">Pure Sine Wave (Off-Grid)</option>
                                    <option value="Micro-Inverter System">Micro-Inverter System</option>
                                    <option value="String Inverter (On-Grid)">String Inverter (On-Grid)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Rod Type</label>
                                <select 
                                    className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500 appearance-none cursor-pointer" 
                                    value={configData.rod_type} 
                                    onChange={e=>setConfigData({...configData, rod_type: e.target.value})}
                                >
                                    <option value="">Select Rod Type</option>
                                    <option value="Copper Bonded Earth Rod">Copper Bonded Earth Rod</option>
                                    <option value="Solid Copper (Premium)">Solid Copper (Premium)</option>
                                    <option value="GI (Galvanized Iron)">GI (Galvanized Iron)</option>
                                    <option value="Chemical Earthing Kit">Chemical Earthing Kit</option>
                                </select>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-400 mb-1">Rod Count</label><input type="number" className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500" value={configData.rod_count} onChange={e=>setConfigData({...configData, rod_count: e.target.value})}/></div>
                            <div><label className="block text-xs font-bold text-gray-400 mb-1">Panel Count</label><input type="number" className="w-full bg-[#020617] border border-white/10 p-2 rounded outline-none text-white focus:border-orange-500" value={configData.panel_count} onChange={e=>setConfigData({...configData, panel_count: e.target.value})}/></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
                <button onClick={() => setConfigModal({open:false, bookingId: null})} className="px-5 py-2 rounded-xl text-gray-400 hover:text-white transition">Cancel</button>
                <button onClick={submitConfig} className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-2 rounded-xl transition shadow-[0_0_15px_rgba(249,115,22,0.3)]">Push to Admin</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 w-full">
        
        {/* 🔥 Header/Greeting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
              {greeting}, <span className="text-orange-500">Agent</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Here is your daily dispatch, active sites, and installation queue.
            </p>
          </div>
          <div className="flex bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-w-[280px]">
             <div className="px-6 py-4 flex flex-col justify-center items-center bg-white/5 border-r border-white/10 flex-1">
                <p className="font-mono text-3xl font-bold tracking-widest text-orange-400 animate-[pulse_2s_ease-in-out_infinite]">{timeString}</p>
                <p className="text-xs uppercase text-gray-500 font-bold mt-2 tracking-widest">{dateString}</p>
             </div>
             <div className="px-5 py-4 flex flex-col justify-center items-center bg-[#020617] relative w-[130px]">
                 {selfAttendance ? (
                    selfAttendance.status === "Shift Ended" ? (
                      <div className="flex flex-col items-center">
                         <div className="w-8 h-8 mb-1 bg-gray-500/20 rounded-full flex items-center justify-center border border-gray-500/50">
                            <Zap className="w-4 h-4 text-gray-500" />
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Shift Ended</span>
                      </div>
                    ) : (
                      <div 
                         className="flex flex-col items-center justify-center w-full h-full cursor-pointer group"
                         onClick={handlePunchOut}
                         title="Click to End Shift / Punch Out"
                      >
                         <div className="flex flex-col items-center group-hover:hidden">
                           <CheckCircle className={`w-8 h-8 mb-1 text-green-400`} />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Punched In</span>
                         </div>
                         <div className="hidden flex-col items-center group-hover:flex">
                           <div className="w-8 h-8 mb-1 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
                              <Zap className="w-4 h-4 text-red-500" />
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 shadow-sm">End Shift</span>
                         </div>
                      </div>
                    )
                 ) : (
                   <button onClick={() => logSelfAttendance("Present")} className="w-full h-full bg-orange-500/10 hover:bg-orange-500 hover:text-black border border-orange-500/30 text-orange-400 font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                      Log Shift
                   </button>
                )}
             </div>
          </div>
        </motion.div>

        {/* 🔥 Daily Metrics Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Daily Targets", value: `${dailyTargetPerc}%`, color: "text-blue-400" },
            { label: "Active Sites", value: activeInstalls, color: "text-orange-400" },
            { label: "Completed", value: completedInstalls, color: "text-green-400" },
            { label: "Shift Efficiency", value: `${shiftEfficiencyPerc}%`, color: "text-purple-400" }
          ].map((stat, i) => (
            <div 
               key={i} 
               onClick={() => handleMetricClick(stat)}
               className="bg-[#0f172a]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-lg hover:bg-white/5 hover:border-orange-500/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition cursor-pointer group"
            >
              <span className={`text-3xl font-black mb-1 group-hover:scale-110 transition-transform ${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* 🔥 Connection Debugger moved to top of section */}
        <div className="mb-4 flex items-center justify-between bg-orange-500/10 border border-orange-500/30 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest underline decoration-orange-500/50">Production Data Sync:</span>
                <code className="text-[10px] font-mono text-white bg-black/40 px-2 py-0.5 rounded">{api.defaults.baseURL}</code>
            </div>
            <p className="text-[9px] text-gray-400 italic">Connected to Vercel Cloud for Expo</p>
        </div>

        {/* 🔥 Incoming Appointments Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-8"
        >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 rounded-xl">
                   <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold">Incoming Appointment Requests</h2>
              </div>
              <Link 
                to="/agent-dashboard/incoming-appointments" 
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                View Full List <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
               {appointments.length === 0 ? <p className="text-gray-500 col-span-full">No active appointment requests right now.</p> : appointments.map((req) => (
                  <div key={req.id} className="bg-[#020617] border border-white/5 p-5 rounded-2xl flex flex-col group hover:border-cyan-500/30 transition-all relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{req.client_name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : (req.status||'').toLowerCase() === 'pending' ? 'bg-orange-500 text-black border border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : req.status === 'Awaiting Admin' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : req.status === 'Loan Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : req.status === 'Loan Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                           {(req.status||'').toLowerCase() === 'pending' ? '🔥 NEW REQUEST' : req.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1 mb-4 border-b border-white/5 pb-4">
                        <p><MapPin className="inline w-3 h-3 mr-1"/>{req.address}</p>
                        <p>Req Date: {req.requested_date} @ {req.requested_time}</p>
                        <p>Phone: {req.phone}</p>
                        {req.notes && <p className="italic text-gray-500">"{req.notes}"</p>}
                      </div>
                      
                      {req.status === "Pending" ? (
                          <div className="mt-auto space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                  <div>
                                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Confirm Date</label>
                                      <input 
                                         type="date"
                                         className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-xs text-white focus:border-orange-500 outline-none transition-all"
                                         value={confirmDates[req.id] || ''}
                                         onChange={(e) => setConfirmDates({...confirmDates, [req.id]: e.target.value})}
                                      />
                                  </div>
                                  <div>
                                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Confirm Time</label>
                                      <select
                                         className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-xs text-white focus:border-orange-500 outline-none appearance-none cursor-pointer transition-all"
                                         value={confirmTimes[req.id] || ''}
                                         onChange={(e) => setConfirmTimes({...confirmTimes, [req.id]: e.target.value})}
                                      >
                                          <option value="">Select Time</option>
                                          {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                                      </select>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => handleAcceptAppointment(req.id)} 
                                  className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 group/btn active:scale-95 transition-all"
                              >
                                  Confirm & Accept <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                          </div>
                      ) : req.status === "Accepted" ? (
                          <div className="mt-auto space-y-3 border-t border-white/5 pt-4">
                              <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl flex items-center justify-between mx-1 mb-2">
                                  <div className="flex items-center gap-3">
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                      <span className="text-xs font-bold text-green-400">Accepted ({req.confirmed_date} @ {formatDisplayTime(req.confirmed_time)})</span>
                                  </div>
                              </div>
                              <button 
                                 onClick={() => setConfigModal({open:true, bookingId:req.id})} 
                                 className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 active:scale-95"
                              >
                                 <Zap className="w-4 h-4" /> Upload Config & Forward
                              </button>
                          </div>
                      ) : req.status === "Awaiting Admin" ? (
                          <div className="mt-auto bg-orange-500/5 border border-orange-500/20 p-3 rounded-xl flex flex-col gap-2">
                              <span className="text-sm font-semibold text-orange-400 flex justify-between items-center">
                                Awaiting Loan Check <Clock className="w-4 h-4" />
                              </span>
                              <p className="text-[10px] text-gray-400">Admin is reviewing hardware and financial documents.</p>
                          </div>
                      ) : req.status === "Loan Rejected" ? (
                          <div className="mt-auto bg-red-500/5 border border-red-500/20 p-3 rounded-xl flex flex-col gap-2">
                              <span className="text-sm font-semibold text-red-400 flex justify-between items-center">
                                Loan Rejected <ShieldAlert className="w-4 h-4" />
                              </span>
                              <p className="text-[10px] text-gray-400">Waiting for user to confirm direct offline payment.</p>
                          </div>
                      ) : req.status === "Dispatched" || req.status === "In Progress" ? (
                          <div className="mt-auto bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-xl flex flex-col gap-3">
                              <span className="text-sm font-semibold text-cyan-300 flex justify-between items-center">
                                {req.status === 'Dispatched' ? 'Field Ops Dispatched' : 'Work In Progress'} <Zap className="w-4 h-4" />
                              </span>
                              <p className="text-[10px] text-gray-400">This request has been sent to the technician. Track completion from the worker dashboard.</p>
                              <div className="flex flex-col gap-2 text-xs text-gray-200">
                                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 font-semibold">
                                  Status: {req.status}
                                </div>
                                {req.team_tasks?.length > 0 ? (
                                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-200">
                                    Assigned Technician: <span className="text-cyan-300">{req.team_tasks[0].sub_worker_name}</span>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-400">Technician assignment is being processed.</div>
                                )}
                              </div>
                          </div>
                      ) : (req.status === "Loan Approved" || req.status === "Direct Pay Confirmed") ? (
                          <div className="mt-auto space-y-3 border-t border-white/5 pt-4">
                              <div className="bg-green-500/5 border border-green-500/20 p-2 rounded-xl flex items-center justify-between mx-1">
                                  <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">{req.status}</span>
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                              </div>
                              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Dispatch Details</label>
                                  <input 
                                     placeholder="Google Maps link or address..."
                                     className="w-full bg-[#020617] border border-white/10 p-2 outline-none focus:border-cyan-500 rounded text-xs text-white"
                                     value={dispatchInfo[req.id]?.location_link || ''}
                                     onChange={e => setDispatchInfo({...dispatchInfo, [req.id]: {...dispatchInfo[req.id], location_link: e.target.value}})}
                                  />
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block pt-1">Assign Lead Technician</label>
                                  <select 
                                     className="w-full bg-[#020617] border border-white/10 p-2 outline-none focus:border-cyan-500 rounded text-xs text-white"
                                     value={dispatchInfo[req.id]?.sub_worker_id || ''}
                                     onChange={e => setDispatchInfo({...dispatchInfo, [req.id]: {...dispatchInfo[req.id], sub_worker_id: e.target.value}})}
                                  >
                                      <option value="">- Assign Worker -</option>
                                      {team.map(w => <option key={w.id} value={w.id}>{w.username} ({w.subworker_profile?.job_title})</option>)}
                                  </select>
                                  
                                  <button onClick={() => handleDispatchTeam(req.id)} className="w-full bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/30 font-bold text-xs py-2 rounded transition-all flex items-center justify-center gap-1 mt-2">
                                     <Zap className="w-3 h-3" /> Dispatch Field Ops
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="mt-auto bg-purple-500/5 border border-purple-500/20 p-3 rounded-xl flex items-center justify-between">
                              <span className="text-sm font-semibold text-purple-400">Completed Installation</span>
                              <CheckCircle className="w-4 h-4 text-purple-400" />
                          </div>
                      )}
                  </div>
               ))}
            </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* 🔥 Customers Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                 <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Assigned Customers</h2>
            </div>
            
            <div className="space-y-4">
              {loading ? <p className="text-gray-500">Loading clients...</p> : customers.length === 0 ? <p className="text-gray-500">No customers found.</p> : customers.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="bg-[#020617] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:border-blue-500/30 transition-all group"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors capitalize">{c.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                       <MapPin className="w-4 h-4" /> {c.location}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300">
                    {c.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 🔥 Installations Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-500/10 rounded-xl">
                 <Wrench className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold">Installation Queue</h2>
            </div>
            
            <div className="space-y-4">
              {loading ? <p className="text-gray-500">Syncing with dispatch...</p> : installations.length === 0 ? <p className="text-gray-500">No active installations.</p> : installations.map((i, idx) => (
                <motion.div
                  key={i.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="bg-[#020617] border border-white/5 p-5 rounded-2xl flex flex-col hover:border-orange-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h3 className="font-bold text-lg text-white mb-1">{i.system}</h3>
                      <p className="text-gray-500 text-sm">For: <span className="text-gray-300 capitalize">{i.client_name}</span></p>
                    </div>
                    {i.status === "Completed" ? (
                       <div className="bg-green-500/10 text-green-400 p-2 rounded-full border border-green-500/20">
                          <CheckCircle className="w-5 h-5" />
                       </div>
                    ) : (
                       <div className="bg-orange-500/10 text-orange-400 p-2 rounded-full border border-orange-500/20">
                          <Clock className="w-5 h-5" />
                       </div>
                    )}
                  </div>
                  
                  <div className="w-full h-px bg-white/5 my-2"></div>
                  
                  <div className="flex justify-between items-center mt-2 relative z-10">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3"/> {i.location || "Pending Address"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                        i.status === 'Completed' ? 'text-green-500 border-green-500/30' : 'text-orange-500 border-orange-500/30'
                      }`}>
                        {i.status}
                      </span>
                      {i.status !== "Completed" && (
                        <button 
                          onClick={() => updateStatus(i.id, i.status)}
                          className="bg-blue-500 hover:bg-blue-400 text-white text-xs px-3 py-1 rounded uppercase font-bold flex items-center gap-1 transition-all"
                        >
                          <Save className="w-3 h-3" /> Update
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* 🔥 My Team (Workers) Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-xl">
                 <HardHat className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold">My Field Team</h2>
                  <p className="text-gray-400 text-sm">Manage Technicians and Workers</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center bg-white/5 border border-white/10 p-2 rounded-xl">
               <input placeholder="Username" className="bg-transparent text-sm w-24 p-1 outline-none font-semibold placeholder-gray-600" value={newWorkerFields.username} onChange={e=>setNewWorkerFields({...newWorkerFields, username: e.target.value})} />
               <input placeholder="Email" type="email" className="bg-transparent text-sm w-32 p-1 outline-none font-semibold border-l border-white/10 pl-2 placeholder-gray-600" value={newWorkerFields.email} onChange={e=>setNewWorkerFields({...newWorkerFields, email: e.target.value})} />
               <input placeholder="Password" type="password" className="bg-transparent text-sm w-24 p-1 outline-none font-semibold border-l border-white/10 pl-2 placeholder-gray-600" value={newWorkerFields.password} onChange={e=>setNewWorkerFields({...newWorkerFields, password: e.target.value})} />
               <select className="bg-[#020617] text-gray-300 text-sm border-l border-white/10 outline-none p-1" value={newWorkerFields.job_title} onChange={e=>setNewWorkerFields({...newWorkerFields, job_title: e.target.value})}>
                  <option value="worker">Worker</option>
                  <option value="technician">Technician</option>
               </select>
               <button onClick={handleAddWorker} className="bg-indigo-500 hover:bg-indigo-400 p-2 rounded-lg text-white font-bold ml-2 transition">
                  <UserPlus className="w-4 h-4" />
               </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
             {team.length === 0 ? <p className="text-gray-500 col-span-full">No active team members. Add technicians and workers above.</p> : team.map((member) => (
                <div key={member.id} className="bg-[#020617] border border-indigo-500/10 hover:border-indigo-500/40 p-5 rounded-2xl transition">
                   <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 font-bold flex items-center justify-center text-lg uppercase shadow-lg">
                             {member.username.charAt(0)}
                          </div>
                          <div>
                              <h3 className="font-bold text-white capitalize">{member.username}</h3>
                              <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                      </div>
                      <span className={`px-2 py-1 uppercase tracking-widest font-bold text-[10px] rounded border ${member.subworker_profile?.job_title === 'technician' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-pink-500/10 text-pink-400 border-pink-500/30'}`}>
                         {member.subworker_profile?.job_title}
                      </span>
                   </div>
                   <div className="text-xs text-gray-400 pt-3 border-t border-white/5 flex justify-between uppercase font-semibold">
                      <span>Status</span>
                      {(() => {
                        const rec = teamAttendance.find(a => a.worker === member.id);
                        if(rec?.status === 'Present') return <span className="text-green-400">On Duty</span>;
                        if(rec?.status === 'Absent') return <span className="text-red-400">Absent</span>;
                        if(rec?.status === 'On Leave') return <span className="text-yellow-400">On Leave</span>;
                        return <span className="text-gray-500">Unmarked</span>;
                      })()}
                   </div>
                </div>
             ))}
          </div>
        </motion.div>

        {/* 🔥 Maintenance Tickets Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mt-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-500/10 rounded-xl">
               <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold">Active Maintenance Tickets</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {tickets.length === 0 ? <p className="text-gray-500">No active maintenance requests.</p> : tickets.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className={`border p-5 rounded-2xl flex flex-col transition-all group relative overflow-hidden ${t.status === 'Resolved' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#020617] border-red-500/30'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1 uppercase">{t.type}</h3>
                    <p className="text-gray-500 text-sm">Target: <span className="text-gray-300">{t.customerName}</span></p>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        t.status === 'Resolved' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      }`}>
                        {t.status}
                  </span>
                </div>
                <div className="text-gray-400 text-sm italic mb-4 border-l-2 border-white/10 pl-3 py-1">
                    "{t.description}"
                </div>
                
                <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-4">
                  <span className="text-xs text-gray-600 font-mono">ID: {t.id}</span>
                  {t.status !== "Resolved" ? (
                    <button 
                      onClick={() => resolveTicket(t.id)}
                      className="bg-green-500 hover:bg-green-400 text-black text-xs px-4 py-2 rounded-lg uppercase font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                    >
                      <CheckCircle className="w-4 h-4" /> Resolve Ticket
                    </button>
                  ) : (
                    <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Cleared at {new Date(t.resolvedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
      {/* Image Viewer Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10" onClick={() => setViewingPhoto(null)}>
            <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <motion.img 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    src={viewingPhoto} 
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] border border-white/10" 
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
};

export default AgentDashboard;
