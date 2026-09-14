'use client';

import React, { useState, useEffect } from 'react';
import { getBestTimeHeatmap } from '@/temp-backend';

function getIntensityClass(score) {
  if (score >= 9) return 'anl-heatmap-cell-4';
  if (score >= 7) return 'anl-heatmap-cell-3';
  if (score >= 5) return 'anl-heatmap-cell-2';
  if (score >= 3) return 'anl-heatmap-cell-1';
  return 'anl-heatmap-cell-0';
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
    <div className="anl-card">
      <div className="anl-card-header">
        <div>
          <h3 className="anl-card-title">Best time to post</h3>
          <p className="anl-card-subtitle">Engagement density by day and time</p>
        </div>
      </div>

      <div className="anl-heatmap-container">
        <div className="anl-heatmap-wrap">
          {/* Time row */}
          <div className="anl-heatmap-time-row">
            {times.map((t) => (
              <div key={`time-${t}`} className="anl-heatmap-time-label">
                {t}
              </div>
            ))}
          </div>

          {/* Days and cells */}
          {matrix.length > 0 &&
            (() => {
              // Find single densest cell coordinates (first max value)
              let maxScore = -1;
              let peakDay = -1;
              let peakTime = -1;
              days.forEach((_, di) => {
                times.forEach((_, ti) => {
                  const score = matrix[di]?.[ti] ?? 0;
                  if (score > maxScore) {
                    maxScore = score;
                    peakDay = di;
                    peakTime = ti;
                  }
                });
              });

              return days.map((day, di) => (
                <div key={`day-${day}`} className="anl-heatmap-day-row">
                  <span className="anl-heatmap-day-label">{day}</span>
                  {times.map((t, ti) => {
                    const score = matrix[di]?.[ti] ?? 1;
                    const isPeak = di === peakDay && ti === peakTime;
                    return (
                      <div
                        key={`cell-${day}-${ti}`}
                        title={`${day} ${t}: Activity score ${score}/10 ${isPeak ? '(Peak slot)' : ''}`}
                        className={`anl-heatmap-cell ${isPeak ? 'anl-heatmap-cell-peak' : getIntensityClass(score)}`}
                      />
                    );
                  })}
                </div>
              ));
            })()}

          {/* Legend with single-hue ramp */}
          <div className="anl-heatmap-legend">
            <span>Low activity</span>
            <div className="anl-heatmap-legend-scale">
              <span className="anl-heatmap-legend-swatch anl-heatmap-cell-0" />
              <span className="anl-heatmap-legend-swatch anl-heatmap-cell-1" />
              <span className="anl-heatmap-legend-swatch anl-heatmap-cell-2" />
              <span className="anl-heatmap-legend-swatch anl-heatmap-cell-3" />
              <span className="anl-heatmap-legend-swatch anl-heatmap-cell-4" />
            </div>
            <span>High activity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
