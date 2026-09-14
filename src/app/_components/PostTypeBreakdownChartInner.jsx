'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getPostTypeBreakdown } from '@/temp-backend';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="anl-chart-tooltip">
      <p className="anl-chart-tooltip-title">{label}</p>
      <div className="anl-chart-tooltip-row">
        <span>Engagement rate:</span>
        <span className="anl-chart-tooltip-val">{payload[0]?.value}%</span>
      </div>
      <div className="anl-chart-tooltip-row">
        <span>Posts analysed:</span>
        <span className="anl-chart-tooltip-val">{payload[0]?.payload?.posts}</span>
      </div>
    </div>
  );
};

export default function PostTypeBreakdownChartInner() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const res = await getPostTypeBreakdown();
        if (!cancelled) setData(res);
      } catch {
        // Fallback
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="anl-card h-full">
      <div className="anl-card-header">
        <div>
          <h3 className="anl-card-title">Performance by post format</h3>
          <p className="anl-card-subtitle">Average engagement rate by format</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E4E2DC"
              strokeWidth={1}
              vertical={false}
            />
            <XAxis
              dataKey="type"
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
            <Bar dataKey="engRate" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((entry, index) => {
                const maxVal = Math.max(...data.map((d) => d.engRate));
                const isLeader = entry.engRate === maxVal;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isLeader ? '#0A66C2' : '#D3D1C7'}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
