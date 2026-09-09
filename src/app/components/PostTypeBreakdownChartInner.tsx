'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const data = [
  { type: 'Thought Lead.', engRate: 6.2, posts: 8 },
  { type: 'Case Study', engRate: 5.8, posts: 5 },
  { type: 'Product Update', engRate: 3.4, posts: 11 },
  { type: 'Hiring', engRate: 4.1, posts: 6 },
  { type: 'Event', engRate: 7.1, posts: 3 },
  { type: 'Engagement', engRate: 5.0, posts: 9 },
];

const colors = ['var(--primary)', 'var(--accent)', '#0891B2', '#059669', '#D97706', '#7C3AED'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 card-shadow-md text-sm">
      <p className="font-600 text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">Eng. Rate: <span className="font-600 text-foreground">{payload[0]?.value}%</span></p>
      <p className="text-muted-foreground">Posts: <span className="font-600 text-foreground">{payload[0]?.payload?.posts}</span></p>
    </div>
  );
};

export default function PostTypeBreakdownChartInner() {
  return (
    <div className="card p-5 h-full">
      <div className="mb-4">
        <h3 className="text-base font-600 text-foreground">Engagement by Post Type</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Average engagement rate per category</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="type" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5 }} />
          <Bar dataKey="engRate" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((_, idx) => (
              <Cell key={`cell-type-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}