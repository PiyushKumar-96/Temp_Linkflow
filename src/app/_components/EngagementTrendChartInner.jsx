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
    <div className="bg-card border border-border rounded-lg p-3 card-shadow-md text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.dataKey}`} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EngagementTrendChartInner({ activeRange = 'range-30d', refreshKey = 0 }) {
  const [data, setData] = useState([]);
  const [activeMetrics, setActiveMetrics] = useState(['impressions', 'reactions']);

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

  const toggle = (m) => {
    setActiveMetrics((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const metricConfig = [
    {
      key: 'impressions',
      label: 'Impressions',
      color: 'var(--primary)',
      gradId: 'grad-impressions',
    },
    { key: 'reactions', label: 'Reactions', color: 'var(--accent)', gradId: 'grad-reactions' },
    { key: 'comments', label: 'Comments', color: 'var(--success)', gradId: 'grad-comments' },
  ];

  const rangeLabels = {
    'range-7d': 'Last 7 days · 7 data points',
    'range-30d': 'Last 30 days · 15 data points',
    'range-90d': 'Last 90 days · 10 data points',
    'range-custom': 'Custom window · Selected intervals',
  };

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">Engagement Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rangeLabels[activeRange] || 'Dynamic trend view'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {metricConfig.map((m) => (
            <button
              key={`toggle-${m.key}`}
              type="button"
              onClick={() => toggle(m.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                activeMetrics.includes(m.key)
                  ? 'text-foreground border-border bg-card'
                  : 'text-muted-foreground border-transparent bg-muted opacity-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <defs>
            {metricConfig.map((m) => (
              <linearGradient key={m.gradId} id={m.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={m.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={m.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {metricConfig.map((m) =>
            activeMetrics.includes(m.key) ? (
              <Area
                key={`area-${m.key}`}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                fill={`url(#${m.gradId})`}
                dot={false}
                activeDot={{ r: 4, fill: m.color }}
              />
            ) : null
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
