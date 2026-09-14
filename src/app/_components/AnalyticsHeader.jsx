'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { exportAnalyticsData } from '@/temp-backend';
import { toast } from 'sonner';

const RANGES = [
  { id: 'range-7d', label: '7 days' },
  { id: 'range-30d', label: '30 days' },
  { id: 'range-90d', label: '90 days' },
  { id: 'range-custom', label: 'Custom' },
];

export default function AnalyticsHeader({
  activeRange = 'range-30d',
  onRangeChange,
  lastUpdated = '4 min ago',
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-08-15');
  const [customEndDate, setCustomEndDate] = useState('2026-09-08');

  const handleRangeClick = (rangeId) => {
    if (rangeId === 'range-custom') {
      setShowCustomModal(true);
    } else {
      onRangeChange?.(rangeId);
    }
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customStartDate || !customEndDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (customStartDate > customEndDate) {
      toast.error('Start date cannot be after end date');
      return;
    }
    setShowCustomModal(false);
    onRangeChange?.('range-custom', { startDate: customStartDate, endDate: customEndDate });
    toast.success(`Applied custom range: ${customStartDate} to ${customEndDate}`);
  };

  const handleExport = () => {
    try {
      exportAnalyticsData(activeRange);
      const rangeLabel = RANGES.find((r) => r.id === activeRange)?.label || activeRange;
      toast.success(`Exported LinkedIn analytics (${rangeLabel}) to CSV`);
    } catch {
      toast.error('Failed to export analytics report');
    }
  };

  return (
    <div className="anl-head">
      <div className="anl-title-block">
        <h1 className="anl-title">Analytics</h1>
        <p className="anl-sub">
          LinkedIn performance for Acme Corp ·{' '}
          <span className="anl-sub-time">Last updated {lastUpdated}</span>
        </p>
      </div>

      <div className="anl-head-controls">
        <div className="anl-range-group" role="tablist" aria-label="Time range">
          {RANGES.map((r) => {
            const isActive = activeRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleRangeClick(r.id)}
                className={`anl-range-btn ${isActive ? 'anl-range-btn--active' : ''}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="anl-btn-export"
          title="Export CSV report"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-foreground mb-1">Select date range</h3>
            <p className="text-xs text-muted-foreground mb-4">Choose custom start and end dates</p>
            <form onSubmit={handleApplyCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Start date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full h-9 px-3 text-sm bg-card border border-border rounded-md text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">End date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full h-9 px-3 text-sm bg-card border border-border rounded-md text-foreground"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md bg-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md"
                >
                  Apply range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
