import React from 'react';
import EngagementTrendChartInner from './EngagementTrendChartInner';

export default function EngagementTrendChart({ activeRange = 'range-30d', refreshKey = 0 }) {
  return <EngagementTrendChartInner activeRange={activeRange} refreshKey={refreshKey} />;
}
