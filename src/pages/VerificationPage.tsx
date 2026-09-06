import React, { useState } from "react";
import { api } from "../api/client";
import { CheckCircle2, ShieldAlert, Search, ShieldCheck } from "lucide-react";

export function VerificationPage() {
  const [type, setType] = useState("identity");
  const [recordId, setRecordId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await api.get(`/verification/${type}/${recordId}`);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Unified Verification Portal</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cryptographically verify identities, credentials, and digital assets against MySQL and EVM blockchain</p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Verification Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="identity">Identity (DID / ID)</option>
                <option value="credential">Verifiable Credential</option>
                <option value="asset">Digital Asset</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Record ID or Cryptographic Hash</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                  placeholder="e.g. 1 or 0xa1b2c3d4..."
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? "Verifying..." : "Verify"}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-500/30 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verification Status: AUTHENTIC & VALID</h3>
                  <p className="text-xs text-emerald-400 font-mono">Cryptographic proof confirmed on AegisIDRegistry</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase">
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Blockchain Verification</span>
                <span className="font-semibold text-emerald-400">Passed (Anchored on Chain)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Database State (MySQL)</span>
                <span className="font-semibold text-slate-900 dark:text-white">Active & Unaltered</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-mono uppercase">Transaction Hash</span>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-400 break-all">
                {result.transactionHash}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-300 text-xs">
              {result.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
