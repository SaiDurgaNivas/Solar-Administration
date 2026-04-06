import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-red-500/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="text-8xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500"
        >
          404
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-300 mb-6"
        >
          Grid Sector Not Found
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-10 leading-relaxed"
        >
          The interface panel you are trying to access has been relocated or does not exist within the Solar Administration framework.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          >
            <Home className="w-5 h-5" /> Return to Command Hub
          </Link>
        </motion.div>
      </div>

    </div>
  );
}

export default NotFound;
