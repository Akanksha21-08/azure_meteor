import React, { useState, useEffect, useCallback } from "react";
import * as adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { Flag, CheckCircle2, XCircle } from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modal, setModal] = useState(null); // { report }
  const [adminNotes, setAdminNotes] = useState("");
  const [action, setAction] = useState("none");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchReports = useCallback(() => {
    setLoading(true);
    adminService.getReports({ status: statusFilter, targetType: typeFilter })
      .then(setReports)
      .catch(() => showToast("Failed to load reports"))
      .finally(() => setLoading(false));
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleResolve = async (status) => {
    if (!modal) return;
    try {
      await adminService.resolveReport(modal._id, { status, adminNotes, action });
      showToast(`Report marked as ${status}.`);
      fetchReports();
    } catch { showToast("Action failed."); }
    setModal(null); setAdminNotes(""); setAction("none");
  };

  const severityColor = (reason) => {
    if (["scam", "fraud"].includes(reason)) return "#f87171";
    if (["spam", "fake_job"].includes(reason)) return "#fb923c";
    return "#818cf8";
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Flag size={26} color="#f87171" /> Fraud & Abuse Reports
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Investigate and resolve user-submitted reports</p>

      {toast && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>{toast}</div>}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: "160px" }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select className="form-input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: "160px" }}>
          <option value="all">All Types</option>
          <option value="user">User</option>
          <option value="job">Job</option>
          <option value="company">Company</option>
        </select>
      </div>

      {loading ? <Loader text="Loading reports..." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reports.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <Flag size={40} style={{ marginBottom: "0.75rem", opacity: 0.3 }} /><p>No reports found.</p>
            </div>
          ) : reports.map(r => (
            <div key={r._id} className="glass-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: severityColor(r.reason), textTransform: "capitalize" }}>
                      {r.reason?.replace(/_/g, " ")}
                    </span>
                    <StatusBadge status={r.status} />
                    <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.07)", padding: "0.1rem 0.5rem", borderRadius: "999px", color: "var(--text-secondary)" }}>
                      {r.targetType}
                    </span>
                  </div>
                  {r.targetTitle && (
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.3rem" }}>Target: {r.targetTitle}</div>
                  )}
                  {r.details && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>{r.details}</p>
                  )}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Reported by: <strong>{r.reporter?.name || "Anonymous"}</strong> ({r.reporter?.email}) ·{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  {r.adminNotes && (
                    <div style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#34d399" }}>
                      Admin note: {r.adminNotes}
                    </div>
                  )}
                </div>
                {r.status === "pending" && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-sm btn-outline" style={{ color: "#34d399", borderColor: "#34d399" }}
                      onClick={() => { setModal(r); setAction("none"); }}>
                      <CheckCircle2 size={14} /> Resolve
                    </button>
                    <button className="btn btn-sm btn-outline" style={{ color: "#94a3b8", borderColor: "#94a3b8" }}
                      onClick={async () => {
                        try { await adminService.resolveReport(r._id, { status: "dismissed", adminNotes: "Report dismissed." }); fetchReports(); }
                        catch { showToast("Failed."); }
                      }}>
                      <XCircle size={14} /> Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: "500px", width: "90%", padding: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Resolve Report</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Report: <strong>{modal.reason?.replace(/_/g, " ")}</strong> on {modal.targetType} "{modal.targetTitle}"
            </p>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Enforcement Action</label>
            <select className="form-input" value={action} onChange={e => setAction(e.target.value)} style={{ marginBottom: "1rem" }}>
              <option value="none">No automated action</option>
              <option value="user_suspended">Suspend the reported user</option>
              <option value="job_removed">Flag the reported job</option>
            </select>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Admin Notes</label>
            <textarea className="form-input" rows={3} placeholder="Internal notes for this resolution…"
              value={adminNotes} onChange={e => setAdminNotes(e.target.value)} style={{ marginBottom: "1rem", resize: "vertical" }} />
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => { setModal(null); setAdminNotes(""); setAction("none"); }}>Cancel</button>
              <button className="btn" style={{ background: "#34d399", color: "#fff", border: "none" }} onClick={() => handleResolve("resolved")}>
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
