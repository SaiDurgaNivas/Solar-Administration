import React from "react";
import { useTickets } from "../../context/TicketContext";
import { AlertCircle, CheckCircle, Trash2, ShieldAlert, Zap, HardHat, MapPin, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axiosConfig";

function Complaints() {
  const { tickets, clearTickets } = useTickets();
  const [activeTab, setActiveTab] = React.useState("Active"); // "Active" or "History"
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('installations/');
        setServices(res.data || []);
      } catch (err) {
        console.error("Service fetch err:", err);
      }
    };
    fetchServices();
  }, []);

  const getServiceForClient = (clientId) => {
    return services.find(s => s.client === clientId);
  };


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

        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
           <button onClick={() => setActiveTab("Active")} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'Active' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white'}`}>
              Active Issues
           </button>
           <button onClick={() => setActiveTab("History")} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'History' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}>
              Resolution History
           </button>
        </div>

        {/* Complaints Feed */}
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 right-10 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>


            {tickets.filter(t => activeTab === 'Active' ? t.status !== 'Resolved' : t.status === 'Resolved').length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center opacity-50"
                >
                    <CheckCircle className="w-20 h-20 text-gray-500 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-300">No {activeTab} Records</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">The complaint registry for this category is currently empty.</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {tickets
                            .filter(t => activeTab === 'Active' ? t.status !== 'Resolved' : t.status === 'Resolved')
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((ticket, i) => (
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
                                             <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-black text-gray-100 uppercase tracking-tight">{ticket.type} Request</h3>
                                                <span className="text-[10px] font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-500 uppercase tracking-widest">{ticket.ticket_no}</span>
                                             </div>
                                             <p className="text-xs text-orange-400 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                                                <HardHat className="w-3 h-3"/> Active Client: {ticket.client_name}
                                             </p>
                                        </div>
                                        <span className={`px-4 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${
                                            ticket.status === 'Resolved' 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </div>

                                    {/* Service Context Section */}
                                    {(() => {
                                        const service = getServiceForClient(ticket.client);
                                        return service ? (
                                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-4">
                                              <div className="bg-[#020617] p-3 rounded-xl border border-white/5 space-y-1 hover:border-blue-500/30 transition-colors">
                                                 <p className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-1.5"><Gauge className="w-3 h-3 text-blue-400"/> System Profile</p>
                                                 <p className="text-xs font-bold text-gray-200 truncate">{service.solar_panel_model} ({service.capacity})</p>
                                              </div>
                                              <div className="bg-[#020617] p-3 rounded-xl border border-white/5 space-y-1 hover:border-yellow-500/30 transition-colors">
                                                 <p className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-1.5"><Zap className="w-3 h-3 text-yellow-400"/> Power Core</p>
                                                 <p className="text-xs font-bold text-gray-200 truncate">{service.inverter_model}</p>
                                              </div>
                                              <div className="bg-[#020617] p-3 rounded-xl border border-white/5 space-y-1 hover:border-red-500/30 transition-colors">
                                                 <p className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-1.5"><MapPin className="w-3 h-3 text-red-400"/> Deployment</p>
                                                 <p className="text-xs font-bold text-gray-200 truncate">{service.address}</p>
                                              </div>
                                              <div className="bg-[#020617] p-3 rounded-xl border border-white/5 space-y-1 hover:border-green-500/30 transition-colors">
                                                 <p className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-1.5"><HardHat className="w-3 h-3 text-green-400"/> Lead Agent</p>
                                                 <p className="text-xs font-bold text-gray-200 truncate capitalize">{service.agent_name}</p>
                                              </div>
                                           </div>
                                        ) : null;
                                     })()}

                                    <div className="bg-[#020617]/80 p-5 rounded-2xl text-gray-300 mt-2 border border-white/5 shadow-inner italic leading-relaxed text-sm">
                                        "{ticket.description}"
                                    </div>
                                    
                                     <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-white/5 gap-4">
                                        <p className="text-[10px] text-gray-500 font-bold">Logged at: {new Date(ticket.created_at).toLocaleString()}</p>
                                        {ticket.status === 'Resolved' ? (
                                            <div className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/5 px-3 py-1 rounded-full border border-green-500/10">
                                                <CheckCircle className="w-3 h-3"/> Diagnostics Cleared {ticket.resolved_at ? new Date(ticket.resolved_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
                                                <Zap className="w-3 h-3"/> {ticket.assigned_worker_name ? `Assigned to: ${ticket.assigned_worker_name}` : 'Awaiting Dispatch'}
                                            </div>
                                        )}
                                     </div>

                                     {/* 📊 Admin Resolution Review */}
                                     {ticket.status === 'Resolved' && (ticket.resolution_photo || ticket.materials_used) && (
                                         <motion.div 
                                            initial={{ height: 0, opacity: 0 }} 
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-6 bg-[#020617] p-6 rounded-[2rem] border border-white/5 space-y-5"
                                         >
                                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                                 Field Operations Report
                                            </p>
                                            
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {ticket.resolution_photo && (
                                                    <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 relative group">
                                                        <img 
                                                           src={`http://127.0.0.1:8000${ticket.resolution_photo}`} 
                                                           alt="Site Verification" 
                                                           className="w-full h-40 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                        />
                                                        <div className="absolute bottom-3 left-4 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                                                            <span className="text-[8px] text-white font-black uppercase tracking-tighter">Site Completion Asset</span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {ticket.materials_used && (
                                                    <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 h-40 overflow-y-auto custom-scrollbar">
                                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Material Audit Log</p>
                                                        <p className="text-xs text-gray-400 leading-relaxed italic">{ticket.materials_used}</p>
                                                    </div>
                                                )}
                                            </div>
                                         </motion.div>
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
