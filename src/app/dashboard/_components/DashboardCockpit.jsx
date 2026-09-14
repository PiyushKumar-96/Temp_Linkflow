'use client';

import React, { useCallback, useState } from 'react';
import DashboardCockpitHeader from './DashboardCockpitHeader';
import DashboardHeroCard from './DashboardHeroCard';
import DashboardPipelineHealth from './DashboardPipelineHealth';
import DashboardTodayFocus from './DashboardTodayFocus';
import DashboardWorkflowStepper from './DashboardWorkflowStepper';
import DashboardAttentionRequired from './DashboardAttentionRequired';
import DashboardPendingReviewCard from './DashboardPendingReviewCard';
import DashboardContentPerformance from './DashboardContentPerformance';
import DashboardUpcomingPostsCard from './DashboardUpcomingPostsCard';
import DashboardTeamActivity from './DashboardTeamActivity';
import DashboardQuoteCard from './DashboardQuoteCard';
import DashboardQuickActions from './DashboardQuickActions';
import DashboardAgendaModal from './DashboardAgendaModal';
import DashboardWorkflowModal from './DashboardWorkflowModal';

/**
 * Reference layout for the Operations Cockpit.
 * Pass real data through; leave a list prop undefined to see demo content.
 */
export default function DashboardCockpit({
  failedPosts,
  pendingPosts,
  upcomingPosts,
  pipelineStats,
  onRetryPost,
  onManualPublish,
}) {
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const closeAgenda = useCallback(() => setAgendaOpen(false), []);
  const closeWorkflow = useCallback(() => setWorkflowOpen(false), []);

  const attentionCount =
    (failedPosts === undefined ? 1 : failedPosts.length) +
    (pendingPosts === undefined ? 1 : pendingPosts.length > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F3F6FA] dark:bg-background">
      <div className="flex w-full max-w-none flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <DashboardCockpitHeader />

        {/* Row 1 — today at a glance */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="lg:col-span-2 xl:col-span-1">
            <DashboardHeroCard
              onOpenAgenda={() => setAgendaOpen(true)}
              attentionCount={attentionCount}
            />
          </div>
          <DashboardPipelineHealth stats={pipelineStats} />
          <DashboardTodayFocus />
        </div>

        {/* Row 2 — process */}
        <DashboardWorkflowStepper onOpenWorkflowModal={() => setWorkflowOpen(true)} />

        {/* Row 3 — what needs doing */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
          <DashboardAttentionRequired
            failedPosts={failedPosts}
            onRetryPost={onRetryPost}
            onManualPublish={onManualPublish}
          />
          <DashboardPendingReviewCard pendingPosts={pendingPosts} />
          <div className="lg:col-span-2 xl:col-span-1">
            <DashboardContentPerformance />
          </div>
        </div>

        {/* Row 4 — what's coming */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="lg:col-span-2 xl:col-span-1">
            <DashboardUpcomingPostsCard upcomingPosts={upcomingPosts} />
          </div>
          <DashboardTeamActivity />
          <div className="flex flex-col gap-5">
            <DashboardQuoteCard />
            <DashboardQuickActions />
          </div>
        </div>
      </div>

      <DashboardAgendaModal isOpen={agendaOpen} onClose={closeAgenda} />
      <DashboardWorkflowModal isOpen={workflowOpen} onClose={closeWorkflow} />
    </div>
  );
}
