'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, Globe, Sparkles, Check, X, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getScheduleSettings,
  getNextAvailableSlot,
  getSequentialScheduleSlots,
  isSlotFromSettings,
} from '@/lib/scheduling';

/**
 * Shared Schedule Control Component
 * Unifies scheduling across Post Composer, AI Generator, and Approval detail.
 * Reads configured weekly windows from Settings.
 */
export default function ScheduleControl({
  date = '',
  time = '09:00',
  onChange,
  onClose,
  isDrawer = false,
}) {
  const [currentDate, setCurrentDate] = useState(date || '');
  const [currentTime, setCurrentTime] = useState(time || '09:00');

  const { timezone } = useMemo(() => getScheduleSettings(), []);
  const upcomingSlots = useMemo(() => getSequentialScheduleSlots(3), []);

  useEffect(() => {
    if (date) setCurrentDate(date);
    if (time) setCurrentTime(time);
  }, [date, time]);

  const matchesSettings = useMemo(() => {
    return isSlotFromSettings(currentDate, currentTime);
  }, [currentDate, currentTime]);

  const handleApplySlot = (slotDate, slotTime) => {
    setCurrentDate(slotDate);
    setCurrentTime(slotTime);
    if (onChange) {
      onChange({
        date: slotDate,
        time: slotTime,
        isSettingsSlot: true,
      });
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    if (onChange) {
      onChange({
        date: newDate,
        time: currentTime,
        isSettingsSlot: isSlotFromSettings(newDate, currentTime),
      });
    }
  };

  const handleTimeChange = (newTime) => {
    setCurrentTime(newTime);
    if (onChange) {
      onChange({
        date: currentDate,
        time: newTime,
        isSettingsSlot: isSlotFromSettings(currentDate, newTime),
      });
    }
  };

  const handlePickNext = () => {
    const nextSlot = getNextAvailableSlot();
    handleApplySlot(nextSlot.date, nextSlot.time);
  };

  const content = (
    <div className="flex flex-col gap-4">
      {/* Timezone & Origin Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
        <span className="flex items-center gap-1.5">
          <Globe size={13} className="text-primary" />
          <span>{timezone}</span>
        </span>
        <Link
          to="/settings"
          className="text-[11px] text-primary hover:underline flex items-center gap-1"
          onClick={onClose}
        >
          <SettingsIcon size={11} />
          <span>Settings Schedule</span>
        </Link>
      </div>

      {/* Settings Slot Match Indicator */}
      <div
        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
          matchesSettings
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
            : 'bg-amber-50/70 border-amber-200 text-amber-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              matchesSettings ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="font-semibold">
            {matchesSettings ? 'Aligned with Weekly Schedule Window' : 'Manual Slot Override'}
          </span>
        </div>
        <button
          type="button"
          onClick={handlePickNext}
          className="text-[11px] font-semibold underline hover:opacity-80 shrink-0"
        >
          Snap to Next Window
        </button>
      </div>

      {/* Suggested Slots from Settings */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
          Recommended Settings Slots
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {upcomingSlots.map((slot) => {
            const isSelected = slot.date === currentDate && slot.time === currentTime;
            return (
              <button
                key={`${slot.date}-${slot.time}`}
                type="button"
                onClick={() => handleApplySlot(slot.date, slot.time)}
                className={`flex flex-col p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted text-foreground'
                }`}
              >
                <span className="text-xs font-bold">{slot.day}</span>
                <span className="text-[11px] text-muted-foreground">
                  {slot.date} · {slot.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date & Time pickers */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">Date</label>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="input-base text-xs py-1.5 px-2.5 w-full bg-input border-border"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">Time ({timezone.split('/')[1] || 'Local'})</label>
          <input
            type="time"
            value={currentTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="input-base text-xs py-1.5 px-2.5 w-full bg-input border-border"
          />
        </div>
      </div>

      {/* Consequence Note */}
      <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-border">
        Once approved by an Account Owner, this post is locked into this publishing slot. Automated Buffer / LinkedIn dispatch releases it without manual intervention.
      </p>
    </div>
  );

  if (!isDrawer) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card border-l border-border h-full flex flex-col slide-up shadow-2xl z-50">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h3 className="text-base font-semibold text-foreground">Set Publishing Slot</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
          {content}
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1 text-xs py-2">
            Cancel
          </button>
          <button
            onClick={() => {
              if (onChange) {
                onChange({ date: currentDate, time: currentTime, isSettingsSlot: matchesSettings });
              }
              if (onClose) onClose();
            }}
            className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5"
          >
            <Check size={14} />
            Confirm Slot
          </button>
        </div>
      </div>
    </div>
  );
}
