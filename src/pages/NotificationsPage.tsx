import React, { useState } from 'react';
import { useNotification, Notification } from '../context/NotificationContext';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Check, Search } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export function NotificationsPage() {
  const { history, markAllAsRead, clearHistory, removeActiveNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = history.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (n.message && n.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const unreadCount = history.filter(n => !n.read).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and manage all historical system alerts and user notifications</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
          <button 
            onClick={clearHistory}
            disabled={history.length === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span>{filteredNotifications.length} Total</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400">{unreadCount} Unread</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[600px] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No notifications found</h3>
              <p className="text-sm">You're all caught up! No recent alerts or messages.</p>
            </div>
          ) : (
            filteredNotifications.map((n: Notification) => (
              <div 
                key={n.id} 
                className={`p-6 flex items-start space-x-4 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  n.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                  n.type === 'error' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                  'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                }`}>
                  {n.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {n.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {n.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-base ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {n.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 uppercase tracking-wider">
                      {format(new Date(n.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  {n.message && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>}
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium">
                    {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
