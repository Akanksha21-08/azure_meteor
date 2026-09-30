import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as jobService from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import { Search, RotateCcw } from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchJobs = () => {
    setLoading(true);
    const query = {
      search,
      location,
      jobType,
      workMode,
      sort,
      page,
      limit: 6
    };

    jobService.getPublicJobs(query)
      .then(data => {
        setJobs(data.jobs || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [page, sort, jobType, workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setJobType('All');
    setWorkMode('All');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Browse All Job Openings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Showing {totalCount} active tech opportunities</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Keyword Search</label>
            <input 
              type="text" 
              placeholder="Title or skill..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="form-control"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Location</label>
            <input 
              type="text" 
              placeholder="City or Remote..." 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="form-control"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Job Type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="form-control">
              <option value="All">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Work Mode</label>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="form-control">
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="form-control">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'end' }}>
            <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <Search size={14} /> Filter
            </button>
            <button type="button" onClick={handleReset} className="btn btn-outline btn-sm" title="Reset Filters">
              <RotateCcw size={14} />
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <Loader text="Loading job listings..." />
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No jobs matching your filter criteria.</p>
          <button onClick={handleReset} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>Clear Filters</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          <Pagination page={page} pages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Jobs;
