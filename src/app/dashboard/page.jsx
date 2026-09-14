'use client';

import React, { useState, useEffect } from 'react';
import { useApprovalPosts } from '@/app/approval-workflow/_api/queries';
import { useTopicsQuery } from '@/app/topics/_api/queries';
import { useQueryClient } from '@tanstack/react-query';
import { getUpcomingPosts, getRecentlyPublishedPosts, updatePost } from '@/temp-backend';
import { toast } from 'sonner';

import DashboardCockpitHeader from './_components/DashboardCockpitHeader';
import DashboardHeroCard from './_components/DashboardHeroCard';
import DashboardPipelineHealth from './_components/DashboardPipelineHealth';
import DashboardTodayFocus from './_components/DashboardTodayFocus';
import DashboardWorkflowStepper from './_components/DashboardWorkflowStepper';
import DashboardAttentionRequired from './_components/DashboardAttentionRequired';
import DashboardPendingReviewCard from './_components/DashboardPendingReviewCard';
import DashboardContentPerformance from './_components/DashboardContentPerformance';
import DashboardUpcomingPostsCard from './_components/DashboardUpcomingPostsCard';
import DashboardContentPillars from './_components/DashboardContentPillars';
import DashboardQuickActions from './_components/DashboardQuickActions';
import DashboardWorkflowModal from './_components/DashboardWorkflowModal';
import DashboardAgendaModal from './_components/DashboardAgendaModal';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { data: allPosts = [] } = useApprovalPosts();
  const { data: topics = [] } = useTopicsQuery();

  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [up, pub] = await Promise.all([getUpcomingPosts(), getRecentlyPublishedPosts()]);
        if (!cancelled) {
          setUpcomingPosts(up);
          setPublishedPosts(pub);
        }
      } catch {
        // Fallback
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter pending & failed posts for human review & error recovery
  const pendingPosts = allPosts.filter(
    (p) => p.status === 'awaiting_review' || p.status === 'needs_revision'
  );
  const failedPosts = allPosts.filter((p) => p.status === 'failed');

  const updatePostStatus = async (postId, newStatus, extra = {}) => {
    let posts = allPosts;
    const updated = posts.map((p) => (p.id === postId ? { ...p, status: newStatus, ...extra } : p));
    try {
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(updated));
      await updatePost(postId, { status: newStatus, ...extra });
    } catch {
      // Ignore
    }
    queryClient.setQueryData(['posts', 'approval-queue'], updated);
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const handleRetryPost = async (postId) => {
    await new Promise((r) => setTimeout(r, 600));
    await updatePostStatus(postId, 'generating', {
      stage: 'dispatching',
      activityLog: [
        {
          id: `act-retry-${Date.now()}`,
          actor: 'Piyush Karn',
          action: 'Initiated retry dispatch [req_retry_01]',
          timestamp: 'Just now',
          details: 'Retrying Buffer publishing worker connection.',
        },
        ...(allPosts.find((p) => p.id === postId)?.activityLog || []),
      ],
    });
    toast.success('Triggered retry worker for post dispatch');
  };

  const handleManualPublish = async (post) => {
    const mdContent = `# ${post.title}\n\n${post.content || ''}\n\n${(post.hashtags || []).join(' ')}\n\n---\nTarget Account: ${post.category || 'Company Page'}\nFormat: ${post.visualFormat || 'Image'}\nDownload Date: ${new Date().toISOString()}`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${(post.title || 'post').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await updatePostStatus(post.id, 'manual');
    toast.success('Downloaded publication package & marked as Manual Publish');
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-none pb-16 text-[color:var(--text)]">
      {/* Top Cockpit Header */}
      <DashboardCockpitHeader />

      {/* Row 1: Hero card (5 cols) | Pipeline health (4 cols) | Today's focus (3 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 md:col-span-2">
          <DashboardHeroCard onOpenAgenda={() => setIsAgendaModalOpen(true)} />
        </div>
        <div className="lg:col-span-4 md:col-span-1">
          <DashboardPipelineHealth />
        </div>
        <div className="lg:col-span-3 md:col-span-1">
          <DashboardTodayFocus />
        </div>
      </div>

      {/* Row 2: Workflow (12 cols, shorter height) */}
      <DashboardWorkflowStepper onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)} />

      {/* Row 3: Content performance, dark (7 cols) | Pending review (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <DashboardContentPerformance />
        </div>
        <div className="lg:col-span-5">
          <DashboardPendingReviewCard pendingPosts={pendingPosts} />
        </div>
      </div>

      {/* Row 4: Upcoming posts (5 cols) | Content pillars (4 cols) | stacked column (3 cols: Attention + Quick actions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 md:col-span-2 lg:col-span-5">
          <DashboardUpcomingPostsCard upcomingPosts={upcomingPosts} />
        </div>
        <div className="lg:col-span-4 md:col-span-1">
          <DashboardContentPillars />
        </div>
        <div className="lg:col-span-3 md:col-span-1 flex flex-col gap-4">
          <DashboardAttentionRequired
            failedPosts={failedPosts}
            onRetryPost={handleRetryPost}
            onManualPublish={handleManualPublish}
          />
          <DashboardQuickActions />
        </div>
      </div>

      {/* Interactive Modals */}
      <DashboardWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />

      <DashboardAgendaModal
        isOpen={isAgendaModalOpen}
        onClose={() => setIsAgendaModalOpen(false)}
      />
    </div>
  );
}
