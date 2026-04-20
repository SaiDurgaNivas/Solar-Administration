import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sun, ShieldCheck, TrendingUp, Users, Building, 
  MapPin, Mail, Phone, Zap, Home 
} from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500 selection:text-white">
      
      {/* 🏠 PREMIUM FLOATING HOME BUTTON */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 bg-white/5 backdrop-blur-3xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Home className="w-6 h-6 relative z-10 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300 drop-shadow-md" />
      </Link>

      {/* 🔥 HERO SECTION */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/solar_hero.png" 
            alt="Solar Panels at Sunset" 
            className="w-full h-full object-cover opacity-40 scale-105 transform origin-center animate-pulse duration-[20s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Pioneering the{" "}
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Solar Revolution
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10 font-light">
              We empower businesses and homeowners with intelligent solar infrastructure, making the transition to renewable energy seamless and data-driven.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#services" className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Our Services
              </a>
              <a href="#contact" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/20 transition-all">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 🔥 STATS BANNER */}
      <div className="relative z-20 -mt-20 px-6 max-w-6xl mx-auto mb-32">
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            {[
              { value: "10K+", label: "Happy Customers", icon: <Users className="text-orange-400 w-6 h-6" /> },
              { value: "500+", label: "Installations", icon: <Building className="text-yellow-400 w-6 h-6" /> },
              { value: "25MW+", label: "Energy Generated", icon: <Zap className="text-orange-400 w-6 h-6" /> },
              { value: "99.9%", label: "System Uptime", icon: <ShieldCheck className="text-yellow-400 w-6 h-6" /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</h2>
                <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 THE STORY SECTION */}
      <div className="px-6 max-w-7xl mx-auto mb-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold mb-6">
              <Sun className="w-4 h-4" /> Our Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              A Legacy of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Sustainable Innovation</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Founded with the vision of building a cleaner, more resilient energy grid, Solar Administration provides full-stack management solutions for modern solar enterprises.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We go beyond just panels. We provide an entire digital ecosystem—from smart CRM workflows to real-time grid monitoring—allowing solar companies to scale effortlessly.
            </p>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center font-bold text-black border-2 border-[#020617] ring-2 ring-orange-500/50">
                SJ
              </div>
              <div>
                <h4 className="font-semibold text-white">Sarah Jenkins</h4>
                <p className="text-sm text-gray-500">CEO & Founder, Solar Administration</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-3xl blur-3xl translate-x-4 translate-y-4"></div>
            <img 
              src="/images/solar_team.png" 
              alt="Our Team" 
              className="relative z-10 w-full h-[600px] object-cover rounded-3xl shadow-2xl border border-white/5"
            />
          </motion.div>
        </div>
      </div>

      {/* 🔥 PREMIUM FEATURES GRID */}
      <div id="services" className="relative bg-[#020617] py-40 border-y border-white/5 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">Our Core Capabilities</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-xl font-light">
              End-to-end solutions designed to perfectly orchestrate every element of your solar administrative processes with military precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Users className="w-10 h-10 text-orange-400" />,
                title: "Client CRM",
                desc: "A powerful portal to manage leads, current clients, communications, and historical service records all in one place.",
                glow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-yellow-400" />,
                title: "Smart Analytics",
                desc: "Real-time telemetry and advanced predictive analytics give you deep insights into panel health and power output.",
                glow: "group-hover:shadow-[0_0_40px_rgba(250,204,21,0.15)]"
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-orange-500" />,
                title: "Automated Billing",
                desc: "Frictionless, PCI-compliant invoicing tailored for modern energy providers and PPA structures.",
                glow: "group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
                className={`relative bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[2.5rem] border border-white/10 transition-all duration-500 group overflow-hidden ${feature.glow} hover:-translate-y-2`}
              >
                {/* Glossy Top Line highlight */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 shadow-xl backdrop-blur-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 CTA & CONTACT */}
      <div id="contact" className="px-6 max-w-7xl mx-auto py-32">
        <div className="bg-gradient-to-br from-orange-600 to-yellow-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Scale Your Solar Business?</h2>
            <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join thousands of providers worldwide managing their installations smarter with Solar Administration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login" className="bg-[#020617] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-colors shadow-xl flex items-center justify-center gap-2">
                Get Started Now <Zap className="w-5 h-5 fill-current" />
              </Link>
            </div>
            
            <div className="mt-16 pt-10 border-t border-white/20 flex flex-wrap justify-center gap-10">
               <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                 <MapPin className="w-5 h-5 flex-shrink-0" /> Kakinada, Pithapuram, Visakhapatnam, Vijayawada
               </div>
               <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                 <Mail className="w-5 h-5 flex-shrink-0" /> Rcsolar@gmail.com
               </div>
               <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                 <Phone className="w-5 h-5 flex-shrink-0" /> 6300697301
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <footer className="border-t border-white/5 pt-12 pb-8 text-center bg-[#020617]">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Sun className="text-orange-500 w-6 h-6" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Solar<span className="text-orange-500">Administration</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Solar Administration System. All rights reserved. Built for Smart Energy ⚡
        </p>
      </footer>

    </div>
  );
}

export default About;
