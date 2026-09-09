import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { api } from '../api/client';

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
  broadcastNotification: (type: NotificationType, title: string, message?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<Notification[]>([]);
  const lastFetchRef = useRef<Date | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.get('/notifications');
      if (data && Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistory(prev => {
          // Find truly new notifications that we didn't have before to show as active popups
          if (prev.length > 0) {
            const prevIds = new Set(prev.map(n => n.id));
            const newNotifs = sortedData.filter(n => !prevIds.has(n.id) && (lastFetchRef.current && new Date(n.timestamp) > lastFetchRef.current));
            
            if (newNotifs.length > 0) {
              const toActive = newNotifs.map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
              setActiveNotifications(curr => [...curr, ...toActive]);
              
              toActive.forEach(n => {
                setTimeout(() => {
                  setActiveNotifications((curr) => curr.filter((an) => an.id !== n.id));
                }, 5000);
              });
            }
          }
          return sortedData.map((n: any) => ({
             ...n,
             timestamp: new Date(n.timestamp)
          }));
        });
        lastFetchRef.current = new Date();
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const showNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = { id, type, title, message, timestamp: new Date(), read: false };
    
    setActiveNotifications((prev) => [...prev, newNotification]);
    setHistory((prev) => [newNotification, ...prev]);

    setTimeout(() => {
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const broadcastNotification = useCallback(async (type: NotificationType, title: string, message?: string) => {
    try {
      await api.post('/notifications', { type, title, message });
      await fetchNotifications(); // immediately fetch to update local state
    } catch (e) {
      console.error("Failed to broadcast notification", e);
    }
  }, [fetchNotifications]);

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
    <NotificationContext.Provider value={{ showNotification, history, activeNotifications, clearHistory, markAllAsRead, removeActiveNotification, broadcastNotification }}>
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
