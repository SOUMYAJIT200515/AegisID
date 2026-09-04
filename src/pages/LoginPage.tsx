import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { Shield, Lock, User, ArrowRight, KeyRound } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      showNotification("success", "Authentication Successful", `Welcome back, ${username}.`);
    } catch (err: any) {
      setError(err.message || "Login failed");
      showNotification("error", "Authentication Failed", err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (u: string) => {
    setUsername(u);
    setPassword("password");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08080a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full bg-white dark:bg-[#0d0d0f] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl font-serif italic text-slate-900 dark:text-white tracking-tight">Aegis<span className="text-blue-500">ID</span></h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-900 dark:text-white/40 uppercase tracking-widest mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-900 dark:text-white/30 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#08080a] border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-900 dark:text-white/40 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-900 dark:text-white/30 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-[#08080a] border border-slate-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In Securely"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
          <div className="text-[10px] font-semibold text-slate-900 dark:text-white/40 uppercase tracking-widest mb-3 flex items-center space-x-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Quick Demo Logins</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["superadmin", "admin", "issuer", "verifier"].map((acc) => (
              <button
                key={acc}
                onClick={() => fillDemoAccount(acc)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:bg-white/10 text-xs font-medium text-slate-900 dark:text-white/70 capitalize text-left border border-slate-100 dark:border-white/5 transition-colors"
              >
                Role: {acc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
