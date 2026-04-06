import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axiosConfig";
import { Calendar, Phone, MapPin, Clock, User as UserIcon, CheckCircle, ArrowRight, Navigation, ShieldAlert } from "lucide-react";
import { useLiveTime } from "../../hooks/useLiveTime";

const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"
];

function CustomerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  
  const [form, setForm] = useState({
    client_name: "",
    phone: "",
    address: "",
    requested_date: "",
    requested_time: "",
    notes: "",
  });

  const { timeString, dateString, greeting } = useLiveTime();
  const userName = JSON.parse(sessionStorage.getItem("solar_user"))?.first_name || JSON.parse(sessionStorage.getItem("solar_user"))?.username || "Customer";

  const fetchBookings = async () => {
    const user = JSON.parse(sessionStorage.getItem("solar_user"));
    if (!user) return;
    try {
        const res = await api.get(`bookings/?client_id=${user.id}`);
        setBookings(res.data);
    } catch(err) {
        console.error("Failed to fetch bookings", err);
    }
  };

  const confirmDirectPay = async (id) => {
    try {
      await api.patch(`bookings/${id}/`, { status: 'Direct Pay Confirmed' });
      alert("Confirmed! We will proceed with your direct payment configuration.");
      fetchBookings();
    } catch(err) {
      alert("Failed to confirm direct pay.");
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem("solar_user");
    if (!userStr) {
      navigate("/login"); return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "customer") {
      navigate("/login"); return;
    }
    // Set default name and phone
    setForm(prev => ({
        ...prev,
        client_name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username,
        phone: user.customer_profile?.phone || ""
    }));
    
    fetchBookings();
  }, []);

  const handleSubmit = async () => {
    if (!form.requested_date || !form.requested_time || !form.address) {
        alert("Please fill all required fields (Date, Time, Address).");
        return;
    }
    
    setLoading(true);
    const user = JSON.parse(sessionStorage.getItem("solar_user"));
    
    // Convert "10:00 AM" to "10:00:00", "02:00 PM" to "14:00:00" for Django TimeField
    const convertTime = (timeStr) => {
        if (!timeStr || !timeStr.includes(" ")) return timeStr;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
        return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    const payload = {
        client: user.id,
        ...form,
        requested_time: convertTime(form.requested_time)
    };

    try {
        await api.post('bookings/', payload);
        alert("Appointment Request Sent to Agents Successfully!");
        setForm({
            ...form,
            requested_date: "",
            requested_time: "",
            address: "",
            notes: ""
        });
        fetchBookings();
    } catch(err) {
        alert("Transmission Failed. Are you logged in?");
    } finally {
        setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
          setForm((prev) => ({ ...prev, address: mapsLink }));
          window.open(mapsLink, "_blank");
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-6 space-y-8 text-white font-sans overflow-x-hidden">

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/5 border border-blue-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between md:items-end gap-6"
      >
        <div className="absolute top-0 right-0 py-8 opacity-20 pointer-events-none">
          <Calendar className="w-48 h-48 text-blue-500 blur-sm" />
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent capitalize">
              {greeting}, {userName}
            </h1>
            <p className="text-gray-400 text-lg mt-2 font-medium">Book a site visit with our Field Agents</p>
        </div>
        <div className="relative z-10 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-3xl flex flex-col items-center justify-center min-w-[220px] shadow-2xl">
           <p className="font-mono text-3xl font-bold tracking-widest text-[#00ffcc] animate-[pulse_2s_ease-in-out_infinite]">{timeString}</p>
           <p className="text-xs uppercase text-gray-500 font-bold mt-2 tracking-widest">{dateString}</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      
        {/* LEFT: Appointment Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
               <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Book Appointment</h2>
          </div>

          <div className="space-y-4">
            
            <div className="relative">
                <UserIcon className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.client_name}
                    onChange={(e) => setForm({...form, client_name: e.target.value})}
                />
            </div>
            
            <div className="relative">
                <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                />
            </div>

            <div className="relative">
                <span className="absolute left-4 top-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</span>
                <input
                    type="date"
                    className="w-full bg-white/20 border border-blue-500/40 p-5 pl-16 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white text-base placeholder-gray-400 cursor-pointer"
                    value={form.requested_date}
                    onChange={(e) => setForm({...form, requested_date: e.target.value})}
                />
            </div>
            
            <div className="relative">
                <span className="absolute left-4 top-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Time</span>
                <select
                    className="w-full bg-white/20 border border-blue-500/40 p-5 pl-16 pr-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white text-base appearance-none cursor-pointer"
                    value={form.requested_time}
                    onChange={(e) => setForm({...form, requested_time: e.target.value})}
                >
                    <option value="" disabled className="bg-[#0f172a] text-white">--:-- (Select AM/PM Slot)</option>
                    {timeSlots.map(time => (
                        <option key={time} value={time} className="bg-[#0f172a] text-white">{time}</option>
                    ))}
                </select>
                <Clock className="absolute right-4 top-4 w-5 h-5 text-blue-400 pointer-events-none" />
            </div>

            <div>
                <div className="flex justify-between items-center mb-2 px-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Site Address</label>
                    <button 
                        onClick={handleGetCurrentLocation}
                        className="text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-blue-500/20"
                    >
                        <Navigation className="w-3 h-3" />
                        Use Current Location
                    </button>
                </div>
                <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                    <textarea
                        placeholder="Address or Maps Link"
                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                </div>
            </div>
            
            <textarea
                placeholder="Any special notes for the agent?"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold py-4 rounded-xl transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50 mt-4"
            >
              {loading ? "Submitting..." : "Submit Appointment Request"}
            </button>
          </div>
        </motion.div>

        {/* RIGHT: Status Tracker */}
        <motion.div
           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
           className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-xl">
               <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Your Requests</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {bookings.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60 mt-12">
                     <Calendar className="w-16 h-16 mb-4" />
                     <p>No appointments requested yet.</p>
                 </div>
             ) : bookings.map((b) => {
                 const formatDisplayTime = (t) => {
                     if (!t) return "";
                     if (t.includes("M")) return t; // Already AM/PM
                     let [h, m] = t.split(':');
                     let hr = parseInt(h, 10);
                     let ampm = hr >= 12 ? 'PM' : 'AM';
                     hr = hr % 12 || 12;
                     return `${hr.toString().padStart(2, '0')}:${m} ${ampm}`;
                 };
                 return (
                 <div key={b.id} className="bg-[#020617] border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-start mb-3">
                         <h3 className="font-bold text-lg">{new Date(b.requested_date).toDateString()} at {formatDisplayTime(b.requested_time)}</h3>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                             b.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                             b.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                             'bg-purple-500/10 text-purple-400 border-purple-500/20'
                         }`}>
                             {b.status === 'Forwarded' ? 'Sent to Admin' : b.status}
                         </span>
                     </div>
                     <p className="text-gray-400 text-sm mb-4"><MapPin className="inline w-3 h-3 mr-1" />{b.address}</p>
                     
                     {b.status === 'Accepted' && (
                         <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-start gap-3 mt-4">
                             <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                             <div>
                                 <p className="text-sm font-semibold text-green-400">Agent {b.agent_username ? b.agent_username.replace('_', ' ') : ''} Confirmed!</p>
                                 <p className="text-xs text-gray-400 mt-1">Confirmed Date: {b.confirmed_date}{b.confirmed_time ? ` @ ${formatDisplayTime(b.confirmed_time)}` : ''}</p>
                             </div>
                         </div>
                     )}
                     
                     {b.status === 'Forwarded' && (
                         <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 flex items-start gap-3 mt-4">
                             <ArrowRight className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                             <div>
                                 <p className="text-sm font-semibold text-purple-400">Escalated to Administration</p>
                                 <p className="text-xs text-gray-400 mt-1">An admin will contact you shortly regarding your request.</p>
                             </div>
                         </div>
                     )}

                     {b.status === 'Loan Rejected' && (
                         <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex flex-col gap-3 mt-4">
                             <div className="flex items-start gap-3">
                                 <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                 <div className="flex-1">
                                     <p className="text-sm font-semibold text-red-400">Loan Application Rejected</p>
                                     <p className="text-xs text-gray-400 mt-1">Your subsidized loan was not approved. You can still proceed with direct payment.</p>
                                 </div>
                             </div>
                             <button onClick={() => confirmDirectPay(b.id)} className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-lg text-sm transition W-full">
                                 Confirm Direct Payment
                             </button>
                         </div>
                     )}

                     {b.status === 'Direct Pay Confirmed' && (
                         <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 flex items-start gap-3 mt-4">
                             <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                             <div>
                                 <p className="text-sm font-semibold text-purple-400">Direct Payment Confirmed</p>
                                 <p className="text-xs text-gray-400 mt-1">We will dispatch our field team shortly.</p>
                             </div>
                         </div>
                     )}
                 </div>
                 );
             })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default CustomerDashboard;
