import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string) => void;
  history: Notification[];
  activeNotifications: Notification[];
  clearHistory: () => void;
  markAllAsRead: () => void;
  removeActiveNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = { id, type, title, message, timestamp: new Date(), read: false };
    
    setActiveNotifications((prev) => [...prev, newNotification]);
    setHistory((prev) => [newNotification, ...prev]);

    setTimeout(() => {
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeActiveNotification = (id: string) => {
    setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const markAllAsRead = () => {
    setHistory(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, history, activeNotifications, clearHistory, markAllAsRead, removeActiveNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2 pointer-events-none">
        {activeNotifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 shadow-lg rounded-xl p-4 w-80 flex items-start space-x-3 animate-in slide-in-from-right-8 duration-300"
          >
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{n.title}</h4>
              {n.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>}
            </div>
            <button
              onClick={() => removeActiveNotification(n.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
