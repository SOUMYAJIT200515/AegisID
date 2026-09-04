import React from "react";
import { Shield, Fingerprint, Lock, Database, ArrowRight, CheckCircle2 } from "lucide-react";

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  const features = [
    {
      icon: <Fingerprint className="w-6 h-6 text-blue-400" />,
      title: "Decentralized Identities",
      desc: "Manage cryptographic user identities anchored to EVM-based smart contracts with absolute immutability.",
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: "Verifiable Credentials",
      desc: "Issue, verify, and revoke tamper-evident digital credentials securely stored on the blockchain.",
    },
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: "Unified Verification",
      desc: "Hybrid cryptographic verification combining fast MySQL reads with absolute on-chain truth.",
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: "Role-Based Access Control",
      desc: "Granular access control from Super Admins down to end-users, ensuring complete administrative security.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08080a] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white dark:bg-[#0d0d0f]/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-2xl font-serif italic text-slate-900 dark:text-white tracking-tight">
              Aegis<span className="text-blue-500">ID</span>
            </span>
          </div>
          <button
            onClick={onLogin}
            className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium transition-all flex items-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8">
            <CheckCircle2 className="w-4 h-4" />
            <span>Next-Generation Identity Platform</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-8">
            Secure, Verifiable, <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Decentralized Identity.
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            AegisID bridges the gap between traditional database speed and blockchain-backed immutability. 
            Manage credentials, digital assets, and organizational access with cryptographic certainty.
          </p>
          <button
            onClick={onLogin}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-2xl font-medium text-lg flex items-center space-x-3 mx-auto shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all"
          >
            <span>Access Secure Portal</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 dark:border-white/5 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Enterprise-Grade Architecture</h2>
          <p className="text-slate-500 dark:text-slate-400">Everything you need to issue, manage, and cryptographically verify digital identities.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-[#0d0d0f] border border-slate-100 dark:border-white/5 rounded-3xl p-8 hover:border-slate-200 dark:border-white/10 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-white/5 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="w-5 h-5 text-slate-500" />
            <span className="font-serif italic text-slate-500 dark:text-slate-400">AegisID Platform</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 AegisID. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
