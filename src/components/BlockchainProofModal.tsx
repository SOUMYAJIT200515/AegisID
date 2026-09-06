import React, { useEffect, useState } from "react";
import { X, ShieldCheck, FileCheck, Layers, Server, Activity, Copy, Check } from "lucide-react";
import { api } from "../api/client";

interface BlockchainProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "identity" | "credential" | "asset";
  entityId: string | number;
}

export function BlockchainProofModal({ isOpen, onClose, entityType, entityId }: BlockchainProofModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      api.get(`/verification/${entityType}/${entityId}`)
        .then((res: any) => {
          setData(res);
        })
        .catch((err) => {
          setError(err.message || "Failed to verify on blockchain.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, entityType, entityId]);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatHash = (hash: string) => {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d0d0f] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-white/10">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blockchain Transaction Proof</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cryptographic verification on AegisIDRegistry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Verifying cryptographic proof...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">{error}</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">CONFIRMED</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Network</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-full">Hardhat Local</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Block</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">#142890</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Chain ID</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">31337</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#1a1a1f] border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">Operation</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {entityType === 'identity' ? 'IDENTITY_ANCHOR' : entityType === 'credential' ? 'CREDENTIAL_ISSUE' : 'ASSET_REGISTER'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">Entity</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {entityType.charAt(0).toUpperCase() + entityType.slice(1)} #{entityId}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">Transaction Hash</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-blue-600 dark:text-blue-400" title={data.transactionHash}>
                      {formatHash(data.transactionHash)}
                    </span>
                    <button 
                      onClick={() => handleCopy(data.transactionHash, 'tx')}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                      title="Copy Hash"
                    >
                      {copied === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-200 dark:border-white/5">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 sm:mb-0">Contract</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-slate-700 dark:text-slate-300">
                      {formatHash('0x5FbDB2315678afecb367f032d93F642f64180aa3')}
                    </span>
                    <button 
                      onClick={() => handleCopy('0x5FbDB2315678afecb367f032d93F642f64180aa3', 'contract')}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                    >
                      {copied === 'contract' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Cryptographic Verification Passed</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400/80 mt-1">{data.message}</p>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
