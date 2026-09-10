'use client';

import React, { useState, useEffect } from 'react';
import { getBestTimeHeatmap } from '@/temp-backend';

function getColor(score) {
  if (score >= 9) return 'bg-primary opacity-100';
  if (score >= 7) return 'bg-primary opacity-80';
  if (score >= 5) return 'bg-primary opacity-50';
  if (score >= 3) return 'bg-primary opacity-25';
  return 'bg-muted opacity-60';
}

export default function BestTimeHeatmap() {
  const [heatmap, setHeatmap] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    times: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'],
    matrix: [],
  });

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const res = await getBestTimeHeatmap();
        if (!cancelled) setHeatmap(res);
      } catch {
        // Fallback
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const { days, times, matrix } = heatmap;

  return (
    <div className="card p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Best Time to Post</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Avg engagement score by day & time</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[280px]">
          {/* Time headers */}
          <div className="flex gap-1 mb-1 pl-8">
            {times.map((t) => (
              <div
                key={`time-${t}`}
                className="flex-1 text-center text-xs text-muted-foreground font-medium"
                style={{ minWidth: 28 }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Grid */}
          {matrix.length > 0 &&
            days.map((day, di) => (
              <div key={`day-${day}`} className="flex items-center gap-1 mb-1">
                <span className="text-xs text-muted-foreground font-medium w-7 shrink-0">{day}</span>
                {times.map((_, ti) => {
                  const score = matrix[di]?.[ti] ?? 1;
                  return (
                    <div
                      key={`cell-${day}-${ti}`}
                      title={`${day} ${times[ti]}: Score ${score}/10`}
                      className={`flex-1 rounded-sm cursor-pointer transition-all hover:scale-110 ${getColor(score)}`}
                      style={{ height: 22, minWidth: 22 }}
                    />
                  );
                })}
              </div>
            ))}

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>Low engagement</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-muted opacity-60 inline-block" />
              <span className="w-3 h-3 rounded-xs bg-primary opacity-25 inline-block" />
              <span className="w-3 h-3 rounded-xs bg-primary opacity-50 inline-block" />
              <span className="w-3 h-3 rounded-xs bg-primary opacity-80 inline-block" />
              <span className="w-3 h-3 rounded-xs bg-primary opacity-100 inline-block" />
            </div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
