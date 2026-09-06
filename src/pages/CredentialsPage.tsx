import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Award, Plus, CheckCircle, ShieldAlert, ShieldCheck, RefreshCw, XCircle, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { BlockchainProofModal } from "../components/BlockchainProofModal";

export function CredentialsPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [proofModal, setProofModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });
  
  const [form, setForm] = useState({ identityId: "", issuerId: user?.id ? String(user.id) : "", credentialType: "DigitalPassportCredential" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const canManage = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.role === "ISSUER";

  async function loadCredentials() {
    try {
      const data = await api.get("/credentials");
      setCredentials(data);
    } catch (err: any) {
      showNotification("error", "Failed to Load", err.message || "Could not load credentials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatHash = (hash: string) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      showNotification("error", "Access Denied", "Your role does not have permission to issue credentials.");
      return;
    }
    
    setIsSubmitting(true);
    showNotification("info", "Submitting Transaction...", "Issuing credential and anchoring to blockchain.");
    
    try {
      await api.post("/credentials", form);
      setShowModal(false);
      setForm({ identityId: "", issuerId: user?.id ? String(user.id) : "", credentialType: "DigitalPassportCredential" });
      await loadCredentials();
      showNotification("success", "Credential Issued", "Credential successfully issued and blockchain transaction confirmed.");
    } catch (err: any) {
      showNotification("error", "Transaction Failed", err.message || "Failed to issue credential.");
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
      await api.put(`/credentials/${id}/${action}`);
      showNotification("success", "Success", `Credential ${action} operation completed successfully.`);
      await loadCredentials();
    } catch (err: any) {
      showNotification("error", "Operation Failed", err.message || `Failed to ${action} credential.`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verifiable Credentials</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Issue, verify, and revoke tamper-evident digital credentials on blockchain</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Credential</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">Credential</th>
                <th className="p-4">Type</th>
                <th className="p-4">Cryptographic Hash</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500 flex items-center justify-center space-x-2"><RefreshCw className="w-4 h-4 animate-spin" /><span>Loading credentials...</span></td></tr>
              ) : credentials.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No credentials found in the registry.</td></tr>
              ) : (
                credentials.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">Credential #{c.id}</div>
                      <div className="text-xs text-slate-500">Identity #{c.identityId}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{c.credentialType}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{formatHash(c.credentialHash)}</span>
                        <button onClick={() => handleCopy(c.credentialHash)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          {copiedHash === c.credentialHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Tx: {formatHash(c.blockchainTxHash)}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                        : "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setProofModal({ isOpen: true, id: c.id })}
                        className="px-2.5 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20 text-xs font-semibold inline-flex items-center space-x-1.5"
                        title="View Blockchain Proof"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Proof</span>
                      </button>
                      
                      {canManage && c.status === "ACTIVE" && (
                        <button
                          onClick={() => handleAction(c.id, "revoke")}
                          disabled={actionLoading === c.id}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20 disabled:opacity-50 inline-flex items-center"
                          title="Revoke Credential"
                        >
                          <XCircle className="w-4 h-4" />
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="relative bg-white dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Issue Verifiable Credential</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Create a tamper-evident credential for an identity.</p>
            
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Target Identity ID</label>
                <input
                  type="number"
                  required
                  disabled={isSubmitting}
                  value={form.identityId}
                  onChange={(e) => setForm({ ...form, identityId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Issuer User ID</label>
                <input
                  type="number"
                  required
                  disabled={isSubmitting}
                  value={form.issuerId}
                  onChange={(e) => setForm({ ...form, issuerId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Credential Type</label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={form.credentialType}
                  onChange={(e) => setForm({ ...form, credentialType: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  placeholder="e.g. DigitalPassportCredential"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 mt-4">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    This will compute a cryptographic hash of the credential data and anchor it on the EVM blockchain.
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
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Issue & Anchor</span>
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
          entityType="credential" 
          entityId={proofModal.id} 
        />
      )}
    </div>
  );
}
