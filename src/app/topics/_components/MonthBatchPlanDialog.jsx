'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Check } from 'lucide-react';
import { computeWeekRanges } from '../_model/week-ranges';
import BatchSlotsList from './BatchSlotsList';

const DEFAULT_SERIES = [
  { id: 'series-1', name: 'Thought Leadership' },
  { id: 'series-2', name: 'Case Studies' },
  { id: 'series-3', name: 'Engineering Culture' },
  { id: 'series-4', name: 'Industry Insights' },
];

export default function MonthBatchPlanDialog({
  isOpen,
  onClose,
  monthKey = '2026-01',
  monthName = 'January 2026',
  onConfirm,
  isSubmitting = false,
}) {
  const [cadence, setCadence] = useState('weekly');
  const [seriesId, setSeriesId] = useState('series-1');
  const [account, setAccount] = useState('personal');
  const [themePrefix, setThemePrefix] = useState('');
  const [slots, setSlots] = useState([]);

  // Reset/populate slots when dialog opens or cadence/monthKey changes
  useEffect(() => {
    if (!isOpen) return;
    if (cadence === 'weekly') {
      const ranges = computeWeekRanges(monthKey);
      setSlots(
        ranges.map((w, idx) => ({
          id: `slot-${idx}`,
          label: w.label,
          startDate: w.startDate,
          endDate: w.endDate,
          seriesId: 'series-1',
          title: '',
        }))
      );
    } else {
      const days = [5, 10, 15, 20, 25];
      setSlots(
        days.map((day, idx) => {
          const dateStr = `${monthKey}-${String(day).padStart(2, '0')}`;
          return {
            id: `slot-${idx}`,
            label: `Day ${day}`,
            startDate: dateStr,
            endDate: dateStr,
            seriesId: 'series-1',
            title: '',
          };
        })
      );
    }
  }, [isOpen, cadence, monthKey]);

  if (!isOpen) return null;

  const handleUpdateSlot = (id, field, value) => {
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (field === 'startDate' && cadence === 'daily') {
          return { ...s, startDate: value, endDate: value };
        }
        return { ...s, [field]: value };
      })
    );
  };

  const handleRemoveSlot = (id) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddSlot = () => {
    const nextIdx = slots.length + 1;
    const defaultDate = `${monthKey}-01`;
    setSlots((prev) => [
      ...prev,
      {
        id: `slot-${Date.now()}`,
        label: cadence === 'weekly' ? `Week ${nextIdx}` : `Day Slot ${nextIdx}`,
        startDate: defaultDate,
        endDate: defaultDate,
        seriesId,
        title: '',
      },
    ]);
  };

  const handleGenerate = () => {
    const preparedSlots = slots.map((s) => {
      const targetSeriesId = s.seriesId || seriesId;
      const matchedSeries = DEFAULT_SERIES.find((item) => item.id === targetSeriesId) || DEFAULT_SERIES[0];

      const topicTitle = s.title?.trim()
        ? s.title.trim()
        : themePrefix.trim()
        ? `${themePrefix}: ${s.label} Focus`
        : `${matchedSeries.name} ${s.label} Editorial Angle`;

      return {
        title: topicTitle,
        seriesId: matchedSeries.id,
        seriesName: matchedSeries.name,
        account,
        audience: 'B2B SaaS Founders',
        cadence,
        startDate: s.startDate,
        endDate: s.endDate || s.startDate,
        publicationDate: s.startDate,
        brief: `Batch planned ${cadence} topic for ${s.label} of ${monthName} (${s.startDate} to ${s.endDate || s.startDate}).`,
      };
    });

    onConfirm(preparedSlots);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white">
              <Calendar size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Plan Month: {monthName}</h2>
              <p className="text-[11px] text-muted-foreground">
                Define weekly/daily topic angles, categories, and custom dates
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Cadence Selection */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Monthly Cadence Strategy</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCadence('weekly')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  cadence === 'weekly'
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">Weekly Cadence</span>
                  {cadence === 'weekly' && <Check size={13} />}
                </div>
                <p className="text-[10px] opacity-80 mt-0.5">{slots.length} weekly topic slots</p>
              </button>

              <button
                type="button"
                onClick={() => setCadence('daily')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  cadence === 'daily'
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">Daily Cadence</span>
                  {cadence === 'daily' && <Check size={13} />}
                </div>
                <p className="text-[10px] opacity-80 mt-0.5">{slots.length} anchor daily slots</p>
              </button>
            </div>
          </div>

          {/* Theme Prefix & Target Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Default Monthly Theme (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Q1 Growth Experiments"
                value={themePrefix}
                onChange={(e) => setThemePrefix(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Target Account</label>
              <select value={account} onChange={(e) => setAccount(e.target.value)} className="input w-full text-xs bg-input">
                <option value="personal">Personal Profile</option>
                <option value="company">Company Page</option>
              </select>
            </div>
          </div>

          {/* Adjustable Slots List */}
          <div className="bg-muted/20 p-3.5 rounded-lg border border-border">
            <BatchSlotsList
              slots={slots}
              cadence={cadence}
              seriesList={DEFAULT_SERIES}
              defaultSeriesId={seriesId}
              themePrefix={themePrefix}
              onUpdateSlot={handleUpdateSlot}
              onRemoveSlot={handleRemoveSlot}
              onAddSlot={handleAddSlot}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-card">
          <button type="button" onClick={onClose} className="btn btn-outline text-xs px-3.5 py-1.5" disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            className="btn btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
            disabled={isSubmitting || slots.length === 0}
          >
            <Sparkles size={13} />
            {isSubmitting ? 'Planning...' : `Generate ${slots.length} Topics`}
          </button>
        </div>
      </div>
    </div>
  );
}
