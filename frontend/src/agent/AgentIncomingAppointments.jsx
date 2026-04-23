import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock, CheckCircle, XCircle, AlertCircle, FileText, ArrowRight, Zap } from 'lucide-react';
import api from '../../api/axiosConfig';

function AgentIncomingAppointments() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchIncoming = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const response = await api.get('bookings/?status=Pending');
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching incoming appointments:", error);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncoming();
        const interval = setInterval(() => fetchIncoming(false), 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (bookingId) => {
        try {
            setActionLoading(bookingId);
            const user = JSON.parse(sessionStorage.getItem("solar_user"));
            await api.patch(`bookings/${bookingId}/`, { 
                status: 'Accepted',
                agent: user.id
            });
            alert("Appointment Accepted! It is now in your Assigned Customers list.");
            fetchIncoming();
        } catch (err) {
            alert("Failed to accept appointment.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto text-white">
            <header className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-orange-500/20 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                        <Calendar className="text-orange-500 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Incoming Appointments</h1>
                        <p className="text-gray-400 font-medium">New customer booking requests awaiting response</p>
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
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">There are no new incoming appointment requests at the moment. New requests will appear here in real-time.</p>
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
                                    <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 animate-pulse">
                                        New Request
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

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleAccept(booking.id)}
                                        disabled={actionLoading === booking.id}
                                        className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 group/btn active:scale-95 disabled:opacity-50"
                                    >
                                        {actionLoading === booking.id ? (
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Accept Request <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AgentIncomingAppointments;
