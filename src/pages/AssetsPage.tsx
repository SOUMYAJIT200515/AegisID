import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Box, Plus, ShieldCheck, Trash2, PauseCircle, PlayCircle, Send, Copy, Check, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, isAfter, startOfDay } from "date-fns";
import { BlockchainProofModal } from "../components/BlockchainProofModal";

export function AssetsPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedAssetDetails, setSelectedAssetDetails] = useState<any | null>(null);
  const [transferUserId, setTransferUserId] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  const [proofModal, setProofModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });
  
  const [form, setForm] = useState({ userId: "", assetName: "", assetType: "IntellectualProperty", ownerAddress: "0x71C359918E7E91c667104b90C5b0C627c54143a5" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageAssets = ["SUPER_ADMIN", "ADMIN", "ISSUER"].includes(user?.role || "");

  async function loadAssets() {
    try {
      const data = await api.get("/assets");
      setAssets(data);
    } catch (err: any) {
      showNotification("error", "Failed to Load", err.message || "Could not load assets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatHash = (hash: string) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    showNotification("info", "Submitting Transaction...", "Anchoring digital asset to blockchain.");
    
    try {
      await api.post("/assets", form);
      setShowModal(false);
      setForm({ userId: "", assetName: "", assetType: "IntellectualProperty", ownerAddress: "0x71C359918E7E91c667104b90C5b0C627c54143a5" });
      await loadAssets();
      showNotification("success", "Asset Registered", "Digital asset has been successfully anchored.");
    } catch (err: any) {
      showNotification("error", "Registration Failed", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: number, action: string, data?: any) => {
    setActionLoading(id);
    try {
      await api.put(`/assets/${id}/${action}`, data);
      await loadAssets();
      if (action === "transfer") {
        setShowTransferModal(false);
        setTransferUserId("");
        setSelectedAssetId(null);
      } else if (action === "delete") {
        setSelectedAssetDetails(null);
      }
      showNotification("success", "Action Successful", `Successfully performed ${action} on asset #${id}.`);
    } catch (err: any) {
      showNotification("error", "Action Failed", `Failed to ${action} asset: ${err.message}`);
    } finally {
      setActionLoading(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Asset Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Secure ownership tracking, asset hashing, and blockchain anchoring</p>
        </div>
        {canManageAssets && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Digital Asset</span>
          </button>
        )}
      </div>

      {canManageAssets && (
        <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">Asset Issuance (Last 30 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" className="dark:opacity-20" opacity={0.5} vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tw-colors-slate-900)', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Assets Issued" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">Asset</th>
                <th className="p-4">Type</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Cryptographic Hash</th>
                <th className="p-4">Status</th>
                {canManageAssets && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr><td colSpan={canManageAssets ? 6 : 5} className="p-8 text-center text-slate-500 flex items-center justify-center space-x-2">Loading assets...</td></tr>
              ) : assets.length === 0 ? (
                <tr><td colSpan={canManageAssets ? 6 : 5} className="p-8 text-center text-slate-500">No digital assets found in the registry.</td></tr>
              ) : (
                assets.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedAssetDetails(a)} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{a.assetName}</div>
                      <div className="text-xs text-slate-500">Asset #{a.id}</div>
                    </td>
                    <td className="p-4 font-medium">{a.assetType}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">User #{a.userId}</td>
                    <td className="p-4">
                      <div className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-1">{formatHash(a.assetHash)}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tx: {formatHash(a.blockchainTxHash)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        a.status === "ACTIVE" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                          : "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    {canManageAssets && (
                      <td className="p-4 text-right space-x-2">
                        {a.status === "ACTIVE" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(a.id, "suspend"); }}
                            disabled={actionLoading === a.id}
                            title="Suspend Asset"
                            className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-lg transition-colors inline-flex border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20 disabled:opacity-50"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(a.id, "activate"); }}
                            disabled={actionLoading === a.id}
                            title="Activate Asset"
                            className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors inline-flex border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20 disabled:opacity-50"
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedAssetId(a.id); setShowTransferModal(true); }}
                          title="Transfer Asset"
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg transition-colors inline-flex border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); if(window.confirm('Are you sure you want to delete this asset?')) handleAction(a.id, "delete") }}
                          disabled={actionLoading === a.id}
                          title="Delete Asset"
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-colors inline-flex border border-transparent hover:border-red-200 dark:hover:border-red-500/20 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="relative bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Register Digital Asset</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Anchor a new digital asset to the blockchain ledger.</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Owner User ID</label>
                <input
                  type="number"
                  required
                  disabled={isSubmitting}
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Asset Name / Title</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={form.assetName}
                  onChange={(e) => setForm({ ...form, assetName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="Enterprise IP Deed #109"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Asset Type</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={form.assetType}
                  onChange={(e) => setForm({ ...form, assetType: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="IntellectualProperty"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 mt-4">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    This operation will generate a cryptographic hash of the asset data and submit it as an anchor transaction to the EVM smart contract.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? "Submitting..." : "Register & Anchor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Asset Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTransferModal(false)}></div>
          <div className="relative bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Transfer Digital Asset</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Transfer ownership of this asset to another user identity.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); if (selectedAssetId) handleAction(selectedAssetId, "transfer", { newUserId: transferUserId }) }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">New Owner User ID</label>
                <input
                  type="number"
                  required
                  value={transferUserId}
                  onChange={(e) => setTransferUserId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="New User ID e.g. 6"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowTransferModal(false); setTransferUserId(""); setSelectedAssetId(null); }}
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
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
        <div className="fixed inset-0 z-[60] flex justify-end p-4 sm:p-0 pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedAssetDetails(null)}></div>
          <div className="relative bg-white dark:bg-[#0d0d0f] w-full sm:w-[450px] h-full sm:h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-white/10 pointer-events-auto">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                  <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Asset Details</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ID: #{selectedAssetDetails.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssetDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Core Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Asset Name</h4>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedAssetDetails.assetName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Type</h4>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedAssetDetails.assetType}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Owner</h4>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">User #{selectedAssetDetails.userId}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Status</h4>
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-block mt-1 border ${
                        selectedAssetDetails.status === "ACTIVE" 
                          ? "bg-emerald-50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
                          : "bg-amber-50 text-amber-600 dark:text-amber-400 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20"
                      }`}>
                    {selectedAssetDetails.status}
                  </span>
                </div>
              </div>

              {/* Cryptographic Proof */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Cryptographic Anchors</span>
                  </h4>
                  <button
                    onClick={() => setProofModal({ isOpen: true, id: selectedAssetDetails.id })}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Verify Proof</span>
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Asset Hash (SHA-256)</h4>
                  <div className="bg-slate-50 dark:bg-[#1a1a1f] p-3.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between group">
                    <p className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate mr-3">{selectedAssetDetails.assetHash}</p>
                    <button onClick={() => handleCopy(selectedAssetDetails.assetHash, 'hash')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      {copiedHash === 'hash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Blockchain Transaction Hash</h4>
                  <div className="bg-slate-50 dark:bg-[#1a1a1f] p-3.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between group">
                    <p className="font-mono text-xs text-blue-600 dark:text-blue-400 truncate mr-3">{selectedAssetDetails.blockchainTxHash}</p>
                    <button onClick={() => handleCopy(selectedAssetDetails.blockchainTxHash, 'tx')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                      {copiedHash === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lifecycle Info */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lifecycle History</h4>
                
                <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  <div className="relative">
                    <div className="absolute -left-[23px] w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#0d0d0f] top-1"></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Anchored to Blockchain</p>
                    <p className="text-xs font-medium text-slate-500">{new Date(selectedAssetDetails.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[23px] w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-[#0d0d0f] top-1"></div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Asset Registration Initiated</p>
                    <p className="text-xs font-medium text-slate-500">By User #{selectedAssetDetails.userId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {proofModal.isOpen && proofModal.id && (
        <BlockchainProofModal 
          isOpen={proofModal.isOpen} 
          onClose={() => setProofModal({ isOpen: false, id: null })} 
          entityType="asset" 
          entityId={proofModal.id} 
        />
      )}
    </div>
  );
}
