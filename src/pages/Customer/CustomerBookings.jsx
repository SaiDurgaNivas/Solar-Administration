import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosConfig";
import { Zap, MapPin, Activity, ShieldCheck, Box, Calendar, User, Clock, CheckCircle, ArrowRight, ShieldAlert, FileText, Download } from "lucide-react";

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    const userStr = sessionStorage.getItem("solar_user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    api.get(`bookings/?client_id=${user.id}`).then(res => {
      console.log("Bookings fetched:", res.data);
      res.data.forEach(b => {
        console.log(`Booking ${b.id}: status="${b.status}" (type: ${typeof b.status})`);
      });
      setBookings(res.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDisplayTime = (t) => {
      if (!t) return "";
      if (t.includes("M")) return t; 
      let [h, m] = t.split(':');
      let hr = parseInt(h, 10);
      let ampm = hr >= 12 ? 'PM' : 'AM';
      hr = hr % 12 || 12;
      return `${hr.toString().padStart(2, '0')}:${m} ${ampm}`;
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

  return (
    <div className="min-h-screen bg-[#020617] p-6 space-y-8 text-white font-sans overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-500/20 to-blue-500/5 border border-cyan-500/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calendar className="w-48 h-48 text-cyan-500" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Service & Installation Tracking
          </h1>
          <p className="text-gray-400 text-lg mt-2 font-medium">
            Monitor approvals, your documents, hardware specs, and final invoices
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide">Your Service Log</h2>
          <Activity className="w-6 h-6 text-cyan-400 opacity-50" />
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center opacity-50 border border-dashed border-white/20 rounded-2xl">
            <ShieldCheck className="w-12 h-12 mb-2" />
            <p className="font-semibold text-lg">Your History is Secure and Empty</p>
            <p className="text-sm">You haven't requested any site visits yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id || i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group"
              >
                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                  <div className="space-y-2">
                    <p className="font-bold text-xl text-gray-100 group-hover:text-cyan-400 transition">
                        Project Site: {b.address || "Location Hidden"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-orange-400" /> Req: {b.requested_date}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-2 rounded-full text-xs font-extrabold tracking-widest uppercase border bg-[#020617] shadow-inner text-white">
                    {b.status}
                  </div>
                </div>

                {/* Sub-status contextual details */}
                {b.status === 'Loan Rejected' && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex flex-col gap-4 mb-4">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-base font-bold text-red-400">Loan Application Rejected</h3>
                                <p className="text-sm text-gray-400 mt-1">Your application for the government subsidized loan was not approved by the bank. However, you can still proceed with the installation by making a direct payment.</p>
                            </div>
                        </div>
                        <button onClick={() => confirmDirectPay(b.id)} className="bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-xl w-full md:w-max transition self-end shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                            Confirm Direct Payment & Proceed
                        </button>
                    </div>
                )}
                
                {b.status === 'Direct Pay Confirmed' && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-4 mb-4">
                        <CheckCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-purple-400">Direct Payment Configuration Accepted</p>
                            <p className="text-xs text-gray-400 mt-1">Our field team will be dispatched shortly to begin the installation procedure based on your approved layout.</p>
                        </div>
                    </div>
                )}

                {b.documents && (
                    <div className="mt-6 pt-6 border-t border-white/5 grid md:grid-cols-2 gap-8">
                         <div>
                            <h3 className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Zap className="w-4 h-4"/> Authorized Hardware</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm bg-[#020617] p-4 rounded-xl border border-white/5">
                                <p><span className="text-gray-500">Panel:</span> {b.documents.panel_type}</p>
                                <p><span className="text-gray-500">Capacity:</span> {b.documents.capacity}</p>
                                <p><span className="text-gray-500">Inverter:</span> {b.documents.inverter_type}</p>
                                <p><span className="text-gray-500">Battery:</span> {b.documents.battery_type}</p>
                                <p><span className="text-gray-500">Rods:</span> {b.documents.rod_count} ({b.documents.rod_type})</p>
                                <p><span className="text-gray-500">Wires:</span> {b.documents.wire_type}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/> Your Documents</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm bg-[#020617] p-4 rounded-xl border border-white/5">
                                {['current_bill', 'aadhar_card', 'pan_card', 'bank_details', 'house_tax', 'bank_statement_6m'].map(k => (
                                    b.documents[k] ? <a key={k} href={b.documents[k]} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline capitalize flex items-center gap-1 truncate pr-2"><FileText className="w-3 h-3 shrink-0"/> {k.replace(/_/g, ' ')}</a> : <span key={k} className="text-gray-600 capitalize truncate pr-2">{k.replace(/_/g, ' ')}: N/A</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {b.status === 'Accepted' && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-4">
                        <p className="text-sm font-semibold text-green-400">Confirmed Appointment</p>
                        <p className="text-xs text-gray-400 mt-1">{b.confirmed_date}{b.confirmed_time ? ` @ ${formatDisplayTime(b.confirmed_time)}` : ''}</p>
                    </div>
                )}
                {b.documents?.final_invoice && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
                        <div>
                            <h3 className="font-bold text-blue-400 text-lg">Installation Complete</h3>
                            <p className="text-sm text-gray-400">Your final invoice has been generated.</p>
                        </div>
                        <a href={b.documents.final_invoice} target="_blank" rel="noreferrer" className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <Download className="w-5 h-5"/> Download Invoice
                        </a>
                    </div>
                )}

              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default CustomerBookings;
