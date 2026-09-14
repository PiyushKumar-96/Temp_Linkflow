'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getEngagementTrends } from '@/temp-backend';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="anl-chart-tooltip">
      <p className="anl-chart-tooltip-title">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.dataKey}`} className="anl-chart-tooltip-row">
          <span>{entry.name}:</span>
          <span className="anl-chart-tooltip-val">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EngagementTrendChartInner({ activeRange = 'range-30d', refreshKey = 0 }) {
  const [data, setData] = useState([]);
  const [activeMetric, setActiveMetric] = useState('impressions');

  useEffect(() => {
    let cancelled = false;
    async function loadTrends() {
      try {
        const trendData = await getEngagementTrends(activeRange);
        if (!cancelled) {
          setData(trendData);
        }
      } catch {
        // Fallback
      }
    }
    loadTrends();
    return () => {
      cancelled = true;
    };
  }, [activeRange, refreshKey]);

  const metrics = [
    { key: 'impressions', label: 'Impressions' },
    { key: 'reactions', label: 'Reactions' },
    { key: 'comments', label: 'Comments' },
  ];

  const rangeLabels = {
    'range-7d': 'Last 7 days · 7 data points',
    'range-30d': 'Last 30 days · 15 data points',
    'range-90d': 'Last 90 days · 10 data points',
    'range-custom': 'Custom window · Selected intervals',
  };

  return (
    <div className="anl-card h-full">
      <div className="anl-card-header">
        <div>
          <h3 className="anl-card-title">Engagement trend</h3>
          <p className="anl-card-subtitle">
            {rangeLabels[activeRange] || 'Trend progression over selected period'}
          </p>
        </div>
        <div className="anl-trend-toggles">
          {metrics.map((m) => {
            const isActive = activeMetric === m.key;
            return (
              <button
                key={`toggle-${m.key}`}
                type="button"
                onClick={() => setActiveMetric(m.key)}
                className={`anl-metric-toggle ${!isActive ? 'anl-metric-toggle--off' : ''}`}
              >
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="anl-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E4E2DC"
              strokeWidth={1}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6B6B70' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B6B70' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeMetric}
              name={metrics.find((m) => m.key === activeMetric)?.label || 'Metric'}
              stroke="#0A66C2"
              strokeWidth={1.5}
              fill="url(#anl-area-fill)"
              dot={false}
              activeDot={{ r: 4, fill: '#0A66C2', stroke: '#FFFFFF', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
