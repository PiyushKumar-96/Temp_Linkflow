'use client';

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MONTH_DATA = [
  { index: 0, numeral: '01', name: 'Jan', fullName: 'January 2026', monthKey: '2026-01', days: 31 },
  { index: 1, numeral: '02', name: 'Feb', fullName: 'February 2026', monthKey: '2026-02', days: 28 },
  { index: 2, numeral: '03', name: 'Mar', fullName: 'March 2026', monthKey: '2026-03', days: 31 },
  { index: 3, numeral: '04', name: 'Apr', fullName: 'April 2026', monthKey: '2026-04', days: 30 },
  { index: 4, numeral: '05', name: 'May', fullName: 'May 2026', monthKey: '2026-05', days: 31 },
  { index: 5, numeral: '06', name: 'Jun', fullName: 'June 2026', monthKey: '2026-06', days: 30 },
  { index: 6, numeral: '07', name: 'Jul', fullName: 'July 2026', monthKey: '2026-07', days: 31 },
  { index: 7, numeral: '08', name: 'Aug', fullName: 'August 2026', monthKey: '2026-08', days: 31 },
  { index: 8, numeral: '09', name: 'Sep', fullName: 'September 2026', monthKey: '2026-09', days: 30 },
  { index: 9, numeral: '10', name: 'Oct', fullName: 'October 2026', monthKey: '2026-10', days: 31 },
  { index: 10, numeral: '11', name: 'Nov', fullName: 'November 2026', monthKey: '2026-11', days: 30 },
  { index: 11, numeral: '12', name: 'Dec', fullName: 'December 2026', monthKey: '2026-12', days: 31 },
];

export const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDate(dateStr) {
  if (!dateStr) return null;
  const cleanStr = String(dateStr).split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length < 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(Date.UTC(y, m, d));
}

export function formatTopicDate(startDateStr, endDateStr) {
  const start = parseDate(startDateStr || '2026-01-01');
  const end = parseDate(endDateStr || startDateStr || '2026-01-01');
  if (!start) return '';

  const startDay = String(start.getUTCDate()).padStart(2, '0');
  const startMonth = SHORT_MONTHS[start.getUTCMonth()];

  if (!end) {
    return `${startDay} ${startMonth}`;
  }

  const endDay = String(end.getUTCDate()).padStart(2, '0');
  const endMonth = SHORT_MONTHS[end.getUTCMonth()];

  // Check if it spans the full month (e.g. 01 to 30/31)
  const isMonthStart = start.getUTCDate() === 1;
  const lastDayOfMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate();
  const isMonthEnd = end.getUTCDate() === lastDayOfMonth;

  if (isMonthStart && isMonthEnd && startMonth === endMonth) {
    return startMonth;
  }

  if (startMonth === endMonth) {
    return `${startDay}–${endDay} ${startMonth}`;
  }

  return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

export function computeMonthWeeks(year, monthIdx, daysInMonth) {
  const weeks = [];
  let currentStart = 1;
  let weekNum = 1;

  while (currentStart <= daysInMonth) {
    const currentEnd = Math.min(daysInMonth, currentStart + 6);
    const mStr = String(monthIdx + 1).padStart(2, '0');
    const sStr = String(currentStart).padStart(2, '0');
    const eStr = String(currentEnd).padStart(2, '0');

    weeks.push({
      weekNum,
      label: `Week ${weekNum}`,
      startDateStr: `${year}-${mStr}-${sStr}`,
      endDateStr: `${year}-${mStr}-${eStr}`,
      startDay: currentStart,
      endDay: currentEnd,
      displayDateRange: `${sStr}–${eStr} ${SHORT_MONTHS[monthIdx]}`,
    });

    currentStart += 7;
    weekNum++;
  }

  return weeks;
}

export default function MonthStepperHeader({
  currentMonthIndex = 8,
  onMonthChange,
  topics = [],
}) {
  const monthInfo = MONTH_DATA[currentMonthIndex] || MONTH_DATA[8];
  const year = 2026;
  const todayMonthIndex = 8; // September 2026 is today in app baseline
  const isAwayFromToday = currentMonthIndex !== todayMonthIndex;

  // Keyboard navigation left/right or up/down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onMonthChange((currentMonthIndex + 11) % 12);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        onMonthChange((currentMonthIndex + 1) % 12);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMonthIndex, onMonthChange]);

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

  // Find which weeks have topics
  const weeksWithOccupancy = weeks.map((wk) => {
    const wkStart = parseDate(wk.startDateStr);
    const wkEnd = parseDate(wk.endDateStr);
    const matchingTopics = monthTopics.filter((t) => {
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

  const openWeeks = weeksWithOccupancy.filter((w) => !w.hasTopics);

  const handlePrev = () => onMonthChange((currentMonthIndex + 11) % 12);
  const handleNext = () => onMonthChange((currentMonthIndex + 1) % 12);
  const handleGoToday = () => onMonthChange(todayMonthIndex);

  return (
    <div className="tpc-month-stepper-head">
      <div className="tpc-month-title-wrap">
        <h2 className="tpc-month-h2">{monthInfo.fullName}</h2>

        {/* Unboxed Chevrons Navigation placed to the right, matched with content calendar */}
        <div className="tpc-month-nav-group">
          <button
            type="button"
            onClick={handlePrev}
            className="tpc-month-nav-btn"
            title="Previous month (Arrow Left)"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="tpc-month-nav-btn"
            title="Next month (Arrow Right)"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {isAwayFromToday && (
          <button
            type="button"
            onClick={handleGoToday}
            className="tpc-today-jump-btn"
            title="Return to current month (September)"
            aria-label="Jump to today"
          >
            Today
          </button>
        )}
      </div>

      {/* Coverage statement: weeks read as coverage, not capacity */}
      <div className="tpc-month-meta-wrap">
        <div className="tpc-month-coverage-text">
          <strong>
            {monthTopics.length} {monthTopics.length === 1 ? 'topic' : 'topics'} planned
          </strong>{' '}
          &middot;{' '}
          {monthTopics.length > 0 && openWeeks.length === 0
            ? 'every week covered'
            : `${openWeeks.length} ${openWeeks.length === 1 ? 'week' : 'weeks'} open`}
        </div>
      </div>
    </div>
  );
}
