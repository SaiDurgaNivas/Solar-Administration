import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, Mail, MapPin, CheckCircle, ShieldAlert } from "lucide-react";

function AddCustomer() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    location: "",
    status: "Active",
  });

  const handleSubmit = () => {
    // Expected Backend Hook
    console.log("Saving Customer:", customer);
    navigate("/customer");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <UserPlus className="w-8 h-8 text-orange-400" /> Enroll Client Link
          </h1>
          <p className="text-gray-400 text-sm mt-1">Provision a new entity into the Solar Administration matrix.</p>
        </div>
      </div>

      <div className="bg-[#0f172a]/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full"></div>

        <div className="space-y-6 relative z-10">
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Legal Entity</label>
            <div className="relative">
              <input
                placeholder="Ex. Stark Industries"
                className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Network Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                placeholder="billing@entity.com"
                className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Deployment Coordinates / GeoZone</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                placeholder="Installation Address"
                className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-medium"
                value={customer.location}
                onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Initial Account State</label>
            <div className="relative">
               {(customer.status === "Active") ? 
                 <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" /> : 
                 <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
               }
              <select
                className="w-full bg-[#020617] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none cursor-pointer"
                value={customer.status}
                onChange={(e) => setCustomer({ ...customer, status: e.target.value })}
              >
                <option value="Active">Operational & Active</option>
                <option value="Inactive">On Hold / Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-[1.02] text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            >
              Initialize Customer Node
            </button>
            <button
              onClick={() => navigate("/customer")}
              className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-all"
            >
              Abort Setup
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default AddCustomer;
