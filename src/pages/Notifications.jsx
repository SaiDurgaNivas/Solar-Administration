import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, PenTool, FileText, Trash2, ShieldAlert, Cpu } from "lucide-react";
import api from "../api/axiosConfig";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [customersRes, installationsRes, billsRes] = await Promise.all([
                api.get('users/?role=customer'),
                api.get('installations/'),
                api.get('bills/')
            ]);
            
            const customers = customersRes.data;
            const installations = installationsRes.data;
            const bills = billsRes.data;

            let notifs = [];

            // System Alert Simulation
            notifs.push({
               id: 'sys-1', date: new Date().toISOString(),
               icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30",
               title: "Security Scan Completed",
               message: "No unauthorized breaches detected in the administrative layer today.",
               time: "System - Auto-generated"
            });

            // 1. Installation Notifications
            installations.forEach(inst => {
                const isUpdated = inst.status === "In Progress" || inst.status === "Completed";
                const isCompleted = inst.status === "Completed";
                
                notifs.push({
                    id: `inst-${inst.id}`, date: inst.date || "2026-04-01",
                    icon: isCompleted ? CheckCircle : PenTool, 
                    color: isCompleted ? "text-green-400" : "text-orange-400", 
                    bg: isCompleted ? "bg-green-500/10" : "bg-orange-500/10", 
                    border: isCompleted ? "border-green-500/20" : "border-orange-500/20",
                    title: isUpdated ? `Field Agent Update: ${inst.status}` : "New Installation Requested",
                    message: isUpdated 
                        ? `The Field Agent has visited the customer site and updated the installation status to ${inst.status} for ${inst.client_name || 'unknown'}.`
                        : `Customer ${inst.client_name || 'unknown'} has requested a new solar installation for their property.`,
                    time: isUpdated ? "Live Field Sync" : "Hardware Provisioning"
                });
            });

            // 2. Billing Notifications
            bills.forEach(bill => {
                const isPaid = bill.status === "Paid";
                notifs.push({
                    id: `bill-${bill.id}`, date: bill.date || "2026-04-01",
                    icon: FileText, color: isPaid ? "text-green-400" : "text-blue-400", bg: isPaid ? "bg-green-500/10" : "bg-blue-500/10", border: isPaid ? "border-green-500/20" : "border-blue-500/20",
                    title: isPaid ? "Payment Received" : "Invoice Issued",
                    message: isPaid 
                      ? `Customer ${bill.client_name || 'unknown'} successfully paid their bill of ₹${bill.amount}.`
                      : `A new bill of ₹${bill.amount} was issued to customer ${bill.client_name || 'unknown'}.`,
                    time: "Finance Ledger"
                });
            });

            notifs.sort((a,b) => b.id.localeCompare(a.id));
            setNotifications(notifs);

        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const clearAll = () => {
    setNotifications([]);
  };

  const removeAlert = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans overflow-hidden relative">
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)] relative">
                 <Bell className="w-8 h-8 text-orange-400" />
                 {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                 )}
                 {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
                 )}
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Global Alerts</h1>
                <p className="text-gray-400 text-sm mt-1 font-medium">Monitoring system operations across the network</p>
              </div>
            </div>

            <button 
                onClick={clearAll}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-inner"
            >
                <Trash2 className="w-4 h-4"/> Dismiss All
            </button>
        </div>

        {/* Notifications Feed */}
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="h-28 bg-white/5 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center"
                >
                    <CheckCircle className="w-20 h-20 text-green-500/50 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-300">All Clear</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">There are currently no active alerts or notifications in the system ledger.</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {notifications.map((note, i) => (
                            <motion.div 
                                key={note.id}
                                layout
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, padding: 0, overflow: "hidden" }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 md:p-6 bg-[#020617]/50 rounded-2xl border shadow-lg ${note.border} group`}
                            >
                                <div className={`p-4 rounded-xl ${note.bg} shrink-0`}>
                                    <note.icon className={`w-7 h-7 ${note.color}`} />
                                </div>
                                
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <h3 className="text-lg font-bold text-gray-100">{note.title}</h3>
                                    </div>
                                    <p className="text-gray-400 mt-1.5 leading-relaxed pr-8">{note.message}</p>
                                    
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                        <Cpu className="w-3 h-3 text-gray-600"/> {note.time}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => removeAlert(note.id)}
                                    className="absolute top-6 right-6 sm:relative sm:top-0 sm:right-0 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                >
                                    <XIcon className="w-5 h-5"/>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

// Inline X icon for dismissal
function XIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
    );
}

export default Notifications;
