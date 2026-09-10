'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useBulkUpdateTopicsMutation,
  useStartTopicGenerationMutation,
} from './_api';
import TopicsHeader from './_components/TopicsHeader';
import TopicsYearView from './_components/TopicsYearView';
import TopicsListView from './_components/TopicsListView';
import TopicFormDialog from './_components/TopicFormDialog';
import BulkReassignSeriesModal from './_components/BulkReassignSeriesModal';
import { Target, AlertCircle, RefreshCw, Plus } from 'lucide-react';

export default function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state to searchParams
  const activeView = searchParams.get('view') || 'year';
  const selectedSeries = searchParams.get('series') || 'all';
  const selectedAccount = searchParams.get('account') || 'all';
  const selectedStatus = searchParams.get('status') || 'all';
  const search = searchParams.get('q') || '';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const setView = (view) => updateParam('view', view);
  const setSeries = (series) => updateParam('series', series);
  const setAccount = (account) => updateParam('account', account);
  const setStatus = (status) => updateParam('status', status);
  const setSearch = (q) => updateParam('q', q);

  // Queries & Mutations
  const { data: topics = [], isLoading, isError, error, refetch } = useTopicsQuery({
    series: selectedSeries,
    account: selectedAccount,
    status: selectedStatus,
    search,
  });

  const createTopic = useCreateTopicMutation();
  const updateTopic = useUpdateTopicMutation();
  const deleteTopic = useDeleteTopicMutation();
  const bulkUpdate = useBulkUpdateTopicsMutation();
  const startGeneration = useStartTopicGenerationMutation();

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [initialDateForCreate, setInitialDateForCreate] = useState(null);

  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [reassignTopicIds, setReassignTopicIds] = useState([]);

  const handleOpenCreate = (prefillDate = null) => {
    setEditingTopic(null);
    setInitialDateForCreate(prefillDate);
    setIsFormOpen(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setInitialDateForCreate(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingTopic) {
      await updateTopic.mutateAsync({
        id: editingTopic.id,
        updates: formData,
      });
    } else {
      await createTopic.mutateAsync(formData);
    }
    setIsFormOpen(false);
    setEditingTopic(null);
  };

  const handleBulkReschedule = (ids, days) => {
    const topicMap = new Map(topics.map((t) => [t.id, t]));
    ids.forEach((id) => {
      const current = topicMap.get(id);
      if (current) {
        const currentDate = new Date(current.publicationDate);
        currentDate.setDate(currentDate.getDate() + days);
        const newDateStr = currentDate.toISOString().split('T')[0];
        updateTopic.mutate({
          id,
          updates: { publicationDate: newDateStr },
        });
      }
    });
  };

  const handleOpenBulkReassign = (ids) => {
    setReassignTopicIds(ids);
    setIsReassignOpen(true);
  };

  const handleConfirmBulkReassign = (ids, seriesId, seriesName) => {
    bulkUpdate.mutate({
      ids,
      updates: { seriesId, seriesName },
    });
  };

  const handleBulkDelete = (ids) => {
    ids.forEach((id) => deleteTopic.mutate(id));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <TopicsHeader
        activeView={activeView}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        selectedSeries={selectedSeries}
        onSeriesChange={setSeries}
        selectedAccount={selectedAccount}
        onAccountChange={setAccount}
        selectedStatus={selectedStatus}
        onStatusChange={setStatus}
        onOpenCreate={() => handleOpenCreate(null)}
        totalCount={topics.length}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="card p-8 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={24} />
          <p className="text-xs text-muted-foreground">Loading planned topics roadmap...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="card p-8 flex flex-col items-center justify-center gap-3 border-destructive/30 bg-destructive/5 text-center">
          <AlertCircle size={28} className="text-destructive" />
          <h3 className="text-sm font-bold text-foreground">Failed to load topics</h3>
          <p className="text-xs text-muted-foreground max-w-md">{error?.message || 'Network error occurred'}</p>
          <button onClick={() => refetch()} className="btn btn-outline text-xs mt-2 flex items-center gap-1.5">
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* Main View Display */}
      {!isLoading && !isError && (
        <>
          {activeView === 'year' ? (
            <TopicsYearView
              topics={topics}
              onEditTopic={handleEditTopic}
              onAddTopicForMonth={(monthDate) => handleOpenCreate(monthDate)}
              onStartGeneration={(id) => startGeneration.mutate(id)}
            />
          ) : (
            <TopicsListView
              topics={topics}
              onEditTopic={handleEditTopic}
              onDeleteTopic={(id) => deleteTopic.mutate(id)}
              onStartGeneration={(id) => startGeneration.mutate(id)}
              onBulkReschedule={handleBulkReschedule}
              onBulkReassignSeries={handleOpenBulkReassign}
              onBulkDelete={handleBulkDelete}
            />
          )}
        </>
      )}

      {/* Topic Create/Edit Modal */}
      <TopicFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTopic(null);
        }}
        initialData={editingTopic}
        initialDate={initialDateForCreate}
        onSubmit={handleFormSubmit}
        isSubmitting={createTopic.isPending || updateTopic.isPending}
      />

      {/* Bulk Reassign Modal */}
      <BulkReassignSeriesModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        topicIds={reassignTopicIds}
        onConfirm={handleConfirmBulkReassign}
      />
    </div>
  );
}
