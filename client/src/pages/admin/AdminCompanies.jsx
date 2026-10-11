import React, { useState, useEffect, useCallback } from "react";
import * as adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { Search, CheckCircle2, XCircle, Building2 } from "lucide-react";

const VERIFICATION_COLORS = {
  verified: "#34d399",
  pending: "#fb923c",
  rejected: "#f87171",
  suspended: "#94a3b8",
};

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(null); // { company, action }
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchCompanies = useCallback(() => {
    setLoading(true);
    adminService.getCompanies({ search, status: statusFilter })
      .then(setCompanies)
      .catch(() => showToast("Failed to load companies"))
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const handleVerify = async () => {
    if (!modal) return;
    try {
      await adminService.updateCompanyVerification(modal.company._id, { status: modal.action, notes });
      showToast(`Company status updated to ${modal.action}.`);
      fetchCompanies();
    } catch { showToast("Action failed."); }
    setModal(null); setNotes("");
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.4rem" }}>Company Verification</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Approve, reject or suspend recruiter companies</p>

      {toast && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>{toast}</div>}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="form-input" placeholder="Search company, location, industry…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
        </div>
        <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: "160px" }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? <Loader text="Loading companies..." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {companies.length === 0 ? (
            <div className="glass-card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <Building2 size={40} style={{ marginBottom: "0.75rem", opacity: 0.4 }} />
              <p>No companies found.</p>
            </div>
          ) : companies.map(c => (
            <div key={c._id} className="glass-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {c.logo ? (
                  <img src={c.logo} alt={c.companyName} style={{ width: 48, height: 48, borderRadius: "8px", objectFit: "cover", background: "var(--surface)" }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: "8px", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={22} color="var(--text-muted)" />
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>{c.companyName || "Unnamed Company"}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.user?.name} · {c.user?.email}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{c.industry} · {c.location} · {c.jobCount} jobs</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <StatusBadge status={c.verificationStatus || "pending"} />
                {c.user?.isSuspended && <StatusBadge status="suspended" />}
                {c.verificationStatus !== "verified" && (
                  <button className="btn btn-sm btn-outline" style={{ color: "#34d399", borderColor: "#34d399" }}
                    onClick={() => setModal({ company: c, action: "verified" })}>
                    <CheckCircle2 size={14} /> Approve
                  </button>
                )}
                {c.verificationStatus !== "rejected" && (
                  <button className="btn btn-sm btn-outline" style={{ color: "#f87171", borderColor: "#f87171" }}
                    onClick={() => setModal({ company: c, action: "rejected" })}>
                    <XCircle size={14} /> Reject
                  </button>
                )}
                {c.verificationStatus !== "suspended" && (
                  <button className="btn btn-sm btn-outline" style={{ color: "#94a3b8", borderColor: "#94a3b8" }}
                    onClick={() => setModal({ company: c, action: "suspended" })}>
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: "460px", width: "90%", padding: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", textTransform: "capitalize" }}>
              {modal.action} "{modal.company.companyName}"?
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              The recruiter will be notified of this decision.
            </p>
            <textarea className="form-input" rows={3} placeholder="Optional notes for the recruiter…"
              value={notes} onChange={e => setNotes(e.target.value)} style={{ marginBottom: "1rem", resize: "vertical" }} />
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => { setModal(null); setNotes(""); }}>Cancel</button>
              <button className="btn" style={{ background: VERIFICATION_COLORS[modal.action] || "#818cf8", color: "#fff", border: "none" }}
                onClick={handleVerify}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;
