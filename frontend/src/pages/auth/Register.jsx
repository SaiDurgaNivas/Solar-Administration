import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Loader2, User, Mail, Lock, ShieldCheck, Eye, EyeOff, Sun } from "lucide-react";
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
      setError("Please fill in all identity fields.");
      return;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    setLoading(true);
    try {
      await api.post('auth/register/', { 
        username: email, email, password,
        first_name: firstName, last_name: lastName,
        role: 'customer'
      });
      navigate("/login");
    } catch (err) {
      const errorData = err.response?.data;
      setError(typeof errorData === 'object' ? Object.values(errorData).flat().join(" ") : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative"
      style={{ backgroundImage: 'url("/images/register_side_bg.png")' }}
    >
      {/* Overall Soft Navy Overlay */}
      <div className="absolute inset-0 bg-[#0f172a]/70 pointer-events-none"></div>

      {/* Floating Home Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all shadow-lg z-[70]"
      >
        <Home className="w-5 h-5 text-white" />
      </Link>

      <div className="w-full max-w-5xl flex items-center justify-center relative z-10">
        
        {/* Branding (Hidden or Adjusted for overall background) */}
        <div className="hidden lg:flex lg:w-1/2 text-white flex-col justify-center p-12">
          <div className="mb-6">
             <div className="inline-flex p-1 rounded-full bg-orange-100/10 mb-4">
                <Sun className="w-20 h-20 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] fill-orange-500" />
             </div>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Join Solar <br /> Administration</h1>
          <p className="text-gray-200 text-lg leading-relaxed font-semibold">
            Manage installations and monitor production with precision and ease.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.3)] border border-white/20"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-gray-500 font-medium italic">Enter your credentials to proceed</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border-l-4 border-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text" name="firstName" placeholder="John"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-medium"
                      value={formData.firstName} onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text" name="lastName" placeholder="Doe"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-medium"
                      value={formData.lastName} onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Connection</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email" name="email" placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Access Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.password} onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 font-bold text-xs uppercase transition-colors">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Security</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword" placeholder="Confirm your password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-[1.5rem] font-black transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg active:scale-95"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Create Account"}
              </button>
            </form>

            <p className="text-center mt-10 text-sm text-gray-500 font-bold uppercase tracking-widest">
              Ready to beam? <Link to="/login" className="text-orange-500 hover:underline hover:text-orange-600 ml-1">Login Here</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;
