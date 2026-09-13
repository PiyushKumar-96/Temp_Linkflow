'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { getGreeting } from './DashboardPrimitives';

export default function DashboardCockpitHeader() {
  const { user } = useAuth();

  const displayName = user?.name || 'Sarah Reeves';
  const firstName = displayName.split(' ')[0] || 'there';

  const now = new Date();
  const greeting = getGreeting(now);

  return (
    <header className="min-w-0 pt-1 pb-2">
      <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight text-[color:var(--text)] leading-tight">
        {greeting.text}, {firstName}
      </h1>
      <p className="mt-1 text-xs sm:text-sm text-[color:var(--text-muted)]">
        Review, schedule, and publish with confidence.
      </p>
    </header>
  );
}
