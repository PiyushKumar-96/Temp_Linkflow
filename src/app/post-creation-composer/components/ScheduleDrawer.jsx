'use client';

import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';

const teamMembers = [
  { id: 'user-001', name: 'Sarah Reeves', initials: 'SR', role: 'Content Manager' },
  { id: 'user-002', name: 'Marcus Chen', initials: 'MC', role: 'Senior Writer' },
  { id: 'user-003', name: 'Jordan Patel', initials: 'JP', role: 'Marketing Lead' },
  { id: 'user-004', name: 'Lisa Tran', initials: 'LT', role: 'Brand Strategist' },
];

const suggestedTimes = [
  {
    id: 'slot-thu-noon',
    label: 'Thu 12:00 PM',
    score: '🔥 Best',
    date: '2026-09-10',
    time: '12:00',
  },
  {
    id: 'slot-wed-10',
    label: 'Wed 10:00 AM',
    score: '⚡ Great',
    date: '2026-09-09',
    time: '10:00',
  },
  { id: 'slot-fri-2', label: 'Fri 2:00 PM', score: '✓ Good', date: '2026-09-11', time: '14:00' },
];

export default function ScheduleDrawer({ onClose, onSchedule }) {
  const [date, setDate] = useState('2026-09-10');
  const [time, setTime] = useState('12:00');
  const [assignee, setAssignee] = useState('');
  const [recurrence, setRecurrence] = useState('none');

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card border-l border-border h-full flex flex-col slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h3 className="text-base font-600 text-foreground">Schedule Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5 scrollbar-thin">
          {/* Suggested times */}
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide block mb-2">
              AI Recommended Times
            </label>
            <div className="flex flex-col gap-2">
              {suggestedTimes.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    setDate(slot.date);
                    setTime(slot.time);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all duration-150 ${
                    date === slot.date && time === slot.time
                      ? 'border-primary/40 bg-primary/5 text-primary'
                      : 'border-border bg-muted/30 text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="font-500">{slot.label}</span>
                  <span className="text-xs">{slot.score}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom date/time */}
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide block mb-2">
              Custom Date & Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input-base text-sm"
                />
              </div>
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide block mb-2">
              Recurrence
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="input-base text-sm"
            >
              <option value="none">No recurrence (one-time)</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly on same day</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Assign reviewer */}
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide block mb-2">
              Assign Reviewer
            </label>
            <div className="flex flex-col gap-1.5">
              {teamMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAssignee(assignee === m.id ? '' : m.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-150 ${
                    assignee === m.id
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-muted/30 hover:bg-muted'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-700">{m.initials}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-500 text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                  {assignee === m.id && (
                    <span className="ml-auto text-xs text-primary font-600">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={() => onSchedule(date, time, assignee)} className="btn-primary flex-1">
            <Clock size={14} />
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
}
