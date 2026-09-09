'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Aug 9', impressions: 7800, reactions: 210, comments: 38 },
  { date: 'Aug 11', impressions: 9200, reactions: 280, comments: 52 },
  { date: 'Aug 13', impressions: 8100, reactions: 190, comments: 29 },
  { date: 'Aug 15', impressions: 11400, reactions: 390, comments: 74 },
  { date: 'Aug 17', impressions: 10200, reactions: 310, comments: 61 },
  { date: 'Aug 19', impressions: 7600, reactions: 175, comments: 22 },
  { date: 'Aug 21', impressions: 13200, reactions: 480, comments: 92 },
  { date: 'Aug 23', impressions: 12800, reactions: 440, comments: 88 },
  { date: 'Aug 25', impressions: 9900, reactions: 295, comments: 55 },
  { date: 'Aug 27', impressions: 14500, reactions: 520, comments: 103 },
  { date: 'Aug 29', impressions: 11100, reactions: 360, comments: 67 },
  { date: 'Aug 31', impressions: 16200, reactions: 610, comments: 118 },
  { date: 'Sep 2', impressions: 14800, reactions: 545, comments: 109 },
  { date: 'Sep 4', impressions: 18100, reactions: 690, comments: 134 },
  { date: 'Sep 6', impressions: 15600, reactions: 580, comments: 112 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 card-shadow-md text-sm">
      <p className="font-600 text-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={`tooltip-${entry.dataKey}`} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-600 text-foreground tabular-nums">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

type Metric = 'impressions' | 'reactions' | 'comments';

export default function EngagementTrendChartInner() {
  const [activeMetrics, setActiveMetrics] = useState<Metric[]>(['impressions', 'reactions']);

  const toggle = (m: Metric) => {
    setActiveMetrics(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  const metricConfig: { key: Metric; label: string; color: string; gradId: string }[] = [
    { key: 'impressions', label: 'Impressions', color: 'var(--primary)', gradId: 'grad-impressions' },
    { key: 'reactions', label: 'Reactions', color: 'var(--accent)', gradId: 'grad-reactions' },
    { key: 'comments', label: 'Comments', color: 'var(--success)', gradId: 'grad-comments' },
  ];

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-600 text-foreground">Engagement Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 30 days · 15 data points</p>
        </div>
        <div className="flex items-center gap-2">
          {metricConfig.map(m => (
            <button
              key={`toggle-${m.key}`}
              onClick={() => toggle(m.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-500 border transition-all duration-150 ${
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
            {metricConfig.map(m => (
              <linearGradient key={m.gradId} id={m.gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={m.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={m.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {metricConfig.map(m =>
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