import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Zap, ShieldAlert,
  ArrowRight, FileText, Settings, Sun,
  MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram,
  Leaf, Coins, Wrench, Clock, TrendingUp, CheckCircle, Droplets, Camera, Activity, Award, Star, User
} from "lucide-react";

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("solar_reviews");
    if (saved) {
      setReviews(JSON.parse(saved).slice(0, 3)); // Only show top 3 on home page
    } else {
        setReviews([
            { id: 1, author: "Rahul Varma", rating: 5, text: "Excellent customer service during my 5kW installation. The engineering desk resolved my query within hours.", date: new Date().toISOString() },
            { id: 2, author: "Priya Sharma", rating: 4, text: "Very smooth process utilizing the hardware manuals and support chat. System is working flawlessly.", date: new Date().toISOString() },
            { id: 3, author: "Aman Gupta", rating: 5, text: "Top notch solar hardware. The Adani Elan panels survived massive hail without a scratch.", date: new Date().toISOString() }
        ]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500 selection:text-white font-sans overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 backdrop-blur-xl bg-[#020617]/50 border-b border-light/5 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link to="/login" title="Portal Login" className="hover:scale-110 transition-transform duration-300">
            <Sun className="w-8 h-8 text-orange-500 cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            RC Solar<span className="text-orange-500">Solutions</span>
          </h1>
        </div>

        <div className="hidden md:flex gap-8 items-center font-medium">
          <Link to="/" className="text-white hover:text-orange-400 transition-colors">Home</Link>
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Customer Login</Link>
          <Link
            to="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          >
            Customer Register
          </Link>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-6 md:px-12 min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl relative z-10 pt-12 md:pt-0"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-semibold mb-6">
             A STEP TOWARDS BRIGHT FUTURE
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            RC Solar <br/>
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
            Incorporated in 2018 as a top-tier Solar Power Stations Installer, and service & maintenance contractor. Empowering homes and businesses with clean, sustainable, and reliable solar energy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-full font-bold transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              Customer Login 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#services"
              className="border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full font-semibold transition-all text-center backdrop-blur-md cursor-pointer"
            >
              Explore Services
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-2xl z-10 Perspective-container"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/30 to-blue-500/20 blur-3xl opacity-50 rounded-[3rem]"></div>
          
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl shadow-2xl p-2 md:p-4 rotate-x-6 rotate-y-[-10deg] transform-gpu hover:rotate-0 transition-all duration-700 ease-out">
             <div className="flex items-center gap-2 mb-4 px-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono flex-1 text-center pr-10">dashboard.rcsolarsolutions.in</div>
             </div>
             
             <div className="rounded-xl overflow-hidden border border-white/5 bg-[#020617] aspect-[4/3] md:aspect-video relative">
                <img 
                  src="/images/dashboard_preview.png" 
                  alt="Solar Dashboard Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'flex'; 
                  }}
                />
                {/* Fallback pattern */}
                <div className="hidden absolute inset-0 flex-col p-6 pointer-events-none">
                   <div className="flex gap-4 mb-6">
                     <div className="h-20 flex-1 bg-white/5 rounded-xl border border-white/5"></div>
                     <div className="h-20 flex-1 bg-white/5 rounded-xl border border-white/5"></div>
                     <div className="h-20 flex-1 bg-white/5 rounded-xl border border-white/5"></div>
                   </div>
                   <div className="flex-1 bg-white/5 rounded-xl border border-white/5"></div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* ================= CERTIFICATIONS / WHY CHOOSE US ================= */}
      <section className="px-6 md:px-12 py-10 relative z-20 bg-[#0f172a]/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-80 mix-blend-screen">
          <div className="flex items-center gap-3">
             <Award className="w-8 h-8 text-orange-500" />
             <div><p className="text-sm font-bold text-white uppercase">APEPDCL</p><p className="text-xs text-gray-400">Approved Vendor</p></div>
          </div>
          <div className="flex items-center gap-3">
             <ShieldAlert className="w-8 h-8 text-blue-400" />
             <div><p className="text-sm font-bold text-white uppercase">APSIWA</p><p className="text-xs text-gray-400">Member</p></div>
          </div>
          <div className="flex items-center gap-3">
             <CheckCircle className="w-8 h-8 text-green-500" />
             <div><p className="text-sm font-bold text-white uppercase">MNRE ALMM</p><p className="text-xs text-gray-400">Listed Modules</p></div>
          </div>
          <div className="flex items-center gap-3">
             <Zap className="w-8 h-8 text-yellow-500" />
             <div><p className="text-sm font-bold text-white uppercase">TOP INVERTERS</p><p className="text-xs text-gray-400">Power One, Polycab...</p></div>
          </div>
        </div>
      </section>

      {/* ================= ADVANTAGES ================= */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
            
            <div className="md:w-1/3">
                <h2 className="text-4xl font-black mb-6">Advantages of <span className="text-orange-500">Solar Power</span></h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    Harnessing solar energy is not just about saving the planet—it's incredibly beneficial for your wallet and infrastructure. Join thousands of happy clients who transitioned to green energy.
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full"></div>
            </div>

            <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
                {[
                  { icon: <Coins />, title: "Reduces Electricity Bills", slug: "reduces-electricity-bills", desc: "Drastically cut your monthly grid energy expenses with roof-top generation." },
                  { icon: <Wrench />, title: "Low Maintenance", slug: "low-maintenance", desc: "No moving parts means practically zero running cost and long-term durability." },
                  { icon: <Clock />, title: "Long Life", slug: "long-life", desc: "Constructed with premium components ensuring decades of reliable generation." },
                  { icon: <TrendingUp />, title: "Fast ROI", slug: "fast-roi", desc: "Subsidies and eliminated power bills help your invested money return in a short period." }
                ].map((adv, i) => (
                    <Link to={`/advantage/${adv.slug}`} key={i} className="block h-full">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="h-full bg-white/[0.02] border border-white/5 hover:border-orange-500/30 p-6 rounded-3xl transition-colors group relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                                    {adv.icon}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white translate-x-4 group-hover:translate-x-0">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-bold mb-2 text-white">{adv.title}</h4>
                            <p className="text-sm text-gray-500 flex-grow">{adv.desc}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
            
        </div>
      </section>

      {/* ================= CUSTOMER SERVICES ================= */}
      <section id="services" className="px-6 md:px-12 py-24 bg-[#0a1122]">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Customer Services</h2>
              <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                From residential roof-tops to mega-watt utility plants, we are your single-point contractor for complete engineering, construction, and maintenance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Net Metering Systems", desc: "Rooftop EPC contractor for net metering and solar battery banks.", icon: <Sun />, color: "text-yellow-500" },
                { title: "Heaters & Pumps", desc: "Solar water heaters, heat pumps, and agricultural solar pump sets.", icon: <Droplets />, color: "text-blue-400" },
                { title: "Mega Watt Plants", desc: "Engineering, construction, CEIG Approval and AMC for large-scale parks.", icon: <Activity />, color: "text-orange-500" },
                { title: "Turnkey Contracting", civil: true, desc: "Civil, electrical wiring, plumbing, CCTV systems & RO Plants.", icon: <Camera />, color: "text-purple-400" }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-[#0f172a]/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-all group"
                >
                  <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* STRENGTHS BANNER */}
            <div className="mt-16 bg-gradient-to-r from-orange-600/20 to-[#0f172a] border border-orange-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full"></div>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><Award className="text-orange-500"/> Our Proven Strength</h3>
                <ul className="space-y-4">
                   <li className="flex gap-3 items-start">
                     <CheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                     <p className="text-gray-300"><strong className="text-white">APEPDCL-475kW</strong> Solar rooftop AMC during COVID-19 Pandemic in 2020 with Freyr Energy Services.</p>
                   </li>
                   <li className="flex gap-3 items-start">
                     <CheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                     <p className="text-gray-300">AMC of <strong className="text-white">DCCB Bank</strong> Solar Rooftop Systems.</p>
                   </li>
                   <li className="flex gap-3 items-start">
                     <CheckCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                     <p className="text-gray-300">AMC of Reputed Hotels & Education Institutions Solar Water Heaters & Rooftops in Kakinada & Surrounds.</p>
                   </li>
                </ul>
            </div>
        </div>
      </section>

      {/* ================= CUSTOMER REVIEWS ================= */ }
      <section className="px-6 md:px-12 py-24 bg-[#0a1122] border-y border-white/5 relative overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute right-[-10%] bottom-[-20%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
               <span className="text-orange-500 font-bold tracking-widest text-sm uppercase mb-2 block">System Feedback</span>
               <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Customers Say</h2>
               <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                 Real reviews from verified clients directly submitted through our encrypted Signal Dispatch terminal.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {reviews.map((rev, i) => (
                    <motion.div
                        key={rev.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl hover:border-orange-500/30 transition-all flex flex-col group relative overflow-hidden"
                    >
                        {/* Glow accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center p-1">
                                     <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center">
                                         <User className="w-5 h-5 text-gray-400" />
                                     </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white tracking-wide">{rev.author}</h4>
                                    <p className="text-xs text-green-400 font-medium tracking-wide">Verified Installation</p>
                                </div>
                            </div>
                            <div className="flex gap-1 bg-[#020617] p-2 rounded-full border border-white/5">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? "fill-orange-500 text-orange-500" : "text-gray-600"}`} />
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow">
                            <p className="text-gray-400 leading-relaxed italic text-lg opacity-90 relative">
                               <span className="text-4xl text-white/10 font-serif absolute -top-4 -left-2">"</span>
                               {rev.text}
                               <span className="text-4xl text-white/10 font-serif absolute -bottom-6 -right-2">"</span>
                            </p>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs font-mono text-gray-500">
                            <span>Signal Dispatch Rating: {rev.rating}/5</span>
                            <span>{new Date(rev.date).toLocaleDateString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="text-center mt-12">
               <Link to="/login">
                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all flex items-center justify-center gap-2 mx-auto">
                    Submit Your Own Review <ArrowRight className="w-4 h-4" />
                  </button>
               </Link>
            </div>
        </div>
      </section>

      {/* ================= MULTI BRANCH CONTACT ================= */ }
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-bold mb-4">Our Presence</h2>
           <p className="text-gray-400">Strategically located to serve Andhra Pradesh with lightning-fast support.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
               { city: "Kakinada", address: "D.No. 70-2-65/3, Yelugubantivari Street, Opp. Green Wood School, Ramanayapeta-533003", phone: "+91 9100310699" },
               { city: "Vijayawada", address: "D.No. 9-144, Opp. Balaji Hotel, Kamayyathopu, Kanuru, Vijayawada-520007", phone: "+91 8317567745" },
               { city: "Visakhapatnam", address: "D.No. 24-57-2, MIG-IIB 76, Vinayak Nagar, Gajuwaka, Visakhapatnam-530044", phone: "+91 9912225167" }
            ].map((loc, i) => (
                <div key={i} className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-[#0f172a]/80 transition-colors group">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                        <MapPin />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{loc.city}</h3>
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed min-h-[4rem]">{loc.address}</p>
                    <div className="flex items-center gap-2 font-mono text-orange-400 font-bold border-t border-white/10 pt-4 cursor-pointer hover:text-orange-300">
                        <Phone className="w-4 h-4" /> {loc.phone}
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-sm font-mono text-gray-300">
               <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">GST: 37AOEPP3879C1ZP</span>
               <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">MSME: UDYAM-AP-03-0014652</span>
            </div>
            <a href="mailto:rcsolarsolutions0@gmail.com" className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" /> rcsolarsolutions0@gmail.com
            </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0b1120] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 mt-10 text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold tracking-wide text-white">
                RC Solar<span className="text-orange-500">Solutions</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A comprehensive platform to manage solar installations, monitor real-time energy production, and streamline customer data management.
            </p>
          </div>

          {/* Column 2 */}
          <div className="md:px-8">
            <h3 className="text-white font-bold uppercase tracking-wider mb-6">QUICK LINKS</h3>
            <ul className="space-y-3">
              {['Home', 'Dashboard', 'Customers', 'Installations', 'Billing'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="hover:text-orange-400 transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6">CONTACT US</h3>
            <ul className="space-y-4 mb-6">
               <li className="flex items-center gap-3 text-sm">
                 <Mail className="w-4 h-4 text-indigo-300" />
                 <a href="mailto:rcsolarsolutions0@gmail.com" className="hover:text-white transition-colors">rcsolarsolutions0@gmail.com</a>
               </li>
               <li className="flex items-center gap-3 text-sm">
                 <Phone className="w-4 h-4 text-pink-500" />
                 <a href="tel:+919100310699" className="hover:text-white transition-colors">+91 91003 10699</a>
               </li>
               <li className="flex items-center gap-3 text-sm">
                 <MapPin className="w-4 h-4 text-red-500" />
                 <span>Headquarters, Kakinada</span>
               </li>
            </ul>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center text-blue-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center text-blue-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center text-red-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center text-pink-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="text-center pt-8 text-xs text-gray-600 max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} RC Solar Solutions. A STEP TOWARDS BRIGHT FUTURE.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
