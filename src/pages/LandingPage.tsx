import React, { useState, useEffect } from "react";
import { Shield, Fingerprint, Lock, Database, ArrowRight, CheckCircle2, Mail, MessageSquare, X, Send } from "lucide-react";
import { api } from "../api/client";

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [orgs, setOrgs] = useState<any[]>([]);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Apply form state
  const [applyForm, setApplyForm] = useState({ fullName: "", email: "", username: "", organizationId: 1, notes: "" });
  const [applySubmitted, setApplySubmitted] = useState(false);

  useEffect(() => {
    async function loadOrgs() {
      try {
        const data = await api.get("/organizations");
        setOrgs(data);
        if (data && data.length > 0) {
          setApplyForm(f => ({ ...f, organizationId: data[0].id }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadOrgs();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setShowContactModal(false);
      setContactForm({ name: "", email: "", message: "" });
      alert("Thank you for contacting us! We will get back to you shortly.");
    }, 500);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/applications", applyForm);
      setApplySubmitted(true);
      setTimeout(() => {
        setApplySubmitted(false);
        setShowApplyModal(false);
        setApplyForm({ fullName: "", email: "", username: "", organizationId: orgs[0]?.id || 1, notes: "" });
        alert("Application submitted successfully! Once approved by a Super Admin, your account will be created.");
      }, 500);
    } catch (err: any) {
      alert("Failed to submit application: " + (err.message || "Unknown error"));
    }
  };

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
      desc: "Hybrid cryptographic verification combining fast database speed with absolute on-chain truth.",
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
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowContactModal(true)}
              className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors hidden sm:block"
            >
              Contact Us
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-xl text-sm font-medium transition-all"
            >
              Apply for Access
            </button>
            <button
              onClick={onLogin}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-medium text-lg flex items-center justify-center space-x-3 shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all"
            >
              <span>Apply for Access</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-medium text-lg flex items-center justify-center space-x-3 transition-all"
            >
              <MessageSquare className="w-5 h-5 text-slate-400" />
              <span>Contact Us</span>
            </button>
          </div>
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
            <div key={i} className="bg-white dark:bg-[#0d0d0f] border border-slate-100 dark:border-white/5 rounded-3xl p-8 hover:border-slate-200 dark:hover:border-white/10 transition-colors shadow-sm">
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
          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <button onClick={() => setShowContactModal(true)} className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</button>
            <button onClick={() => setShowApplyModal(true)} className="hover:text-slate-900 dark:hover:text-white transition-colors">Apply</button>
            <button onClick={onLogin} className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</button>
          </div>
          <p className="text-sm text-slate-500 mt-4 md:mt-0">© 2026 AegisID. All rights reserved.</p>
        </div>
      </footer>

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Contact AegisID Team</h3>
            <p className="text-sm text-slate-500 mb-6">Have questions about enterprise deployment or verification? Send us a note.</p>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="jane@organization.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="How can we help your organization?"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contactSubmitted}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/30 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply for Access Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Apply for Portal Access</h3>
            <p className="text-sm text-slate-500 mb-6">Submit your application for superadmin review. Upon approval, your account is created with temporary password <code className="text-blue-400">{"{firstname}@26"}</code>.</p>
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={applyForm.username}
                  onChange={(e) => setApplyForm({ ...applyForm, username: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={applyForm.email}
                  onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="john@organization.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Organization</label>
                <select
                  value={applyForm.organizationId}
                  onChange={(e) => setApplyForm({ ...applyForm, organizationId: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Reason / Notes</label>
                <textarea
                  rows={3}
                  value={applyForm.notes}
                  onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Briefly state your purpose for joining..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applySubmitted}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/30 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
