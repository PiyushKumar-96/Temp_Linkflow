'use client';

import React, { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  AlertCircle,
  Plus,
  Sparkles,
  Building2,
  User,
  Calendar,
  Layers,
  ChevronDown,
  Maximize2,
} from 'lucide-react';

export default function MonthCard({
  month,
  topics = [],
  onEditTopic,
  onAddTopic,
  onBatchPlanMonth,
  onStartGeneration,
  onOpenMonthModal,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const count = topics.length;
  const isGap = count === 0;

  // Cadence counts
  const weeklyCount = topics.filter((t) => t.cadence === 'weekly').length;
  const dailyCount = topics.filter((t) => t.cadence === 'daily').length;
  const customCount = topics.filter((t) => t.cadence === 'custom' || !t.cadence).length;

  const MAX_VISIBLE_TOPICS = 2;
  const visibleTopics = topics.slice(0, MAX_VISIBLE_TOPICS);
  const overflowCount = topics.length - MAX_VISIBLE_TOPICS;

  const handleSelectCadence = (cadence) => {
    setIsMenuOpen(false);
    onAddTopic({ monthDate: `${month.key}-15`, cadence });
  };

  return (
    <div
      className={`card flex flex-col overflow-hidden transition-all duration-150 relative ${
        isGap ? 'border-dashed border-amber-400/50 bg-amber-50/10' : 'hover:border-primary/40'
      }`}
    >
      {/* Header */}
      <div
        onClick={() => onOpenMonthModal && onOpenMonthModal(month)}
        className="px-4 py-3 border-b border-border flex items-center justify-between bg-card hover:bg-muted/30 transition-colors cursor-pointer group select-none"
        title={`Click to view all ${count} topics for ${month.name} in modal`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
            {month.name}
          </span>
          <Maximize2
            size={11}
            className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            title="Expand month modal"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-transform group-hover:scale-105 ${
              isGap
                ? 'bg-amber-100 text-amber-800'
                : count >= 3
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {count} {count === 1 ? 'Topic' : 'Topics'}
          </span>
        </div>
      </div>

      {/* Cadence Summary Bar (if topics exist) */}
      {!isGap && (
        <div
          onClick={() => onOpenMonthModal && onOpenMonthModal(month)}
          className="px-4 py-1.5 bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border/50 flex items-center justify-between text-[10px] text-muted-foreground cursor-pointer select-none"
          title={`Click to view all ${count} topics for ${month.name}`}
        >
          <div className="flex items-center gap-2">
            {weeklyCount > 0 && <span className="font-medium text-foreground">{weeklyCount} Weekly</span>}
            {dailyCount > 0 && <span className="font-medium text-foreground">{dailyCount} Daily</span>}
            {customCount > 0 && <span className="font-medium text-foreground">{customCount} Custom</span>}
          </div>
          {count > 2 && (
            <span className="text-primary font-semibold flex items-center gap-0.5">
              View all →
            </span>
          )}
        </div>
      )}

      {/* Topics Content */}
      <div className="p-3 flex-1 flex flex-col gap-2 min-h-[160px]">
        {isGap ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-muted/10">
            <AlertCircle size={20} className="text-amber-500 mb-1.5 opacity-80" />
            <p className="text-xs font-semibold text-foreground">Content Gap</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[170px]">
              No topics planned for {month.short} yet
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onAddTopic({ monthDate: `${month.key}-15`, cadence: 'weekly' })}
                className="btn btn-outline text-[11px] py-1 px-2 flex items-center gap-1 border-dashed"
              >
                <Plus size={11} />
                Plan Topic
              </button>
              <button
                onClick={() => onBatchPlanMonth(month)}
                className="btn btn-primary text-[11px] py-1 px-2.5 flex items-center gap-1"
                title="1-click batch plan weekly or daily strategy"
              >
                <Sparkles size={11} />
                Batch Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {visibleTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onEditTopic(topic)}
                className="p-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer group flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {topic.title}
                  </p>
                </div>

                {/* Cadence & Date Span */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium capitalize">
                      {topic.cadence || 'custom'}
                    </span>
                    <span className="text-muted-foreground font-mono tabular-nums text-[9px]">
                      {topic.startDate ? `${topic.startDate.slice(5)}` : ''}
                      {topic.endDate && topic.endDate !== topic.startDate ? `→${topic.endDate.slice(5)}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {topic.account === 'company' ? (
                      <Building2 size={11} className="text-muted-foreground" title="Company Page" />
                    ) : (
                      <User size={11} className="text-muted-foreground" title="Personal Profile" />
                    )}
                    <StatusBadge status={topic.downstreamPostStatus || topic.status} size="sm" />
                  </div>
                </div>

                {topic.status === 'planned' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartGeneration(topic.id);
                    }}
                    className="w-full mt-0.5 btn btn-outline text-[10px] py-1 flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Sparkles size={11} />
                    Generate AI Draft
                  </button>
                )}
              </div>
            ))}

            {overflowCount > 0 && (
              <button
                type="button"
                onClick={() => onOpenMonthModal && onOpenMonthModal(month)}
                className="mt-0.5 w-full p-2.5 rounded-lg border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary text-primary transition-all flex items-center justify-between group/more cursor-pointer text-left shadow-2xs"
                title={`Click to view all ${topics.length} topics in ${month.name}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Layers size={13} className="text-primary shrink-0" />
                  <span className="text-xs font-bold truncate">
                    +{overflowCount} more {overflowCount === 1 ? 'topic' : 'topics'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-primary flex items-center gap-1 shrink-0 group-hover/more:translate-x-0.5 transition-transform">
                  View in modal →
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="px-3 py-2 border-t border-border bg-card/50 flex items-center justify-between relative">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-[11px] font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            <Plus size={12} />
            Add Topic
            <ChevronDown size={11} />
          </button>

          {isMenuOpen && (
            <div className="absolute left-0 bottom-full mb-1 z-30 w-36 bg-card border border-border rounded-lg shadow-xl py-1 text-xs">
              <button
                type="button"
                onClick={() => handleSelectCadence('weekly')}
                className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-foreground flex items-center gap-1.5"
              >
                <Calendar size={12} className="text-primary" />
                Weekly Topic
              </button>
              <button
                type="button"
                onClick={() => handleSelectCadence('daily')}
                className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-foreground flex items-center gap-1.5"
              >
                <Layers size={12} className="text-accent" />
                Daily Topic
              </button>
              <button
                type="button"
                onClick={() => handleSelectCadence('custom')}
                className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-foreground flex items-center gap-1.5"
              >
                <Calendar size={12} className="text-emerald-500" />
                Custom Range
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onBatchPlanMonth(month)}
          className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
          title="Batch generate weekly/daily schedule for this month"
        >
          <Sparkles size={10} className="text-primary" />
          Batch Plan
        </button>
      </div>
    </div>
  );
}
