'use client';

import React, { useState, useMemo, useEffect } from 'react';
import LibraryHeader from './LibraryHeader';
import LibraryGrid from './LibraryGrid';
import LibraryList from './LibraryList';
import BulkUploadTable from './BulkUploadTable';
import '@/styles/library.css';

import { LIBRARY_ITEMS } from '@/temp-backend/data/content-library';
import { getStoredPosts } from '@/temp-backend';

import { SAMPLE_POSTS } from './bulkUploadHelpers';

function isApprovedStatus(status) {
  return status === 'approved' || status === 'scheduled' || status === 'published';
}

export default function LibraryShell() {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkPosts, setBulkPosts] = useState(() => SAMPLE_POSTS);
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
      if (
        !e ||
        !e.key ||
        e.key === 'linkedflow_master_posts' ||
        e.key === 'linkedflow_approval_posts'
      ) {
        setVersion((v) => v + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('linkedflow_posts_updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('linkedflow_posts_updated', handleStorage);
    };
  }, []);

  const approvedLibraryItems = useMemo(() => {
    const storedPosts = getStoredPosts();
    let approvalStored = [];
    try {
      const raw = localStorage.getItem('linkedflow_approval_posts');
      if (raw) approvalStored = JSON.parse(raw);
    } catch {
      // ignore
    }

    const combinedPosts = [...storedPosts];
    approvalStored.forEach((p) => {
      const idx = combinedPosts.findIndex((item) => item.id === p.id);
      if (idx !== -1) {
        combinedPosts[idx] = { ...combinedPosts[idx], ...p };
      } else {
        combinedPosts.push(p);
      }
    });

    // 1. Only approved, scheduled, or published posts from master storage
    const fromPosts = combinedPosts
      .filter((p) => isApprovedStatus(p.status))
      .map((p) => {
        const isPub = p.status === 'published';
        const formattedPublishDate = isPub
          ? p.publishedDate ||
            (p.publishedAt
              ? new Date(p.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Published')
          : p.scheduledDate
            ? `${p.scheduledDate}${p.scheduledTime ? ` · ${p.scheduledTime}` : ''}`
            : 'Scheduled';

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
    const fromLibrary = LIBRARY_ITEMS.filter((item) => isApprovedStatus(item.status)).map(
      (item) => ({
        ...item,
        source: item.source || 'composer',
        publishDate: item.savedAt || 'Published',
      })
    );

    // Deduplicate by ID
    const existingIds = new Set(fromPosts.map((p) => p.id));
    return [...fromPosts, ...fromLibrary.filter((item) => !existingIds.has(item.id))];
  }, [version]);

  const statusCounts = useMemo(() => {
    let published = 0;
    let scheduled = 0;
    approvedLibraryItems.forEach((item) => {
      if (item.status === 'published') published++;
      if (item.status === 'scheduled' || item.status === 'approved') scheduled++;
    });
    return { published, scheduled };
  }, [approvedLibraryItems]);

  const sourceCounts = useMemo(() => {
    const counts = {
      all: 0,
      composer: 0,
      ai_generator: 0,
      bulk_upload: 0,
    };
    approvedLibraryItems
      .filter((item) => {
        return (
          statusFilter === 'all' ||
          item.status === statusFilter ||
          (statusFilter === 'scheduled' && item.status === 'approved')
        );
      })
      .forEach((item) => {
        counts.all++;
        const src = item.source || 'composer';
        if (counts[src] !== undefined) {
          counts[src]++;
        }
      });
    return counts;
  }, [approvedLibraryItems, statusFilter]);

  const filtered = useMemo(() => {
    return approvedLibraryItems.filter((item) => {
      const matchesSource = sourceFilter === 'all' || (item.source || 'composer') === sourceFilter;
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

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  // Reset to page 1 whenever the result set changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sourceFilter, typeFilter, statusFilter]);

  const totalFilteredCount = filtered.length;
  const totalPages = Math.ceil(totalFilteredCount / PAGE_SIZE);
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, PAGE_SIZE]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const container = document.querySelector('.lib');
    if (container) {
      container.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedIds(filtered.map((i) => i.id));
  const clearSelection = () => setSelectedIds([]);

  const startItem = (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, totalFilteredCount);

  return (
    <div className="lib flex flex-col gap-6">
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
        statusCounts={statusCounts}
        totalCount={view === 'bulk' ? bulkPosts.length : filtered.length}
        selectedCount={selectedIds.length}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />

      {view === 'grid' && (
        <LibraryGrid
          items={paginatedItems}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}
      {view === 'list' && (
        <LibraryList
          items={paginatedItems}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}
      {view === 'bulk' && <BulkUploadTable posts={bulkPosts} onPostsChange={setBulkPosts} />}

      {view !== 'bulk' && totalFilteredCount > PAGE_SIZE && (
        <div className="lib-pagination">
          <p className="lib-pagination-count">
            Showing {startItem}–{endItem} of {totalFilteredCount}
          </p>
          <div className="lib-pagination-controls" role="navigation" aria-label="Pagination">
            <button
              type="button"
              className="lib-pagination-btn"
              disabled={safePage <= 1}
              onClick={() => handlePageChange(safePage - 1)}
              aria-label="Previous page"
            >
              Previous
            </button>

            <div className="lib-pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className="lib-pagination-page"
                  aria-current={p === safePage ? 'page' : undefined}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="lib-pagination-btn"
              disabled={safePage >= totalPages}
              onClick={() => handlePageChange(safePage + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
