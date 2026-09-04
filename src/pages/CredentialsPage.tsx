import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import { Award, Plus, CheckCircle, ShieldAlert } from "lucide-react";

export function CredentialsPage() {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ identityId: "", issuerId: "", credentialType: "DigitalPassportCredential" });

  async function loadCredentials() {
    try {
      const data = await api.get("/credentials");
      setCredentials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCredentials();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/credentials", form);
      setShowModal(false);
      setForm({ identityId: "", issuerId: "", credentialType: "DigitalPassportCredential" });
      loadCredentials();
    } catch (err: any) {
      alert("Failed to issue credential: " + err.message);
    }
  };

  const handleRevoke = async (id: number) => {
    try {
      await api.put(`/credentials/${id}/revoke`);
      loadCredentials();
    } catch (err: any) {
      alert("Revocation failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verifiable Credentials</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Issue, verify, and revoke tamper-evident digital credentials on blockchain</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Credential</span>
        </button>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Identity ID</th>
                <th className="p-4">Credential Hash</th>
                <th className="p-4">Status</th>
                <th className="p-4">Blockchain Tx</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">Loading credentials...</td></tr>
              ) : credentials.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-slate-500">No credentials found.</td></tr>
              ) : (
                credentials.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-400">#{c.id}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{c.credentialType}</td>
                    <td className="p-4">Identity #{c.identityId}</td>
                    <td className="p-4 font-mono text-xs text-blue-400 truncate max-w-[140px]">{c.credentialHash}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{c.blockchainTxHash}</td>
                    <td className="p-4 text-right">
                      {c.status === "ACTIVE" && (
                        <button
                          onClick={() => handleRevoke(c.id)}
                          className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-medium border border-red-500/30"
                        >
                          Revoke
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
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Issue Verifiable Credential</h3>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Identity ID</label>
                <input
                  type="number"
                  required
                  value={form.identityId}
                  onChange={(e) => setForm({ ...form, identityId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Issuer User ID</label>
                <input
                  type="number"
                  required
                  value={form.issuerId}
                  onChange={(e) => setForm({ ...form, issuerId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Credential Type</label>
                <input
                  type="text"
                  required
                  value={form.credentialType}
                  onChange={(e) => setForm({ ...form, credentialType: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="DigitalPassportCredential"
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
                  Issue & Anchor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
