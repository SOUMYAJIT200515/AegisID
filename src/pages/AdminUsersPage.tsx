import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api/client";
import { Users, Shield, Plus, Building2, CheckCircle2, XCircle, Clock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "applications">("users");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", role: "USER", organizationId: 1 });

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, orgsRes, appsRes] = await Promise.all([
          api.get("/users"),
          api.get("/organizations"),
          api.get("/applications")
        ]);
        setUsers(usersRes);
        setOrgs(orgsRes);
        setApplications(appsRes);
        if (orgsRes && orgsRes.length > 0) {
          setForm(f => ({ ...f, organizationId: orgsRes[0].id }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const orgMap = useMemo(() => {
    const map: Record<number, string> = {};
    orgs.forEach(o => { map[o.id] = o.name; });
    return map;
  }, [orgs]);

  const handleAction = async (id: number, action: string) => {
    try {
      await api.put(`/users/${id}/${action}`);
      const data = await api.get("/users");
      setUsers(data);
    } catch (e: any) {
      alert("Action failed: " + e.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      setShowModal(false);
      setForm({ fullName: "", username: "", email: "", password: "", role: "USER", organizationId: orgs[0]?.id || 1 });
      const data = await api.get("/users");
      setUsers(data);
    } catch (err: any) {
      alert("Failed to create user: " + err.message);
    }
  };

  const getAvailableRoles = () => {
    if (currentUser?.role === "SUPER_ADMIN") {
      return ["SUPER_ADMIN", "ADMIN", "ISSUER", "VERIFIER", "USER"];
    }
    return ["ISSUER", "VERIFIER", "USER"];
  };

  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User & Access Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage user accounts, organizations, and registration applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === "applications"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Applications
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
          {activeTab === "users" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "users" && (
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {loading ? (
                  <tr><td colSpan={8} className="p-6 text-center text-slate-500">Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center text-slate-500">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono text-slate-500 dark:text-slate-400">#{u.id}</td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{u.fullName}</td>
                      <td className="p-4 font-mono text-xs text-blue-400">{u.username}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-medium">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>{orgMap[u.organizationId] || `Org #${u.organizationId}`}</span>
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-purple-400 uppercase">{u.role}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {u.status === 'ACTIVE' ? (
                          <button
                            onClick={() => handleAction(u.id, "suspend")}
                            className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-lg text-xs font-medium border border-amber-500/30"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(u.id, "activate")}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30"
                          >
                            Activate
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
      )}

      {activeTab === "applications" && (
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950/50">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">User Access Applications</h3>
              <p className="text-xs text-slate-500">Review public user registrations. Approving creates a user account with password <code className="text-blue-400">{"{firstname}@26"}</code>.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {applications.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center text-slate-500">No applications found.</td></tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-200/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono text-slate-500">#{app.id}</td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{app.fullName}</td>
                      <td className="p-4 font-mono text-xs text-blue-400">{app.username}</td>
                      <td className="p-4 text-slate-500">{app.email}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-medium">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>{orgMap[app.organizationId] || `Org #${app.organizationId}`}</span>
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 truncate max-w-xs">{app.notes || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {app.status === 'PENDING' && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await api.post(`/applications/${app.id}/approve`, {});
                                  alert(`Application approved successfully!\nUser account created.\nGenerated Password: ${res.generatedPassword}`);
                                  const [appsRes, usersRes] = await Promise.all([api.get("/applications"), api.get("/users")]);
                                  setApplications(appsRes);
                                  setUsers(usersRes);
                                } catch (e: any) {
                                  alert("Approval failed: " + e.message);
                                }
                              }}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30"
                            >
                              Approve
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await api.post(`/applications/${app.id}/reject`, {});
                                  const appsRes = await api.get("/applications");
                                  setApplications(appsRes);
                                } catch (e: any) {
                                  alert("Rejection failed: " + e.message);
                                }
                              }}
                              className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-medium border border-red-500/30"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New User</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pr-10 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Organization</label>
                <select
                  value={form.organizationId}
                  onChange={(e) => setForm({ ...form, organizationId: Number(e.target.value) })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {getAvailableRoles().map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
