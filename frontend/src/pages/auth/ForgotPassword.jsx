import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, ArrowLeft, Mail, Loader2, ShieldCheck, CheckCircle } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulation of password reset request
      // In a real app: await api.post('auth/password-reset/', { email });
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (err) {
      setError("Could not initiate reset. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 text-white bg-[#020617] relative selection:bg-orange-500/30 bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: 'url("/images/login_bg.png")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#020617]/85 pointer-events-none z-[5]"></div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-[8]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-[60]"
      >
        <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        {!submitted ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-orange-500/30">
                <ShieldCheck className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-3xl font-black text-center mb-2">Reset Passphrase</h2>
              <p className="text-gray-400 text-xs text-center uppercase tracking-widest font-bold">Secure Recovery Protocol</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-bold flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Registered Identity (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all shadow-inner"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-orange-500 hover:bg-orange-400 text-[#020617] py-4 rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2 group mt-4 shadow-orange-500/20"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Request Recovery <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold leading-relaxed">
              If the account exists, a recovery link will be dispatched to this node.
            </p>
          </>
        ) : (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center py-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-center mb-4 text-green-400">Recovery Sent</h2>
            <p className="text-gray-400 text-center text-sm leading-relaxed mb-8 px-4 font-medium">
              A secure recovery link has been dispatched to <span className="text-white font-bold">{email}</span>. Please check your inbox and follow the clearance instructions.
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-xs font-black uppercase tracking-[0.2em] transition-all"
            >
              Return to Hub
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
