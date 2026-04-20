import React, { useState } from 'react';
import { Bell, ArrowLeft, Sun, Home, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import UserProfilePhoto from '../UserProfilePhoto';

function WorkerHeader({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    setShowHomeConfirm(true);
    setOpen(false);
  };

  const confirmGoHome = () => {
    setShowHomeConfirm(false);
    if (onLogout) onLogout();
    navigate('/');
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const showBackButton = location.pathname !== '/worker-dashboard';

  return (
    <>
      <header className="w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-sm text-white">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white"
                title="Go Back"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Sun className="text-orange-500 w-6 h-6" />
              <h1 className="text-lg font-bold tracking-wide">
                Solar<span className="text-orange-500">Worker</span>
              </h1>
            </div>
          </div>

          <button
            onClick={handleHomeClick}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]"
            title="Go to Public Portal"
          >
            <Home size={16} />
            <span className="text-sm font-bold tracking-wider uppercase">Home</span>
          </button>

          <p className="hidden md:block text-sm text-gray-400 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {dateString}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/worker-dashboard"
            className="text-sm font-semibold text-gray-400 hover:text-orange-400 transition-colors"
          >
            Worker Hub
          </Link>

          <div className="relative cursor-pointer group">
            <div className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={20} className="text-gray-300 group-hover:text-white transition-colors" />
            </div>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#020617]">
              2
            </span>
          </div>

          <div className="relative">
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <UserProfilePhoto user={user} size="md" />
              <span className="hidden sm:block font-medium text-sm text-gray-200 pr-2">
                {user?.username?.replace(/_/g, ' ') || 'Worker'}
              </span>
            </div>

            {open && (
              <div className="absolute right-0 mt-4 w-72 bg-[#0f172a] shadow-2xl rounded-2xl p-5 z-50 border border-white/10">
                <p className="font-bold mb-4 text-white">Worker Profile</p>
                <div className="flex justify-center mb-6">
                  <UserProfilePhoto user={user} size="xl" clickable={true} />
                </div>
                <div className="text-sm text-gray-400 mb-4 space-y-3 bg-[#020617] p-3 rounded-xl border border-white/5">
                  <p><strong className="text-gray-200 font-medium">Name:</strong><br />{user?.username?.replace(/_/g, ' ') || 'Worker'}</p>
                  <p><strong className="text-gray-200 font-medium">Email:</strong><br />{user?.email || 'No Email'}</p>
                  <p className="capitalize"><strong className="text-gray-200 font-medium">Role:</strong><br />
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-md border border-orange-500/20">
                      {user?.role === 'sub_worker' ? 'Field Worker' : user?.role}
                    </span>
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full bg-white/5 text-red-400 hover:text-white border border-white/5 hover:bg-red-500 font-semibold py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

      {/* 🔒 Logout Confirmation Modal */}
      <AnimatePresence>
        {showHomeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center"
            >
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                <AlertCircle className="w-7 h-7 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Leave Portal?</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                You are about to leave the <span className="text-orange-400 font-semibold">Worker Portal</span> and return to the public home page.<br />
                <span className="text-white/60">This will log you out.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowHomeConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-semibold transition-all text-sm"
                >
                  Stay Here
                </button>
                <button
                  onClick={confirmGoHome}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all text-sm shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default WorkerHeader;
