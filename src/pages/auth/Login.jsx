import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, CheckCircle, ArrowRight, Loader2, Eye, EyeOff, Mail, Home, Shield, Lock, Briefcase, HardHat, Users, ChevronLeft } from "lucide-react";
import api from "../../api/axiosConfig"; // Axios for Django

function Login({ onLogin }) {
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | '2fa'
  const [secretCode, setSecretCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const showStaff = location.state?.showStaff || false;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);

    // 🚀 DEMO OVERRIDE: Local Bypass for Admin
    if (selectedPortal === 'admin' && email === 'admin@solar.com') {
        if (password !== 'admin123') {
           setError("Invalid Admin Credentials.");
           setLoading(false);
           return;
        }
        
        // Move to 2FA Secret Code Step
        setTimeout(() => {
            setStep('2fa');
            setLoading(false);
        }, 600);
        return;
    }

    try {
      // Send authentication request to Django API with role awareness
      const response = await api.post('auth/login/', { email, password, role: selectedPortal });
      
      const { user, token } = response.data;
      
      // Save token universally
      sessionStorage.setItem('access_token', token);
      
      // Update global React App state
      onLogin(user);
      
      // Navigate based on assigned role from Database
      if (user.role === 'admin') navigate("/dashboard");
      else if (user.role === 'agent') navigate("/agent-dashboard");
      else if (user.role === 'sub_worker') navigate("/worker-dashboard");
      else navigate("/customer-dashboard");

    } catch (err) {
      setError(err.response?.data?.error || "Invalid Credentials or Server Offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
      e.preventDefault();
      setError("");
      
      // Mock secret code is "0000" or anything specific
      if (secretCode === "1234" || secretCode === "0000") {
          setLoading(true);
          setTimeout(() => {
              sessionStorage.setItem('access_token', 'mock-admin-token-12345');
              onLogin({ role: 'admin', username: 'Super Admin Security', email: 'admin@solar.com' });
              navigate("/dashboard");
          }, 600);
      } else {
          setError("Invalid Secret Code. Access Denied.");
      }
  };

  const handleGoogleLogin = async () => {
    // Simulated fetch from present Google SSO state
    const googleEmail = window.prompt("Google SSO Authorization: Choose a Google account to continue.", "personal@gmail.com");
    if (!googleEmail) return;

    setLoading(true);
    try {
      const response = await api.post('auth/oauth/', { email: googleEmail, role: selectedPortal });
      
      const { user, token } = response.data;
      sessionStorage.setItem('access_token', token);
      onLogin(user);

      if (user.role === 'admin') navigate("/dashboard");
      else if (user.role === 'agent') navigate("/agent-dashboard");
      else if (user.role === 'sub_worker') navigate("/worker-dashboard");
      else navigate("/customer-dashboard");
    } catch (err) {
      setError("Google SSO Fetch Failed. Check Backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleWebEmailLogin = async () => {
    // Simulated fetch from present web browser SSO state
    const webEmail = window.prompt("Local SSO Authorization: Requesting permission to fetch current web email.", "user@gmail.com");
    if (!webEmail) return;

    setLoading(true);
    try {
      // Connect to backend securely
      const response = await api.post('auth/oauth/', { email: webEmail, role: selectedPortal });
      
      const { user, token } = response.data;
      sessionStorage.setItem('access_token', token);
      onLogin(user);

      // Auto-route based on account standing
      if (user.role === 'admin') navigate("/dashboard");
      else if (user.role === 'agent') navigate("/agent-dashboard");
      else if (user.role === 'sub_worker') navigate("/worker-dashboard");
      else navigate("/customer-dashboard");
    } catch (err) {
      setError("Web Email SSO Fetch Failed. Check Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex text-white bg-[#020617] overflow-hidden relative selection:bg-orange-500/30 bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: 'url("/images/login_bg.png")' }}
    >
      {/* Dark transparency overlay to ensure interface readability */}
      <div className="absolute inset-0 bg-[#020617]/85 pointer-events-none z-[5]"></div>
      
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-[70] bg-white/5 backdrop-blur-3xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Home className="w-6 h-6 relative z-10 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300 drop-shadow-md" />
      </Link>

      {!selectedPortal ? (
        // ================= GATEWAY SELECTION =================
        <div className="w-full flex flex-col items-center justify-center p-8 relative z-[60] min-h-screen">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-[8]"></div>
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 relative z-10 flex flex-col items-center">
            <button 
              onClick={() => { setSelectedPortal('admin'); setEmail('admin@solar.com'); setPassword('admin123'); }} 
              className="relative group hover:scale-110 transition-transform duration-300 outline-none focus:outline-none block"
            >
              <Sun className="w-16 h-16 text-orange-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)] cursor-pointer" />
            </button>
            <h1 className="text-5xl font-black tracking-tight mb-4">Secure Authentication Gateway</h1>
            <p className="text-gray-400 text-lg uppercase tracking-widest font-semibold">Select Your Designated Operations Portal</p>
          </motion.div>

          <div className="grid md:grid-cols-2 max-w-4xl gap-8 mx-auto w-full relative z-10 px-4">
            {!showStaff ? (
              <>
                {/* Customer Hub Portal */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPortal('customer')} className="group text-left bg-[#0f172a]/60 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/50 p-8 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col w-full h-full">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mb-6 border border-blue-500/20"><Users className="w-8 h-8 text-blue-400" /></div>
                   <h2 className="text-3xl font-bold mb-3">Customer Hub</h2>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Manage your appointments, billing, and system diagnostics.</p>
                   <div className="font-bold text-blue-400 uppercase tracking-widest text-xs flex items-center gap-2 mt-auto">Enter Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></div>
                </motion.button>
                
                {/* Register Hub Portal */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/register')} className="group text-left bg-[#0f172a]/60 backdrop-blur-xl border border-green-500/20 hover:border-green-500/50 p-8 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col w-full h-full">
                   <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="p-4 bg-green-500/10 rounded-2xl w-fit mb-6 border border-green-500/20"><Users className="w-8 h-8 text-green-400" /></div>
                   <h2 className="text-3xl font-bold mb-3">Register Hub</h2>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">New to RC Solar? Create an account to start your solar journey.</p>
                   <div className="font-bold text-green-400 uppercase tracking-widest text-xs flex items-center gap-2 mt-auto">Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></div>
                </motion.button>
              </>
            ) : (
              <>
                {/* Agent Portal */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPortal('agent')} className="group text-left bg-[#0f172a]/60 backdrop-blur-xl border border-orange-500/20 hover:border-orange-500/50 p-8 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col w-full h-full">
                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="p-4 bg-orange-500/10 rounded-2xl w-fit mb-6 border border-orange-500/20"><Briefcase className="w-8 h-8 text-orange-400" /></div>
                   <h2 className="text-3xl font-bold mb-3">Agent Terminal</h2>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Field coordination, document verification, and deployment queues.</p>
                   <div className="font-bold text-orange-400 uppercase tracking-widest text-xs flex items-center gap-2 mt-auto">Enter Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></div>
                </motion.button>

                {/* Worker Portal */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPortal('sub_worker')} className="group text-left bg-[#0f172a]/60 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/50 p-8 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col w-full h-full">
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="p-4 bg-cyan-500/10 rounded-2xl w-fit mb-6 border border-cyan-500/20"><HardHat className="w-8 h-8 text-cyan-400" /></div>
                   <h2 className="text-3xl font-bold mb-3">Field Ops</h2>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Task tracking, site photos, and daily attendance logs.</p>
                   <div className="font-bold text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2 mt-auto">Enter Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></div>
                </motion.button>
              </>
            )}
          </div>

          <button onClick={() => { setSelectedPortal('admin'); setEmail('admin@solar.com'); setPassword('admin123'); }} className="absolute bottom-8 right-8 flex items-center gap-2 text-gray-600 hover:text-white transition-colors">
            <Lock className="w-4 h-4" /> <span className="text-[10px] uppercase tracking-widest font-bold">Admin Clearance</span>
          </button>
        </div>
      ) : (
        // ================= SPECIFIC PORTAL LOGIN =================
        <div className="w-full flex min-h-screen">
          {/* LEFT: FORM */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative z-[60]">
            <button onClick={() => { setSelectedPortal(null); setError(''); setStep('login'); }} className="absolute top-8 left-24 flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 px-4 py-2 rounded-xl transition-colors font-bold uppercase text-xs tracking-widest border border-white/10">
              <ChevronLeft className="w-4 h-4" /> Switch Portal
            </button>
            
            <div className={`absolute top-0 right-1/2 w-96 h-96 blur-[120px] rounded-full pointer-events-none ${selectedPortal === 'customer' ? 'bg-blue-500/20' : selectedPortal === 'sub_worker' ? 'bg-cyan-500/20' : 'bg-orange-500/20'}`}></div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               
              {step === 'login' ? (
                 <>
                    <h2 className={`text-4xl font-extrabold mb-2 tracking-tight ${selectedPortal === 'customer' ? 'text-blue-400' : selectedPortal === 'sub_worker' ? 'text-cyan-400' : 'text-orange-400'}`}>
                      {selectedPortal === 'admin' ? "Admin Access" : selectedPortal === 'customer' ? 'Customer Hub' : selectedPortal === 'sub_worker' ? 'Field Ops Portal' : 'Agent Terminal'}
                    </h2>
                    <p className="text-gray-400 mb-8 text-sm font-semibold uppercase tracking-widest border-b border-white/10 pb-6">Secure Gateway Active</p>

                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-bold flex items-start gap-3">
                        <Lock className="w-5 h-5 shrink-0" /> {error}
                      </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Identity verification (Email)</label>
                        <input
                          type="email"
                          placeholder={selectedPortal === "admin" ? "admin@core.local" : `${selectedPortal}@domain.com`}
                          className="w-full px-5 py-4 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all shadow-inner"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Security Passphrase</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all pr-12 shadow-inner"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button type="button" tabIndex="-1" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button type="submit" disabled={loading} className={`w-full text-[#020617] py-4 rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2 group mt-4 ${selectedPortal === 'customer' ? 'bg-blue-400 hover:bg-blue-500 hover:shadow-blue-500/50' : selectedPortal === 'sub_worker' ? 'bg-cyan-400 hover:bg-cyan-500 hover:shadow-cyan-500/50' : 'bg-orange-500 hover:bg-orange-400 hover:shadow-orange-500/50'}`}>
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Access System <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /></>}
                      </button>
                    </form>

                    <div className="flex items-center my-8 gap-4 opacity-50">
                      <div className="flex-1 h-px bg-white/20"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or Link Device</span>
                      <div className="flex-1 h-px bg-white/20"></div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={handleGoogleLogin} disabled={loading} type="button" className={`flex-1 bg-[#020617] hover:bg-white/5 border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs font-bold uppercase tracking-wider`}>
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="google" className="w-4 h-4" /> Google
                      </button>
                      <button onClick={handleWebEmailLogin} disabled={loading} type="button" className={`flex-1 bg-[#020617] hover:bg-white/5 border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs font-bold uppercase tracking-wider`}>
                        <Mail className={`w-4 h-4 ${selectedPortal === 'customer' ? 'text-blue-400' : 'text-orange-400'}`} /> SSO Login
                      </button>
                    </div>

                    {selectedPortal === 'customer' && (
                      <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        Need an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Apply Here</Link>
                      </p>
                    )}
                 </>
              ) : (
                 <>
                    {/* 2FA COMPONENT FOR ADMIN */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                       <div className="flex justify-center items-center mb-6">
                          <div className="p-4 bg-orange-500/20 rounded-full border border-orange-500/30">
                             <Lock className="w-10 h-10 text-orange-500" />
                          </div>
                       </div>
                       <h2 className="text-3xl font-extrabold mb-2 text-center text-white tracking-tight">Level 5 Clearance</h2>
                       <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed font-semibold">
                           A Signal Code has been dispatched.<br/><span className="text-orange-400 font-bold block mt-2">Notification Sent to secure device.</span>
                       </p>
                       {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-bold text-center">{error}</div>}
                       <form onSubmit={handleVerifyCode} className="flex flex-col gap-5 relative z-10 w-full" autoComplete="off">
                          <input type="text" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} className="w-full bg-[#020617] text-white border border-white/10 rounded-xl p-6 focus:outline-none focus:border-orange-500/50 transition-all font-mono tracking-[1em] text-center text-3xl shadow-inner" placeholder="0000" maxLength={4} autoFocus />
                          <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest py-5 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 transition-all flex justify-center mt-2">
                            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Verify Identity"}
                          </button>
                          <button type="button" onClick={() => { setStep('login'); setError(""); setSecretCode(""); }} className="text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest border-b border-gray-600 pb-1 mt-6 text-center w-fit mx-auto">Cancel Override</button>
                       </form>
                    </motion.div>
                 </>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDE BRANDING (Visible only in Specific Portal) */}
          <div className="hidden lg:flex w-1/2 bg-[#020617] relative items-center justify-center p-16 border-l border-white/5">
             <img src="/images/solar_hero.png" alt="Solar" className={`absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen grayscale ${selectedPortal === 'customer' ? 'contrast-125 sepia-[.3] hue-rotate-180' : selectedPortal === 'sub_worker' ? 'contrast-125 sepia-[.3] hue-rotate-[130deg]' : 'contrast-125 sepia-[.3]'}`} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/50 to-transparent"></div>
             
             <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 max-w-lg">
               <h2 className="text-5xl font-extrabold mb-8 leading-tight tracking-tight">
                  {selectedPortal === 'customer' ? 'Power Your Future.' : selectedPortal === 'sub_worker' ? 'Build The Grid.' : 'Manage The Network.'}
               </h2>
               <ul className="space-y-6">
                  {[
                    selectedPortal === 'customer' ? "Access seamless diagnostics and billing details instantly." : selectedPortal === 'sub_worker' ? "Direct connectivity with operations dispatch 24/7." : "Enterprise tools for rapid solar deployments.",
                    selectedPortal === 'customer' ? "Zero hidden fees. Complete transparency." : selectedPortal === 'sub_worker' ? "Real-time logging directly to headquarters." : "Client coordination and task automation.",
                    "Military-grade security protocols active."
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="mt-1">
                          <CheckCircle className={`w-6 h-6 ${selectedPortal === 'customer' ? 'text-blue-400' : selectedPortal === 'sub_worker' ? 'text-cyan-400' : 'text-orange-400'}`} />
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed font-medium">{text}</p>
                    </li>
                  ))}
               </ul>
             </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
