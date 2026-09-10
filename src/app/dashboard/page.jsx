'use client';

import React, { useState, useEffect } from 'react';
import { useApprovalPosts } from '@/app/approval-workflow/_api/queries';
import { useTopicsQuery } from '@/app/topics/_api/queries';
import { useQueryClient } from '@tanstack/react-query';
import DashboardHeader from './_components/DashboardHeader';
import DashboardFailuresSection from './_components/DashboardFailuresSection';
import DashboardPendingReview from './_components/DashboardPendingReview';
import DashboardUpcomingPosts from './_components/DashboardUpcomingPosts';
import DashboardRecentlyPublished from './_components/DashboardRecentlyPublished';
import { getUpcomingPosts, getRecentlyPublishedPosts, updatePost } from '@/temp-backend';
import { toast } from 'sonner';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { data: allPosts = [] } = useApprovalPosts();
  const { data: topics = [] } = useTopicsQuery();

  const [upcomingPosts, setUpcomingPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);

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
          actor: 'Operations User',
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
    const mdContent = `# ${post.title}\n\n${post.content}\n\n${(post.hashtags || []).join(' ')}\n\n---\nTarget Account: ${post.category}\nFormat: ${post.visualFormat || 'Image'}\nDownload Date: ${new Date().toISOString()}`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await updatePostStatus(post.id, 'manual');
    toast.success('Downloaded publication package & marked as Manual Publish');
  };

  const handleQuickApprove = async (postId) => {
    await updatePostStatus(postId, 'approved');
    toast.success('Post approved and queued for scheduling');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      <DashboardHeader
        pendingReviewCount={pendingPosts.length}
        upcomingCount={upcomingPosts.length}
        failureCount={failedPosts.length}
        topicsCount={topics.length}
      />

      {/* The loudest section on the page */}
      <DashboardFailuresSection
        failedPosts={failedPosts}
        onRetryPost={handleRetryPost}
        onManualPublish={handleManualPublish}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashboardPendingReview
          pendingPosts={pendingPosts}
          onQuickApprove={handleQuickApprove}
        />
        <DashboardUpcomingPosts upcomingPosts={upcomingPosts} />
      </div>

      <DashboardRecentlyPublished publishedPosts={publishedPosts} />
    </div>
  );
}
