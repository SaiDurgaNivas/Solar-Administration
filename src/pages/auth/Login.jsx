import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, CheckCircle, ArrowRight, Loader2, Eye, EyeOff, Mail, Home, Shield, Lock } from "lucide-react";
import api from "../../api/axiosConfig"; // Axios for Django

function Login({ onLogin }) {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('login'); // 'login' | '2fa'
  const [secretCode, setSecretCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);

    // 🚀 DEMO OVERRIDE: Local Bypass for Admin
    if (role === 'admin' && email === 'admin@solar.com') {
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
      const response = await api.post('auth/login/', { email, password, role });
      
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
      const response = await api.post('auth/oauth/', { email: googleEmail, role });
      
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
      const response = await api.post('auth/oauth/', { email: webEmail, role });
      
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
    <div className="min-h-screen flex text-white bg-[#020617] overflow-hidden relative">
      
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-[70] bg-white/5 backdrop-blur-3xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Home className="w-6 h-6 relative z-10 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300 drop-shadow-md" />
      </Link>

      {/* LEFT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative z-[60]">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/2 w-96 h-96 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        {/* 🛡️ DISCRETE ADMIN ACCESS BUTTON */}
        <button 
          type="button"
          onClick={() => {
              setRole('admin');
              setEmail('admin@solar.com');
              setPassword('admin123');
          }}
          className={`absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            role === 'admin' 
              ? "bg-orange-500/20 text-orange-500 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              : "bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Admin Access</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
        >
          {step === 'login' ? (
             <>
                <div className="flex justify-center items-center gap-2 mb-8">
                  <Sun className="w-8 h-8 text-orange-500" />
                  <h1 className="text-2xl font-bold tracking-wide">
                    Solar<span className="text-orange-500">Administration</span>
                  </h1>
                </div>
                
                <h2 className="text-3xl font-extrabold mb-2 text-center tracking-tight">
                  {role === 'admin' ? "Admin Portal" : "Welcome Back"}
                </h2>
                <p className="text-gray-400 text-center mb-8 text-sm">
                  {role === 'admin' 
                      ? "Provide high-level credentials to grant access." 
                      : "Sign in to your account to continue"}
                </p>

                {/* Role Tabs or Admin Indicator */}
                {role !== 'admin' ? (
                  <div className="bg-white/5 p-1 rounded-xl flex gap-1 mb-8 border border-white/5">
                    {["agent", "sub_worker", "customer"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                          role === r 
                            ? "bg-orange-500 text-white shadow-lg" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {r === 'sub_worker' ? 'Worker' : r}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-orange-500/10 p-2 mb-8 rounded-xl border border-orange-500/30 flex justify-center items-center">
                      <span className="text-orange-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                         <Shield className="w-4 h-4" /> Secure Admin Terminal
                      </span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder={role === "admin" ? "admin@gmail.com" : role === "agent" ? "agent@gmail.com" : role === "sub_worker" ? "worker@example.com" : "you@example.com"}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} className="text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors">Forgot Password?</a>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        tabIndex="-1"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-black py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 group mt-2"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                        <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>

                <div className="flex items-center my-8 gap-4">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Or continue with</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    type="button"
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm font-semibold"
                  >
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="google" className="w-5 h-5" />
                    Google
                  </button>

                  <button
                    onClick={handleWebEmailLogin}
                    disabled={loading}
                    type="button"
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm font-semibold"
                  >
                    <Mail className="w-5 h-5 text-orange-500" />
                    Web Email
                  </button>
                </div>
                
                {role === 'customer' && (
                  <p className="text-center mt-8 text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-orange-500 font-bold hover:underline">Sign Up</Link>
                  </p>
                )}
             </>
          ) : (
             <>
                {/* 2FA SECRET CODE STEP */}
                <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                >
                   <div className="flex justify-center items-center gap-2 mb-6">
                      <div className="p-4 bg-orange-500/20 rounded-full border border-orange-500/30">
                         <Lock className="w-10 h-10 text-orange-500" />
                      </div>
                   </div>
                   <h2 className="text-3xl font-extrabold mb-2 text-center tracking-tight text-white">Admin Clearance</h2>
                   <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
                       A high-priority Signal Code has been dispatched to the Administrator's secure device.<br/>
                       <span className="text-orange-400 font-bold block mt-2">Notification Sent to +91 ******0699</span>
                   </p>

                   {error && (
                     <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
                       {error}
                     </div>
                   )}

                   <form onSubmit={handleVerifyCode} className="flex flex-col gap-5 relative z-10 w-full" autoComplete="off">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Secret Clearance Code</label>
                        <input
                          type="text"
                          value={secretCode}
                          onChange={(e) => setSecretCode(e.target.value)}
                          className="w-full bg-black/40 text-white border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-orange-500/50 transition-all font-mono tracking-[1em] text-center text-2xl"
                          placeholder="••••"
                          maxLength={4}
                          autoFocus
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50 transition-all text-sm uppercase tracking-widest flex justify-center mt-4"
                      >
                        {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Verify Identity"}
                      </button>

                      <p className="text-center mt-6">
                         <button 
                            type="button" 
                            onClick={() => { setStep('login'); setError(""); setSecretCode(""); }} 
                            className="text-xs text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-widest border-b border-gray-600 pb-0.5"
                         >
                            Cancel Override
                         </button>
                      </p>
                   </form>
                </motion.div>
             </>
          )}
          
        </motion.div>
      </div>

      {/* RIGHT SIDE: Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#0a1122] relative border-l border-white/5 items-center justify-center p-16">
         {/* Using our generated solar hero image */}
         <img 
            src="/images/solar_hero.png" 
            alt="Solar Panels" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#020617] to-transparent"></div>
         
         <motion.div 
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative z-10 max-w-lg"
         >
           <h2 className="text-4xl font-bold mb-6 leading-tight">The industry standard for solar administration.</h2>
           
           <ul className="space-y-6">
              {[
                "Deploy and track infrastructure with precision.",
                "Real-time grid telemetry and panel health diagnostics.",
                "Frictionless billing and customer CRM routing."
              ].map((text, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1"><CheckCircle className="w-6 h-6 text-orange-500" /></div>
                  <p className="text-gray-300 text-lg leading-relaxed">{text}</p>
                </li>
              ))}
           </ul>
         </motion.div>
      </div>

    </div>
  );
}

export default Login;
