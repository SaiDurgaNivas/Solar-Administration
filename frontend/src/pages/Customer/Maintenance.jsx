import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, AlertTriangle, CheckCircle, Clock, ShieldCheck, Activity, Search, ArrowRight, Zap, Filter, HelpCircle } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

function Maintenance() {
  const [formData, setFormData] = useState({
    issueType: 'general',
    description: '',
  });

  const { tickets, addTicket } = useTickets();
  const [submitted, setSubmitted] = useState(false);

  // Filter context tickets
  const pastRequests = tickets;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description.trim() === '') return;
    
    // Global Context submission
    addTicket('Customer (Local)', formData.issueType, formData.description);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ issueType: 'general', description: '' });
    }, 4000);
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      
      {/* 🔮 Background Ambience - Premium Mesh Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 🏷️ Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 bg-white/[0.02] backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Wrench className="w-40 h-40 text-orange-500 rotate-12" />
            </div>
            <div className="relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-orange-500/20">
                    System Maintenance
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4 justify-center md:justify-start">
                    Maintenance & Repairs
                </h1>
                <p className="text-gray-400 mt-3 text-lg font-medium max-w-xl leading-relaxed">
                    Access our tier-one hardware engineering pool. Report technical anomalies or request preventive optimization for your solar array.
                </p>
            </div>
            <div className="flex gap-4">
                <div className="text-center bg-[#020617] border border-white/10 px-6 py-4 rounded-3xl">
                    <p className="text-orange-500 text-2xl font-black">{pastRequests.length}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Active Tickets</p>
                </div>
                <div className="text-center bg-[#020617] border border-white/10 px-6 py-4 rounded-3xl">
                    <p className="text-green-500 text-2xl font-black">24/7</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Global Support</p>
                </div>
            </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* 📝 LEFT COLUMN: Request Form (8 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group"
          >
            <AnimatePresence>
              {submitted && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 bg-[#0f172a]/98 backdrop-blur-3xl flex flex-col items-center justify-center z-50 p-12 text-center"
                >
                  <motion.div 
                     initial={{ rotate: -90, scale: 0 }}
                     animate={{ rotate: 0, scale: 1 }}
                     transition={{ type: "spring", damping: 12 }}
                     className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/30"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Signal Transmitted!</h3>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                    Our hardware engineering desk in <span className="text-orange-400 font-bold">Hyderabad</span> has received your brief. Expect a diagnostic response within the next few cycles.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                   <Zap className="w-6 h-6 text-orange-500" /> Submit Request
                </h2>
                <div className="h-px flex-grow mx-6 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Anomaly Classification</label>
                    <div className="relative group/sel">
                        <Filter className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-hover/sel:text-orange-500 transition-colors" />
                        <select 
                            title="Select Issue Type"
                            value={formData.issueType}
                            onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                            className="w-full bg-[#020617] border border-white/5 group-hover/sel:border-orange-500/30 rounded-2xl px-12 py-4 text-white focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none cursor-pointer text-sm font-semibold"
                        >
                            <option value="general">Standard Maintenance</option>
                            <option value="inverter">SH-Inverter Malfunction</option>
                            <option value="panel">PV-Array Integrity Issue</option>
                            <option value="wiring">Grid-Link/Electrical</option>
                            <option value="other">Other Unspecified Anomaly</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Priority Level</label>
                    <div className="flex gap-2">
                        {['Low', 'Medium', 'Critical'].map(p => (
                            <button key={p} type="button" className={`flex-1 py-3.5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${p === 'Critical' ? 'border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10' : 'border-white/5 text-gray-500 bg-white/[0.02] hover:bg-white/5'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Technical Brief</label>
                <div className="relative">
                    <textarea 
                        required
                        placeholder="Detail the exact symptoms, hardware behavior, or maintenance requirements..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-[#020617] border border-white/5 focus:border-orange-500/40 rounded-[2rem] px-8 py-8 text-white focus:ring-4 focus:ring-orange-500/5 transition-all outline-none min-h-[220px] resize-none text-sm leading-relaxed"
                    />
                    <HelpCircle className="absolute right-6 bottom-6 w-6 h-6 text-gray-800" />
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-[1.5rem] p-6 flex gap-6 items-start">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                  </div>
                  <div>
                      <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-1">Emergency Protocol</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-semibold italic">
                        In case of electrical arcing, smoke, or fire, immediately activate the DC Isolator and contact your local utility grid control room.
                      </p>
                  </div>
              </div>

              <button 
                type="submit"
                className="group relative w-full overflow-hidden rounded-[1.5rem] bg-orange-500 p-px"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 transition-all group-hover:scale-105"></div>
                <div className="relative flex items-center justify-center gap-3 bg-transparent py-5 px-8 transition-colors">
                  <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Raise Diagnostic Ticket</span>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </form>
          </motion.div>

          {/* 📊 RIGHT COLUMN: Insights & History (4 cols) */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* 🛡️ AMC Card - Holographic Glass */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-[#020617] border border-white/10 rounded-[2.8rem] p-10 overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] rounded-full"></div>
                    
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <ShieldCheck className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Contract ID</p>
                           <p className="font-mono text-xs text-indigo-400/60">SN-AMC-2402-2B</p>
                        </div>
                    </div>

                    <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Protection Tier</h3>
                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-5xl font-black text-white italic tracking-tighter">Gold</span>
                        <span className="text-green-400 font-black uppercase text-[10px] tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 animate-pulse">ACTIVE</span>
                    </div>

                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10 flex-grow">
                        Your <span className="text-white">SolarNode Gold Protection</span> is active through Dec 2028. Covers bi-annual cleaning, inverter recalibration, and priority engineering dispatch.
                    </p>

                    <div className="flex items-center gap-4 py-4 px-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">Next Inspection</p>
                            <p className="text-[10px] text-gray-500 font-semibold italic">Scheduled for June 15, 2026</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                </div>
            </motion.div>

            {/* 🕰️ Timeline Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0f172a]/40 border border-white/10 rounded-[2.8rem] p-10 backdrop-blur-xl shadow-xl flex flex-col min-h-[400px]"
            >
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                       <Clock className="w-5 h-5 text-gray-500" /> Timeline
                    </h3>
                    <Search className="w-4 h-4 text-gray-600 hover:text-white cursor-pointer transition-colors" />
                </div>
                
                <div className="flex-grow space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    {pastRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale">
                            <Wrench className="w-16 h-16 mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">No request logs</p>
                        </div>
                    ) : (
                        pastRequests.map((req, i) => (
                            <div key={i} className="group flex items-start gap-5 relative pb-6 border-l-2 border-white/5 ml-3 pl-8 last:border-0 last:pb-0">
                                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-[#0f172a] border-2 border-orange-500 rounded-full group-hover:scale-125 transition-transform"></div>
                                <div className="flex-1 bg-white/[0.03] border border-white/5 p-5 rounded-3xl hover:bg-white/[0.06] hover:border-orange-500/20 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-tighter mb-0.5">{req.type}</p>
                                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{req.ticket_no}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                            req.status === 'Resolved' 
                                                ? 'bg-green-500/10 text-green-400' 
                                                : 'bg-orange-500/10 text-orange-400'
                                        }`}>
                                            {req.status}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-[10px] text-gray-600 font-bold italic">{new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        <button className="p-2 bg-[#020617] rounded-lg text-gray-500 hover:text-white transition">
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="pt-8 mt-4 border-t border-white/5 text-center">
                    <button className="text-[10px] font-black text-gray-500 hover:text-orange-500 uppercase tracking-[0.5em] transition-all group">
                        Enter Command History <ArrowRight className="inline w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
