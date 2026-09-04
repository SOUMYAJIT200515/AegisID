import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Box, Plus, ShieldCheck, Trash2, PauseCircle, PlayCircle, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, isAfter, startOfDay } from "date-fns";

export function AssetsPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedAssetDetails, setSelectedAssetDetails] = useState<any | null>(null);
  const [transferUserId, setTransferUserId] = useState("");
  
  const [form, setForm] = useState({ userId: "", assetName: "", assetType: "IntellectualProperty", ownerAddress: "0x71C359918E7E91c667104b90C5b0C627c54143a5" });

  const canManageAssets = ["SUPER_ADMIN", "ADMIN", "ISSUER"].includes(user?.role || "");

  async function loadAssets() {
    try {
      const data = await api.get("/assets");
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/assets", form);
      setShowModal(false);
      setForm({ userId: "", assetName: "", assetType: "IntellectualProperty", ownerAddress: "0x71C359918E7E91c667104b90C5b0C627c54143a5" });
      loadAssets();
      showNotification("success", "Asset Registered", "Digital asset has been successfully anchored.");
    } catch (err: any) {
      showNotification("error", "Registration Failed", err.message);
    }
  };

  const handleAction = async (id: number, action: string, data?: any) => {
    try {
      await api.put(`/assets/${id}/${action}`, data);
      loadAssets();
      if (action === "transfer") {
        setShowTransferModal(false);
        setTransferUserId("");
        setSelectedAssetId(null);
      }
      showNotification("success", "Action Successful", `Successfully performed ${action} on asset #${id}.`);
    } catch (err: any) {
      showNotification("error", "Action Failed", `Failed to ${action} asset: ${err.message}`);
    }
  };

  const chartData = useMemo(() => {
    if (!assets || assets.length === 0) return [];
    const now = new Date();
    const thirtyDaysAgo = startOfDay(subDays(now, 30));
    
    const dateCounts: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      dateCounts[format(subDays(now, i), 'MMM dd')] = 0;
    }
    
    assets.forEach(asset => {
      const date = new Date(asset.createdAt);
      if (isAfter(date, thirtyDaysAgo)) {
        const formatted = format(date, 'MMM dd');
        if (dateCounts[formatted] !== undefined) {
          dateCounts[formatted]++;
        }
      }
    });

    return Object.keys(dateCounts).map(date => ({
      date,
      count: dateCounts[date]
    }));
  }, [assets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Asset Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Secure ownership tracking, asset hashing, and blockchain anchoring</p>
        </div>
        {canManageAssets && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Digital Asset</span>
          </button>
        )}
      </div>

      {canManageAssets && (
        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Asset Issuance (Last 30 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" className="dark:opacity-20" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tw-colors-slate-900)', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} name="Assets Issued" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Asset Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Owner User</th>
                <th className="p-4">Asset Hash</th>
                <th className="p-4">Status</th>
                {canManageAssets && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-8"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-16"></div></td>
                    {canManageAssets && <td className="p-4 text-right"><div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-24 inline-block"></div></td>}
                  </tr>
                ))
              ) : assets.length === 0 ? (
                <tr><td colSpan={canManageAssets ? 7 : 6} className="p-6 text-center text-slate-500">No digital assets found.</td></tr>
              ) : (
                assets.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedAssetDetails(a)} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">#{a.id}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{a.assetName}</td>
                    <td className="p-4">{a.assetType}</td>
                    <td className="p-4">User #{a.userId}</td>
                    <td className="p-4 font-mono text-xs text-blue-400 truncate max-w-[140px]">{a.assetHash}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        a.status === "ACTIVE" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    {canManageAssets && (
                      <td className="p-4 text-right space-x-2">
                        {a.status === "ACTIVE" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(a.id, "suspend"); }}
                            title="Suspend Asset"
                            className="p-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 dark:text-amber-300 rounded-lg transition-colors inline-flex"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(a.id, "activate"); }}
                            title="Activate Asset"
                            className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-600 dark:text-emerald-300 rounded-lg transition-colors inline-flex"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedAssetId(a.id); setShowTransferModal(true); }}
                          title="Transfer Asset"
                          className="p-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 dark:text-blue-300 rounded-lg transition-colors inline-flex"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if(window.confirm('Are you sure you want to delete this asset?')) handleAction(a.id, "delete") }}
                          title="Delete Asset"
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-600 dark:text-red-300 rounded-lg transition-colors inline-flex"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Register Digital Asset</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Owner User ID</label>
                <input
                  type="number"
                  required
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Asset Name / Title</label>
                <input
                  type="text"
                  required
                  value={form.assetName}
                  onChange={(e) => setForm({ ...form, assetName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enterprise IP Deed #109"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Asset Type</label>
                <input
                  type="text"
                  required
                  value={form.assetType}
                  onChange={(e) => setForm({ ...form, assetType: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="IntellectualProperty"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/30"
                >
                  Register & Anchor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Asset Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Transfer Digital Asset</h3>
            <form onSubmit={(e) => { e.preventDefault(); if (selectedAssetId) handleAction(selectedAssetId, "transfer", { newUserId: transferUserId }) }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">New Owner User ID</label>
                <input
                  type="number"
                  required
                  value={transferUserId}
                  onChange={(e) => setTransferUserId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="New User ID e.g. 6"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowTransferModal(false); setTransferUserId(""); setSelectedAssetId(null); }}
                  className="px-4 py-2 bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/30"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Asset Details Slide-Over */}
      {selectedAssetDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm p-4 sm:p-0">
          <div className="bg-white dark:bg-[#0d0d0f] w-full sm:w-[450px] h-full sm:h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Asset Details</h3>
              <button
                onClick={() => setSelectedAssetDetails(null)}
                className="p-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Core Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Asset Name</h4>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">{selectedAssetDetails.assetName}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Asset ID & Type</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">#{selectedAssetDetails.id} • {selectedAssetDetails.assetType}</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Status</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block mt-1 ${
                        selectedAssetDetails.status === "ACTIVE" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}>
                    {selectedAssetDetails.status}
                  </span>
                </div>
              </div>

              {/* Cryptographic Proof */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Cryptographic Proof</span>
                </h4>
                
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Asset Hash (SHA-256)</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all">{selectedAssetDetails.assetHash}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Blockchain Transaction Hash</h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="font-mono text-xs text-blue-500 break-all">{selectedAssetDetails.blockchainTxHash}</p>
                  </div>
                </div>
              </div>

              {/* Lifecycle Info */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lifecycle History</h4>
                
                <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  <div className="relative">
                    <div className="absolute -left-6 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#0d0d0f] top-1"></div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">Anchored to Blockchain</p>
                    <p className="text-[10px] text-slate-500">{new Date(selectedAssetDetails.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-6 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-[#0d0d0f] top-1"></div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white mb-0.5">Asset Registration Initiated</p>
                    <p className="text-[10px] text-slate-500">By User #{selectedAssetDetails.userId}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900">
              <button
                onClick={() => setSelectedAssetDetails(null)}
                className="w-full py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
