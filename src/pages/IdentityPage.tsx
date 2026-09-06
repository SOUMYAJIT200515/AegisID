import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Fingerprint, ShieldCheck, Plus, CheckCircle, AlertTriangle, RefreshCw, Eye, Pause, Play, Trash2, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { BlockchainProofModal } from "../components/BlockchainProofModal";

export function IdentityPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [identities, setIdentities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Modals
  const [showAnchorModal, setShowAnchorModal] = useState(false);
  const [proofModal, setProofModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });
  
  const [form, setForm] = useState({ userId: "", walletAddress: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedDid, setCopiedDid] = useState<string | null>(null);

  const canManage = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  async function loadIdentities() {
    try {
      const data = await api.get("/identities");
      setIdentities(data);
    } catch (err: any) {
      showNotification("error", "Failed to Load", err.message || "Could not load identities");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIdentities();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDid(text);
    setTimeout(() => setCopiedDid(null), 2000);
  };

  const formatHash = (hash: string) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    showNotification("info", "Submitting Transaction...", "Anchoring identity to blockchain.");
    
    try {
      await api.post("/identities", form);
      setShowAnchorModal(false);
      setForm({ userId: "", walletAddress: "" });
      await loadIdentities();
      showNotification("success", "Identity Anchored", "Identity successfully anchored and blockchain transaction confirmed.");
    } catch (err: any) {
      showNotification("error", "Transaction Failed", err.message || "Failed to anchor identity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (id: number, action: string) => {
    if (!canManage) {
      showNotification("error", "Access Denied", "Your role does not have permission to perform this operation.");
      return;
    }
    
    setActionLoading(id);
    try {
      await api.put(`/identities/${id}/${action}`);
      showNotification("success", "Success", `Identity ${action} operation completed successfully.`);
      await loadIdentities();
    } catch (err: any) {
      showNotification("error", "Operation Failed", err.message || `Failed to ${action} identity.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Identity Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage decentralized identities and cryptographic blockchain anchors</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowAnchorModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Anchor Identity</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">Entity</th>
                <th className="p-4">DID / Wallet</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 flex items-center justify-center space-x-2"><RefreshCw className="w-4 h-4 animate-spin" /><span>Loading identities...</span></td></tr>
              ) : identities.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No identities found in the registry.</td></tr>
              ) : (
                identities.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">User #{i.userId}</div>
                      <div className="text-xs text-slate-500">Identity #{i.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{formatHash(i.did)}</span>
                        <button onClick={() => handleCopy(i.did)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          {copiedDid === i.did ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">{i.walletAddress}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex w-fit items-center space-x-1.5 ${
                        i.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                        : 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                      }`}>
                        {i.verificationStatus === 'VERIFIED' && <CheckCircle className="w-3 h-3" />}
                        <span>{i.verificationStatus}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        i.identityStatus === 'ACTIVE' ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                        : i.identityStatus === 'SUSPENDED' ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                      }`}>
                        {i.identityStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setProofModal({ isOpen: true, id: i.id })}
                        className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20"
                        title="View Blockchain Proof"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      
                      {canManage && i.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => handleAction(i.id, "verify")}
                          disabled={actionLoading === i.id}
                          className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20 disabled:opacity-50"
                          title="Verify Identity"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {canManage && i.identityStatus === 'ACTIVE' && (
                        <button
                          onClick={() => handleAction(i.id, "suspend")}
                          disabled={actionLoading === i.id}
                          className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20 disabled:opacity-50"
                          title="Suspend"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      )}

                      {canManage && i.identityStatus === 'SUSPENDED' && (
                        <button
                          onClick={() => handleAction(i.id, "reactivate")}
                          disabled={actionLoading === i.id}
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 disabled:opacity-50"
                          title="Reactivate"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAnchorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAnchorModal(false)}></div>
          <div className="relative bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Anchor Identity</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create a new decentralized identity and anchor it to the blockchain.</p>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">User ID</label>
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
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Wallet Address (Optional)</label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="0x..."
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 mt-4">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    This operation will generate a cryptographic hash of the identity data and submit it as an anchor transaction to the EVM smart contract.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAnchorModal(false)}
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm Anchor</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {proofModal.isOpen && proofModal.id && (
        <BlockchainProofModal 
          isOpen={proofModal.isOpen} 
          onClose={() => setProofModal({ isOpen: false, id: null })} 
          entityType="identity" 
          entityId={proofModal.id} 
        />
      )}
    </div>
  );
}
