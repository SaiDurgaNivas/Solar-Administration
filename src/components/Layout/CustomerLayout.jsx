import React from "react";
import CustomerHeader from "./CustomerHeader";

function CustomerLayout({ children, user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ✅ Header for all pages */}
      <CustomerHeader user={user} onLogout={onLogout} />

      {/* Page Content */}
      <div className="p-6">
        {children}
      </div>

    </div>
  );
}

export default CustomerLayout;
