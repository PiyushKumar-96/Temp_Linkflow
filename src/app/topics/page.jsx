'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useTopicsQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useBulkUpdateTopicsMutation,
  useBulkCreateTopicsMutation,
  useStartTopicGenerationMutation,
} from './_api';
import TopicsHeader from './_components/TopicsHeader';
import TopicsYearView from './_components/TopicsYearView';
import TopicsListView from './_components/TopicsListView';
import TopicFormDialog from './_components/TopicFormDialog';
import MonthBatchPlanDialog from './_components/MonthBatchPlanDialog';
import BulkReassignSeriesModal from './_components/BulkReassignSeriesModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function TopicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state to searchParams
  const activeView = searchParams.get('view') || 'year';
  const selectedSeries = searchParams.get('series') || 'all';
  const selectedAccount = searchParams.get('account') || 'all';
  const selectedStatus = searchParams.get('status') || 'all';
  const selectedCadence = searchParams.get('cadence') || 'all';
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
  const setCadence = (cadence) => updateParam('cadence', cadence);
  const setSearch = (q) => updateParam('q', q);

  // Queries & Mutations
  const { data: topics = [], isLoading, isError, error, refetch } = useTopicsQuery({
    series: selectedSeries,
    account: selectedAccount,
    status: selectedStatus,
    cadence: selectedCadence,
    search,
  });

  const createTopic = useCreateTopicMutation();
  const updateTopic = useUpdateTopicMutation();
  const deleteTopic = useDeleteTopicMutation();
  const bulkUpdate = useBulkUpdateTopicsMutation();
  const bulkCreate = useBulkCreateTopicsMutation();
  const startGeneration = useStartTopicGenerationMutation();

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [initialDateForCreate, setInitialDateForCreate] = useState(null);
  const [initialCadenceForCreate, setInitialCadenceForCreate] = useState('custom');

  const [batchPlanMonth, setBatchPlanMonth] = useState(null);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [reassignTopicIds, setReassignTopicIds] = useState([]);

  const handleOpenCreate = ({ monthDate = null, cadence = 'custom' } = {}) => {
    setEditingTopic(null);
    setInitialDateForCreate(monthDate);
    setInitialCadenceForCreate(cadence);
    setIsFormOpen(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setInitialDateForCreate(topic.startDate || topic.publicationDate);
    setInitialCadenceForCreate(topic.cadence || 'custom');
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
        const shift = (dStr) => {
          if (!dStr) return dStr;
          const d = new Date(dStr);
          d.setDate(d.getDate() + days);
          return d.toISOString().split('T')[0];
        };
        updateTopic.mutate({
          id,
          updates: {
            publicationDate: shift(current.publicationDate),
            startDate: shift(current.startDate || current.publicationDate),
            endDate: shift(current.endDate || current.startDate || current.publicationDate),
          },
        });
      }
    });
  };

  const handleConfirmBatchPlan = async (generatedSlots) => {
    await bulkCreate.mutateAsync(generatedSlots);
    setBatchPlanMonth(null);
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
        selectedCadence={selectedCadence}
        onCadenceChange={setCadence}
        onOpenCreate={() => handleOpenCreate({ cadence: 'custom' })}
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
              onAddTopic={handleOpenCreate}
              onBatchPlanMonth={(month) => setBatchPlanMonth(month)}
              onStartGeneration={(id) => startGeneration.mutate(id)}
            />
          ) : (
            <TopicsListView
              topics={topics}
              onEditTopic={handleEditTopic}
              onDeleteTopic={(id) => deleteTopic.mutate(id)}
              onStartGeneration={(id) => startGeneration.mutate(id)}
              onBulkReschedule={handleBulkReschedule}
              onBulkReassignSeries={(ids) => {
                setReassignTopicIds(ids);
                setIsReassignOpen(true);
              }}
              onBulkDelete={(ids) => ids.forEach((id) => deleteTopic.mutate(id))}
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
        initialCadence={initialCadenceForCreate}
        onSubmit={handleFormSubmit}
        isSubmitting={createTopic.isPending || updateTopic.isPending}
      />

      {/* Month Batch Plan Modal */}
      <MonthBatchPlanDialog
        isOpen={Boolean(batchPlanMonth)}
        onClose={() => setBatchPlanMonth(null)}
        monthKey={batchPlanMonth?.key || '2026-01'}
        monthName={batchPlanMonth?.name || ''}
        onConfirm={handleConfirmBatchPlan}
        isSubmitting={bulkCreate.isPending}
      />

      {/* Bulk Reassign Modal */}
      <BulkReassignSeriesModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        topicIds={reassignTopicIds}
        onConfirm={(ids, sId, sName) => bulkUpdate.mutate({ ids, updates: { seriesId: sId, seriesName: sName } })}
      />
    </div>
  );
}
