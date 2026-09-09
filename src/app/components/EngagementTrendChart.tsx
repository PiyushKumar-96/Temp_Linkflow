'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const EngagementTrendChartInner = dynamic(() => import('./EngagementTrendChartInner'), { ssr: false });

export default function EngagementTrendChart() {
  return <EngagementTrendChartInner />;
}