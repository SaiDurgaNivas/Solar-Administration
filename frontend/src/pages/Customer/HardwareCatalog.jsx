import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, CheckCircle, Zap, Shield, IndianRupee, Layers, 
  FileText, Search, Filter, ShoppingCart, Star, TrendingUp,
  ChevronDown, ArrowRight
} from 'lucide-react';

const panels = [
  {
    id: 1,
    name: "RC Premium Monocrystalline",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop",
    wattage: "550W",
    type: "Solar Panel",
    efficiency: "22.5%",
    mrp: "₹29,000",
    price: "₹26,500",
    discount: "8% OFF",
    rating: 4.9,
    reviews: "1,240",
    color: "orange",
    description: "Our flagship high-efficiency panel using advanced monocrystalline cells for maximum yield.",
    pros: ["RC 25-Year Performance Guarantee", "Superior Low-Light Performance", "Advanced Heat Dissipation"],
    popular: true
  },
  {
    id: 2,
    name: "TATA Power Solar Mono",
    image: "https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=600&auto=format&fit=crop",
    wattage: "540W",
    type: "Solar Panel",
    efficiency: "21.5%",
    mrp: "₹27,000",
    price: "₹24,500",
    discount: "9% OFF",
    rating: 4.7,
    reviews: "850",
    color: "blue",
    description: "Industry-leading reliability from TATA. High output monocrystalline cells for residential roofs.",
    pros: ["Tier-1 TATA Guarantee", "Excellent durability", "High weather resistance"],
  },
  {
    id: 3,
    name: "Waaree Bifacial N-Type",
    image: "https://images.unsplash.com/photo-1545209123-242203798993?q=80&w=600&auto=format&fit=crop",
    wattage: "600W",
    type: "Solar Panel",
    efficiency: "22.8%",
    mrp: "₹36,000",
    price: "₹32,000",
    discount: "11% OFF",
    rating: 4.8,
    reviews: "520",
    color: "orange",
    description: "Bifacial technology generating power from both front and rear light reflection.",
    pros: ["Highest space efficiency", "Picks up reflective light", "Slowest degradation rate"],
  },
  {
    id: 4,
    name: "Adani Elan Polycrystalline",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop",
    wattage: "330W",
    type: "Solar Panel",
    efficiency: "17%",
    mrp: "₹19,000",
    price: "₹16,000",
    discount: "15% OFF",
    rating: 4.5,
    reviews: "2,100",
    color: "purple",
    description: "Cost-effective Adani panel meant for large-scale utility and expansive commercial rooftops.",
    pros: ["Lower upfront cost", "Trusted Adani build quality", "Good for large installations"],
  },
  {
    id: 5,
    name: "Luminous Solar Inverter",
    image: "https://images.unsplash.com/photo-1558444479-c8482933074e?q=80&w=600&auto=format&fit=crop",
    wattage: "5kVA",
    type: "Solar Inverter",
    efficiency: "98.5%",
    mrp: "₹49,990",
    price: "₹45,000",
    discount: "10% OFF",
    rating: 4.9,
    reviews: "3,400",
    color: "green",
    description: "Pure Sine Wave Luminous inverter designed to sync perfectly with the power grid.",
    pros: ["Pure Sine Wave", "Heavy Duty Setup", "Smart WiFi Monitoring"],
  }
];

function HardwareCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPanels = panels.filter(panel => {
    const matchesSearch = panel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || panel.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700 bg-[#020617] min-h-screen">
      
      {/* Flipkart Style Navbar / Header */}
      <div className="sticky top-0 z-50 bg-[#0f172a] shadow-2xl border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-3xl rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl">
             <ShoppingCart className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">SolarStore</h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter">By RC Solar Solutions</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search panels, inverters, power systems..."
            className="w-full bg-[#020617] border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all placeholder:text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Links */}
        <div className="hidden lg:flex items-center gap-6">
          <button className="text-white font-bold text-sm hover:text-orange-400 transition-colors">Compare</button>
          <button className="bg-orange-500 hover:bg-orange-600 text-black font-black px-6 py-2 rounded-full text-sm transition-all transform active:scale-95">
             My Cart (0)
          </button>
        </div>
      </div>

      <div className="px-6 md:px-12">
        {/* Banner */}
        <div className="relative h-48 md:h-64 rounded-[3rem] overflow-hidden mb-12 group">
          <img 
            src="https://images.unsplash.com/photo-1466611653911-95281773ad60?q=80&w=1200&auto=format&fit=crop" 
            alt="Hero Banner" 
            className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-12">
            <span className="bg-green-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full w-max mb-4">Summer Sale Live</span>
            <h2 className="text-4xl md:text-6xl font-black text-white italic">SAVE UP TO 30%</h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium mt-2">On High Efficiency Monocrystalline Systems</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-gray-400 mr-4">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-widest">Filters:</span>
          </div>
          {["All", "Solar Panel", "Solar Inverter"].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${activeFilter === filter ? 'bg-orange-500 border-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredPanels.map((panel) => (
              <motion.div 
                layout
                key={panel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col relative"
              >
                {panel.popular && (
                  <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-black text-[10px] font-black uppercase px-3 py-1 rounded-md shadow-lg italic">
                    Best Seller
                  </div>
                )}
                
                {/* Product Image Area */}
                <div className="relative h-56 bg-white/5 overflow-hidden">
                   <img 
                    src={panel.image} 
                    alt={panel.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-75"
                   />
                   <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-black p-3 rounded-full shadow-2xl hover:bg-orange-500 hover:text-white transition-all transform hover:rotate-12">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-400 transition-colors line-clamp-1">{panel.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded items-center gap-0.5">
                      {panel.rating} <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span className="text-gray-500 text-[11px] font-bold">({panel.reviews} Reviews)</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                       <span className="text-2xl font-black text-white italic">{panel.price}</span>
                       <span className="text-gray-500 text-sm line-through font-medium">{panel.mrp}</span>
                       <span className="text-green-500 text-xs font-black">{panel.discount}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Free Delivery within 3 days</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {panel.pros.slice(0, 2).map((pro, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {pro}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="mt-auto flex gap-2">
                    <button className="flex-1 border border-orange-500/20 hover:bg-orange-500/5 text-orange-500 text-xs font-black py-3 rounded-xl transition-all uppercase tracking-widest">
                       Details
                    </button>
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-black text-xs font-black py-3 rounded-xl transition-all uppercase tracking-widest transform active:scale-95 shadow-lg shadow-orange-500/20">
                       Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="mt-24 grid md:grid-cols-3 gap-12 bg-gradient-to-br from-orange-500/10 to-transparent p-12 rounded-[3.5rem] border border-white/5">
              <div className="space-y-4">
                <div className="bg-orange-500/20 p-3 rounded-2xl w-max">
                  <Shield className="text-orange-500 w-8 h-8" />
                </div>
                <h4 className="text-white font-black text-xl italic uppercase">Secure Purchase</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Every transaction is protected by end-to-end encryption. RC Solar ensures safe delivery of your hardware components.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-500/20 p-3 rounded-2xl w-max">
                  <TrendingUp className="text-blue-500 w-8 h-8" />
                </div>
                <h4 className="text-white font-black text-xl italic uppercase">High ROI</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Our premium panels offer up to 22.8% efficiency, ensuring your system pays for itself in record time.</p>
              </div>
              <div className="space-y-4">
                <div className="bg-green-500/20 p-3 rounded-2xl w-max">
                  <Zap className="text-green-500 w-8 h-8" />
                </div>
                <h4 className="text-white font-black text-xl italic uppercase">Expert Install</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Certified technicians handle your setup from start to finish. Zero hidden costs, pure clean energy.</p>
              </div>
        </div>
      </div>
    </div>
  );
}

export default HardwareCatalog;

