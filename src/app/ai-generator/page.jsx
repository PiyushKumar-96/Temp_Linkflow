'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import AIGeneratorShell from './components/AIGeneratorShell';

export default function AIGeneratorPage() {
  return (
    <AppLayout>
      <AIGeneratorShell />
    </AppLayout>
  );
}
