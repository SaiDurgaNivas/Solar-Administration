import React from 'react';
import { motion } from 'framer-motion';
import { Sun, CheckCircle, Zap, Shield, IndianRupee, Layers, FileText, X, Globe, Info } from 'lucide-react';

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

const systemPrices = [
  { size: "1kW", cost: "₹7000/-" },
  { size: "2kW", cost: "₹14,000/-" },
  { size: "3kW", cost: "₹21,000/-" },
  { size: "4kW", cost: "₹28,000/-" },
  { size: "5kW", cost: "₹35,000/-" },
  { size: "6kW", cost: "₹42,000/-" },
  { size: "7kW", cost: "₹49,000/-" },
  { size: "8kW", cost: "₹56,000/-" },
  { size: "9kW", cost: "₹63,000/-" },
  { size: "10kW", cost: "₹70,000/-" },
];

const waareePricing = [
  { model: "Waaree 330w Solar Panel", price: "Rs.8,250", perWatt: "Rs.25" },
  { model: "Waaree 325w Solar Panel", price: "Rs.8,125", perWatt: "Rs.25" },
  { model: "Waaree 320w Solar Panel", price: "Rs.8,000", perWatt: "Rs.25" },
  { model: "Waaree 270w Solar Panel", price: "Rs.6,750", perWatt: "Rs.25" },
  { model: "Waaree 200w Solar Panel", price: "Rs.5,000", perWatt: "Rs.25" },
  { model: "Waaree 160w Solar Panel", price: "Rs.5,600", perWatt: "Rs.35" },
  { model: "Waaree 100w Solar Panel", price: "Rs.3,500", perWatt: "Rs.35" },
  { model: "Waaree 75w Solar Panel", price: "Rs.2,625", perWatt: "Rs.35" },
  { model: "Waaree 50w Solar Panel", price: "Rs.1,750", perWatt: "Rs.35" },
];

const tataPricing = [
  { model: "50W Solar Panel", price: "Rs.2,200", perWatt: "Rs.44" },
  { model: "100W Solar Panel", price: "Rs.4,400", perWatt: "Rs.44" },
  { model: "150W Solar Panel", price: "Rs.6,600", perWatt: "Rs.44" },
  { model: "160W Solar Panel", price: "Rs.6,720", perWatt: "Rs.42" },
  { model: "200W Solar Panel", price: "Rs.7,800", perWatt: "Rs.39" },
  { model: "250W Solar Panel", price: "Rs.7,250", perWatt: "Rs.29" },
  { model: "265W Solar Panel", price: "Rs.7,685", perWatt: "Rs.29" },
  { model: "288W Solar Panel", price: "Rs.8,352", perWatt: "Rs.29" },
  { model: "300W Solar Panel", price: "Rs.8,700", perWatt: "Rs.29" },
  { model: "315W Solar Panel", price: "Rs.9,135", perWatt: "Rs.29" },
  { model: "330W Solar Panel", price: "Rs.9,240", perWatt: "Rs.28" },
];

const adaniPricing = [
  { model: "Adani 330W Poly", price: "Rs.10,500", perWatt: "Rs.32" },
  { model: "Adani 335W Poly", price: "Rs.10,800", perWatt: "Rs.32" },
  { model: "Adani 340W Poly", price: "Rs.11,200", perWatt: "Rs.33" },
  { model: "Adani 400W Mono", price: "Rs.15,500", perWatt: "Rs.38" },
  { model: "Adani 450W Mono", price: "Rs.18,000", perWatt: "Rs.40" },
];

const luminousPricing = [
  { model: "Luminous 850VA NXG", price: "Rs.6,500", type: "Home UPS" },
  { model: "Luminous 1100VA NXG", price: "Rs.7,800", type: "Home UPS" },
  { model: "Luminous 1500VA Solar", price: "Rs.12,500", type: "Inverter" },
  { model: "Luminous 2kVA PCU", price: "Rs.18,000", type: "PCU" },
  { model: "Luminous 5kVA Solarverter", price: "Rs.45,000", type: "Heavy Duty" },
];

const vguardPricing = [
  { model: "V-Guard 1kVA Hybrid", price: "Rs.7,500", warranty: "2 Years" },
  { model: "V-Guard 2kVA Hybrid", price: "Rs.14,000", warranty: "2 Years" },
  { model: "V-Guard 3kVA Smart", price: "Rs.22,000", warranty: "3 Years" },
  { model: "V-Guard 5kVA Heavy", price: "Rs.38,000", warranty: "3 Years" },
  { model: "V-Guard 10kVA Industrial", price: "Rs.85,000", warranty: "5 Years" },
];

function HardwareCatalog() {
  const [selectedPanel, setSelectedPanel] = React.useState(null);

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* Detail Modal */}
      {selectedPanel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f172a] border border-white/10 w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative overflow-hidden my-auto"
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-2xl">
                  <Globe className="text-orange-400 w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{selectedPanel.name} - Deep Dive</h2>
              </div>
              <button 
                onClick={() => setSelectedPanel(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              {/* WAAREE CONTENT */}
              {selectedPanel.name.toUpperCase().includes("WAAREE") && (
                <>
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Info className="text-blue-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-1 inline-block">About Waaree Solar</h3>
                    </div>
                    <div className="text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
                        <p>
                            Waaree solar is a 28 years old company, founded in 1989. It started its business journey with the formation of Waaree Solar Instruments Ltd. Then Waaree group has diversified into solar business apart from Instrumentation in 2007 and began it in <span className="text-blue-400">renewable energy</span> as Waaree Energies Pvt Ltd. Company has automatic production line for <span className="text-blue-400">solar module</span> at the Surat, north of Mumbai.
                        </p>
                        <p>
                            The Waaree Energies offer a full range of solar panel at best price in all over India from 10Wp to 335Wp with dealer, distributors and stockiest. Company manufacturing its panel for <span className="text-blue-400">on grid solar system, off grid solar system, hybrid solar power plant</span> applications and also exported to a number of countries globally. It is one of the fastest growing company as Waaree is youthful, vibrant with balanced combination of maturity, innovation & creativity.
                        </p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Layers className="text-blue-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-1 inline-block">Types of Waaree Solar Panel</h3>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base">
                        Waaree Solar has changed the panel technology completely and it continues to improve in terms of efficiency, quality, and versatility. Three types of Waaree solar panels are now available in the market. Let's know about the types of these solar panels.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Polycrystalline Solar Panel', 'Monocrystalline Solar Panel', 'Bifacial Solar Panel'].map((type) => (
                            <li key={type} className="bg-white/5 border-l-2 border-red-500 p-4 rounded-r-xl font-bold text-blue-400 text-sm">{type}</li>
                        ))}
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <IndianRupee className="text-blue-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white pb-1 inline-block">Waaree Models & Pricing</h3>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-red-500 text-white font-black uppercase text-xs tracking-widest">
                                    <th className="py-4 px-6">Model / Watt</th>
                                    <th className="py-4 px-6">Selling Price</th>
                                    <th className="py-4 px-6">Price per Watt</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/5">
                                {waareePricing.map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                                        <td className="py-3 px-6 text-blue-400 font-bold text-sm">{item.model}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.price}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.perWatt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </section>
                </>
              )}

              {/* TATA CONTENT */}
              {selectedPanel.name.toUpperCase().includes("TATA") && (
                <>
                  <section className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <Info className="text-blue-400 w-5 h-5" />
                                <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-1 inline-block">Tata Solar Panel Overview</h3>
                            </div>
                            <div className="text-gray-400 leading-relaxed space-y-4 text-sm md:text-base">
                                <p>
                                    Tata solar panels are best in class solar modules, manufactured in India on leading edge module production line and world class processes. The panels are equipped with <strong className="text-white">strong, light-weight anodized aluminium frame</strong> and unique back sheet for high resistance to moisture ingress.
                                </p>
                                <p>
                                    The solar panels from Tata are torsion and corrosion resistant and come with highly reliable <span className="text-blue-400 font-bold">IP67 rated junction box</span>. The high fill factor and positive power tolerance improves the energy conversion efficiency of these panels.
                                </p>
                                <p>
                                    Tata design and manufacture highly efficient polycrystalline solar panels, wattage ranging from 50 to 330 watts. These panels are completely reliable under extreme weather conditions, certified to withstand <span className="text-red-400 font-bold">snow loads of up to 5,400 Pa</span>. The most satisfying thing with Tata solar panels are that you will get guaranteed peace of mind and <span className="text-green-400 font-bold">25 year linear module warranty</span>.
                                </p>
                            </div>
                        </div>
                        <div className="w-full md:w-64 shrink-0 bg-white p-4 rounded-2xl shadow-xl">
                            <img 
                                src="file:///C:/Users/K.%20Sai%20Durga%20Nivas/.gemini/antigravity/brain/b592bb96-349a-413d-a26f-df52fb2d94a5/tata_solar_panel_detail_1776906848398.png" 
                                alt="Tata Solar Logo" 
                                className="w-full h-auto object-contain rounded-xl"
                            />
                        </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <IndianRupee className="text-blue-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white pb-1 inline-block">Tata Models & Pricing</h3>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-red-500 text-white font-black uppercase text-xs tracking-widest">
                                    <th className="py-4 px-6">Solar Panel Model</th>
                                    <th className="py-4 px-6">Selling Price</th>
                                    <th className="py-4 px-6">Price per Watt</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/5">
                                {tataPricing.map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                                        <td className="py-3 px-6 text-blue-400 font-bold text-sm">{item.model}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.price}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.perWatt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </section>
                </>
              )}

              {/* RC PREMIUM CONTENT (First Panel) */}
              {selectedPanel.name.toUpperCase().includes("RC PREMIUM") && (
                  <section className="space-y-6">
                      <div className="flex items-center gap-3">
                          <Shield className="text-orange-500 w-6 h-6" />
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight">RC Solar Elite Engineering</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                              <p className="text-gray-400 leading-relaxed">
                                  Our signature <strong className="text-white">RC Premium Monocrystalline</strong> series represents the pinnacle of residential solar technology. Each cell is carved from a single crystal of pure silicon, allowing electrons more room to move, which results in a massive <span className="text-green-400 font-bold">22.5% efficiency rating</span>.
                              </p>
                              <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                                  <p className="text-sm text-orange-400 font-medium italic">
                                      "Designed for homeowners who want the maximum power possible from every square inch of their roof space."
                                  </p>
                              </div>
                          </div>
                          <div className="space-y-3">
                              {['Anti-PID Technology', 'Half-Cut Cell Design', '9-Busbar Configuration', 'Excellent Low Irradiance Performance'].map((feat) => (
                                  <div key={feat} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                      <CheckCircle className="w-5 h-5 text-orange-500" />
                                      <span className="text-sm font-bold text-gray-300">{feat}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </section>
              )}

              {/* ADANI CONTENT */}
              {selectedPanel.name.toUpperCase().includes("ADANI") && (
                <>
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Info className="text-blue-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-1 inline-block">About Adani Solar</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        Adani Solar is the solar PV manufacturing arm of the Adani Group, a diversified organization in India with a combined market cap of $200 Bn. Mundra Solar PV Ltd (Adani Solar) is one of the 15 largest utility-scale solar PV developers in the world. They provide high-performance polycrystalline panels that are <strong className="text-white">perfect for large installations</strong> due to their extreme cost-effectiveness and durability.
                    </p>
                  </section>
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Adani Models & Pricing</h3>
                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-red-500 text-white font-black uppercase text-xs tracking-widest">
                                    <th className="py-4 px-6">Model</th>
                                    <th className="py-4 px-6">Selling Price</th>
                                    <th className="py-4 px-6">Price per Watt</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/5">
                                {adaniPricing.map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                                        <td className="py-3 px-6 text-blue-400 font-bold text-sm">{item.model}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.price}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.perWatt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </section>
                </>
              )}

              {/* LUMINOUS CONTENT */}
              {selectedPanel.name.toUpperCase().includes("LUMINOUS") && (
                <>
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Zap className="text-green-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-1 inline-block">About Luminous Solar</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        Luminous Power Technologies is the leading home electrical specialist in India having a vast portfolio comprising of Power backup solutions such as Home UPS, Inverter, and Solar Applications. Their <strong className="text-white">Pure Sine Wave</strong> technology ensures that your delicate electronics are protected from power surges and voltage fluctuations.
                    </p>
                  </section>
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Luminous Product Pricing</h3>
                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-red-500 text-white font-black uppercase text-xs tracking-widest">
                                    <th className="py-4 px-6">Product Model</th>
                                    <th className="py-4 px-6">Selling Price</th>
                                    <th className="py-4 px-6">Type</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/5">
                                {luminousPricing.map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                                        <td className="py-3 px-6 text-blue-400 font-bold text-sm">{item.model}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.price}</td>
                                        <td className="py-3 px-6 text-gray-400 text-xs">{item.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </section>
                </>
              )}

              {/* V-GUARD CONTENT */}
              {selectedPanel.name.toUpperCase().includes("V-GUARD") && (
                <>
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Shield className="text-red-400 w-5 h-5" />
                        <h3 className="text-xl font-bold text-white border-b-2 border-red-500 pb-1 inline-block">About V-Guard Hybrid Systems</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        V-Guard is a trusted name in the Indian market, known for its focus on energy efficiency and product reliability. Their hybrid solar inverters are designed to work seamlessly with both <strong className="text-white">grid power and battery storage</strong>, ensuring that you never run out of electricity even during prolonged power cuts.
                    </p>
                  </section>
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-white">V-Guard Models & Warranty</h3>
                    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-red-500 text-white font-black uppercase text-xs tracking-widest">
                                    <th className="py-4 px-6">Hybrid Model</th>
                                    <th className="py-4 px-6">Selling Price</th>
                                    <th className="py-4 px-6">Warranty</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white/5">
                                {vguardPricing.map((item, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                                        <td className="py-3 px-6 text-blue-400 font-bold text-sm">{item.model}</td>
                                        <td className="py-3 px-6 text-gray-300 font-mono text-sm">{item.price}</td>
                                        <td className="py-3 px-6 text-green-400 text-xs font-bold">{item.warranty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </section>
                </>
              )}

              {/* Default detailed view for other panels */}
              {!selectedPanel.name.toUpperCase().includes("WAAREE") && 
               !selectedPanel.name.toUpperCase().includes("TATA") && 
               !selectedPanel.name.toUpperCase().includes("RC PREMIUM") && 
               !selectedPanel.name.toUpperCase().includes("ADANI") && 
               !selectedPanel.name.toUpperCase().includes("LUMINOUS") && 
               !selectedPanel.name.toUpperCase().includes("V-GUARD") && (
                  <div className="text-center py-12">
                      <Sun className="w-20 h-20 text-orange-500 mx-auto mb-6 animate-pulse" />
                      <h3 className="text-2xl font-bold text-white mb-4">Detailed Specs for {selectedPanel.name}</h3>
                      <p className="text-gray-400 max-w-md mx-auto">Full technical data sheets and structural diagrams are currently being updated for this model. Please contact support for immediate inquiries.</p>
                  </div>
              )}
            </div>
            
            <div className="p-8 bg-black/40 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedPanel(null)}
                  className="bg-orange-500 hover:bg-orange-400 text-black font-black px-10 py-3 rounded-2xl transition shadow-lg"
                >
                  Close Detail View
                </button>
            </div>
          </motion.div>
        </div>
      )}
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

      {/* Standard System Pricing Table */}
      <div className="bg-[#0f172a]/50 border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-8">
          <IndianRupee className="text-green-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Standard System Installation Pricing</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-gray-400">System Size</th>
                <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-gray-400 text-right">Cost Per Watt (In ₹)</th>
              </tr>
            </thead>
            <tbody>
              {systemPrices.map((item, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6 font-bold text-white">{item.size}</td>
                  <td className="py-4 px-6 text-orange-400 font-mono font-bold group-hover:text-orange-300 transition-colors text-right">{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              onClick={() => setSelectedPanel(panel)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-[#020617] border shadow-2xl rounded-3xl p-0 flex flex-col group transition-all hover:-translate-y-2 cursor-pointer overflow-hidden ${panel.popular ? 'border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]' : 'border-white/10 hover:border-white/20'}`}
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
