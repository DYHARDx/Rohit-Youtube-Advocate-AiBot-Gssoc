import React from 'react';
import '../styles/CommonStyles.css';

/**
 * Reusable Error Display Component
 * Provides consistent error messaging across the application
 */
const ErrorDisplay = ({ message, onRetry, type = 'error' }) => {
  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  return (
    <div className={`error-display ${isError ? 'error' : isSuccess ? 'success' : isWarning ? 'warning' : ''}`}>
      <div className="error-content">
        <span className="error-icon">
          {isError && '❌'}
          {isSuccess && '✅'}
          {isWarning && '⚠️'}
        </span>
        <span className="error-message">{message}</span>
        {onRetry && (
          <button 
            className="retry-button" 
            onClick={onRetry}
            aria-label="Retry operation"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;