import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { format } from "date-fns";
import { Shield, Fingerprint, Award, Box, CheckCircle2, Activity, Users, Building2, Calendar } from "lucide-react";
import { ActivityHeatmap } from "../components/ActivityHeatmap";

export function DashboardPage() {
  const [stats, setStats] = useState({
    identities: 0,
    credentials: 0,
    assets: 0,
    transactions: 0,
    users: 0,
    organizations: 0
  });
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [ids, creds, assets, txs, users, orgs, auditLogs] = await Promise.all([
          api.get("/identities"),
          api.get("/credentials"),
          api.get("/assets"),
          api.get("/blockchain/transactions"),
          api.get("/users"),
          api.get("/organizations"),
          api.get("/audit")
        ]);
        
        setStats({
          identities: ids.length,
          credentials: creds.length,
          assets: assets.length,
          transactions: txs.length,
          users: users.length,
          organizations: orgs.length
        });
        
        if (auditLogs) {
          const counts: Record<string, number> = {};
          auditLogs.forEach((log: any) => {
             const date = format(new Date(log.timestamp), 'yyyy-MM-dd');
             counts[date] = (counts[date] || 0) + 1;
          });
          setHeatmapData(Object.keys(counts).map(date => ({ date, count: counts[date] })));
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
              Verified Identity • AegisID Registry
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif italic text-slate-900 dark:text-white mt-4 mb-2">
              did:aegis:sih2026:5f8d9b
            </h3>
            <p className="text-slate-900 dark:text-white/40 font-mono text-xs sm:text-sm">
              Hash Anchor: 0xa1b2c3d4e5f67890123456789abcdef0
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-slate-100 dark:border-white/5 relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40 mb-1">Identities</p>
              <p className="text-2xl font-serif text-slate-900 dark:text-white">{loading ? "..." : stats.identities}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40 mb-1">Credentials</p>
              <p className="text-2xl font-serif text-slate-900 dark:text-white">{loading ? "..." : stats.credentials}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40 mb-1">Assets</p>
              <p className="text-2xl font-serif text-slate-900 dark:text-white">{loading ? "..." : stats.assets}</p>
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40 mb-6">Operational Summary</p>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-4">
                <div>
                  <p className="text-sm text-slate-900 dark:text-white/60 mb-1">Digital Assets</p>
                  <p className="text-3xl font-serif text-slate-900 dark:text-white">{loading ? "..." : stats.assets}</p>
                </div>
                <div className="text-emerald-400 text-xs font-mono mb-1">Secure</div>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-4">
                <div>
                  <p className="text-sm text-slate-900 dark:text-white/60 mb-1">Blockchain Anchors</p>
                  <p className="text-3xl font-serif text-slate-900 dark:text-white">{loading ? "..." : stats.transactions}</p>
                </div>
                <div className="text-blue-400 text-xs font-mono mb-1">EVM Mainnet</div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-900 dark:text-white/60 mb-1">System Users</p>
                  <p className="text-3xl font-serif text-slate-900 dark:text-white">{loading ? "..." : stats.users}</p>
                </div>
                <div className="text-slate-900 dark:text-white/40 text-xs font-mono mb-1">RBAC Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40">Organizations</p>
            <p className="text-2xl font-serif text-slate-900 dark:text-white mt-1">{loading ? "..." : stats.organizations}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40">Active Credentials</p>
            <p className="text-2xl font-serif text-slate-900 dark:text-white mt-1">{loading ? "..." : stats.credentials}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40">Secured Assets</p>
            <p className="text-2xl font-serif text-slate-900 dark:text-white mt-1">{loading ? "..." : stats.assets}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Box className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-900 dark:text-white/40">Security Compliance</p>
            <p className="text-2xl font-serif text-emerald-400 mt-1">100%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Heatmap</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Asset lifecycle events and logins over the last 6 months</p>
          </div>
        </div>
        <div className="w-full flex justify-center border-t border-slate-100 dark:border-white/5 pt-6">
          <ActivityHeatmap data={heatmapData} />
        </div>
      </div>
    </div>
  );
}
