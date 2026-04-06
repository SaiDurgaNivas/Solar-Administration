import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, CalendarCheck, Flag, LogOut, User as UserIcon } from 'lucide-react';
import UserProfilePhoto from '../UserProfilePhoto';

function WorkerSidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentHash = location.hash.replace('#', '') || 'dashboard';

  const getMenuItemClass = (menuKey) => {
    const isActive = menuKey === 'dashboard' ? !currentHash || currentHash === '' : currentHash === menuKey;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium cursor-pointer ${
      isActive ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'text-gray-300 bg-white/10 hover:bg-white/20 hover:text-white'
    }`;
  };

  const handleNavigation = (hash) => {
    if (hash) {
      navigate(`/worker-dashboard#${hash}`);
    } else {
      navigate('/worker-dashboard');
    }
  };

  return (
    <aside className="w-64 bg-[#020617] border-r border-white/10 min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-orange-500/10 blur-[50px] pointer-events-none" />

      <div className="h-20 flex items-center justify-center border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2 drop-shadow-lg">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <UserIcon className="text-black w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">
            Field<span className="text-orange-500">Worker</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto relative z-10">
        <button onClick={() => handleNavigation('')} className={getMenuItemClass('dashboard')}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </button>
        <button onClick={() => handleNavigation('tasks')} className={getMenuItemClass('tasks')}>
          <ClipboardList className="w-5 h-5" />
          Tasks
        </button>
        <button onClick={() => handleNavigation('attendance')} className={getMenuItemClass('attendance')}>
          <CalendarCheck className="w-5 h-5" />
          Attendance
        </button>
        <button onClick={() => handleNavigation('vacation')} className={getMenuItemClass('vacation')}>
          <Flag className="w-5 h-5" />
          Leave Request
        </button>
      </nav>

      <div className="p-4 border-t border-white/5 bg-white/5 relative z-10">
        {user && (
          <div className="flex items-center gap-3 mb-4 p-2 bg-black/20 rounded-xl border border-white/5 shadow-inner">
            <UserProfilePhoto user={user} size="lg" clickable={false} />
            <div className="overflow-hidden">
              <p className="text-white text-sm font-bold truncate capitalize">
                {user?.username?.replace(/_/g, ' ') || 'Worker'}
              </p>
              <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase">
                On Duty
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (onLogout) onLogout();
            sessionStorage.removeItem('solar_user');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default WorkerSidebar;
