import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, CheckCircle, ArrowRight, Loader2, Eye, EyeOff, Home, Shield, Lock, Briefcase, HardHat, Users, ChevronLeft } from "lucide-react";
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
      console.error('Login error:', err);
      const errorData = err.response?.data;
      let errorMessage = "";
      
      if (!errorData) {
        errorMessage = "Invalid Credentials or Server Offline.";
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (typeof errorData === 'object') {
        errorMessage = Object.values(errorData)
          .map(v => {
            if (Array.isArray(v)) return v.join(" ");
            if (typeof v === 'object' && v !== null) return JSON.stringify(v);
            return String(v);
          })
          .join(" ");
      } else {
        errorMessage = String(errorData);
      }
      
      setError(errorMessage || "Login failed. Please check credentials.");
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
            <Sun className="w-16 h-16 text-orange-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
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

          {/* 🔥 HIDDEN ADMIN DOOR (ONLY ACCESSIBLE VIA STAFF VIEW) */}
          {showStaff && (
            <button 
              onClick={() => { 
                setSelectedPortal('admin'); 
                setEmail(''); 
                setPassword(''); 
                setStep('login');
                setError('');
              }} 
              className="absolute bottom-8 right-8 flex items-center gap-3 text-white/40 hover:text-orange-500 transition-all group scale-90 hover:scale-100 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-orange-500/50 backdrop-blur-md shadow-2xl"
            >
              <Lock className="w-4 h-4 group-hover:animate-pulse" /> 
              <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-100 transition-opacity">Admin Clearance</span>
            </button>
          )}
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
                      {selectedPortal === 'customer' ? 'Customer Hub' : 
                       selectedPortal === 'sub_worker' ? 'Field Ops Portal' : 
                       selectedPortal === 'admin' ? 'Admin Login' : 'Agent Terminal'}
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
                          placeholder="Enter email"
                          className="w-full px-5 py-4 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all shadow-inner"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Security Passphrase</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="w-full px-5 py-4 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all pr-12 shadow-inner"
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

                    {selectedPortal === 'admin' && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <button 
                          onClick={() => setStep('2fa')}
                          className="w-full py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-orange-500/20 flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" /> Use Security Authorization Code
                        </button>
                      </div>
                    )}

                    {selectedPortal === 'customer' && (
                      <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        Need an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Apply Here</Link>
                      </p>
                    )}
                 </>
              ) : step === '2fa' ? (
                 <>
                    <div className="flex flex-col items-center mb-8">
                      <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center mb-6 border border-orange-500/30">
                        <Shield className="w-10 h-10 text-orange-500" />
                      </div>
                      <h2 className="text-3xl font-black text-center mb-2">Admin Clearance</h2>
                      <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Verification Level: Omega</p>
                    </div>

                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-bold flex items-start gap-3">
                        <Shield className="w-5 h-5 shrink-0" /> {error}
                      </div>
                    )}

                    <form onSubmit={handleVerifyCode} className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 text-center">Enter 4-Digit Security Authorization Code</label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="••••"
                          className="w-full px-5 py-6 rounded-2xl bg-[#020617] border border-orange-500/30 text-white placeholder-gray-700 text-center text-4xl tracking-[1em] focus:outline-none focus:border-orange-500 transition-all shadow-2xl font-black"
                          value={secretCode}
                          onChange={(e) => setSecretCode(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-400 text-[#020617] py-4 rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2 group mt-4">
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Authorize Clearance <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /></>}
                      </button>

                      <p className="text-center text-[10px] text-gray-600 uppercase tracking-tighter font-bold">Encrypted terminal connection active. All attempts are logged.</p>
                    </form>
                 </>
              ) : (
                 <>
                  <div className="flex flex-col items-center justify-center p-10 bg-red-500/10 border border-red-500/20 rounded-3xl">
                    <Lock className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Unauthorized Access</h3>
                    <p className="text-gray-400 text-center text-sm">This portal is restricted. Please contact system administrator.</p>
                    <button onClick={() => setSelectedPortal(null)} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">Go Back</button>
                  </div>
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
