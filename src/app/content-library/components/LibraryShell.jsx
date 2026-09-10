'use client';

import React, { useState, useMemo, useEffect } from 'react';
import LibraryHeader from './LibraryHeader';
import LibraryGrid from './LibraryGrid';
import LibraryList from './LibraryList';
import BulkUploadTable from './BulkUploadTable';

import { LIBRARY_ITEMS } from '@/temp-backend/data/content-library';
import { getStoredPosts } from '@/temp-backend';

function isApprovedStatus(status) {
  return (
    status === 'approved' ||
    status === 'scheduled' ||
    status === 'published'
  );
}

export default function LibraryShell() {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkPosts, setBulkPosts] = useState([]);
  const [version, setVersion] = useState(0);

  // Sync when posts are approved or updated in storage & sanitize legacy Bulk author
  useEffect(() => {
    try {
      ['linkedflow_master_posts', 'linkedflow_approval_posts'].forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw && (raw.includes('Bulk Spreadsheet') || raw.includes('"Bulk"'))) {
          const parsed = JSON.parse(raw);
          const sanitized = parsed.map((p) => {
            if (p.author === 'Bulk Spreadsheet' || p.author === 'Bulk') {
              return { ...p, author: 'Sarah Reeves', authorInitials: 'SR' };
            }
            return p;
          });
          localStorage.setItem(key, JSON.stringify(sanitized));
        }
      });
    } catch {
      // ignore
    }

    const handleStorage = (e) => {
      if (e.key === 'linkedflow_master_posts' || e.key === 'linkedflow_approval_posts') {
        setVersion((v) => v + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const approvedLibraryItems = useMemo(() => {
    const storedPosts = getStoredPosts();

    // 1. Only approved, scheduled, or published posts from master storage
    const fromPosts = storedPosts
      .filter((p) => isApprovedStatus(p.status))
      .map((p) => {
        const isPub = p.status === 'published';
        const formattedPublishDate = isPub
          ? p.publishedDate || (p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Published')
          : p.scheduledDate ? `${p.scheduledDate}${p.scheduledTime ? ` · ${p.scheduledTime}` : ''}` : 'Scheduled';

        const safeAuthor =
          !p.author || p.author.toLowerCase().includes('bulk') ? 'Sarah Reeves' : p.author;
        const safeInitials =
          !p.authorInitials || p.authorInitials === 'BS' ? 'SR' : p.authorInitials;

        return {
          id: p.id,
          source: p.source || 'composer',
          type:
            p.visualFormat === 'carousel'
              ? 'carousel'
              : p.visualFormat === 'infographic'
              ? 'infographic'
              : p.imageUrl || (p.mediaUrls && p.mediaUrls.length > 0)
              ? 'image'
              : 'post',
          title: p.title || p.excerpt || (p.content || '').slice(0, 50),
          preview: p.content || p.excerpt || '',
          tags: Array.isArray(p.hashtags)
            ? p.hashtags.map((h) => h.replace('#', ''))
            : [p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : 'thought-leadership'],
          author: safeAuthor,
          authorInitials: safeInitials,
          publishDate: formattedPublishDate,
          savedAt: formattedPublishDate,
          engagementRate: p.engagementRate || p.engRate || null,
          status: p.status === 'approved' ? 'scheduled' : p.status,
          imageUrl: p.imageUrl || (p.mediaUrls && p.mediaUrls[0]) || null,
        };
      });

    // 2. Only approved/published items from LIBRARY_ITEMS
    const fromLibrary = LIBRARY_ITEMS.filter((item) => isApprovedStatus(item.status)).map((item) => ({
      ...item,
      source: item.source || 'composer',
      publishDate: item.savedAt || 'Published',
    }));

    // Deduplicate by ID
    const existingIds = new Set(fromPosts.map((p) => p.id));
    return [...fromPosts, ...fromLibrary.filter((item) => !existingIds.has(item.id))];
  }, [version]);

  const sourceCounts = useMemo(() => {
    const counts = { all: approvedLibraryItems.length, composer: 0, ai_generator: 0, bulk_upload: 0 };
    approvedLibraryItems.forEach((item) => {
      const src = item.source || 'composer';
      if (counts[src] !== undefined) {
        counts[src]++;
      }
    });
    return counts;
  }, [approvedLibraryItems]);

  const filtered = useMemo(() => {
    return approvedLibraryItems.filter((item) => {
      const matchesSource =
        sourceFilter === 'all' || (item.source || 'composer') === sourceFilter;
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.preview.toLowerCase().includes(search.toLowerCase()) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter ||
        (statusFilter === 'scheduled' && item.status === 'approved');
      return matchesSource && matchesSearch && matchesType && matchesStatus;
    });
  }, [approvedLibraryItems, sourceFilter, search, typeFilter, statusFilter]);

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
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        sourceCounts={sourceCounts}
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
