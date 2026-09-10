'use client';

import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Calendar,
  AlertCircle,
  Plus,
  Sparkles,
  Building2,
  User,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';

const MONTHS_2026 = [
  { key: '2026-01', name: 'January 2026', short: 'Jan' },
  { key: '2026-02', name: 'February 2026', short: 'Feb' },
  { key: '2026-03', name: 'March 2026', short: 'Mar' },
  { key: '2026-04', name: 'April 2026', short: 'Apr' },
  { key: '2026-05', name: 'May 2026', short: 'May' },
  { key: '2026-06', name: 'June 2026', short: 'Jun' },
  { key: '2026-07', name: 'July 2026', short: 'Jul' },
  { key: '2026-08', name: 'August 2026', short: 'Aug' },
  { key: '2026-09', name: 'September 2026', short: 'Sep' },
  { key: '2026-10', name: 'October 2026', short: 'Oct' },
  { key: '2026-11', name: 'November 2026', short: 'Nov' },
  { key: '2026-12', name: 'December 2026', short: 'Dec' },
];

export default function TopicsYearView({
  topics = [],
  onEditTopic,
  onAddTopicForMonth,
  onStartGeneration,
}) {
  // Group topics by month YYYY-MM
  const topicsByMonth = {};
  MONTHS_2026.forEach((m) => {
    topicsByMonth[m.key] = [];
  });

  topics.forEach((t) => {
    const monthKey = t.publicationDate.slice(0, 7);
    if (topicsByMonth[monthKey]) {
      topicsByMonth[monthKey].push(t);
    }
  });

  const totalPlanned = topics.length;
  const coveredMonths = Object.values(topicsByMonth).filter((list) => list.length > 0).length;
  const gapMonths = 12 - coveredMonths;

  return (
    <div className="flex flex-col gap-6">
      {/* Annual Health Bar */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">2026 Annual Editorial Roadmap</h2>
            <p className="text-xs text-muted-foreground">
              {coveredMonths} of 12 months scheduled · {gapMonths > 0 ? `${gapMonths} coverage gaps detected` : 'Full 12-month coverage achieved'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-medium">Covered ({coveredMonths})</span>
          </div>
          {gapMonths > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-amber-600 font-semibold">Gaps ({gapMonths})</span>
            </div>
          )}
        </div>
      </div>

      {/* 12-Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {MONTHS_2026.map((month) => {
          const monthTopics = topicsByMonth[month.key] || [];
          const count = monthTopics.length;
          const isGap = count === 0;

          return (
            <div
              key={month.key}
              className={`card flex flex-col overflow-hidden transition-all duration-150 ${
                isGap ? 'border-dashed border-amber-400/50 bg-amber-50/10' : 'hover:border-primary/40'
              }`}
            >
              {/* Month Card Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{month.name}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
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

              {/* Month Card Content */}
              <div className="p-3 flex-1 flex flex-col gap-2 min-h-[160px]">
                {isGap ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-border rounded-lg bg-muted/10">
                    <AlertCircle size={20} className="text-amber-500 mb-1.5 opacity-80" />
                    <p className="text-xs font-semibold text-foreground">Content Gap</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[170px]">
                      No topics planned for {month.short} yet
                    </p>
                    <button
                      onClick={() => onAddTopicForMonth(`${month.key}-15`)}
                      className="mt-3 btn btn-outline text-[11px] py-1 px-2.5 flex items-center gap-1 border-dashed"
                    >
                      <Plus size={12} />
                      Plan Topic
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {monthTopics.map((topic) => (
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

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-muted text-foreground font-medium">
                              {topic.seriesName}
                            </span>
                            <span className="flex items-center gap-0.5 text-muted-foreground">
                              {topic.account === 'company' ? (
                                <Building2 size={10} title="Company Page" />
                              ) : (
                                <User size={10} title="Personal Profile" />
                              )}
                            </span>
                          </div>

                          <StatusBadge status={topic.downstreamPostStatus || topic.status} size="sm" />
                        </div>

                        {/* Downstream action */}
                        {topic.status === 'planned' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartGeneration(topic.id);
                            }}
                            className="w-full mt-1 btn btn-outline text-[10px] py-1 flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <Sparkles size={11} />
                            Generate AI Draft
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Month Card Footer */}
              {!isGap && (
                <div className="px-3 py-2 border-t border-border bg-card/50 flex items-center justify-center">
                  <button
                    onClick={() => onAddTopicForMonth(`${month.key}-15`)}
                    className="text-[11px] font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <Plus size={11} />
                    Add topic for {month.short}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
