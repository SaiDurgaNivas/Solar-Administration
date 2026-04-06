import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Zap, ShieldAlert,
  ArrowRight, FileText, Home, Activity, Globe, Cpu 
} from "lucide-react";

function Features() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500 selection:text-white pb-20">
      
      {/* 🏠 PREMIUM FLOATING HOME BUTTON */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 bg-white/5 backdrop-blur-3xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Home className="w-6 h-6 relative z-10 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300 drop-shadow-md" />
      </Link>

      <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight relative z-10">
          Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Features</span>
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto relative z-10">
          A deep dive into the engineering and capabilities driving modern solar grid orchestration.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-32">

        {/* Feature 1 */}
        <section id="customer-portal" className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
               <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Customer Portal Dashboard</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Our Customer Portal establishes absolute transparency between the energy provider and the consumer. End-users can securely log in to monitor their historical energy production, review live generation graphs, and pay recurring deployment bills natively.
            </p>
            <ul className="space-y-3 text-gray-300">
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Direct access to individual solar generation curves.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Secure role-based authentication bridging.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Embedded support ticketer.</li>
            </ul>
          </motion.div>
          <div className="bg-[#0f172a] border border-white/5 p-4 rounded-3xl relative overflow-hidden backdrop-blur-xl group">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-all"></div>
             <div className="bg-[#020617] h-80 rounded-2xl border border-white/5 flex items-center justify-center relative z-10 overflow-hidden">
                <Globe className="w-40 h-40 text-blue-500/20 animate-spin-slow" />
             </div>
          </div>
        </section>

        {/* Feature 2 */}
        <section id="telemetry-analytics" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#0f172a] border border-white/5 p-4 rounded-3xl relative overflow-hidden backdrop-blur-xl group order-2 md:order-1">
             <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-all"></div>
             <div className="bg-[#020617] h-80 rounded-2xl border border-white/5 flex items-center justify-center relative z-10 overflow-hidden">
                <BarChart3 className="w-40 h-40 text-yellow-500/20" />
             </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center mb-6 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
               <Activity className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Telemetry Analytics</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Track thousands of active nodes with sophisticated telemetry streams. Data points are aggregated from individual panels, passing through edge inverters directly to the admin hub for high-performance processing.
            </p>
            <ul className="space-y-3 text-gray-300">
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Live active Wattage & Voltage mapping.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Environmental loss calculation algorithms.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Aggregated fleet statistics filtering.</li>
            </ul>
          </motion.div>
        </section>

        {/* Feature 3 */}
        <section id="automated-billing" className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
               <FileText className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Automated PPA Billing</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Skip the manual invoicing. Solar Administration implements an entirely native payment architecture allowing customers to seamlessly settle their dues. Downpayments, subsidies, and outstanding PPA loans are algorithmically processed.
            </p>
            <ul className="space-y-3 text-gray-300">
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> One-click customer side payment portals.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Admin ledger & loan discrepancy tracking.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> PDF receipt and history generation.</li>
            </ul>
          </motion.div>
          <div className="bg-[#0f172a] border border-white/5 p-4 rounded-3xl relative overflow-hidden backdrop-blur-xl group">
             <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-all"></div>
             <div className="bg-[#020617] h-80 rounded-2xl border border-white/5 flex items-center justify-center relative z-10 overflow-hidden">
                <FileText className="w-40 h-40 text-green-500/20" />
             </div>
          </div>
        </section>

        {/* Feature 4 */}
        <section id="predictive-alerts" className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#0f172a] border border-white/5 p-4 rounded-3xl relative overflow-hidden backdrop-blur-xl group order-2 md:order-1">
             <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-all"></div>
             <div className="bg-[#020617] h-80 rounded-2xl border border-white/5 flex items-center justify-center relative z-10 overflow-hidden">
                <ShieldAlert className="w-40 h-40 text-red-500/20" />
             </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
               <Cpu className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Predictive Alerts & Notifications</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              When solar setups dip below peak efficiency thresholds, early diagnosis is paramount. Central dispatch natively captures anomaly flags and coordinates field agent operations through active dashboard syncs.
            </p>
            <ul className="space-y-3 text-gray-300">
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Agent dashboard integration.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Automated threshold triggering.</li>
               <li className="flex gap-2 items-center"><Zap className="w-5 h-5 text-orange-500"/> Cross-network system log aggregation.</li>
            </ul>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

export default Features;
