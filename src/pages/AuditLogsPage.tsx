import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { FileText, Shield, Filter } from "lucide-react";

export function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/audit");
        setLogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter((l) => {
    let include = true;
    
    if (actionFilter !== "ALL" && !l.action.includes(actionFilter)) {
      include = false;
    }
    
    if (startDate) {
      if (new Date(l.timestamp) < new Date(startDate)) include = false;
    }
    
    if (endDate) {
      // Set end date to end of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(l.timestamp) > end) include = false;
    }
    
    return include;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Audit Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Immutable trail of authentication, authorization, and administrative actions</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white outline-none"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">Logins</option>
              <option value="CREATED">Creations</option>
              <option value="UPDATED">Updates</option>
              <option value="SUSPEND">Suspensions</option>
              <option value="REVOKE">Revocations</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Username</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Entity ID</th>
                <th className="p-4">Result</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-8"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-12"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-24"></div></td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={8} className="p-6 text-center text-slate-500">No audit logs recorded for this criteria.</td></tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">#{l.id}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{l.username}</td>
                    <td className="p-4 font-mono text-xs text-blue-400">{l.action}</td>
                    <td className="p-4">{l.entityType}</td>
                    <td className="p-4 font-mono">#{l.entityId}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {l.result}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{l.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
