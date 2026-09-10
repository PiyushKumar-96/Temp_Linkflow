import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { MONTHS_2026 } from '../_model/week-ranges';
import MonthCard from './MonthCard';
import MonthTopicsModal from './MonthTopicsModal';

export default function TopicsYearView({
  topics = [],
  onEditTopic,
  onAddTopic,
  onBatchPlanMonth,
  onStartGeneration,
}) {
  const [activeMonthForModal, setActiveMonthForModal] = useState(null);

  // Group topics by month YYYY-MM
  const topicsByMonth = {};
  MONTHS_2026.forEach((m) => {
    topicsByMonth[m.key] = [];
  });

  topics.forEach((t) => {
    const monthKey = (t.startDate || t.publicationDate || '').slice(0, 7);
    if (topicsByMonth[monthKey]) {
      topicsByMonth[monthKey].push(t);
    }
  });

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
        {MONTHS_2026.map((month) => (
          <MonthCard
            key={month.key}
            month={month}
            topics={topicsByMonth[month.key] || []}
            onEditTopic={onEditTopic}
            onAddTopic={onAddTopic}
            onBatchPlanMonth={onBatchPlanMonth}
            onStartGeneration={onStartGeneration}
            onOpenMonthModal={(m) => setActiveMonthForModal(m)}
          />
        ))}
      </div>

      {/* Month Topics Modal Dialog */}
      <MonthTopicsModal
        isOpen={Boolean(activeMonthForModal)}
        onClose={() => setActiveMonthForModal(null)}
        month={activeMonthForModal}
        topics={activeMonthForModal ? topicsByMonth[activeMonthForModal.key] || [] : []}
        onEditTopic={onEditTopic}
        onAddTopic={onAddTopic}
        onBatchPlanMonth={onBatchPlanMonth}
        onStartGeneration={onStartGeneration}
      />
    </div>
  );
}
