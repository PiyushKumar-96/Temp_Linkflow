'use client';

import React, { useState } from 'react';
import { X, Layers } from 'lucide-react';

const AVAILABLE_SERIES = [
  { id: 'series-1', name: 'Thought Leadership' },
  { id: 'series-2', name: 'Case Studies' },
  { id: 'series-3', name: 'Engineering Culture' },
  { id: 'series-4', name: 'Industry Insights' },
];

export default function BulkReassignSeriesModal({
  isOpen,
  onClose,
  topicIds = [],
  onConfirm,
}) {
  const [selectedSeriesId, setSelectedSeriesId] = useState('series-1');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const s = AVAILABLE_SERIES.find((item) => item.id === selectedSeriesId);
    if (s) {
      onConfirm(topicIds, s.id, s.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white">
              <Layers size={15} />
            </div>
            <h2 className="text-sm font-bold text-foreground">Reassign Series</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            Select a new series to assign to the {topicIds.length} selected topics:
          </p>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Series Category
            </label>
            <select
              value={selectedSeriesId}
              onChange={(e) => setSelectedSeriesId(e.target.value)}
              className="input w-full text-xs bg-input"
            >
              {AVAILABLE_SERIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn btn-primary text-xs px-5 py-2"
            >
              Update Series
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
