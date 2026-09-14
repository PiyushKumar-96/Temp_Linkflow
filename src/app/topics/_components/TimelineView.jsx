'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import { Pencil, Plus } from 'lucide-react';
import MonthStepperHeader, {
  MONTH_DATA,
  computeMonthWeeks,
  parseDate,
  formatTopicDate,
} from './MonthStepperHeader';

function getTitleLengthCategory(title) {
  const len = (title || '').length;
  if (len <= 28) return 'short';
  return 'long';
}

export default function TimelineView({
  topics = [],
  currentMonthIndex = 8, // September default (0-indexed 8)
  onMonthChange,
  selectedTopicId = null,
  onSelectTopic,
  onPlanWeek,
}) {
  const monthInfo = MONTH_DATA[currentMonthIndex] || MONTH_DATA[8];
  const year = 2026;

  const gridRef = useRef(null);
  const [cols, setCols] = useState(4);

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w < 600) setCols(2);
      else if (w < 900) setCols(3);
      else setCols(4);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const weeks = computeMonthWeeks(year, monthInfo.index, monthInfo.days);

  // Topics for this month
  const monthTopics = topics.filter((t) => {
    const start = parseDate(t.startDate || t.publicationDate);
    const end = parseDate(t.endDate || t.startDate || t.publicationDate);
    if (!start) return false;
    const startMonth = start.getUTCFullYear() === 2026 ? start.getUTCMonth() : -1;
    const endMonth = end ? (end.getUTCFullYear() === 2026 ? end.getUTCMonth() : 11) : startMonth;
    return monthInfo.index >= startMonth && monthInfo.index <= endMonth;
  });

  // Sort topics by start date
  const sortedTopics = [...monthTopics].sort((a, b) => {
    const startA = a.startDate || a.publicationDate || '2026-01-01';
    const startB = b.startDate || b.publicationDate || '2026-01-01';
    return startA.localeCompare(startB);
  });

  // Find which weeks have topics
  const weeksWithOccupancy = weeks.map((wk) => {
    const wkStart = parseDate(wk.startDateStr);
    const wkEnd = parseDate(wk.endDateStr);
    const matchingTopics = sortedTopics.filter((t) => {
      const tStart = parseDate(t.startDate || t.publicationDate);
      const tEnd = parseDate(t.endDate || t.startDate || t.publicationDate);
      return tStart <= wkEnd && tEnd >= wkStart;
    });
    return {
      ...wk,
      topics: matchingTopics,
      hasTopics: matchingTopics.length > 0,
    };
  });

  // Count empty weeks (open slots) in chronological order
  const openWeeks = weeksWithOccupancy.filter((w) => !w.hasTopics);
  // Show only the next open week in the month, in date order (earliest open week)
  const nextOpenWeek = openWeeks.length > 0 ? openWeeks[0] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Month Stepper Header */}
      <MonthStepperHeader
        currentMonthIndex={currentMonthIndex}
        onMonthChange={onMonthChange}
        topics={topics}
      />

      {/* Wall of Tiles (Responsive Grid: Auto-fill 220px) */}
      <div ref={gridRef} className="tpc-tile-wall">
        {/* Render all planned topic tiles */}
        {sortedTopics.map((topic, index) => {
          const isSelected = selectedTopicId === topic.id;
          const formattedDate = formatTopicDate(topic.startDate, topic.endDate);
          const lenCategory = getTitleLengthCategory(topic.title);
          // Rotation formula derived from live column count (cols): zero horizontal/vertical/diagonal matches
          const r = Math.floor(index / cols);
          const c = index % cols;
          const colorNumber = ((r * 2 + c) % 4) + 1;
          const dynamicColor = `topic-${colorNumber}`;

          return (
            <div
              key={topic.id}
              className="tpc-topic-tile"
              data-color={dynamicColor}
              data-selected={isSelected ? 'true' : 'false'}
              onClick={() => onSelectTopic(topic)}
              title={`Click to edit: ${topic.title}`}
            >
              {/* Tile Head: Clean container */}
              <div className="tpc-tile-head" />

              {/* Tile Body: Title filling the tile with step-down font sizing */}
              <div className="tpc-tile-body">
                <span
                  className="tpc-tile-title"
                  data-len={lenCategory}
                >
                  {topic.title}
                </span>
              </div>

              {/* Tile Foot: Formatted date bottom-left and Edit icon bottom-right */}
              <div className="tpc-tile-foot">
                <span className="tpc-tile-date">{formattedDate}</span>
                <Pencil size={13} className="tpc-tile-edit-icon" />
              </div>
            </div>
          );
        })}

        {/* Plan tile is always present as the last tile in every month */}
        {nextOpenWeek ? (
          <div
            key={`open-${nextOpenWeek.weekNum}`}
            className="tpc-empty-week-tile"
            onClick={() => onPlanWeek(nextOpenWeek)}
            title={`Plan topic for ${nextOpenWeek.label} (${nextOpenWeek.displayDateRange})`}
          >
            <div className="tpc-empty-week-head">
              <span className="tpc-empty-week-badge">{nextOpenWeek.label}</span>
              <span className="text-[10px] text-muted-foreground font-medium">Open week</span>
            </div>

            <div className="tpc-empty-week-body">
              <Plus size={20} className="tpc-empty-week-plus-icon" />
              <span className="tpc-empty-week-action-text">Plan topic</span>
            </div>

            <div className="tpc-empty-week-foot">
              <span className="tpc-empty-week-dates">{nextOpenWeek.displayDateRange}</span>
            </div>
          </div>
        ) : (
          <div
            key="plan-custom-tile"
            className="tpc-empty-week-tile"
            onClick={() => onPlanWeek(null)}
            title={`Plan topic for ${monthInfo.name}`}
          >
            <div className="tpc-empty-week-head">
              <span className="tpc-empty-week-badge">{monthInfo.name}</span>
              <span className="text-[10px] text-muted-foreground font-medium">Add topic</span>
            </div>

            <div className="tpc-empty-week-body">
              <Plus size={20} className="tpc-empty-week-plus-icon" />
              <span className="tpc-empty-week-action-text">Plan topic</span>
            </div>

            <div className="tpc-empty-week-foot">
              <span className="tpc-empty-week-dates">Custom range</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
