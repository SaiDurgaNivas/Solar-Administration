import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Coins, Wrench, Clock, TrendingUp, Sun, 
  CheckCircle, ShieldCheck, Zap
} from "lucide-react";

const advantageData = {
  "reduces-electricity-bills": {
    title: "Reduces Electricity Bills",
    icon: <Coins className="w-12 h-12 text-orange-500" />,
    heroText: "Drastically cut your monthly grid energy expenses with highly efficient roof-top generation.",
    fullDetails: [
      "Solar power allows you to generate your own electricity, significantly reducing your reliance on traditional energy grids. As soon as your solar panels are active, your monthly electricity bills will drop dramatically, and in many cases with proper net-metering, they can be entirely eliminated.",
      "Beyond just immediate savings, solar energy offers a buffer against rising utility rates. While grid electricity prices are subject to inflation and raw material shortages, sunlight is free and consistent.",
      "With RC Solar Solutions' precision engineering, we ensure optimal placement and maximum sunlight absorption for your roof, meaning you generate the highest possible yield and savings every single day."
    ],
    features: ["Net Metering Integration", "Grid Independence", "Guaranteed Tariff Relief"]
  },
  "low-maintenance": {
    title: "Low Maintenance",
    icon: <Wrench className="w-12 h-12 text-orange-500" />,
    heroText: "No moving parts means practically zero running cost and long-term durability.",
    fullDetails: [
      "One of the greatest benefits of modern solar installations is how little maintenance they require. Because there are no moving parts to wear out or break down, the chances of mechanical failure are incredibly low.",
      "Typically, the only maintenance required is occasional cleaning to ensure dirt or leaves aren't blocking the sunlight. RC Solar Solutions provides comprehensive Annual Maintenance Contracts (AMC) to handle even this minimal upkeep, ensuring your system runs smoothly without you ever having to lift a finger.",
      "Our smart telemetry systems continuously monitor the health of your panels. If there is ever a slight drop in efficiency, our team is alerted and can proactively resolve the issue."
    ],
    features: ["Zero Moving Parts", "Automated Cleaning Alerts", "Comprehensive AMC Packages"]
  },
  "long-life": {
    title: "Long Life",
    icon: <Clock className="w-12 h-12 text-orange-500" />,
    heroText: "Constructed with premium components ensuring decades of reliable generation.",
    fullDetails: [
      "Investing in solar is investing in the long-term future of your property. Our solar modules are built to withstand extreme weather conditions, including heavy rain, high winds, and intense heat, providing dependable energy for over 25 years.",
      "We strictly install MNRE ALMM listed and IEC/BS Certified Tier-1 solar modules, paired with industry-leading inverters from trusted brands like Power One, Polycab, and Havells. This guarantees that internal degradation is minimized.",
      "Most of our solar panels come with a 25-year performance warranty, ensuring that even after a couple of decades, your panels will still operate at a highly efficient capacity."
    ],
    features: ["25-Year Performance Warranty", "Tier-1 Certified Modules", "Weather-Resilient Engineering"]
  },
  "fast-roi": {
    title: "Fast Return on Investment",
    icon: <TrendingUp className="w-12 h-12 text-orange-500" />,
    heroText: "Subsidies and eliminated power bills help your invested money return in a short period.",
    fullDetails: [
      "While the initial setup cost for solar energy can seem significant, the financial payback is incredibly fast. Most residential and commercial users see a complete return on their investment within just 3 to 5 years.",
      "At RC Solar Solutions, we help you navigate and fully maximize available government subsidies and financial incentives, reducing your upfront capital expenditure significantly.",
      "Once the system pays for itself, every watt of electricity generated is pure profit. It increases your property value and acts as a major financial asset for your home or business for decades to come."
    ],
    features: ["3 to 5 Years Break-even", "Government Subsidy Assistance", "Instant Property Value Boost"]
  }
};

function AdvantageDetails() {
  const { slug } = useParams();
  
  const data = advantageData[slug];

  if (!data) {
    return <Navigate to="/not-found" />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-orange-500">
      
      {/* Top Navbar / Back Button */}
      <nav className="px-6 md:px-12 py-6 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm tracking-wide uppercase">Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 opacity-50 pointer-events-none">
          <Sun className="w-6 h-6 text-orange-500" />
          <h1 className="text-lg font-bold text-white tracking-wide">
            RC Solar<span className="text-orange-500">Solutions</span>
          </h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16"
        >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative">
                <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-xl"></div>
                <div className="relative z-10">{data.icon}</div>
            </div>
            
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
                  <Zap className="w-3 h-3 fill-current" /> Core Advantage
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">{data.title}</h1>
                <p className="text-xl text-gray-400 leading-relaxed font-light">{data.heroText}</p>
            </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
                {data.fullDetails.map((paragraph, index) => (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                        key={index} 
                        className="text-lg text-gray-300 leading-loose"
                    >
                        {paragraph}
                    </motion.p>
                ))}
            </div>

            <div className="md:col-span-1">
                <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 sticky top-32">
                    <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-orange-500" /> Key Highlights
                    </h3>
                    <ul className="space-y-4">
                        {data.features.map((feature, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                                <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-semibold">Ready to get started?</p>
                        <Link to="/register" className="block text-center w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-4 rounded-xl transition-colors">
                            Request Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </main>

    </div>
  );
}

export default AdvantageDetails;
