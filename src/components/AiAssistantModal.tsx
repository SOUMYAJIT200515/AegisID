import React, { useState } from "react";
import { Cpu, X, Send, Sparkles, ShieldAlert } from "lucide-react";
import { api } from "../api/client";

export function AiAssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/ai/analyze", { prompt });
      setAnalysis(res.analysis);
    } catch (err: any) {
      setAnalysis("Error running AI audit analysis: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">AegisID AI Compliance & Security Auditor</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-3">
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ask AI Security Auditor
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Verify smart contract integrity & recent credential anchors"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl font-medium text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Audit</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 min-h-[160px] max-h-[300px] overflow-y-auto">
            <div className="text-xs font-mono text-blue-400 mb-2 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>AUDIT REPORT OUTPUT:</span>
            </div>
            {analysis ? (
              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Enter a query above or click Audit to inspect system integrity, blockchain anchors, and RBAC security policies.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
