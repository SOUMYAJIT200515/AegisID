import React, { useState, useEffect } from 'react';
import { ShieldAlert, Database, Activity, AlertTriangle, X, Terminal, CheckCircle2 } from 'lucide-react';

export function TamperSimulationModal({ isOpen, onClose, latestTx }: { isOpen: boolean, onClose: () => void, latestTx: any }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const t1 = setTimeout(() => setStep(1), 1000);
      const t2 = setTimeout(() => setStep(2), 2500);
      const t3 = setTimeout(() => setStep(3), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const txHash = latestTx?.transactionHash || "0x8a31b9d4e5f6c7d8e9f0a1b2c3d4e5f6c7d8e9f0a1b2c3d4e5f6c7d8e9f0a1b2";
  const tamperedHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d0d0f] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tamper Detection Simulation</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Demonstrating cryptographic integrity checks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Process Steps */}
          <div className="space-y-4">
            <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${step >= 1 ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-50'}`}>
              <Database className={`w-6 h-6 shrink-0 ${step >= 1 ? 'text-amber-500' : 'text-slate-400'}`} />
              <div>
                <h4 className={`text-sm font-bold ${step >= 1 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'}`}>1. Malicious Database Modification</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Attempting to change off-chain records directly in the database, bypassing the smart contract...</p>
              </div>
              {step === 1 && <div className="ml-auto flex shrink-0"><span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span></div>}
              {step > 1 && <CheckCircle2 className="w-5 h-5 text-amber-500 ml-auto shrink-0" />}
            </div>

            <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${step >= 2 ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-50'}`}>
              <Activity className={`w-6 h-6 shrink-0 ${step >= 2 ? 'text-blue-500' : 'text-slate-400'}`} />
              <div>
                <h4 className={`text-sm font-bold ${step >= 2 ? 'text-blue-700 dark:text-blue-400' : 'text-slate-500'}`}>2. Cryptographic Validation Sequence</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recalculating hash of modified off-chain data and comparing against immutable on-chain anchor...</p>
              </div>
              {step === 2 && <div className="ml-auto flex shrink-0"><span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span></div>}
              {step > 2 && <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto shrink-0" />}
            </div>

            <div className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${step >= 3 ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-50'}`}>
              <ShieldAlert className={`w-6 h-6 shrink-0 ${step >= 3 ? 'text-red-500' : 'text-slate-400'}`} />
              <div>
                <h4 className={`text-sm font-bold ${step >= 3 ? 'text-red-700 dark:text-red-400' : 'text-slate-500'}`}>3. Tamper Detected</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hash mismatch. The data integrity has been compromised.</p>
              </div>
            </div>
          </div>

          {/* Results (Show after step 3) */}
          {step >= 3 && (
            <div className="bg-[#08080a] rounded-2xl p-5 font-mono text-sm border border-red-500/30 shadow-inner overflow-hidden relative">
              <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-red-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="text-slate-400 flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Running integrity check protocol...</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase">Expected (Immutable On-chain Anchor):</span> 
                  <div className="text-emerald-300/70 text-xs break-all leading-relaxed bg-emerald-500/10 p-2 rounded">{txHash}</div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-red-400 text-xs font-semibold tracking-wider uppercase">Actual (Modified Off-chain Record):</span> 
                  <div className="text-red-300/70 text-xs break-all leading-relaxed bg-red-500/10 p-2 rounded">{tamperedHash}</div>
                </div>

                <div className="pt-4 border-t border-slate-800/60">
                  <span className="text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg inline-flex items-center space-x-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    <span>[ERROR] CRYPTOGRAPHIC_MISMATCH_DETECTED</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
