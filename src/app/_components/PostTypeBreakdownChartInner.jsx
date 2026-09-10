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

const colors = ['var(--primary)', 'var(--accent)', '#0891B2', '#059669', '#D97706', '#7C3AED'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 card-shadow-md text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        Eng. Rate: <span className="font-semibold text-foreground">{payload[0]?.value}%</span>
      </p>
      <p className="text-muted-foreground">
        Posts: <span className="font-semibold text-foreground">{payload[0]?.payload?.posts}</span>
      </p>
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
    <div className="card p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Engagement by Post Type</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Average engagement rate per category</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="type"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="engRate" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
