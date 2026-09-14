'use client';

import React from 'react';

export default function ResultsEmptyState() {
  return (
    <div className="aig-empty-pane">
      <div className="aig-empty-head">
        <h3 className="aig-empty-title">Ready to generate</h3>
        <p className="aig-empty-sub">Configure your batch spec on the left or describe the posts above.</p>
      </div>

      <div className="aig-prose-flow">
        <p className="aig-prose-line">
          <strong>Opening hook:</strong> Drafts a concise opening hook formatted for the mobile feed fold to maximize engagement.
        </p>
        <p className="aig-prose-line">
          <strong>Visual synthesis:</strong> Custom styled visuals, carousels, or metric cards to reinforce the core topic narrative.
        </p>
        <p className="aig-prose-line">
          <strong>Quality & scheduling:</strong> Scores clarity and readability, then queues into open calendar publishing slots.
        </p>
      </div>
    </div>
  );
}
