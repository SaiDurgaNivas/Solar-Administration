import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t shadow-sm mt-auto">
      <div className="max-w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm">
        
        {/* Left */}
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-yellow-500">Solar Admin</span>. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-yellow-500 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-yellow-500 transition">
            Terms
          </a>
          <a href="#" className="hover:text-yellow-500 transition">
            Support
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
