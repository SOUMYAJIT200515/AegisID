import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Check, Trash2 } from 'lucide-react';
import { useNotification, Notification } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export function NotificationDropdown({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { history, markAllAsRead, clearHistory } = useNotification();

  const unreadCount = history.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewAll = () => {
    setIsOpen(false);
    setActiveTab('notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-[#0d0d0f]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={clearHistory}
                title="Clear history"
                className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto hide-scrollbar">
            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                No notifications to display.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {history.map((n: Notification) => (
                  <div key={n.id} className={`p-4 flex items-start space-x-3 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                    {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    {n.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </h4>
                      {n.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>}
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium uppercase tracking-wider">
                        {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
            <button 
              onClick={handleViewAll}
              className="w-full text-center text-xs font-semibold text-blue-600 dark:text-blue-400 py-1.5 hover:underline"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
