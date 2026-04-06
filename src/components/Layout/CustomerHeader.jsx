import React from "react";
import { Bell, Search, LayoutGrid, Home, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function CustomerHeader({ user }) {
  const navigate = useNavigate();
  // We stripped the nav because it is now natively handled by CustomerSidebar.jsx
  
  return (
    <header className="w-full h-20 bg-[#020617] border-b border-white/5 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40">
      
      {/* 🔹 LEFT: Breadcrumbs or Title Space */}
      <div className="flex items-center gap-4 text-white/50">
         <div className="flex items-center gap-2 border-r border-white/10 pr-4">
           <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/10 rounded-md transition text-white/70 hover:text-white" title="Go Back">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <Link to="/customer-dashboard" className="p-1.5 hover:bg-white/10 rounded-md transition text-white/70 hover:text-white" title="Customer Dashboard">
             <Home className="w-5 h-5" />
           </Link>
         </div>
         <div className="flex items-center gap-3">
           <LayoutGrid className="w-5 h-5" />
           <span className="font-medium tracking-wide">Client Workspace v2.0</span>
         </div>
      </div>

      {/* 🔹 RIGHT: Functional Icons */}
      <div className="flex items-center gap-6">
        
        {/* Fake Search */}
        <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
           <Search className="w-4 h-4 text-white/40 mr-2" />
           <input 
             type="text" 
             placeholder="Search hardware..." 
             className="bg-transparent text-sm text-white focus:outline-none placeholder-white/30"
             disabled
           />
        </div>

        {/* Fake Notifications */}
        <button className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition">
           <Bell className="w-5 h-5" />
           <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
        </button>

      </div>

    </header>
  );
}

export default CustomerHeader;
