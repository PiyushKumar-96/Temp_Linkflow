'use client';

import React, { useState } from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';

const ranges = [
  { id: 'range-7d', label: '7 days' },
  { id: 'range-30d', label: '30 days' },
  { id: 'range-90d', label: '90 days' },
  { id: 'range-custom', label: 'Custom' },
];

export default function AnalyticsHeader() {
  const [activeRange, setActiveRange] = useState('range-30d');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={20} className="text-primary" />
          <h1 className="text-2xl font-700 text-foreground">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          LinkedIn performance for <span className="font-600 text-foreground">Acme Corp</span> · Last updated 4 min ago
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Range selector */}
        <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
          {ranges?.map(r => (
            <button
              key={r?.id}
              onClick={() => setActiveRange(r?.id)}
              className={`px-3 py-1.5 text-sm font-500 rounded-md transition-all duration-150 ${
                activeRange === r?.id
                  ? 'bg-card text-foreground card-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r?.label}
            </button>
          ))}
        </div>

        <button className="btn-secondary">
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>
    </div>
  );
}