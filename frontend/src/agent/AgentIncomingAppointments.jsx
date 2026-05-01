import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock, CheckCircle, XCircle, AlertCircle, FileText, ArrowRight, Zap, X } from 'lucide-react';
import api from '../api/axiosConfig';

function AgentIncomingAppointments() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [confirmDates, setConfirmDates] = useState({});
    const [confirmTimes, setConfirmTimes] = useState({});

    const [configModal, setConfigModal] = useState({ open: false, bookingId: null });
    const [configData, setConfigData] = useState({
        current_bill: null, aadhar_card: null, pan_card: null, bank_details: null, house_tax: null, bank_statement_6m: null,
        panel_type: '', capacity: '', wire_type: '', battery_type: '', inverter_type: '', rod_type: '', rod_count: 0, panel_count: 0
    });

    const timeSlots = [
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
        "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
    ];

    const fetchIncoming = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const user = JSON.parse(sessionStorage.getItem("solar_user"));
            if (!user) return;

            const response = await api.get('bookings/');
            console.log("Incoming Page - All Data:", response.data);
            // Show Pending OR Accepted by this agent
            const filtered = response.data.filter(b => {
                const status = (b.status || "").toLowerCase();
                const isPending = status === "pending" || status === "";
                const isAssignedToMe = Number(b.agent) === Number(user.id);

                return isPending || 
                       (status === "accepted" && isAssignedToMe);
            });
            console.log("Incoming Page - Filtered Data:", filtered);
            setBookings(filtered);
        } catch (error) {
            console.error("Error fetching incoming appointments:", error);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncoming();
        const interval = setInterval(() => fetchIncoming(false), 3000);
        return () => clearInterval(interval);
    }, []);

    const formatDisplayTime = (timeString) => {
        if (!timeString) return "";
        if (timeString.includes("AM") || timeString.includes("PM")) return timeString;
        const [hours, minutes] = timeString.split(':');
        const hr = parseInt(hours, 10);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const displayHour = ((hr % 12) || 12).toString().padStart(2, '0');
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const handleAccept = async (bookingId) => {
        const d = confirmDates[bookingId];
        const t = confirmTimes[bookingId];
        if (!d || !t) { alert("Please select both date and time before accepting."); return; }

        try {
            setActionLoading(bookingId);
            const userStr = sessionStorage.getItem("solar_user");
            if (!userStr) { alert("Session expired. Please log in again."); return; }
            const user = JSON.parse(userStr);
            if (!user.id) { alert("User ID not found in session. Please re-login."); return; }

            const convertTime = (timeStr) => {
                if (!timeStr || !timeStr.includes(" ")) return timeStr;
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours, 10) + 12);
                if (modifier === 'AM' && hours === '12') hours = '00';
                return `${hours.padStart(2, '0')}:${minutes}:00`;
            };

            await api.patch(`bookings/${bookingId}/`, { 
                status: 'Accepted',
                confirmed_date: d,
                confirmed_time: convertTime(t),
                agent: user.id
            });
            
            // Update background data without full-page loader
            await fetchIncoming(false);
            
            // Open next process
            setConfigModal({open: true, bookingId: bookingId});
            
            alert("Appointment Accepted and Confirmation Sent to Client!");
        } catch (err) {
            console.error("Accept error:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Failed to accept appointment.";
            alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
        } finally {
            setActionLoading(null);
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
            fetchIncoming();
        } catch(err) {
            console.error("Config submit error:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to submit configuration.";
            alert("Submission Failed: " + (typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg));
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto text-white">
            
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

            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <>


            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-orange-500/20 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-pulse">
                        <Calendar className="text-orange-500 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Incoming Appointments
                            <span className="text-[10px] bg-orange-500 text-black px-3 py-1 rounded-full animate-bounce">LIVE UPDATE</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">Accept new customer requests and schedule site visits</p>
                    </div>
                </div>
            </header>

            {bookings.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f172a] border border-white/5 rounded-3xl p-20 text-center shadow-2xl"
                >
                    <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-gray-500 w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-300">All caught up!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">There are no new incoming or accepted appointment requests at the moment.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bookings.map((booking, index) => (
                        <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group shadow-xl"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                            <User className="text-gray-300 w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                                {booking.client_name || 'Anonymous Client'}
                                            </h3>
                                            <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">ID: #{booking.id}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${booking.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse'}`}>
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-orange-500" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Requested Date</p>
                                                <p className="text-sm font-bold text-gray-200">{booking.requested_date || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Requested Time</p>
                                                <p className="text-sm font-bold text-gray-200">{booking.requested_time || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-blue-400" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Contact Node</p>
                                                <p className="text-sm font-bold text-gray-200">{booking.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-red-400" />
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Deployment Area</p>
                                                <p className="text-sm font-bold text-gray-200 truncate">{booking.address || 'Location unknown'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 mb-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-3 h-3 text-gray-500" />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Client Briefing</span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed italic line-clamp-2">"{booking.notes}"</p>
                                    </div>
                                )}

                                {booking.status === 'Pending' ? (
                                    <div className="mt-auto space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Confirm Date</label>
                                                <input 
                                                    type="date"
                                                    className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-xs text-white focus:border-orange-500 outline-none transition-all"
                                                    value={confirmDates[booking.id] || ''}
                                                    onChange={(e) => setConfirmDates({...confirmDates, [booking.id]: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Confirm Time</label>
                                                <select
                                                    className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl text-xs text-white focus:border-orange-500 outline-none appearance-none cursor-pointer transition-all"
                                                    value={confirmTimes[booking.id] || ''}
                                                    onChange={(e) => setConfirmTimes({...confirmTimes, [booking.id]: e.target.value})}
                                                >
                                                    <option value="">Select Time</option>
                                                    {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleAccept(booking.id)}
                                            disabled={actionLoading === booking.id}
                                            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 group/btn active:scale-95 disabled:opacity-50"
                                        >
                                            {actionLoading === booking.id ? (
                                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    Confirm & Accept <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                                        <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                                <span className="text-sm font-bold text-green-400">
                                                    Accepted ({booking.confirmed_date} @ {formatDisplayTime(booking.confirmed_time)})
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setConfigModal({open:true, bookingId:booking.id})}
                                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Zap className="w-4 h-4" /> Upload Config & Forward to Admin
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            </>
        )}
        </div>
    );
}

export default AgentIncomingAppointments;
