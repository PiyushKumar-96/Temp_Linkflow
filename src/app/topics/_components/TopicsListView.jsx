'use client';

import React, { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Calendar,
  Sparkles,
  Building2,
  User,
  Pencil,
  Trash2,
  CheckSquare,
  Clock,
  ArrowUpDown,
  Layers,
} from 'lucide-react';

export default function TopicsListView({
  topics = [],
  onEditTopic,
  onDeleteTopic,
  onStartGeneration,
  onBulkReschedule,
  onBulkReassignSeries,
  onBulkDelete,
}) {
  const [selectedIds, setSelectedIds] = useState([]);

  const isAllSelected = topics.length > 0 && selectedIds.length === topics.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(topics.map((t) => t.id));
    }
  };

  const handleToggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkRescheduleDays = (days) => {
    onBulkReschedule(selectedIds, days);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Bulk Action Bar (when selected) */}
      {selectedIds.length > 0 && (
        <div className="card p-3 bg-primary/5 border-primary/30 flex flex-wrap items-center justify-between gap-3 slide-up">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary">
              {selectedIds.length} {selectedIds.length === 1 ? 'topic' : 'topics'} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
              <button
                onClick={() => handleBulkRescheduleDays(7)}
                className="px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted rounded transition-colors"
                title="Shift planned dates forward by 7 days"
              >
                +7 Days
              </button>
              <button
                onClick={() => handleBulkRescheduleDays(14)}
                className="px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted rounded transition-colors"
                title="Shift planned dates forward by 14 days"
              >
                +14 Days
              </button>
            </div>

            <button
              onClick={() => {
                onBulkReassignSeries(selectedIds);
                setSelectedIds([]);
              }}
              className="btn btn-outline text-xs py-1 px-3 flex items-center gap-1.5"
            >
              <Layers size={12} />
              Reassign Series
            </button>

            <button
              onClick={() => {
                onBulkDelete(selectedIds);
                setSelectedIds([]);
              }}
              className="btn btn-outline text-xs py-1 px-3 text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center gap-1.5"
            >
              <Trash2 size={12} />
              Delete Selected
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-muted-foreground hover:underline ml-2"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="card overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="p-3">Topic & Strategic Angle</th>
                <th className="p-3">Series</th>
                <th className="p-3">Target Context</th>
                <th className="p-3">Audience</th>
                <th className="p-3">Cadence & Dates</th>
                <th className="p-3">Downstream Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topics.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No topics match the selected filters.
                  </td>
                </tr>
              ) : (
                topics.map((topic) => {
                  const isSelected = selectedIds.includes(topic.id);
                  return (
                    <tr
                      key={topic.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleOne(topic.id)}
                          className="rounded border-border"
                        />
                      </td>

                      {/* Topic Title & Brief */}
                      <td className="p-3 max-w-sm">
                        <p className="font-semibold text-foreground leading-snug">{topic.title}</p>
                        {topic.brief && (
                          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {topic.brief}
                          </p>
                        )}
                      </td>

                      {/* Series */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-muted font-medium text-foreground">
                          {topic.seriesName}
                        </span>
                      </td>

                      {/* Target Context */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          {topic.account === 'company' ? (
                            <>
                              <Building2 size={12} className="text-primary" />
                              <span className="font-medium text-foreground">Company</span>
                            </>
                          ) : (
                            <>
                              <User size={12} className="text-accent" />
                              <span className="font-medium text-foreground">Personal</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Audience */}
                      <td className="p-3 text-muted-foreground max-w-[150px] truncate">
                        {topic.audience || '—'}
                      </td>

                      {/* Cadence & Dates */}
                      <td className="p-3 whitespace-nowrap text-foreground font-medium">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium capitalize">
                              {topic.cadence || 'custom'}
                            </span>
                            <span className="tabular-nums text-xs font-semibold">
                              {topic.startDate || topic.publicationDate}
                            </span>
                          </div>
                          {topic.endDate && topic.endDate !== topic.startDate && (
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                              → {topic.endDate}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <StatusBadge
                          status={topic.downstreamPostStatus || topic.status}
                          size="sm"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {topic.status === 'planned' && (
                            <button
                              onClick={() => onStartGeneration(topic.id)}
                              className="btn btn-outline text-[11px] py-1 px-2 flex items-center gap-1 hover:bg-primary/10 hover:text-primary"
                              title="Start AI drafting pipeline"
                            >
                              <Sparkles size={11} />
                              Generate
                            </button>
                          )}

                          <button
                            onClick={() => onEditTopic(topic)}
                            className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Edit topic"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() => onDeleteTopic(topic.id)}
                            className="p-1 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Delete topic"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
