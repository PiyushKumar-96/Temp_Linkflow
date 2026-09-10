'use client';

import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { computeWeekRanges } from '../_model/week-ranges';
import TopicWeeklySelector from './TopicWeeklySelector';

export default function TopicDateRangePicker({
  cadence = 'custom',
  startDate = '',
  endDate = '',
  onChange,
  error = null,
}) {
  const currentMonthKey = useMemo(() => {
    if (startDate && startDate.length >= 7) {
      return startDate.slice(0, 7);
    }
    return '2026-01';
  }, [startDate]);

  const weekRanges = useMemo(() => computeWeekRanges(currentMonthKey), [currentMonthKey]);

  const dayDuration = useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e - s;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : null;
  }, [startDate, endDate]);

  const handleCadenceChange = (nextCadence) => {
    if (nextCadence === 'daily') {
      const date = startDate || new Date().toISOString().split('T')[0];
      onChange({ cadence: 'daily', startDate: date, endDate: date, publicationDate: date });
    } else if (nextCadence === 'weekly') {
      const firstWeek = weekRanges[0];
      onChange({
        cadence: 'weekly',
        startDate: firstWeek.startDate,
        endDate: firstWeek.endDate,
        publicationDate: firstWeek.startDate,
      });
    } else {
      onChange({
        cadence: 'custom',
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || startDate || new Date().toISOString().split('T')[0],
        publicationDate: startDate || new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleMonthChange = (monthKey) => {
    const ranges = computeWeekRanges(monthKey);
    const w1 = ranges[0];
    onChange({
      cadence: 'weekly',
      startDate: w1.startDate,
      endDate: w1.endDate,
      publicationDate: w1.startDate,
    });
  };

  const handleSelectWeek = (week) => {
    onChange({
      cadence: 'weekly',
      startDate: week.startDate,
      endDate: week.endDate,
      publicationDate: week.startDate,
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/80 bg-muted/20 p-3.5">
      {/* Cadence Tabs */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Calendar size={13} className="text-primary" />
          Planning Cadence
        </label>
        <div className="flex items-center bg-card border border-border rounded-lg p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => handleCadenceChange('weekly')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              cadence === 'weekly'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => handleCadenceChange('daily')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              cadence === 'daily'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => handleCadenceChange('custom')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              cadence === 'custom'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Weekly Mode */}
      {cadence === 'weekly' && (
        <TopicWeeklySelector
          startDate={startDate}
          endDate={endDate}
          currentMonthKey={currentMonthKey}
          onMonthChange={handleMonthChange}
          onSelectWeek={handleSelectWeek}
        />
      )}

      {/* Daily Mode */}
      {cadence === 'daily' && (
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            Target Day <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              onChange({
                cadence: 'daily',
                startDate: e.target.value,
                endDate: e.target.value,
                publicationDate: e.target.value,
              })
            }
            className="input w-full text-xs bg-card"
          />
        </div>
      )}

      {/* Custom Date Range Mode */}
      {cadence === 'custom' && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Start Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  onChange({
                    cadence: 'custom',
                    startDate: e.target.value,
                    endDate: endDate || e.target.value,
                    publicationDate: e.target.value,
                  })
                }
                className="input w-full text-xs bg-card"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                End Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  onChange({
                    cadence: 'custom',
                    startDate: startDate || e.target.value,
                    endDate: e.target.value,
                    publicationDate: startDate || e.target.value,
                  })
                }
                className="input w-full text-xs bg-card"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-card/60 px-2.5 py-1.5 rounded-md border border-border/50">
            <span>Range Duration:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {dayDuration ? `${dayDuration} days editorial window` : 'Please pick valid dates'}
            </span>
          </div>
        </div>
      )}

      {error && <span className="text-[10px] text-destructive mt-0.5">{error}</span>}
    </div>
  );
}
