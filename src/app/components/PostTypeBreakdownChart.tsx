'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PostTypeBreakdownChartInner = dynamic(() => import('./PostTypeBreakdownChartInner'), { ssr: false });

export default function PostTypeBreakdownChart() {
  return <PostTypeBreakdownChartInner />;
}