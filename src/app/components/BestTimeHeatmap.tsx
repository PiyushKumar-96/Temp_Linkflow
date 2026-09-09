'use client';

import React from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];

// Engagement score 0-10 for each [day][time] — backend: fetch from analytics aggregation
const heatData: number[][] = [
  [1, 2, 5, 7, 6, 4, 2, 1],
  [1, 3, 6, 8, 7, 5, 3, 2],
  [2, 4, 8, 9, 8, 6, 4, 2],
  [1, 3, 7, 10, 9, 7, 5, 2],
  [2, 4, 6, 8, 7, 5, 3, 1],
  [1, 1, 2, 3, 3, 4, 5, 3],
  [1, 1, 2, 2, 2, 3, 4, 2],
];

function getColor(score: number): string {
  if (score >= 9) return 'bg-primary opacity-100';
  if (score >= 7) return 'bg-primary opacity-80';
  if (score >= 5) return 'bg-primary opacity-50';
  if (score >= 3) return 'bg-primary opacity-25';
  return 'bg-muted opacity-60';
}

export default function BestTimeHeatmap() {
  return (
    <div className="card p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-600 text-foreground">Best Time to Post</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Avg engagement score by day & time</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[280px]">
          {/* Time headers */}
          <div className="flex gap-1 mb-1 pl-8">
            {times.map(t => (
              <div key={`time-${t}`} className="flex-1 text-center text-xs text-muted-foreground font-500" style={{ minWidth: 28 }}>
                {t}
              </div>
            ))}
          </div>

          {/* Grid */}
          {days.map((day, di) => (
            <div key={`day-${day}`} className="flex items-center gap-1 mb-1">
              <span className="text-xs text-muted-foreground font-500 w-7 shrink-0">{day}</span>
              {times.map((_, ti) => {
                const score = heatData[di][ti];
                return (
                  <div
                    key={`cell-${day}-${ti}`}
                    className={`flex-1 rounded-sm cursor-pointer transition-all hover:scale-110 ${getColor(score)}`}
                    style={{ height: 22, minWidth: 22 }}
                    title={`${day} ${times[ti]}: score ${score}/10`}
                  />
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Low</span>
            {[1, 3, 5, 7, 9].map(s => (
              <div key={`legend-${s}`} className={`w-5 h-4 rounded-sm ${getColor(s)}`} />
            ))}
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>
      </div>

      {/* Best slot highlight */}
      <div className="mt-3 p-2.5 rounded-lg bg-primary/5 border border-primary/15">
        <p className="text-xs font-600 text-primary">📈 Best slot: Thursday 12pm</p>
        <p className="text-xs text-muted-foreground mt-0.5">Avg 9.8% engagement — 2.1× your baseline</p>
      </div>
    </div>
  );
}