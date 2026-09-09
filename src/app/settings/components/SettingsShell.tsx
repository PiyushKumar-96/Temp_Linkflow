'use client';

import React, { useState } from 'react';
import { Settings, Clock, Plus, Trash2, Save, RotateCcw, Info } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Day = typeof DAYS[number];

interface TimeSlot {
  id: string;
  time: string;
  enabled: boolean;
}

interface DayRule {
  day: Day;
  enabled: boolean;
  slots: TimeSlot[];
  offsetFromPrev: number | null; // minutes to add to previous day's first slot
  useOffset: boolean;
}

const defaultSlot = (time = '09:00'): TimeSlot => ({
  id: `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  time,
  enabled: true,
});

const defaultRules: DayRule[] = DAYS.map((day, i) => ({
  day,
  enabled: i < 5, // Mon-Fri enabled by default
  slots: [defaultSlot(i === 0 ? '09:00' : i === 1 ? '09:15' : i === 2 ? '10:00' : i === 3 ? '11:00' : i === 4 ? '12:00' : '10:00')],
  offsetFromPrev: i > 0 ? 15 : null,
  useOffset: i > 0 && i < 5,
}));

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export default function SettingsShell() {
  const [rules, setRules] = useState<DayRule[]>(defaultRules);
  const [timezone, setTimezone] = useState('America/New_York');
  const [defaultGap, setDefaultGap] = useState(15);

  const updateRule = (idx: number, patch: Partial<DayRule>) => {
    setRules(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  };

  const addSlot = (idx: number) => {
    const rule = rules[idx];
    const lastSlot = rule.slots[rule.slots.length - 1];
    const newTime = lastSlot ? addMinutesToTime(lastSlot.time, 60) : '10:00';
    updateRule(idx, { slots: [...rule.slots, defaultSlot(newTime)] });
  };

  const removeSlot = (ruleIdx: number, slotId: string) => {
    setRules(prev => prev.map((r, i) => i === ruleIdx
      ? { ...r, slots: r.slots.filter(s => s.id !== slotId) }
      : r
    ));
  };

  const updateSlot = (ruleIdx: number, slotId: string, time: string) => {
    setRules(prev => prev.map((r, i) => i === ruleIdx
      ? { ...r, slots: r.slots.map(s => s.id === slotId ? { ...s, time } : s) }
      : r
    ));
  };

  const applyOffset = (idx: number) => {
    const rule = rules[idx];
    if (!rule.useOffset || rule.offsetFromPrev === null) return;
    const prevRule = rules[idx - 1];
    if (!prevRule || prevRule.slots.length === 0) return;
    const prevFirstTime = prevRule.slots[0].time;
    const newTime = addMinutesToTime(prevFirstTime, rule.offsetFromPrev);
    const newSlots = rule.slots.map((s, si) => si === 0 ? { ...s, time: newTime } : s);
    updateRule(idx, { slots: newSlots });
    toast.success(`${rule.day} first slot set to ${newTime}`);
  };

  const handleSave = () => {
    toast.success('Scheduling rules saved successfully');
  };

  const handleReset = () => {
    setRules(defaultRules);
    toast.info('Rules reset to defaults');
  };

  const getComputedPreview = (idx: number): string => {
    const rule = rules[idx];
    if (!rule.useOffset || rule.offsetFromPrev === null || idx === 0) return '';
    const prevRule = rules[idx - 1];
    if (!prevRule || prevRule.slots.length === 0) return '';
    const prevTime = prevRule.slots[0].time;
    return addMinutesToTime(prevTime, rule.offsetFromPrev);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-primary" />
          <h1 className="text-2xl font-700 text-foreground">Settings</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-1.5">
            <RotateCcw size={14} />
            Reset
          </button>
          <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-1.5">
            <Save size={14} />
            Save Rules
          </button>
        </div>
      </div>

      {/* Global settings */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-base font-700 text-foreground">Global Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600 text-foreground">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="input-base text-sm"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600 text-foreground">Default Offset (minutes)</label>
            <input
              type="number"
              value={defaultGap}
              onChange={e => setDefaultGap(Number(e.target.value))}
              min={0}
              max={1440}
              className="input-base text-sm"
              placeholder="15"
            />
            <p className="text-xs text-muted-foreground">Used as default when applying offset rules</p>
          </div>
        </div>
      </div>

      {/* Rule builder */}
      <div className="card p-5 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h2 className="text-base font-700 text-foreground">Weekly Posting Schedule</h2>
        </div>
        <div className="flex items-start gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-lg">
          <Info size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Set posting times for each day. Use the offset rule to automatically calculate a day&apos;s time based on the previous day&apos;s first slot plus X minutes.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {rules.map((rule, idx) => (
            <div
              key={rule.day}
              className={`rounded-xl border transition-all duration-200 ${rule.enabled ? 'border-border bg-card' : 'border-border/50 bg-muted/30'}`}
            >
              {/* Day header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => updateRule(idx, { enabled: !rule.enabled })}
                    className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${rule.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rule.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                  <span className={`text-sm font-700 w-24 ${rule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{rule.day}</span>
                </label>

                {rule.enabled && (
                  <div className="flex items-center gap-3 ml-auto flex-wrap">
                    {/* Offset toggle */}
                    {idx > 0 && (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.useOffset}
                            onChange={e => updateRule(idx, { useOffset: e.target.checked })}
                            className="w-3.5 h-3.5 accent-primary"
                          />
                          <span className="text-xs text-muted-foreground">Offset from {DAYS[idx - 1].slice(0, 3)}</span>
                        </label>
                        {rule.useOffset && (
                          <>
                            <input
                              type="number"
                              value={rule.offsetFromPrev ?? 15}
                              onChange={e => updateRule(idx, { offsetFromPrev: Number(e.target.value) })}
                              min={-1440}
                              max={1440}
                              className="input-base text-xs py-1 px-2 w-16 text-center"
                            />
                            <span className="text-xs text-muted-foreground">min</span>
                            <button
                              onClick={() => applyOffset(idx)}
                              className="text-xs text-primary hover:underline font-600"
                            >
                              Apply
                            </button>
                            {getComputedPreview(idx) && (
                              <span className="text-xs text-success font-600">→ {getComputedPreview(idx)}</span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => addSlot(idx)}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-600 transition-colors"
                    >
                      <Plus size={12} />
                      Add time
                    </button>
                  </div>
                )}
              </div>

              {/* Time slots */}
              {rule.enabled && (
                <div className="px-4 py-3 flex flex-wrap gap-2">
                  {rule.slots.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No time slots — click &quot;Add time&quot; to add one</p>
                  ) : (
                    rule.slots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1.5">
                        <Clock size={12} className="text-muted-foreground" />
                        <input
                          type="time"
                          value={slot.time}
                          onChange={e => updateSlot(idx, slot.id, e.target.value)}
                          className="bg-transparent text-sm font-600 text-foreground outline-none w-[90px]"
                        />
                        {rule.slots.length > 1 && (
                          <button
                            onClick={() => removeSlot(idx, slot.id)}
                            className="text-muted-foreground hover:text-danger transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {!rule.enabled && (
                <div className="px-4 py-2.5">
                  <p className="text-xs text-muted-foreground">No posts scheduled on {rule.day}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview summary */}
      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-base font-700 text-foreground">Schedule Preview</h2>
        <div className="grid grid-cols-7 gap-2">
          {rules.map(rule => (
            <div key={`preview-${rule.day}`} className={`rounded-lg p-3 text-center ${rule.enabled ? 'bg-primary/5 border border-primary/20' : 'bg-muted/40 border border-border'}`}>
              <p className={`text-xs font-700 mb-2 ${rule.enabled ? 'text-primary' : 'text-muted-foreground'}`}>{rule.day.slice(0, 3)}</p>
              {rule.enabled && rule.slots.length > 0 ? (
                rule.slots.map(s => (
                  <p key={s.id} className="text-xs font-600 text-foreground tabular-nums">{s.time}</p>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">—</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
