import React, { useState, useEffect, useCallback } from "react";
import * as adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { Search, ShieldOff, ShieldCheck, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const AdminUsers = () => {
  const [data, setData] = useState({ users: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const [modal, setModal] = useState(null); // { type: 'suspend'|'delete', user }
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminService.getAllUsers({ search, role: roleFilter, status: statusFilter, page, limit: 15 })
      .then(setData)
      .catch(() => showToast("Failed to load users"))
      .finally(() => setLoading(false));
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async () => {
    if (!modal?.user) return;
    const isSuspending = !modal.user.isSuspended;
    setActionLoading(p => ({ ...p, [modal.user._id]: true }));
    try {
      await adminService.toggleUserSuspension(modal.user._id, { isSuspended: isSuspending, reason });
      showToast(isSuspending ? "User suspended." : "User access restored.");
      fetchUsers();
    } catch { showToast("Action failed."); }
    setActionLoading(p => ({ ...p, [modal.user._id]: false }));
    setModal(null); setReason("");
  };

  const handleDelete = async () => {
    if (!modal?.user) return;
    setActionLoading(p => ({ ...p, [modal.user._id]: true }));
    try {
      await adminService.deleteUser(modal.user._id);
      showToast("User permanently deleted.");
      fetchUsers();
    } catch { showToast("Delete failed."); }
    setActionLoading(p => ({ ...p, [modal.user._id]: false }));
    setModal(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.4rem" }}>User Management</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        Suspend, restore or remove platform accounts
      </p>

      {toast && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>{toast}</div>}

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="form-input" placeholder="Search name or email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: "2.25rem" }} />
        </div>
        <select className="form-input" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={{ width: "140px" }}>
          <option value="all">All Roles</option>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <select className="form-input" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ width: "150px" }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? <Loader text="Loading users..." /> : (
        <>
          <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No users found.</td></tr>
                  ) : data.users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{u.email}</td>
                      <td><StatusBadge status={u.role} /></td>
                      <td><StatusBadge status={u.isSuspended ? "suspended" : "active"} /></td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button
                            className={`btn btn-sm ${u.isSuspended ? "btn-outline" : "btn-outline"}`}
                            style={u.isSuspended ? { color: "#34d399", borderColor: "#34d399" } : { color: "#fb923c", borderColor: "#fb923c" }}
                            onClick={() => setModal({ type: "suspend", user: u })}
                            disabled={!!actionLoading[u._id]}
                          >
                            {u.isSuspended ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                            {u.isSuspended ? "Restore" : "Suspend"}
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            style={{ color: "#f87171", borderColor: "#f87171" }}
                            onClick={() => setModal({ type: "delete", user: u })}
                            disabled={!!actionLoading[u._id]}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.25rem" }}>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}><ChevronLeft size={16} /></button>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Page {data.page} of {data.pages}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page >= data.pages}><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: "460px", width: "90%", padding: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
              {modal.type === "delete" ? "Delete User?" : modal.user.isSuspended ? "Restore Access?" : "Suspend User?"}
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              {modal.type === "delete"
                ? `Permanently delete "${modal.user.name}" and all their data. This cannot be undone.`
                : modal.user.isSuspended
                  ? `Restore access for "${modal.user.name}". They will be notified.`
                  : `Suspend "${modal.user.name}". They will be blocked from logging in.`}
            </p>
            {modal.type === "suspend" && !modal.user.isSuspended && (
              <textarea className="form-input" rows={3} placeholder="Reason for suspension (optional)…"
                value={reason} onChange={e => setReason(e.target.value)} style={{ marginBottom: "1rem", resize: "vertical" }} />
            )}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => { setModal(null); setReason(""); }}>Cancel</button>
              <button
                className="btn"
                style={{ background: modal.type === "delete" ? "#f87171" : modal.user.isSuspended ? "#34d399" : "#fb923c", color: "#fff", border: "none" }}
                onClick={modal.type === "delete" ? handleDelete : handleSuspend}
              >
                {modal.type === "delete" ? "Delete" : modal.user.isSuspended ? "Restore" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
