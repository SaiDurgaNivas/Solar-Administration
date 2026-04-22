import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CheckCircle, Zap, Shield, IndianRupee, Layers, FileText } from 'lucide-react';

const panels = [
  {
    name: "RC Premium Monocrystalline",
    image: "file:///C:/Users/K.%20Sai%20Durga%20Nivas/.gemini/antigravity/brain/b964639b-9118-4778-ad58-c217be38a362/monocrystalline_solar_panel_1776788107079.png",
    wattage: "550W",
    type: "Solar Panel",
    efficiency: "22.5%",
    price: "₹26,500",
    color: "orange",
    description: "Our flagship high-efficiency panel using advanced monocrystalline cells for maximum yield in minimal space.",
    pros: ["RC 25-Year Performance Guarantee", "Superior Low-Light Performance", "Advanced Heat Dissipation"],
    popular: true
  },
  {
    name: "TATA Power Solar Monocrystalline",
    image: "/images/tata_solar.png",
    wattage: "540W",
    type: "Solar Panel",
    efficiency: "21.5%",
    price: "₹24,500",
    color: "blue",
    description: "Industry-leading reliability from TATA. High output monocrystalline cells perfect for compact residential roofs.",
    pros: ["Tier-1 TATA Guarantee", "Excellent durability", "High weather resistance"],
  },
  {
    name: "Waaree Bifacial N-Type",
    image: "/images/waaree_bifacial.png",
    wattage: "600W",
    type: "Solar Panel",
    efficiency: "22.8%",
    price: "₹32,000",
    color: "orange",
    description: "Premium Waaree bifacial technology generating power from both front and rear light reflection.",
    pros: ["Highest space efficiency", "Picks up reflective light", "Slowest degradation rate"],
  },
  {
    name: "Adani Elan Polycrystalline",
    image: "/images/adani_poly.png",
    wattage: "330W",
    type: "Solar Panel",
    efficiency: "17%",
    price: "₹16,000",
    color: "purple",
    description: "A highly cost-effective Adani panel meant for large-scale utility and expansive commercial rooftops.",
    pros: ["Lower upfront cost", "Trusted Adani build quality", "Good for large installations"],
  },
  {
    name: "Luminous Solar Inverter",
    image: "/images/luminous_inv.png",
    wattage: "5kVA",
    type: "Solar Inverter",
    efficiency: "98.5%",
    price: "₹45,000",
    color: "green",
    description: "Pure Sine Wave Luminous inverter designed to flawlessly convert DC energy and sync with the power grid.",
    pros: ["Pure Sine Wave", "Heavy Duty Setup", "Smart WiFi Monitoring"],
  },
  {
    name: "V-Guard Hybrid Inverter",
    image: "/images/vguard_inv.png",
    wattage: "3kVA",
    type: "Solar Inverter",
    efficiency: "97%",
    price: "₹35,000",
    color: "red",
    description: "V-Guard's hybrid inverter model seamlessly switching between solar, grid, and battery storage.",
    pros: ["Hybrid Grid Support", "Battery Backup Ready", "V-Guard Warranty"],
  }
];

const materials = [
  {
    component: "Tempered Solar Glass",
    feature: "Anti-reflective & Hail-resistant",
    desc: "The front layer protects the delicate internal cells from baseball-sized hail, heavy snow loads, and debris while allowing 98% of sunlight through."
  },
  {
    component: "EVA Encapsulant",
    feature: "Ethylene Vinyl Acetate",
    desc: "A protective transparent polymer layer that binds the glass and solar cells together, preventing moisture and dirt penetration for 25+ years."
  },
  {
    component: "Anodized Aluminum Frame",
    feature: "Structural Integrity",
    desc: "The rigid metallic border resists rust, extremely high winds, and structural flex, ensuring the glass never shatters under tension."
  },
  {
    component: "Polymer Backsheet",
    feature: "Electrical Insulation",
    desc: "The solid white or black bottom layer acts as a fierce electrical insulator, preventing moisture ingress and catastrophic electrical shorts."
  }
];

function HardwareCatalog() {
  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0f172a]/50 p-8 shadow-xl rounded-[2rem] border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-50%] w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white flex items-center gap-4 mb-3 tracking-tight">
            <Sun className="text-orange-500 w-10 h-10" />
            Solar Technology & Hardware
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl">
            Understand exactly what powers your roof. Transparent pricing, structural materials, and technical specifications tailored for you.
          </p>
        </div>
      </div>

      {/* Pricing Catalog */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Zap className="text-orange-500 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Panel Models & Pricing Estimate</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {panels.map((panel, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-[#020617] border shadow-2xl rounded-3xl p-0 flex flex-col group transition-all hover:-translate-y-2 overflow-hidden ${panel.popular ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : 'border-white/10 hover:border-white/20'}`}
            >
              {panel.popular && (
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Hardware Image */}
              <div className="w-full h-48 relative overflow-hidden bg-white/5">
                <img 
                  src={panel.image} 
                  alt={panel.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
              </div>

              <div className="p-8 pt-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 pr-4">{panel.name}</h3>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-${panel.color}-500/10 text-${panel.color}-400 border border-${panel.color}-500/20`}>
                        Output: {panel.wattage}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-3xl font-black text-white flex items-center mb-1">
                      {panel.price} <span className="text-xs text-gray-500 font-medium ml-2">/ per unit</span>
                    </p>
                    <p className="text-xs text-green-400 font-bold tracking-wide uppercase">Efficiency: {panel.efficiency}</p>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 italic border-l-2 border-white/10 pl-4 py-1">
                    "{panel.description}"
                  </p>

                  <div className="space-y-3 mt-auto border-t border-white/5 pt-6">
                    {panel.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-500 shrink-0 group-hover:text-orange-500 transition-colors" />
                        <span className="text-sm font-medium text-gray-300">{pro}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Materials Breakdown */}
      <div className="bg-[#0f172a]/40 border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-32 bg-blue-500/5 blur-[80px] -rotate-12 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-10 relative z-10">
          <Layers className="text-blue-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Anatomy & Materials</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
            {materials.map((mat, i) => (
                <div key={i} className="flex flex-col">
                    <h3 className="text-lg font-extrabold text-gray-200 mb-1">{mat.component}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">{mat.feature}</p>
                    <p className="text-sm leading-relaxed text-gray-400">{mat.desc}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Customer Explanation Guide */}
      <div className="bg-gradient-to-br from-orange-500/10 to-[#0f172a] border border-orange-500/20 rounded-[2rem] p-8 md:p-12 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-orange-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Understanding Your Investment</h2>
        </div>
        
        <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
                When you invest in an RC Solar Solutions roof system, you aren't just buying glass and wire—you are purchasing a 25-year miniature power plant. The combination of our <strong className="text-white">Anodized Aluminum Frames</strong> and <strong className="text-white">Tempered Glass</strong> means your panels will easily survive fierce monsoons, harsh summers, and zero-maintenance conditions.
            </p>
            <p>
                As seen in the catalog above, choosing a <strong className="text-orange-400">Premium Monocrystalline</strong> panel might cost slightly more per unit (₹26,000 vs ₹18,500), but its 22% efficiency means you generate significantly more electricity in a smaller roof space. This drastically shortens your Return on Investment (ROI) time, meaning the system literally pays for itself much faster.
            </p>
            <div className="flex items-start gap-4 p-5 bg-[#020617] rounded-2xl border border-white/5 mt-6">
                <Shield className="w-8 h-8 text-green-400 shrink-0" />
                <p className="text-sm text-gray-400 font-medium">
                    All components listed here strictly comply with <span className="text-white">IEC/BS Certifications</span> and are backed by our <span className="text-green-400">25-Year Performance Guarantee</span>. You are fully protected.
                </p>
            </div>
        </div>
      </div>

    </div>
  );
}

export default HardwareCatalog;
