'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  Plus,
  Search,
  Layers,
  User,
  Building2,
  Tag,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export default function MonthTopicsModal({
  isOpen,
  onClose,
  month,
  topics = [],
  onEditTopic,
  onAddTopic,
  onBatchPlanMonth,
  onStartGeneration,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cadenceFilter, setCadenceFilter] = useState('all');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset filters on open/close
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setCadenceFilter('all');
    }
  }, [isOpen, month?.key]);

  // Cadence counts for this month
  const counts = useMemo(() => {
    let weekly = 0;
    let daily = 0;
    let custom = 0;
    topics.forEach((t) => {
      if (t.cadence === 'weekly') weekly++;
      else if (t.cadence === 'daily') daily++;
      else custom++;
    });
    return { total: topics.length, weekly, daily, custom };
  }, [topics]);

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      if (cadenceFilter !== 'all') {
        const topicCadence = topic.cadence || 'custom';
        if (topicCadence !== cadenceFilter) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const titleMatch = (topic.title || '').toLowerCase().includes(q);
        const seriesMatch = (topic.seriesName || '').toLowerCase().includes(q);
        const briefMatch = (topic.brief || '').toLowerCase().includes(q);
        if (!titleMatch && !seriesMatch && !briefMatch) return false;
      }
      return true;
    });
  }, [topics, cadenceFilter, searchTerm]);

  if (!isOpen || !month) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-muted/40 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <Calendar size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base font-bold text-foreground">
                  {month.name}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {topics.length} {topics.length === 1 ? 'Topic' : 'Topics Planned'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>Editorial Roadmap</span>
                <span>·</span>
                <span>{counts.weekly} Weekly</span>
                <span>·</span>
                <span>{counts.daily} Daily</span>
                {counts.custom > 0 && (
                  <>
                    <span>·</span>
                    <span>{counts.custom} Custom</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAddTopic({ monthDate: `${month.key}-15`, cadence: 'weekly' })}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
            >
              <Plus size={13} />
              <span>Add Topic</span>
            </button>
            <button
              type="button"
              onClick={() => onBatchPlanMonth(month)}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 font-semibold cursor-pointer shadow-2xs"
            >
              <Sparkles size={13} />
              <span>Batch Plan</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1 cursor-pointer"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter / Search Toolbar */}
        {topics.length > 0 && (
          <div className="px-5 py-2.5 border-b border-border bg-card flex items-center justify-between gap-3 flex-wrap text-xs">
            {/* Cadence Pills */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setCadenceFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  cadenceFilter === 'all'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({topics.length})
              </button>
              {counts.weekly > 0 && (
                <button
                  type="button"
                  onClick={() => setCadenceFilter('weekly')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    cadenceFilter === 'weekly'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Weekly ({counts.weekly})
                </button>
              )}
              {counts.daily > 0 && (
                <button
                  type="button"
                  onClick={() => setCadenceFilter('daily')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    cadenceFilter === 'daily'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Daily ({counts.daily})
                </button>
              )}
              {counts.custom > 0 && (
                <button
                  type="button"
                  onClick={() => setCadenceFilter('custom')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    cadenceFilter === 'custom'
                      ? 'bg-background text-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Custom ({counts.custom})
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] max-w-xs flex-1">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics in this month..."
                className="w-full bg-muted/40 border border-border/70 rounded-lg pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:bg-background transition-colors"
              />
            </div>
          </div>
        )}

        {/* Topics List Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin bg-muted/10 space-y-3">
          {topics.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-border rounded-xl bg-card">
              <Calendar size={32} className="text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-foreground">No Topics Planned</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                There are currently no topics scheduled for {month.name}. Add your first topic or use batch plan.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => onAddTopic({ monthDate: `${month.key}-15`, cadence: 'weekly' })}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Plus size={13} />
                  Plan Topic
                </button>
                <button
                  type="button"
                  onClick={() => onBatchPlanMonth(month)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Sparkles size={13} />
                  Batch Plan
                </button>
              </div>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground bg-card border border-border rounded-xl">
              <Filter size={24} className="mx-auto mb-1.5 opacity-40" />
              <p className="font-semibold text-foreground">No matching topics found</p>
              <p className="mt-0.5">Try adjusting your search query or cadence filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCadenceFilter('all');
                }}
                className="btn-secondary text-xs mt-3 py-1 px-3 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredTopics.map((topic, idx) => (
              <div
                key={topic.id || idx}
                onClick={() => onEditTopic(topic)}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary capitalize">
                        {topic.cadence || 'custom'}
                      </span>
                      {topic.seriesName && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-foreground flex items-center gap-1 border border-border/60">
                          <Tag size={10} className="text-muted-foreground" />
                          {topic.seriesName}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                        {topic.startDate ? `${topic.startDate}` : ''}
                        {topic.endDate && topic.endDate !== topic.startDate ? ` → ${topic.endDate}` : ''}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {topic.title}
                    </h4>

                    {topic.brief && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {topic.brief}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={topic.downstreamPostStatus || topic.status} size="sm" />
                    <ChevronRight size={15} className="text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Footer bar with details and generation button */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {topic.account === 'company' ? (
                        <>
                          <Building2 size={12} className="text-muted-foreground" />
                          <span>Company Page</span>
                        </>
                      ) : (
                        <>
                          <User size={12} className="text-muted-foreground" />
                          <span>Personal Profile</span>
                        </>
                      )}
                    </div>
                    {topic.audience && (
                      <span className="hidden sm:inline-block text-muted-foreground/70">
                        Audience: {topic.audience}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {topic.status === 'planned' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartGeneration(topic.id);
                        }}
                        className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 hover:text-primary hover:border-primary/40 font-semibold cursor-pointer shadow-2xs"
                      >
                        <Sparkles size={11} className="text-primary" />
                        <span>Generate AI Draft</span>
                      </button>
                    )}
                    <span className="text-[11px] text-primary font-semibold group-hover:underline">
                      Edit
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-border bg-card flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Showing {filteredTopics.length} of {topics.length} topics for {month.name}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary text-xs py-1.5 px-4 font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
