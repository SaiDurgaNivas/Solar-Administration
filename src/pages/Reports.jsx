import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Activity, CheckCircle, Clock, Zap, FileText } from "lucide-react";
import api from "../api/axiosConfig";

function Reports() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalCollected: 0,
    totalPendingAmount: 0,
    activeSystems: 0,
    pendingSystems: 0,
    recentPayments: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [billsRes, installationsRes] = await Promise.all([
           api.get("bills/"),
           api.get("installations/")
        ]);

        const bills = billsRes.data;
        const installs = installationsRes.data;

        // Calculate Revenue
        const collected = bills
          .filter(b => b.status === "Paid")
          .reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
          
        const pending = bills
          .filter(b => b.status === "Unpaid")
          .reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

        // Calculate Infrastructure
        const activeSys = installs.filter(i => i.status === "Active" || i.status === "Completed").length;
        const pendingSys = installs.filter(i => i.status === "Pending").length;

        // Get Recent Payments 
        const recent = bills
          .filter(b => b.status === "Paid")
          .sort((a,b) => b.id.toString().localeCompare(a.id.toString()))
          .slice(0, 5);

        setData({
          totalCollected: collected,
          totalPendingAmount: pending,
          activeSystems: activeSys,
          pendingSystems: pendingSys,
          recentPayments: recent
        });

      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans overflow-x-hidden relative pb-32">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Setup */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              Monthly Intelligence Report
            </h1>
            <p className="text-gray-400 text-lg mt-2 font-medium">A simplified overview of your company's complete performance.</p>
        </motion.div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <TrendingUp className="w-16 h-16 text-orange-500/50 mb-4" />
                <p className="text-xl text-gray-400 font-bold">Compiling Financial Data...</p>
            </div>
        ) : (
            <>
              {/* 🔹 Core English Metrics */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                  
                  {/* Financial Report Box */}
                  <motion.div 
                     initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                     className="bg-[#0f172a]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full"></div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                        <TrendingUp className="w-8 h-8 text-green-400" /> Financial Health
                      </h2>
                      
                      <div className="space-y-6">
                         <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <p className="text-gray-400 font-medium mb-1">Company has successfully collected:</p>
                            <h3 className="text-4xl font-extrabold text-green-400 tracking-tight">₹{data.totalCollected.toLocaleString()}</h3>
                            <p className="text-xs text-gray-500 mt-2 tracking-wide uppercase font-bold">Total clear revenue</p>
                         </div>
                         <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                            <p className="text-gray-400 font-medium mb-1">Customers still owe administration:</p>
                            <h3 className="text-3xl font-extrabold text-yellow-500 tracking-tight">₹{data.totalPendingAmount.toLocaleString()}</h3>
                            <p className="text-xs text-gray-500 mt-2 tracking-wide uppercase font-bold">Awaiting invoice clearance</p>
                         </div>
                      </div>
                  </motion.div>

                  {/* Operational Health Box */}
                  <motion.div 
                     initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                     className="bg-[#0f172a]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-2xl rounded-full"></div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                        <Activity className="w-8 h-8 text-orange-400" /> Infrastructure Scale
                      </h2>
                      
                      <div className="space-y-6">
                         <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="p-4 bg-orange-500/10 rounded-xl">
                               <Zap className="w-8 h-8 text-orange-400"/>
                            </div>
                            <div>
                               <h3 className="text-3xl font-extrabold text-white">{data.activeSystems} Systems</h3>
                               <p className="text-gray-400 font-medium mt-1">Currently active & generating power</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-5 bg-white/5 p-5 rounded-2xl border border-white/5">
                            <div className="p-4 bg-blue-500/10 rounded-xl">
                               <Clock className="w-8 h-8 text-blue-400"/>
                            </div>
                            <div>
                               <h3 className="text-3xl font-extrabold text-white">{data.pendingSystems} Bookings</h3>
                               <p className="text-gray-400 font-medium mt-1">Awaiting hardware installation</p>
                            </div>
                         </div>
                      </div>
                  </motion.div>

              </div>

              {/* 🔹 Financial Action History */}
              <motion.div 
                 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                 className="bg-[#0f172a]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl"
              >
                 <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">Latest Successful Transactions</h2>
                        <p className="text-gray-400 mt-1">Recent payments physically collected from your clients.</p>
                    </div>
                    <FileText className="w-10 h-10 text-gray-600 opacity-50" />
                 </div>

                 {data.recentPayments.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 border border-white/5 rounded-2xl">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="font-semibold text-lg">No Revenue Logged Yet</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                        {data.recentPayments.map(pay => (
                            <div key={pay.id} className="bg-[#020617]/50 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition">
                               <div className="flex items-center gap-4">
                                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                     <CheckCircle className="w-6 h-6 text-green-400" />
                                  </div>
                                  <div>
                                     <p className="text-lg font-bold text-gray-200">Payment Processed</p>
                                     <p className="text-gray-400 text-sm mt-0.5">
                                        Client <span className="text-orange-400 font-semibold">{pay.client_name || "Unknown"}</span> paid invoice #{pay.bill_no} successfully.
                                     </p>
                                  </div>
                               </div>
                               <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-center sm:text-right">
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Amount</p>
                                  <p className="text-xl font-extrabold text-green-400">₹{parseFloat(pay.amount).toLocaleString()}</p>
                               </div>
                            </div>
                        ))}
                    </div>
                 )}
              </motion.div>
            </>
        )}
      </div>
    </div>
  );
}

export default Reports;
