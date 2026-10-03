import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import {
  Users, Briefcase, Building2, Flag, ShieldAlert,
  CheckCircle2, Clock, TrendingUp, AlertTriangle, UserX
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass-card stat-card" style={{ gap: "1rem" }}>
    <div className="stat-icon" style={{ background: `${color}22`, color }}><Icon size={22} /></div>
    <div>
      <div className="stat-value">{value ?? "—"}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{sub}</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.getAdminStats()
      .then(setData)
      .catch(() => setError("Failed to load admin stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading admin dashboard..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const m = data?.metrics || {};

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <ShieldAlert size={28} color="var(--accent-red, #f87171)" /> Admin Control Center
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Platform-wide overview — users, jobs, companies and fraud reports</p>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: "2rem" }}>
        <StatCard icon={Users}        label="Total Users"        value={m.totalUsers}       color="#818cf8" sub={`${m.totalCandidates} candidates`} />
        <StatCard icon={Building2}    label="Companies"          value={m.totalCompanies}   color="#34d399" sub={`${m.pendingCompanies} pending`} />
        <StatCard icon={Briefcase}    label="Total Jobs"         value={m.totalJobs}        color="#c084fc" sub={`${m.activeJobs} active`} />
        <StatCard icon={Flag}         label="Flagged Jobs"       value={m.flaggedJobs}      color="#fb923c" />
        <StatCard icon={AlertTriangle}label="Pending Reports"    value={m.pendingReports}   color="#f87171" sub={`${m.totalReports} total`} />
        <StatCard icon={UserX}        label="Suspended Users"    value={m.suspendedUsers}   color="#94a3b8" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent Users */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: 700 }}>Recent Signups</h3>
            <Link to="/admin/users" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {data?.recentUsers?.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>No users yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {data?.recentUsers?.map(u => (
                <li key={u._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <StatusBadge status={u.role} />
                    {u.isSuspended && <StatusBadge status="suspended" />}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Reports */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontWeight: 700 }}>Recent Reports</h3>
            <Link to="/admin/reports" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {data?.recentReports?.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>No reports yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {data?.recentReports?.map(r => (
                <li key={r._id} style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{r.reason}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    By: {r.reporter?.name || "Unknown"} · {r.targetType}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card" style={{ marginTop: "1.5rem" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/admin/users"     className="btn btn-outline">Manage Users</Link>
          <Link to="/admin/companies" className="btn btn-outline">Verify Companies</Link>
          <Link to="/admin/jobs"      className="btn btn-outline">Moderate Jobs</Link>
          <Link to="/admin/reports"   className="btn btn-outline" style={{ color: "var(--accent-red, #f87171)", borderColor: "var(--accent-red, #f87171)" }}>
            <Flag size={15} /> View Reports {m.pendingReports > 0 && `(${m.pendingReports})`}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
