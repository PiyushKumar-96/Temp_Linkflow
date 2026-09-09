'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import SettingsShell from './components/SettingsShell';

export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsShell />
    </AppLayout>
  );
}
