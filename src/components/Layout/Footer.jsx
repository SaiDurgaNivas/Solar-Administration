import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-orange-400 mb-3">
            ☀ Solar Administration
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
              <Link to="/" className="hover:text-orange-400 transition duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-orange-400 transition duration-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/customers" className="hover:text-orange-400 transition duration-200">
                Customers
              </Link>
            </li>
            <li>
              <Link to="/installations" className="hover:text-orange-400 transition duration-200">
                Installations
              </Link>
            </li>
            <li>
              <Link to="/billing" className="hover:text-orange-400 transition duration-200">
                Billing
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

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6 text-xl">
            <a href="#" className="hover:text-orange-400 transition transform hover:scale-110">
              🌐
            </a>
            <a href="#" className="hover:text-orange-400 transition transform hover:scale-110">
              📘
            </a>
            <a href="#" className="hover:text-orange-400 transition transform hover:scale-110">
              🐦
            </a>
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
