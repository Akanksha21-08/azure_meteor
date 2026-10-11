import React, { useState, useEffect, useCallback } from "react";
import * as adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { Search, CheckCircle2, Flag, XCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const AdminJobs = () => {
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // { job, action }
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchJobs = useCallback(() => {
    setLoading(true);
    adminService.getJobsForModeration({ search, status: statusFilter, page, limit: 15 })
      .then(setData)
      .catch(() => showToast("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleModerate = async () => {
    if (!modal) return;
    try {
      await adminService.moderateJob(modal.job._id, { status: modal.action, notes });
      showToast(`Job status updated to ${modal.action}.`);
      fetchJobs();
    } catch { showToast("Action failed."); }
    setModal(null); setNotes("");
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete job "${job.jobTitle}" permanently? All applications will be removed.`)) return;
    try {
      await adminService.deleteJob(job._id);
      showToast("Job deleted.");
      fetchJobs();
    } catch { showToast("Delete failed."); }
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.4rem" }}>Job Moderation</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Review, approve, flag or remove job listings</p>

      {toast && <div className="alert alert-success" style={{ marginBottom: "1rem" }}>{toast}</div>}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input className="form-input" placeholder="Search job title, company, location…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ paddingLeft: "2.25rem" }} />
        </div>
        <select className="form-input" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ width: "165px" }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending_review">Pending Review</option>
          <option value="flagged">Flagged</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? <Loader text="Loading jobs..." /> : (
        <>
          <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr><th>Job Title</th><th>Company / Recruiter</th><th>Location</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {data.jobs.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No jobs found.</td></tr>
                  ) : data.jobs.map(j => (
                    <tr key={j._id}>
                      <td style={{ fontWeight: 600 }}>{j.jobTitle}</td>
                      <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {j.companyName}<br />
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{j.recruiter?.name}</span>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{j.location}</td>
                      <td><StatusBadge status={j.status} /></td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(j.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                          {j.status !== "active" && (
                            <button className="btn btn-sm btn-outline" style={{ color: "#34d399", borderColor: "#34d399", padding: "0.2rem 0.5rem" }}
                              onClick={() => setModal({ job: j, action: "active" })}>
                              <CheckCircle2 size={13} /> Approve
                            </button>
                          )}
                          {j.status !== "flagged" && (
                            <button className="btn btn-sm btn-outline" style={{ color: "#fb923c", borderColor: "#fb923c", padding: "0.2rem 0.5rem" }}
                              onClick={() => setModal({ job: j, action: "flagged" })}>
                              <Flag size={13} /> Flag
                            </button>
                          )}
                          {j.status !== "rejected" && (
                            <button className="btn btn-sm btn-outline" style={{ color: "#f87171", borderColor: "#f87171", padding: "0.2rem 0.5rem" }}
                              onClick={() => setModal({ job: j, action: "rejected" })}>
                              <XCircle size={13} /> Reject
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline" style={{ color: "#94a3b8", borderColor: "#94a3b8", padding: "0.2rem 0.5rem" }}
                            onClick={() => handleDelete(j)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {data.pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.25rem" }}>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}><ChevronLeft size={16} /></button>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Page {data.page} of {data.pages}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page >= data.pages}><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: "460px", width: "90%", padding: "2rem" }}>
            <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", textTransform: "capitalize" }}>
              Mark as "{modal.action}" — {modal.job.jobTitle}
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>The recruiter will be notified.</p>
            <textarea className="form-input" rows={3} placeholder="Moderation notes (optional)…"
              value={notes} onChange={e => setNotes(e.target.value)} style={{ marginBottom: "1rem", resize: "vertical" }} />
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => { setModal(null); setNotes(""); }}>Cancel</button>
              <button className="btn" style={{ background: "#818cf8", color: "#fff", border: "none" }} onClick={handleModerate}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
