import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap } from "lucide-react";

function Footer({ role }) {
  const currentYear = new Date().getFullYear();

  if (role === "agent") {
    // 🟠 Minimal & Neat Footer tailored for the Agent Dashboard
    return (
      <footer className="bg-[#020617] border-t border-white/5 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div className="flex items-center gap-3 text-orange-500 font-bold tracking-widest text-sm uppercase">
            <ShieldCheck className="w-5 h-5 text-yellow-500" />
            Field Agent Operations Command
          </div>
          <div className="text-gray-500 text-xs font-semibold tracking-wider">
            Maintain strict conformity to installation protocols. Synchronizing with centralized ledger...
          </div>
          <div className="text-gray-600 text-xs font-medium">
            © {currentYear} SolarNode Grid. All Rights Reserved.
          </div>
        </div>
      </footer>
    );
  }

  // 🔹 Standard Footer for Public, Admin, and Customers
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-orange-400 mb-3 flex items-center gap-2">
            <Zap className="w-6 h-6" /> Solar Administration
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            A comprehensive platform to manage solar installations, monitor real-time energy production, and streamline customer data management.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="hover:text-orange-400 transition duration-200">
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/customer-dashboard" className="hover:text-orange-400 transition duration-200">
                Customer Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white uppercase tracking-wider">
            Contact Us
          </h3>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:saidurganivas02@gmail.com" className="hover:text-orange-400 transition">
                 saidurganivas02@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+916300697301" className="hover:text-orange-400 transition">
                +91 6300697301
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span>Kakinada, Andhra Pradesh</span>
            </p>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500 bg-gray-950">
        © {currentYear} Solar Administration System. All rights reserved. | Developed by <span className="text-orange-500 font-medium">Nivas Reddy</span>
      </div>
    </footer>
  );
}

export default Footer;
