import React from 'react';
import AppLayout from '@/components/AppLayout';
import AnalyticsHeader from './components/AnalyticsHeader';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import EngagementTrendChart from './components/EngagementTrendChart';
import PostTypeBreakdownChart from './components/PostTypeBreakdownChart';
import TopPostsTable from './components/TopPostsTable';
import BestTimeHeatmap from './components/BestTimeHeatmap';

export default function AnalyticsDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <AnalyticsHeader />
        <MetricsBentoGrid />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <EngagementTrendChart />
          </div>
          <div className="xl:col-span-1">
            <PostTypeBreakdownChart />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TopPostsTable />
          </div>
          <div className="xl:col-span-1">
            <BestTimeHeatmap />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}