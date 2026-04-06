import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center bg-[#0f172a]/50 p-6 shadow-xl rounded-2xl border border-white/5 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Wrench className="text-orange-500 w-8 h-8" />
            Maintenance & Repairs
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Request service or report technical faults for your installation.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Request Form */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0f172a]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {submitted && (
            <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-3xl flex flex-col items-center justify-center z-20">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-gray-400 text-center max-w-sm px-4">Our support engineering team has received your ticket and will contact you within 24 hours.</p>
            </div>
          )}

          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Submit New Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Issue Type</label>
              <select 
                title="Select Issue Type"
                value={formData.issueType}
                onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none"
              >
                <option value="general">General Maintenance / Cleaning</option>
                <option value="inverter">Inverter Malfunction</option>
                <option value="panel">Physical Panel Damage</option>
                <option value="wiring">Wiring / Electrical Issue</option>
                <option value="other">Other / Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Detailed Description</label>
              <textarea 
                required
                placeholder="Please describe the exact problem you are facing..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none min-h-[160px] resize-none"
              />
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-4 items-start">
                <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-200/80 leading-relaxed">
                    If this is a critical electrical emergency, please step away from the panels and contact your local emergency thermal team immediately.
                </p>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-orange-500 text-black font-extrabold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transform hover:-translate-y-1"
            >
              Raise Maintenance Ticket
            </button>
          </form>
        </motion.div>

        {/* Support Details & History */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <div className="bg-gradient-to-br from-indigo-900/40 to-[#0f172a] border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">AMC Warranty Status</h3>
                <div className="flex items-end gap-3 mb-6 relative z-10">
                    <span className="text-4xl font-black text-indigo-400">Active</span>
                    <span className="text-gray-400 text-sm mb-1">valid until Dec 2028</span>
                </div>
                <p className="text-sm text-gray-400 relative z-10">
                    Your Annual Maintenance Contract is fully active. Most standard service requests, including bi-annual cleanings and inverter diagnostics, are free of charge.
                </p>
            </div>

            <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Past Work Orders</h3>
                
                <div className="space-y-4">
                    {pastRequests.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No past maintenance requests found.</p>
                    ) : (
                        pastRequests.map((req, i) => (
                            <div key={i} className="flex flex-col gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-default">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center text-gray-500">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white uppercase">{req.type}</p>
                                            <p className="text-xs text-gray-500 font-mono">{req.id} • {new Date(req.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${
                                        req.status === 'Resolved' 
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                            : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                    }`}>
                                        {req.status}
                                    </span>
                                </div>
                                {req.status === 'Resolved' && req.resolvedAt && (
                                    <p className="text-xs text-green-400 border-t border-white/5 pt-2 mt-1">
                                        Complaint cleared on {new Date(req.resolvedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                    
                    <div className="text-center pt-4">
                        <button className="text-sm text-orange-500 font-semibold hover:text-orange-400">View All History</button>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Maintenance;
