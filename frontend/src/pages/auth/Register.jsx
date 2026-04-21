import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, Loader2, User, Mail, Lock, 
  ShieldCheck, Eye, EyeOff, ArrowRight, Sun, CheckCircle 
} from "lucide-react";
import api from "../../api/axiosConfig";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password) {
      setError("Strategic protocol requires all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Security passphrase mismatch detected.");
      return;
    }

    if (password.length < 6) {
      setError("Passphrase integrity must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await api.post('auth/register/', { 
        username: email, 
        email, 
        password,
        first_name: firstName,
        last_name: lastName,
        role: 'customer'
      });
      
      // Success logic
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      console.error('Registration error:', err);
      const errorData = err.response?.data;
      let errorMessage = "System rejection. Core offline or data invalid.";
      
      if (typeof errorData === 'object' && errorData !== null) {
        errorMessage = Object.values(errorData).flat().join(" | ").replace(/username/gi, "email");
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex text-white bg-[#020617] overflow-hidden relative selection:bg-orange-500/30 bg-cover bg-center bg-no-repeat w-full"
      style={{ backgroundImage: 'url("/images/login_bg.png")' }}
    >
      {/* Transparency Overlay */}
      <div className="absolute inset-0 bg-[#020617]/85 pointer-events-none z-[5]"></div>
      
      {/* 🏠 FLOATING HOME BUTTON */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-[70] bg-white/5 backdrop-blur-3xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50 hover:bg-white/10 p-4 rounded-2xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Home className="w-6 h-6 relative z-10 group-hover:scale-110 group-hover:text-orange-400 transition-all duration-300 drop-shadow-md" />
      </Link>

      <div className="w-full flex min-h-screen relative z-10">
        
        {/* LEFT: FORM CONTAINER */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
          
          <div className="absolute top-1/4 right-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="w-full max-w-xl bg-[#0f172a]/90 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                <Sun className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white">Join Solar Hub</h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Initialize Residential Network Account</p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3">
                <Lock className="w-5 h-5 shrink-0" /> {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Identity (First)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all shadow-inner text-sm"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Identity (Last)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all shadow-inner text-sm"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Core Contact (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@nexus.com"
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all shadow-inner text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Passphrase</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-4 rounded-2xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all shadow-inner text-sm"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white pb-1">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Verification</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#020617] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all shadow-inner text-sm"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black py-5 rounded-[1.5rem] font-black transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] flex items-center justify-center gap-3 group mt-4 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Initialize Account <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500 font-bold text-sm">
                Already have a station? <Link to="/login" className="text-orange-500 hover:text-orange-400 transition-colors ml-2 underline underline-offset-4">Sign In to Hub</Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: BRANDING / BENEFITS */}
        <div className="hidden lg:flex w-1/2 bg-[#020617] relative items-center justify-center p-16 border-l border-white/5 overflow-hidden">
           {/* Visual Assets */}
           <img src="/images/solar_hero.png" alt="Solar" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen grayscale contrast-125 sepia-[.3]" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/50 to-transparent"></div>
           
           <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 max-w-lg">
             <h2 className="text-5xl font-black mb-8 leading-[1.1] tracking-tighter">
                Accelerate Your <br />
                <span className="text-orange-500">Solar Transition.</span>
             </h2>
             <ul className="space-y-8">
                {[
                  "Military-grade encryption for all financial and energy data.",
                  "Real-time monitoring of monocrystalline panel performance.",
                  "Automated support ticket dispatch for hardware anomalies."
                ].map((text, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex gap-5 items-start"
                  >
                    <div className="mt-1 bg-orange-500/20 p-1.5 rounded-lg border border-orange-500/30">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed font-semibold italic">{text}</p>
                  </motion.li>
                ))}
             </ul>

             <div className="mt-16 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-colors"></div>
                <p className="text-gray-300 font-bold italic leading-relaxed text-sm">
                  "RC Solar Solutions has completely transformed how I manage my power bills. The interface is stunning and the data is accurate."
                </p>
                <p className="text-xs text-orange-500 font-black uppercase tracking-widest mt-4">— Verified Customer Hub User</p>
             </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}

export default Register;
