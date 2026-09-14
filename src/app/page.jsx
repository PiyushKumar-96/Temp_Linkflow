'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalyticsHeader from './_components/AnalyticsHeader';
import AnalyticsFindings from './_components/AnalyticsFindings';
import EngagementTrendChart from './_components/EngagementTrendChart';
import PostTypeBreakdownChart from './_components/PostTypeBreakdownChart';
import BestTimeHeatmap from './_components/BestTimeHeatmap';
import TopPostsTable from './_components/TopPostsTable';

export default function AnalyticsDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeParam = searchParams.get('range') || 'range-30d';
  const activeRange = rangeParam.startsWith('range-') ? rangeParam : `range-${rangeParam}`;

  const [refreshKey] = useState(0);
  const [lastUpdated] = useState('4 min ago');

  const handleRangeChange = (newRange) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('range', newRange);
    setSearchParams(nextParams);
  };

  return (
    <div className="anl anl-container">
      {/* 1. Header: H1 at 36px, one-line subtitle, quiet last updated */}
      <AnalyticsHeader
        activeRange={activeRange}
        onRangeChange={handleRangeChange}
        lastUpdated={lastUpdated}
      />

      {/* 2. Top of page: 2-3 Plain narrative findings derived from data */}
      <AnalyticsFindings range={activeRange} />

      {/* 3. Evidence Charts: Question-oriented layout */}
      {/* Row 1: Engagement trend over period & Performance by post format */}
      <div className="anl-evidence-grid">
        <div className="anl-col-2">
          <EngagementTrendChart activeRange={activeRange} refreshKey={refreshKey} />
        </div>
        <div className="anl-col-1">
          <PostTypeBreakdownChart />
        </div>
      </div>

      {/* Row 2: Top posts & Best time to post */}
      <div className="anl-evidence-grid">
        <div className="anl-col-2">
          <TopPostsTable range={activeRange} refreshKey={refreshKey} />
        </div>
        <div className="anl-col-1">
          <BestTimeHeatmap />
        </div>
      </div>
    </div>
  );
}
