'use client';

import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import './chrome.css';

const MESSAGES = [
  'Queuing today’s drafts…',
  'Checking your publishing slots…',
  'Syncing the approval queue…',
  'Warming up your feed…',
];

// Full-screen splash for app boot or a slow route transition.
// Renders on its own — only needs chrome.css + motion.css, no app data.
export default function LoadingScreen({ label = 'Content Operations' }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lf lf-boot" role="status" aria-live="polite">
      <div className="lf-field" aria-hidden="true">
        <span className="lf-blob b1" />
        <span className="lf-blob b2" />
      </div>

      <div className="lf-ring" aria-hidden="true">
        <svg viewBox="0 0 84 84">
          <circle cx="42" cy="42" r="33" className="lf-ring-track" />
          <circle cx="42" cy="42" r="33" className="lf-ring-arc" />
        </svg>
        <span className="lf-ring-icon">
          <Send size={18} strokeWidth={2.2} />
        </span>
      </div>

      <div className="lf-steps" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <span className="lf-step" style={{ '--i': i }} />
            {i < 3 && <span className="lf-link" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="lf-eyebrow">{label}</p>
        <p className="lf-status">
          <span key={msgIndex} className="m-swap">
            {MESSAGES[msgIndex]}
          </span>
        </p>
      </div>
    </div>
  );
}
