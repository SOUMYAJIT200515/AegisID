import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';

export function ProfileDropdown({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    showNotification("info", "Session Terminated", "You have been securely logged out.");
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    setActiveTab("profile");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-white/10 hover:opacity-80 transition-opacity"
      >
        <div className="text-right hidden md:block">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.fullName || "Guest User"}</div>
          <div className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">{user?.role || "GUEST"}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] relative">
          <div className="w-full h-full rounded-full bg-white dark:bg-[#0d0d0f] flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
            {user?.fullName?.substring(0, 2).toUpperCase() || "ET"}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0d0d0f] rounded-full p-0.5">
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName || "Guest User"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || "guest@aegis.system"}</p>
            </div>
          </div>
          
          <div className="p-2 space-y-1">
            <button 
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </button>
            <button 
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
          
          <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Secure Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
