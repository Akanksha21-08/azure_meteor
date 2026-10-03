import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Download, FileText, Loader2, AlertCircle } from 'lucide-react';

/**
 * ResumeViewerModal
 * In-browser PDF previewer for resumes so recruiters don't have to download files.
 */
const ResumeViewerModal = ({ isOpen, onClose, resumeUrl, candidateName = 'Candidate' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Normalize URL
  const normalizedUrl = React.useMemo(() => {
    if (!resumeUrl) return '';
    if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://') || resumeUrl.startsWith('/')) {
      return resumeUrl;
    }
    return `/${resumeUrl}`;
  }, [resumeUrl]);

  // Reset loading state whenever modal opens or URL changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, normalizedUrl]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '90vh',
          maxHeight: '900px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f3f4f6' }}>
                {candidateName ? `${candidateName}'s Resume` : 'Candidate Resume'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>
                In-browser PDF Document Preview
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {normalizedUrl && (
              <>
                <a
                  href={normalizedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.85rem',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#e5e7eb'
                  }}
                  title="Open resume in a new browser tab"
                >
                  <ExternalLink size={14} />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={normalizedUrl}
                  download
                  className="btn btn-outline btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.85rem',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#e5e7eb'
                  }}
                  title="Download PDF to computer"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
              </>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#9ca3af',
                cursor: 'pointer',
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.3rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#0b0f19',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Loading indicator */}
          {isLoading && !hasError && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0b0f19',
                color: '#9ca3af',
                gap: '0.75rem',
                zIndex: 10
              }}
            >
              <Loader2 size={36} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.9rem' }}>Loading resume preview...</span>
            </div>
          )}

          {/* Missing URL or Error */}
          {(!normalizedUrl || hasError) ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                color: '#9ca3af',
                textAlign: 'center',
                gap: '1rem'
              }}
            >
              <AlertCircle size={44} style={{ color: '#f87171' }} />
              <div>
                <h4 style={{ color: '#f3f4f6', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  Unable to display resume preview
                </h4>
                <p style={{ fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.5 }}>
                  The resume document could not be rendered directly in the viewer. You can still download or open it in a new tab.
                </p>
              </div>
              {normalizedUrl && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <ExternalLink size={14} style={{ marginRight: '6px' }} />
                    Open in New Window
                  </a>
                  <a
                    href={normalizedUrl}
                    download
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={14} style={{ marginRight: '6px' }} />
                    Download File
                  </a>
                </div>
              )}
            </div>
          ) : (
            /* In-browser PDF iframe */
            <iframe
              src={`${normalizedUrl}#toolbar=1&navpanes=0`}
              title={`${candidateName} Resume`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#1e293b'
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResumeViewerModal;
