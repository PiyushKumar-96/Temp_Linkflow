'use client';

import React from 'react';

const PILLARS = [
  { name: 'Thought Leadership', color: 'var(--tpc-pillar-thought)' },
  { name: 'Case Studies', color: 'var(--tpc-pillar-case)' },
  { name: 'Engineering Culture', color: 'var(--tpc-pillar-engineering)' },
  { name: 'Industry Insights', color: 'var(--tpc-pillar-industry)' },
];

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  return new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

export default function CoverageBar({ topics = [] }) {
  // Compute how many distinct weeks of the 52 weeks in 2026 have at least one topic
  const coveredWeeks = new Set();

  topics.forEach((t) => {
    const start = parseDate(t.startDate || t.publicationDate);
    const end = parseDate(t.endDate || t.startDate || t.publicationDate);
    if (!start) return;

    const cur = new Date(start.getTime());
    const limit = end || start;

    while (cur <= limit) {
      if (cur.getUTCFullYear() === 2026) {
        coveredWeeks.add(getWeekNumber(cur));
      }
      cur.setUTCDate(cur.getUTCDate() + 3); // check every 3 days in span
    }
  });

  const totalWeeks = 52;
  const count = coveredWeeks.size;
  const uncoveredCount = totalWeeks - count;

  return (
    <div className="tpc-coverage-bar">
      <div className="tpc-coverage-text">
        <strong>{count} of {totalWeeks} weeks</strong> have a planned topic &middot; {uncoveredCount} weeks open
      </div>

      <div className="tpc-coverage-legend">
        {PILLARS.map((p) => (
          <div key={p.name} className="tpc-legend-item">
            <span
              className="tpc-legend-swatch"
              style={{ backgroundColor: p.color }}
            />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
