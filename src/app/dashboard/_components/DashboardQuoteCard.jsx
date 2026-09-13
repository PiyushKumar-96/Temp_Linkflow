'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { Panel } from './DashboardPrimitives';

const DEFAULT_QUOTES = [
  { text: 'A well-run pipeline creates freedom.', note: "Keep building. You're on track." },
  { text: 'Small, steady posts compound.', note: 'Show up again tomorrow.' },
  {
    text: 'A clear process beats a last-minute scramble.',
    note: 'Your queue is doing the heavy lifting.',
  },
  { text: 'Ship the draft, then make it better.', note: 'Momentum matters more than polish.' },
  {
    text: 'Your calendar is a promise to your audience.',
    note: 'Keep the promise, one slot at a time.',
  },
];

/** Rotates through quotes by day of year, so it changes daily but stays stable within a day. */
export default function DashboardQuoteCard({ quotes = DEFAULT_QUOTES }) {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const quote = quotes[dayOfYear % quotes.length];

  return (
    <Panel as="figure" className="relative flex items-start gap-3.5 overflow-hidden p-5">
      <Quote
        size={30}
        strokeWidth={0}
        aria-hidden="true"
        className="shrink-0 -scale-x-100 fill-primary"
      />
      <div className="min-w-0">
        <blockquote className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <figcaption className="mt-1.5 text-xs text-muted-foreground">{quote.note}</figcaption>
      </div>
    </Panel>
  );
}
