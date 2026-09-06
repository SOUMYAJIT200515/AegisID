import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Megaphone } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ProfileDropdown } from "./ProfileDropdown";
import { ComposeNotificationModal } from "./ComposeNotificationModal";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ onOpenAiModal, setActiveTab }: { onOpenAiModal?: () => void; setActiveTab: (tab: string) => void }) {
  const { user } = useAuth();
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const canBroadcast = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <header className="h-20 bg-white dark:bg-[#0d0d0f] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 sticky top-0 z-30 flex items-center justify-between px-8">
      <div>
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-white/40">Session: Active Directory</h2>
        <p className="text-lg font-serif text-slate-900 dark:text-white italic">
          System Overview — {user?.fullName || "Dr. Elias Thorne"}
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/40">Gas Price</p>
          <p className="text-sm font-mono text-blue-400">12.4 Gwei</p>
        </div>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

        {canBroadcast && (
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all uppercase tracking-wider"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Compose Broadcast</span>
          </button>
        )}

        <ThemeToggle />

        <NotificationDropdown setActiveTab={setActiveTab} />
        
        <ProfileDropdown setActiveTab={setActiveTab} />
      </div>

      <ComposeNotificationModal 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
      />
    </header>
  );
}
