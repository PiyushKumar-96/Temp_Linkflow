'use client';

import React, { useState } from 'react';
import { BarChart3, Download, RefreshCw, Calendar, Check, X } from 'lucide-react';
import { exportAnalyticsData } from '@/temp-backend';
import { toast } from 'sonner';

const ranges = [
  { id: 'range-7d', label: '7 days' },
  { id: 'range-30d', label: '30 days' },
  { id: 'range-90d', label: '90 days' },
  { id: 'range-custom', label: 'Custom' },
];

export default function AnalyticsHeader({
  activeRange = 'range-30d',
  onRangeChange,
  onRefresh,
  isRefreshing = false,
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
      const rangeLabel = ranges.find((r) => r.id === activeRange)?.label || activeRange;
      toast.success(`Exported LinkedIn analytics (${rangeLabel}) to CSV`);
    } catch {
      toast.error('Failed to export analytics report');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          LinkedIn performance for <span className="font-semibold text-foreground">Acme Corp</span> ·
          Last updated {lastUpdated}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Range selector */}
        <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
          {ranges.map((r) => {
            const isActive = activeRange === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRangeClick(r.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 ${
                  isActive
                    ? 'bg-card text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExport}
          className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-sm"
          title="Export CSV report"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
          title="Refresh metrics from backend"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-primary' : ''} />
        </button>
      </div>

      {/* Custom Date Range Popover/Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm p-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                <Calendar size={16} className="text-primary" />
                Select Custom Date Range
              </div>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-xs focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-xs focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-1.5 px-3 py-1.5"
                >
                  <Check size={14} />
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
