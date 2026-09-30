import React from 'react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button 
        className="btn btn-outline btn-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      {pageNumbers.map(num => (
        <button
          key={num}
          className={num === page ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button 
        className="btn btn-outline btn-sm"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
