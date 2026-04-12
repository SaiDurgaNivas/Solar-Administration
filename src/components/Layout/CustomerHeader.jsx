import React, { useState, useEffect, useRef } from "react";
import { Bell, Search, LayoutGrid, Home, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axiosConfig";

function CustomerHeader({ user }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [bookRes, billRes] = await Promise.all([
        api.get(`bookings/?client_id=${user.id}`),
        api.get(`bills/?client_id=${user.id}`)
      ]);
      
      let notifs = [];
      
      // Parse Bookings
      bookRes.data.forEach(b => {
        notifs.push({
          id: `book-${b.id}`,
          title: 'Project Status Update',
          message: `Your solar project is currently: ${b.status}`,
          time: new Date(b.created_at || Date.now()),
          type: 'booking',
          read: b.status === "Completed"
        });
        if (b.documents?.final_invoice) {
           notifs.push({
             id: `inv-${b.id}`,
             title: 'Final Invoice Available',
             message: `The final hardware bill for your project has been uploaded by the admin.`,
             time: new Date(),
             type: 'invoice',
             read: false
           });
        }
      });

      // Parse Bills
      billRes.data.forEach(bill => {
        if (bill.status !== "Paid") {
          notifs.push({
            id: `bill-${bill.id}`,
            title: 'Action Required: Pending Bill',
            message: `A payment slot (₹${bill.amount}) requires your attention.`,
            time: new Date(bill.date || Date.now()),
            type: 'bill',
            read: false
          });
        } else {
          notifs.push({
            id: `bill-${bill.id}-paid`,
            title: 'Payment Cleared',
            message: `Your payment of ₹${bill.amount} was successfully verified.`,
            time: new Date(bill.paid_at || bill.date || Date.now()),
            type: 'bill',
            read: true
          });
        }
      });

      // Sort chronological descending
      notifs.sort((a, b) => b.time - a.time);
      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  // Initial fetch for red dot indicator
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

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
        
        {/* Search */}
        <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10">
           <Search className="w-4 h-4 text-white/40 mr-2" />
           <input 
             type="text" 
             placeholder="Search hardware..." 
             className="bg-transparent text-sm text-white focus:outline-none placeholder-white/30"
             disabled
           />
        </div>

        {/* Dynamic Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition">
             <Bell className="w-5 h-5" />
             {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]"></span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="font-bold text-white text-sm uppercase tracking-widest flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-400" /> Notifications
                  </h3>
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                </div>

                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      You are completely caught up!
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {notifications.map((notif, index) => (
                        <div key={index} className={`p-4 transition hover:bg-white/5 \${!notif.read ? 'bg-white/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-xs font-bold uppercase tracking-wide \${!notif.read ? 'text-white' : 'text-gray-400'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" /> {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-gray-600 font-medium block mt-2">
                            {new Date(notif.time).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-3 border-t border-white/10 bg-[#020617] text-center">
                  <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-gray-500 hover:text-white transition uppercase tracking-widest">
                     Close Panel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
}

export default CustomerHeader;
