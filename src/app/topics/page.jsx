'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '@/styles/topics.css';
import {
  useTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useBulkRescheduleTopicsMutation,
} from './_api';
import TopicsHeader from './_components/TopicsHeader';
import TimelineView from './_components/TimelineView';
import TopicsListView from './_components/TopicsListView';
import TopicPlanningPanel from './_components/TopicPlanningPanel';
import { MONTH_DATA, computeMonthWeeks, parseDate } from './_components/MonthStepperHeader';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state to searchParams
  const rawView = searchParams.get('view');
  const activeView = rawView === 'list' ? 'list' : 'month';
  const selectedAccount = searchParams.get('account') || 'all';
  const search = searchParams.get('q') || '';
  const monthParam = searchParams.get('month'); // e.g. "09" or "9"
  const currentMonthIndex = monthParam !== null ? parseInt(monthParam, 10) - 1 : 8; // Default September (8)

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || (key === 'view' && value === 'month') || (key === 'month' && value === '09')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const setView = (view) => updateParam('view', view);
  const setAccount = (account) => updateParam('account', account);
  const setSearch = (q) => updateParam('q', q);
  const setMonthIndex = (idx) => {
    const mStr = String(idx + 1).padStart(2, '0');
    updateParam('month', mStr);
  };

  // Queries & Mutations
  const {
    data: topics = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTopicsQuery({
    account: selectedAccount,
    status: 'all',
    cadence: 'all',
    search,
  });

  const createTopic = useCreateTopicMutation();
  const updateTopic = useUpdateTopicMutation();
  const deleteTopic = useDeleteTopicMutation();
  const bulkRescheduleTopics = useBulkRescheduleTopicsMutation();

  // Side Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [draftSpan, setDraftSpan] = useState(null);

  // Open panel for new topic (header button click)
  const handleOpenCreate = () => {
    const monthInfo = MONTH_DATA[currentMonthIndex] || MONTH_DATA[8];
    const year = 2026;
    const allWeeks = computeMonthWeeks(year, monthInfo.index, monthInfo.days);

    const monthTopics = topics.filter((t) => {
      const start = parseDate(t.startDate || t.publicationDate);
      const end = parseDate(t.endDate || t.startDate || t.publicationDate);
      if (!start) return false;
      const startMonth = start.getUTCFullYear() === 2026 ? start.getUTCMonth() : -1;
      const endMonth = end ? (end.getUTCFullYear() === 2026 ? end.getUTCMonth() : 11) : startMonth;
      return monthInfo.index >= startMonth && monthInfo.index <= endMonth;
    });

    const openWeeks = allWeeks.filter((wk) => {
      const wkStart = parseDate(wk.startDateStr);
      const wkEnd = parseDate(wk.endDateStr);
      const isOccupied = monthTopics.some((t) => {
        const tStart = parseDate(t.startDate || t.publicationDate);
        const tEnd = parseDate(t.endDate || t.startDate || t.publicationDate);
        return tStart <= wkEnd && tEnd >= wkStart;
      });
      return !isOccupied;
    });

    const targetWeek = openWeeks.length > 0 ? openWeeks[0] : null;
    setSelectedTopic(null);
    setDraftSpan(
      targetWeek
        ? {
            startDate: targetWeek.startDateStr,
            endDate: targetWeek.endDateStr,
          }
        : null
    );
    setIsPanelOpen(true);
  };

  // Plan week clicked from plan tile (open week or custom)
  const handlePlanWeek = (wk) => {
    setSelectedTopic(null);
    setDraftSpan(
      wk
        ? {
            startDate: wk.startDateStr,
            endDate: wk.endDateStr,
          }
        : null
    );
    setIsPanelOpen(true);
  };

  // Select topic to edit in panel
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setDraftSpan(null);
    setIsPanelOpen(true);
  };

  const handleSaveTopic = async (formData) => {
    if (formData.id) {
      await updateTopic.mutateAsync({
        id: formData.id,
        updates: formData,
      });
    } else {
      await createTopic.mutateAsync(formData);
    }
    setIsPanelOpen(false);
    setSelectedTopic(null);
    setDraftSpan(null);
  };

  const handleDeleteTopic = async (id) => {
    await deleteTopic.mutateAsync(id);
    setIsPanelOpen(false);
    setSelectedTopic(null);
  };

  const handleBulkReschedule = (ids, days) => {
    bulkRescheduleTopics.mutate({ ids, days });
  };


  return (
    <div className="tpc flex flex-col gap-4 max-w-7xl mx-auto pb-12">
      {/* Minimal Top Bar Navigation */}
      <TopicsHeader
        activeView={activeView}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        selectedAccount={selectedAccount}
        onAccountChange={setAccount}
        onOpenCreate={handleOpenCreate}
        totalCount={topics.length}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="card p-8 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={24} />
          <p className="text-xs text-muted-foreground">Loading topics wall...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="card p-8 flex flex-col items-center justify-center gap-3 border-destructive/30 bg-destructive/5 text-center">
          <AlertCircle size={28} className="text-destructive" />
          <h3 className="text-sm font-bold text-foreground">Failed to load topics</h3>
          <p className="text-xs text-muted-foreground max-w-md">
            {error?.message || 'Network error occurred'}
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-outline text-xs mt-2 flex items-center gap-1.5"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Main View Display with Two-Pane Side Panel */}
      {!isLoading && !isError && (
        <div className="tpc-layout-with-panel">
          <div className="tpc-layout-main">
            {activeView === 'month' ? (
              <TimelineView
                topics={topics}
                currentMonthIndex={currentMonthIndex}
                onMonthChange={setMonthIndex}
                selectedTopicId={selectedTopic?.id}
                onSelectTopic={handleSelectTopic}
                onPlanWeek={handlePlanWeek}
              />
            ) : (
              <TopicsListView
                topics={topics}
                currentMonthIndex={currentMonthIndex}
                onMonthChange={setMonthIndex}
                onPlanTopic={handleOpenCreate}
                onEditTopic={handleSelectTopic}
                onDeleteTopic={handleDeleteTopic}
                onStartGeneration={() => {}}
                onBulkReschedule={handleBulkReschedule}
                onBulkDelete={(ids) => ids.forEach((id) => deleteTopic.mutate(id))}
              />
            )}
          </div>

          {/* Side Planning Panel */}
          <TopicPlanningPanel
            isOpen={isPanelOpen}
            onClose={() => {
              setIsPanelOpen(false);
              setSelectedTopic(null);
              setDraftSpan(null);
            }}
            topic={selectedTopic}
            initialDraft={draftSpan}
            onSave={handleSaveTopic}
            onDelete={handleDeleteTopic}
            isSubmitting={createTopic.isPending || updateTopic.isPending}
          />
        </div>
      )}
    </div>
  );
}
