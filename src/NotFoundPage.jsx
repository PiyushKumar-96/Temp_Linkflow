'use client';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, LayoutDashboard, PenLine, RotateCcw, Send, WifiOff, X } from 'lucide-react';
import './chrome.css';

// Flow steps when a post/page doesn't exist (404)
const NOT_FOUND_STEPS = [
  { label: 'Queued', state: 'done', line: 'done' },
  { label: 'Reviewed', state: 'done', line: 'broken' },
  { label: 'This page', state: 'broken', line: 'todo' },
  { label: 'Published', state: 'todo' },
];

// Flow steps when offline or the network connection was lost
const OFFLINE_STEPS = [
  { label: 'Device', state: 'done', line: 'broken' },
  { label: 'Network', state: 'broken', line: 'todo' },
  { label: 'Server', state: 'todo', line: 'todo' },
  { label: 'Page', state: 'todo' },
];

export default function NotFoundPage({ isNetworkError = false, error = null, onRetry = null }) {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine || isNetworkError);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const isUnreachable = isOffline || isNetworkError;
  const steps = isUnreachable ? OFFLINE_STEPS : NOT_FOUND_STEPS;

  const handleRetryClick = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="lf lf-404" role="main" aria-labelledby="lf-status-title">
      <span className="lf-mark lf-404-mark" aria-hidden="true">
        {isUnreachable ? (
          <WifiOff size={18} strokeWidth={2.2} />
        ) : (
          <Send size={18} strokeWidth={2.2} />
        )}
      </span>

      <ol className="lf-flow" aria-hidden="true">
        {steps.map((step, i) => (
          <li key={step.label} className={`lf-flow-step is-${step.state}`}>
            <span className="lf-flow-node-col">
              <span className="lf-flow-node">
                {step.state === 'done' && <Check size={15} strokeWidth={3} />}
                {step.state === 'broken' && <X size={15} strokeWidth={3} />}
                {step.state === 'todo' && i + 1}
              </span>
              <span className="lf-flow-label">{step.label}</span>
            </span>
            {step.line && <span className={`lf-flow-link is-${step.line}`} />}
          </li>
        ))}
      </ol>

      <h1 id="lf-status-title" className="lf-404-title">
        {isUnreachable ? 'This page couldn’t be reached.' : 'This page didn’t make it to publish.'}
      </h1>
      <p className="lf-404-sub">
        {isUnreachable
          ? 'There is no internet connection or the server is temporarily unreachable. Please check your network and try again.'
          : 'The link you followed isn’t in your queue. It may have been renamed, moved, or removed.'}
      </p>

      <div className="lf-404-actions">
        {isUnreachable ? (
          <>
            <button
              type="button"
              onClick={handleRetryClick}
              className="lf-btn lf-btn-primary cursor-pointer"
            >
              <RotateCcw size={16} />
              Try again
            </button>
            <Link to="/dashboard" className="lf-btn lf-btn-outline">
              <LayoutDashboard size={16} />
              Back to dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="lf-btn lf-btn-primary">
              <LayoutDashboard size={16} />
              Back to dashboard
            </Link>
            <Link to="/post-creation-composer" className="lf-btn lf-btn-outline">
              <PenLine size={16} />
              Open composer
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
