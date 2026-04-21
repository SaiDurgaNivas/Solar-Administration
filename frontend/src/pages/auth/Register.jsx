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
      style={{ backgroundImage: 'url("file:///C:/Users/K.%20Sai%20Durga%20Nivas/.gemini/antigravity/brain/b964639b-9118-4778-ad58-c217be38a362/residential_solar_bg_1776788998817.png")' }}
    >
      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 bg-white/90 backdrop-blur shadow-lg p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all text-gray-700"
      >
        <Home className="w-5 h-5" />
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-lg bg-white/95 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50 relative z-10"
      >
        <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-orange-100 rounded-2xl mb-4">
                <Sun className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-500 font-medium">Powering your home with clean energy</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" name="firstName" placeholder="First Name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                value={formData.firstName} onChange={handleChange}
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text" name="lastName" placeholder="Last Name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                value={formData.lastName} onChange={handleChange}
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email" name="email" placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              value={formData.email} onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password" placeholder="Password (Min. 6 chars)"
              className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              value={formData.password} onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword" placeholder="Confirm Password"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              value={formData.confirmPassword} onChange={handleChange}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600 font-medium">
          Already have an account? <Link to="/login" className="text-orange-500 font-bold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
