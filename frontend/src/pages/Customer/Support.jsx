import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, Mail, MessageSquare, Briefcase, Star, Send, User } from "lucide-react";

function Support({ modal, setModal }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user
  const userStr = sessionStorage.getItem("solar_user");
  const user = userStr ? JSON.parse(userStr) : { username: "Guest User" };

  useEffect(() => {
    const savedReviews = sessionStorage.getItem("solar_reviews");
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
        // Fallback default reviews
        const defaultReviews = [
            { id: 1, author: "Rahul Varma", rating: 5, text: "Excellent customer service during my 5kW installation. The engineering desk resolved my query within hours.", date: new Date().toISOString() },
            { id: 2, author: "Priya Sharma", rating: 4, text: "Very smooth process utilizing the hardware manuals and support chat. System is working flawlessly.", date: new Date().toISOString() }
        ];
        sessionStorage.setItem("solar_reviews", JSON.stringify(defaultReviews));
        setReviews(defaultReviews);
    }
  }, []);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
        const newReview = {
            id: Date.now(),
            author: user.username || user.name || "Customer",
            rating: rating,
            text: reviewText,
            date: new Date().toISOString()
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        sessionStorage.setItem("solar_reviews", JSON.stringify(updatedReviews));
        
        setReviewText("");
        setRating(5);
        setIsSubmitting(false);
        
        alert("Your review has been successfully submitted and is now live on our Home Page!");
    }, 800);
  };

  const handleAction = (block) => {
    let content = null;
    if (block.title === "Comm Link") {
        content = (
            <div className="space-y-6">
                <div className="flex flex-col items-center py-10 bg-[#020617]/50 rounded-3xl border border-white/5">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                    <p className="text-blue-400 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Neural Link...</p>
                    <p className="text-gray-500 text-xs mt-2">Connecting to Secure Signal Channel</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-sm text-gray-400 leading-relaxed italic">
                    "All agents are currently assisting other grid nodes. Typical wait time: 4 minutes."
                </div>
            </div>
        );
    } else if (block.title === "Engineering Desk") {
        content = (
            <div className="space-y-4">
                <p className="text-gray-400 text-sm leading-relaxed">Fill out the diagnostic brief below to alert our hardware engineers.</p>
                <div className="space-y-3">
                    <input type="text" placeholder="Subject" className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl outline-none focus:border-orange-500 text-sm" />
                    <textarea rows="4" placeholder="Detail the anomaly (e.g. Inverter Error Code 402)..." className="w-full bg-[#020617] border border-white/10 p-3 rounded-xl outline-none focus:border-orange-500 text-sm resize-none"></textarea>
                    <button onClick={() => {alert("Ticket Transmitted Successfully!"); setModal({open: false})}} className="w-full bg-orange-500 text-black font-black uppercase tracking-widest py-3 rounded-xl">Transmit Ticket</button>
                </div>
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                    { name: "Grid Integration Guide v3.1", size: "4.2 MB", date: "Jan 2026" },
                    { name: "Inverter Maintenance Protcols", size: "2.1 MB", date: "Feb 2026" },
                    { name: "Panel Cleaning & Efficiency", size: "1.8 MB", date: "Dec 2025" },
                    { name: "Battery Safety Manual", size: "5.5 MB", date: "Mar 2026" }
                ].map((doc, idx) => (
                    <div key={idx} className="bg-[#020617]/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:border-green-500/30 transition">
                        <div>
                            <p className="font-bold text-white text-sm">{doc.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">{doc.date} • {doc.size}</p>
                        </div>
                        <button className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-green-400 transition italic text-[10px] uppercase font-black">Download</button>
                    </div>
                ))}
            </div>
        );
    }
    setModal({ open: true, title: block.title, content: content, icon: block.icon });
  };

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans animate-in fade-in duration-700 relative overflow-hidden pb-20">
        
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center max-w-2xl mx-auto"
          >
            <div className="flex justify-center mb-6">
                <div className="bg-[#0f172a]/80 p-5 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
                    <Headphones className="w-12 h-12 text-orange-400" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-[#0f172a]"></div>
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Signal Dispatch</h1>
            <p className="text-gray-400 font-medium text-lg leading-relaxed">
              Need assistance with your solar array? Our engineering team is standing by 24/7/365 to resolve your technical queries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
                { icon: MessageSquare, title: "Comm Link", desc: "Open a direct chat array with an agent.", action: "Start Session", color: "text-blue-400", borderHover: "hover:border-blue-500/30", bgHover: "hover:bg-blue-500/5" },
                { icon: Mail, title: "Engineering Desk", desc: "Submit a detailed email diagnostic request.", action: "Create Ticket", color: "text-orange-400", borderHover: "hover:border-orange-500/30", bgHover: "hover:bg-orange-500/5" },
                { icon: Briefcase, title: "Hardware Manuals", desc: "Read documentation on grid integration.", action: "Access Library", color: "text-green-400", borderHover: "hover:border-green-500/30", bgHover: "hover:bg-green-500/5" }
            ].map((block, i) => (
                 <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={`bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center group transition-all duration-300 ${block.borderHover} ${block.bgHover}`}
                  >
                      <div className="p-4 bg-[#020617] rounded-2xl mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                          <block.icon className={`w-8 h-8 ${block.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{block.title}</h3>
                      <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed">{block.desc}</p>
                      <button 
                        onClick={() => handleAction(block)}
                        className="w-full bg-[#020617] hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl transition duration-300 relative overflow-hidden"
                      >
                          <span className="relative z-10">{block.action}</span>
                      </button>
                 </motion.div>
            ))}
          </div>

          {/* ================= REVIEWS & FEEDBACK SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
              <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row gap-12 relative z-10">
                  {/* Form Side */}
                  <div className="flex-1">
                      <h2 className="text-3xl font-black text-white mb-2">Leave a System Review</h2>
                      <p className="text-gray-400 mb-8 border-b border-white/10 pb-6">
                          Your feedback directly shapes our future arrays. Share your experience below—this will be publicly displayed on our homepage.
                      </p>

                      <form onSubmit={handleSubmitReview} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">Overall Satisfaction</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button" 
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-8 h-8 ${star <= rating ? "fill-orange-500 text-orange-500" : "text-gray-600"}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 tracking-wider uppercase mb-3">Your Commentary</label>
                                <textarea 
                                    rows="4" 
                                    required
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Detail your experience with our hardware, installation crew, or grid integration..."
                                    className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500 resize-none transition-colors"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting || !reviewText.trim()}
                                className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl flex items-center justify-center gap-3 w-full md:w-auto transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>Transmit Feedback <Send className="w-5 h-5" /></>
                                )}
                            </button>
                      </form>
                  </div>

                  {/* Previous Reviews Side */}
                  <div className="flex-1 bg-[#020617]/50 rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col h-full max-h-[500px]">
                      <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                         <Star className="w-5 h-5 text-yellow-500" /> Recent Transmissions
                      </h3>
                      
                      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                          {reviews.map((rev) => (
                              <div key={rev.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                                  <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600">
                                            <User className="w-4 h-4 text-gray-400" />
                                          </div>
                                          <span className="font-bold text-white">{rev.author}</span>
                                      </div>
                                      <div className="flex">
                                          {[...Array(5)].map((_, idx) => (
                                              <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? "fill-orange-500 text-orange-500" : "text-gray-700"}`} />
                                          ))}
                                      </div>
                                  </div>
                                  <p className="text-gray-400 text-sm leading-relaxed italic">"{rev.text}"</p>
                                  <p className="text-xs text-gray-600 mt-3 font-mono">{new Date(rev.date).toLocaleDateString()}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </motion.div>

      </div>
    </div>
  );
}

const SupportModal = ({ isOpen, onClose, title, content, Icon }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0f172a] border border-white/10 p-8 md:p-12 rounded-[2.5rem] w-full max-w-xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition">
                    <Star className="w-5 h-5 rotate-45" /> {/* Using Star as X for style */}
                </button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-[#020617] rounded-2xl border border-white/5">
                        {Icon && <Icon className="w-6 h-6 text-orange-400" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-widest uppercase">{title}</h2>
                        <div className="h-1 w-12 bg-orange-500 rounded-full mt-1"></div>
                    </div>
                </div>
                <div>{content}</div>
            </motion.div>
        </div>
    );
};

// Replace export wrapper to include modal
const SupportPage = () => {
    const [modal, setModal] = useState({ open: false, title: "", content: null, icon: null });
    return (
        <>
           <Support modal={modal} setModal={setModal} />
           <SupportModal 
             isOpen={modal.open} 
             onClose={() => setModal({...modal, open: false})} 
             title={modal.title} 
             content={modal.content} 
             Icon={modal.icon} 
           />
        </>
    );
};

export default SupportPage;
