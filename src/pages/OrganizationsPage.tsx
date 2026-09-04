import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Building2, Plus } from "lucide-react";

export function OrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/organizations");
        setOrgs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organizations & Departments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Enterprise hierarchy and jurisdiction management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-slate-500">Loading organizations...</div>
        ) : (
          orgs.map((o) => (
            <div key={o.id} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{o.name}</h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">{o.code} • {o.country}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {o.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
