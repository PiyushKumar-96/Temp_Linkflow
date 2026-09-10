'use client';

import React, { useState, useMemo } from 'react';
import LibraryHeader from './LibraryHeader';
import LibraryGrid from './LibraryGrid';
import LibraryList from './LibraryList';
import BulkUploadTable from './BulkUploadTable';

import { LIBRARY_ITEMS } from '@/temp-backend/data/content-library';

const mockItems = LIBRARY_ITEMS;

export default function LibraryShell() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkPosts, setBulkPosts] = useState([]);

  const filtered = useMemo(() => {
    return mockItems.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.preview.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.includes(search.toLowerCase()));
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedIds(filtered.map((i) => i.id));
  const clearSelection = () => setSelectedIds([]);

  return (
    <div className="flex flex-col gap-5">
      <LibraryHeader
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalCount={view === 'bulk' ? bulkPosts.length : filtered.length}
        selectedCount={selectedIds.length}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />

      {view === 'grid' && (
        <LibraryGrid items={filtered} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
      )}
      {view === 'list' && (
        <LibraryList items={filtered} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
      )}
      {view === 'bulk' && <BulkUploadTable posts={bulkPosts} onPostsChange={setBulkPosts} />}
    </div>
  );
}
