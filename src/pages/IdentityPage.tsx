import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Fingerprint, ShieldCheck, Plus, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

export function IdentityPage() {
  const [identities, setIdentities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ userId: "", walletAddress: "" });

  async function loadIdentities() {
    try {
      const data = await api.get("/identities");
      setIdentities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIdentities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/identities", form);
      setShowModal(false);
      setForm({ userId: "", walletAddress: "" });
      loadIdentities();
    } catch (err: any) {
      alert("Failed to create identity: " + err.message);
    }
  };

  const handleAction = async (id: number, action: string) => {
    try {
      await api.put(`/identities/${id}/${action}`);
      loadIdentities();
    } catch (err: any) {
      alert("Action failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Decentralized Identities (DID)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage user cryptographic identities anchored to AegisIDRegistry smart contract</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Anchor New Identity</span>
        </button>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">User ID</th>
                <th className="p-4">DID URI</th>
                <th className="p-4">Wallet Address</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">Loading identities...</td></tr>
              ) : identities.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">No identities found.</td></tr>
              ) : (
                identities.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">#{i.id}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">User #{i.userId}</td>
                    <td className="p-4 font-mono text-xs text-blue-400 max-w-xs truncate">{i.did}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">{i.walletAddress}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {i.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {i.identityStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleAction(i.id, "verify")}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleAction(i.id, "suspend")}
                        className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-lg text-xs font-medium border border-amber-500/30"
                      >
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Anchor New Identity on Blockchain</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">User ID</label>
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
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Wallet Address</label>
                <input
                  type="text"
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="0x71C359918..."
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
                  Anchor Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
