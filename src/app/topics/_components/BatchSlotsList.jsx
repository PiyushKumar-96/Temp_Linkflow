'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function BatchSlotsList({
  slots = [],
  cadence = 'weekly',
  seriesList = [],
  defaultSeriesId = 'series-1',
  themePrefix = '',
  onUpdateSlot,
  onRemoveSlot,
  onAddSlot,
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-foreground block">
            Weekly / Daily Topics & Dates ({slots.length})
          </label>
          <span className="text-[11px] text-muted-foreground">
            Customize topic angles, series, and dates for each slot, or remove slots
          </span>
        </div>
        <button
          type="button"
          onClick={onAddSlot}
          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <Plus size={12} />
          Add Slot
        </button>
      </div>

      <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
        {slots.map((slot, idx) => {
          const currentSeriesId = slot.seriesId || defaultSeriesId;
          return (
            <div
              key={slot.id}
              className="flex flex-col gap-2 p-2.5 rounded-lg bg-card border border-border text-xs shadow-xs transition-all hover:border-primary/40"
            >
              {/* Row 1: Label, Dates, Series, Trash */}
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[11px] shrink-0">
                  {slot.label}
                </span>

                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <input
                    type="date"
                    value={slot.startDate}
                    onChange={(e) => onUpdateSlot(slot.id, 'startDate', e.target.value)}
                    className="input py-1 text-xs flex-1 min-w-[105px] bg-input"
                    title="Start date"
                  />

                  {cadence === 'weekly' && (
                    <>
                      <span className="text-muted-foreground shrink-0 text-[11px]">→</span>
                      <input
                        type="date"
                        value={slot.endDate}
                        onChange={(e) => onUpdateSlot(slot.id, 'endDate', e.target.value)}
                        className="input py-1 text-xs flex-1 min-w-[105px] bg-input"
                        title="End date"
                      />
                    </>
                  )}
                </div>

                <select
                  value={currentSeriesId}
                  onChange={(e) => onUpdateSlot(slot.id, 'seriesId', e.target.value)}
                  className="input py-1 text-xs bg-input shrink-0 w-36"
                  title="Category series for this topic"
                >
                  {seriesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSlot(slot.id)}
                    className="p-1 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 transition-colors"
                    title="Remove this slot"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Row 2: Specific Topic Title / Theme for this week */}
              <div>
                <input
                  type="text"
                  placeholder={
                    themePrefix.trim()
                      ? `e.g. ${themePrefix} - Part ${idx + 1}...`
                      : `e.g. Strategic topic angle for ${slot.label}...`
                  }
                  value={slot.title || ''}
                  onChange={(e) => onUpdateSlot(slot.id, 'title', e.target.value)}
                  className="input py-1.5 px-2.5 text-xs w-full bg-input/60 focus:bg-input"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
