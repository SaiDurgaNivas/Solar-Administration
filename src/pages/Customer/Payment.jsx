import React from "react";
import { motion } from "framer-motion";
import { Lock, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-[#020617] min-h-screen p-6 font-sans flex text-white justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 relative overflow-hidden"
      >
        <div className="flex justify-center mb-6">
           <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20">
               <Lock className="w-10 h-10 text-orange-400" />
           </div>
        </div>

        <h1 className="text-2xl font-extrabold text-center mb-2 tracking-wide">Encrypted Checkout</h1>
        <p className="text-gray-500 text-center text-sm font-medium mb-8">Execute payment protocol for Ledger Invoice #{id}</p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Card Identification</label>
            <div className="relative">
                <CreditCard className="w-5 h-5 absolute left-4 top-3.5 text-gray-500" />
                <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-white font-mono" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Expiry</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-white font-mono text-center" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">CVV</label>
                <input type="password" placeholder="•••" className="w-full bg-white/5 border border-white/10 py-3 px-4 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-white font-mono text-center tracking-widest" />
              </div>
          </div>

          <button onClick={() => navigate('/customer-dashboard/bills')} className="w-full mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition duration-300">
            Confirm Transfer
          </button>
          
          <p className="text-center text-xs text-gray-600 mt-6 font-medium flex justify-center items-center gap-1">
             <Lock className="w-3 h-3" /> Transmissions are protected via 256-bit AES encryption.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Payment;
