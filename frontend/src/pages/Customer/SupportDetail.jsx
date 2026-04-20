import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Mail, Briefcase, Download, ShieldCheck, Zap, Cog, History, Send } from "lucide-react";

function SupportDetail() {
  const { type } = useParams();
  const navigate = useNavigate();

  const getContent = () => {
    switch (type) {
      case "comm-link":
        return {
          title: "Comm Link Array",
          subtitle: "Established Secure Neural Connection",
          icon: MessageSquare,
          color: "text-blue-400",
          bg: "from-blue-500/20",
          render: (
            <div className="space-y-8">
              <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-40 h-40" /></div>
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Agent Status: Online</h3>
                 <p className="text-gray-400 leading-relaxed mb-6">
                    Our Comm Link system uses end-to-end encrypted signals to connect you directly with a dedicated SolarNode agent. 
                    Agents are trained to handle hardware troubleshooting, administrative queries, and system optimization.
                 </p>
                 <div className="grid grid-cols-2 gap-4 text-sm font-mono uppercase tracking-widest text-gray-500">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">Encryption: 256-bit</div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">Latency: &lt; 40ms</div>
                 </div>
              </div>
              <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 p-8 rounded-3xl">
                 <h3 className="text-lg font-bold mb-4">Start a Secure Session</h3>
                 <div className="space-y-4">
                    <div className="h-64 bg-[#020617]/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-gray-600 italic text-sm">
                       Session waiting for user initiation...
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition shadow-lg shadow-blue-600/20">
                        Initiate Handshake
                    </button>
                 </div>
              </div>
            </div>
          )
        };
      case "engineering-desk":
        return {
          title: "Engineering Desk",
          subtitle: "Hardware Diagnostic & Maintenance Portal",
          icon: Mail,
          color: "text-orange-400",
          bg: "from-orange-500/20",
          render: (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                 {[
                   { label: "Hardware Lab", icon: Cog, desc: "Inverter & Panel queries" },
                   { label: "Grid Interface", icon: Zap, desc: "Connection issues" },
                   { label: "Efficiency Lab", icon: ShieldCheck, desc: "Performance drops" }
                 ].map((item, i) => (
                   <div key={i} className="bg-[#0f172a] border border-white/10 p-5 rounded-2xl hover:border-orange-500/30 transition group">
                      <item.icon className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition" />
                      <h4 className="font-bold text-white mb-1">{item.label}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-black">{item.desc}</p>
                   </div>
                 ))}
              </div>
              <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl">
                 <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Send className="w-5 h-5 text-orange-400" /> Submit Technical Brief</h3>
                 <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Anomaly Category</label>
                          <select className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl outline-none text-sm text-white">
                             <option>Power Output Variance</option>
                             <option>Inverter Warning Light</option>
                             <option>Physical Panel Damage</option>
                             <option>Smart Meter Desync</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Asset Serial Number</label>
                          <input type="text" placeholder="e.g. SN-INV-9920" className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl outline-none text-sm" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Detailed Diagnostic Description</label>
                       <textarea rows="5" placeholder="Describe the behavior observed in detail..." className="w-full bg-[#020617] border border-white/10 p-4 rounded-2xl outline-none text-sm resize-none"></textarea>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest py-4 px-10 rounded-xl transition shadow-xl shadow-orange-500/20">
                       Transmit to Lab
                    </button>
                 </form>
              </div>
            </div>
          )
        };
      case "hardware-manuals":
        return {
          title: "Hardware Archive",
          subtitle: "Digital Documentation & Grid Standards",
          icon: Briefcase,
          color: "text-green-400",
          bg: "from-green-500/20",
          render: (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-[#0f172a] border border-white/10 p-6 rounded-3xl">
                 <div className="flex items-center gap-4">
                    <History className="w-8 h-8 text-green-400" />
                    <div>
                       <h4 className="font-bold">Last Updated: March 2026</h4>
                       <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Archive Sync Status: 100%</p>
                    </div>
                 </div>
                 <button className="bg-white/5 hover:bg-white/10 p-3 rounded-full transition"><Download className="w-5 h-5" /></button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 {[
                   { title: "SolarNode Grid Protocols", ver: "v4.0.2", size: "12.4 MB", desc: "Detailed specifications for connecting your array to the local utility smart grid." },
                   { title: "Hardware Safety Index", ver: "v2.1.0", size: "3.2 MB", desc: "Critical safety warnings and emergency shutdown procedures for all SolarNode assets." },
                   { title: "Smart-Hybrid Inverter Manual", ver: "v8.5.1", size: "8.7 MB", desc: "Programming and maintenance guide for the SH-Series hybrid power electronics." },
                   { title: "Efficiency Calibration Guide", ver: "v1.2.0", size: "2.1 MB", desc: "Best practices for panel cleaning and optimal tilt configuration for maximum yield." }
                 ].map((doc, i) => (
                   <motion.div 
                     key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                     className="bg-[#0f172a] border border-white/10 p-6 rounded-3xl hover:border-green-500/30 transition group"
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-[#020617] rounded-xl group-hover:scale-110 transition"><Briefcase className="w-6 h-6 text-green-400" /></div>
                         <span className="text-[10px] font-black uppercase text-gray-500 tracking-tighter bg-white/5 px-2 py-1 rounded-md">{doc.ver}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{doc.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed mb-6">{doc.desc}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                         <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{doc.size} PDF</span>
                         <button className="flex items-center gap-2 text-green-400 font-bold text-xs hover:underline uppercase">
                            <Download className="w-4 h-4" /> Download Access
                         </button>
                      </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          )
        };
      default:
        return null;
    }
  };

  const data = getContent();
  if (!data) return navigate("/customer-dashboard/support");

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans overflow-x-hidden pb-20">
      {/* Dynamic Background */}
      <div className={`absolute top-0 left-0 w-full h-96 bg-gradient-to-b ${data.bg} to-transparent opacity-30 pointer-events-none`}></div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Header Navigation */}
        <button 
            onClick={() => navigate("/customer-dashboard/support")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-10 group"
        >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition"><ArrowLeft className="w-5 h-5" /></div>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Signal Dispatch</span>
        </button>

        {/* Title Block */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left">
            <div className="p-6 bg-[#0f172a] rounded-[2rem] border border-white/10 shadow-2xl">
                <data.icon className={`w-12 h-12 ${data.color}`} />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{data.title}</h1>
                <p className={`text-sm font-black uppercase tracking-[0.3em] ${data.color}`}>{data.subtitle}</p>
            </div>
        </div>

        {/* Content Render */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {data.render}
        </motion.div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">SolarNode Authorized Diagnostic Environment</p>
        </div>
      </div>
    </div>
  );
}

export default SupportDetail;
