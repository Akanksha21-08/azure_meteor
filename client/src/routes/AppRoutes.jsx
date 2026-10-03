import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import Jobs from '../pages/public/Jobs';
import JobDetails from '../pages/public/JobDetails';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import CandidateProfile from '../pages/candidate/CandidateProfile';
import CandidateEditProfile from '../pages/candidate/CandidateEditProfile';
import AppliedJobs from '../pages/candidate/AppliedJobs';
import ApplicationDetails from '../pages/candidate/ApplicationDetails';
import SavedJobs from '../pages/candidate/SavedJobs';
import CandidateInterviews from '../pages/candidate/CandidateInterviews';
import CandidateNotifications from '../pages/candidate/CandidateNotifications';
import CandidateChangePassword from '../pages/candidate/ChangePassword';

// Recruiter Pages
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import CompanyProfile from '../pages/recruiter/CompanyProfile';
import EditCompanyProfile from '../pages/recruiter/EditCompanyProfile';
import MyJobs from '../pages/recruiter/MyJobs';
import CreateJob from '../pages/recruiter/CreateJob';
import ApplicantsList from '../pages/recruiter/ApplicantsList';
import RecruiterInterviews from '../pages/recruiter/RecruiterInterviews';
import RecruiterNotifications from '../pages/recruiter/RecruiterNotifications';
import RecruiterChangePassword from '../pages/candidate/ChangePassword';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCompanies from '../pages/admin/AdminCompanies';
import AdminJobs from '../pages/admin/AdminJobs';
import AdminReports from '../pages/admin/AdminReports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Candidate Protected Routes inside DashboardLayout */}
      <Route element={<ProtectedRoute role="candidate" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/edit-profile" element={<CandidateEditProfile />} />
          <Route path="/candidate/applications" element={<AppliedJobs />} />
          <Route path="/candidate/applications/:id" element={<ApplicationDetails />} />
          <Route path="/candidate/saved-jobs" element={<SavedJobs />} />
          <Route path="/candidate/interviews" element={<CandidateInterviews />} />
          <Route path="/candidate/notifications" element={<CandidateNotifications />} />
          <Route path="/candidate/change-password" element={<CandidateChangePassword />} />
        </Route>
      </Route>

      {/* Recruiter Protected Routes inside DashboardLayout */}
      <Route element={<ProtectedRoute role="recruiter" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/company-profile" element={<CompanyProfile />} />
          <Route path="/recruiter/edit-company-profile" element={<EditCompanyProfile />} />
          <Route path="/recruiter/my-jobs" element={<MyJobs />} />
          <Route path="/recruiter/create-job" element={<CreateJob />} />
          <Route path="/recruiter/edit-job/:id" element={<CreateJob />} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<ApplicantsList />} />
          <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
          <Route path="/recruiter/notifications" element={<RecruiterNotifications />} />
          <Route path="/recruiter/change-password" element={<RecruiterChangePassword />} />
        </Route>
      </Route>

      {/* Admin Protected Routes inside DashboardLayout */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route element={<MainLayout />}>
        <Route path="*" element={
          <div className="page-container" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>404 - Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The page you requested does not exist.</p>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
