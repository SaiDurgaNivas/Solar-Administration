import React from "react";
import { useTickets } from "../../context/TicketContext";
import { AlertCircle, CheckCircle, Trash2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Complaints() {
  const { tickets, clearTickets } = useTickets();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans overflow-hidden relative">
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.15)] relative">
                 <ShieldAlert className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Service Complaints</h1>
                <p className="text-gray-400 text-sm mt-1 font-medium">Customer maintenance requests tracking system</p>
              </div>
            </div>

            <button 
                onClick={clearTickets}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-inner"
            >
                <Trash2 className="w-4 h-4"/> Clear Registry
            </button>
        </div>

        {/* Complaints Feed */}
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

            {tickets.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center"
                >
                    <CheckCircle className="w-20 h-20 text-green-500/50 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-300">All Clear!</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">There are no active customer maintenance requests.</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {tickets.map((ticket, i) => (
                            <motion.div 
                                key={ticket.id}
                                layout
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                                className={`flex flex-col sm:flex-row items-start gap-5 p-5 md:p-6 bg-[#020617]/50 rounded-2xl border shadow-lg ${ticket.status === 'Resolved' ? 'border-green-500/20 bg-green-500/5' : 'border-orange-500/20'}`}
                            >
                                <div className={`p-4 rounded-xl shrink-0 ${ticket.status === 'Resolved' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                                    {ticket.status === 'Resolved' ? (
                                        <CheckCircle className="w-7 h-7 text-green-400" />
                                    ) : (
                                        <AlertCircle className="w-7 h-7 text-orange-400" />
                                    )}
                                </div>
                                
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start w-full">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-100">{ticket.id} - {ticket.type.toUpperCase()}</h3>
                                            <p className="text-xs text-gray-400 font-bold mb-2">Customer: {ticket.customerName} • {new Date(ticket.createdAt).toLocaleString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${
                                            ticket.status === 'Resolved' 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-xl text-gray-300 mt-2 border border-white/5">
                                        {ticket.description}
                                    </div>
                                    
                                    {ticket.status === 'Resolved' && (
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 text-sm font-bold text-green-400">
                                            <CheckCircle className="w-4 h-4"/> Complaint cleared with proper diagnostic protocol on {new Date(ticket.resolvedAt).toLocaleString()}
                                        </div>
                                    )}
                                </div>
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

export default Complaints;
