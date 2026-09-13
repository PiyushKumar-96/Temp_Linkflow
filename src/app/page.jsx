'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnalyticsHeader from './_components/AnalyticsHeader';
import MetricsBentoGrid from './_components/MetricsBentoGrid';
import EngagementTrendChart from './_components/EngagementTrendChart';
import PostTypeBreakdownChart from './_components/PostTypeBreakdownChart';
import TopPostsTable from './_components/TopPostsTable';
import BestTimeHeatmap from './_components/BestTimeHeatmap';
import { getPostById } from '@/temp-backend';
import { Eye, ThumbsUp, MessageSquare, TrendingUp, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AnalyticsDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeParam = searchParams.get('range') || 'range-30d';
  const activeRange = rangeParam.startsWith('range-') ? rangeParam : `range-${rangeParam}`;
  const highlightedPostId = searchParams.get('post') || searchParams.get('highlight');

  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('4 min ago');

  // Load selected post if query param exists
  useEffect(() => {
    let cancelled = false;
    async function loadPost() {
      if (highlightedPostId) {
        try {
          const post = await getPostById(highlightedPostId);
          if (!cancelled) {
            setSelectedPost(post);
          }
        } catch {
          if (!cancelled) setSelectedPost(null);
        }
      } else {
        setSelectedPost(null);
      }
    }
    loadPost();
    return () => {
      cancelled = true;
    };
  }, [highlightedPostId]);

  const handleRangeChange = (newRange) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('range', newRange);
    setSearchParams(nextParams);
  };

  const handleClearPostFocus = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('post');
    nextParams.delete('highlight');
    setSearchParams(nextParams);
    setSelectedPost(null);
  };

  const handleSelectPostFromTable = (postId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('post', postId);
    nextParams.set('highlight', postId);
    setSearchParams(nextParams);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshKey((k) => k + 1);
    setLastUpdated('Just now');
    setIsRefreshing(false);
    toast.success('Analytics refreshed with latest LinkedIn metrics');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      <AnalyticsHeader
        activeRange={activeRange}
        onRangeChange={handleRangeChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Focused Post Metric Banner when redirected from Dashboard or clicked */}
      {selectedPost && (
        <div className="card border-2 border-primary/30 bg-primary/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Viewing Post Analytics
                </span>
                <span className="text-xs text-muted-foreground">
                  Published:{' '}
                  <span className="text-foreground font-medium">
                    {selectedPost.publishedDate || 'Recent'}
                  </span>
                </span>
                {selectedPost.targetAccount && (
                  <span className="text-xs text-muted-foreground">
                    Target:{' '}
                    <span className="text-foreground font-medium">
                      {selectedPost.targetAccount}
                    </span>
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-foreground mt-1 line-clamp-1">
                {selectedPost.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 bg-card px-3 py-1.5 rounded-lg border border-border text-xs">
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <Eye size={13} className="text-primary" />
                <span>{selectedPost.impressions?.toLocaleString() || '14,280'}</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <ThumbsUp size={13} className="text-primary" />
                <span>{selectedPost.reactions || '342'}</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <MessageSquare size={13} className="text-primary" />
                <span>{selectedPost.comments || selectedPost.commentsCount || '58'}</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <TrendingUp size={13} />
                <span>{selectedPost.engRate || selectedPost.engagementRate || '5.2'}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearPostFocus}
              className="p-1.5 rounded-lg hover:bg-card border border-border text-muted-foreground hover:text-foreground text-xs flex items-center gap-1"
              title="Clear post filter"
            >
              <X size={14} />
              <span className="hidden sm:inline">View all</span>
            </button>
          </div>
        </div>
      )}

      <MetricsBentoGrid activeRange={activeRange} refreshKey={refreshKey} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <EngagementTrendChart activeRange={activeRange} refreshKey={refreshKey} />
        </div>
        <div className="xl:col-span-1">
          <PostTypeBreakdownChart />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopPostsTable
            range={activeRange}
            highlightPostId={highlightedPostId}
            onSelectPost={handleSelectPostFromTable}
            refreshKey={refreshKey}
          />
        </div>
        <div className="xl:col-span-1">
          <BestTimeHeatmap />
        </div>
      </div>
    </div>
  );
}
