'use client';

import React, { useState, useMemo } from 'react';
import LibraryHeader from './LibraryHeader';
import LibraryGrid from './LibraryGrid';
import LibraryList from './LibraryList';
import BulkUploadTable from './BulkUploadTable';

// BACKEND: GET /api/library?workspace=acme
const mockItems = [
  {
    id: 'lib-001',
    type: 'post',
    title: '10,000 customers milestone post',
    preview:
      "We just crossed 10,000 customers — here's what we learned about building trust at scale...",
    tags: ['milestone', 'thought-leadership', 'growth'],
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    savedAt: 'Sep 4, 2026',
    usageCount: 1,
    engagementRate: 7.4,
    status: 'published',
  },
  {
    id: 'lib-002',
    type: 'post',
    title: 'Onboarding time reduction case study',
    preview:
      'How we reduced our customer onboarding time by 62% in one quarter (full case study inside)...',
    tags: ['case-study', 'product', 'metrics'],
    author: 'Marcus Chen',
    authorInitials: 'MC',
    savedAt: 'Sep 2, 2026',
    usageCount: 1,
    engagementRate: 6.1,
    status: 'published',
  },
  {
    id: 'lib-003',
    type: 'caption',
    title: 'Product launch caption template',
    preview:
      "Excited to announce [PRODUCT NAME] — built for teams who [KEY BENEFIT]. Here's what makes it different...",
    tags: ['product-launch', 'template', 'announcement'],
    author: 'Jordan Patel',
    authorInitials: 'JP',
    savedAt: 'Aug 28, 2026',
    usageCount: 4,
    status: 'draft',
  },
  {
    id: 'lib-004',
    type: 'hashtag_set',
    title: 'B2B SaaS core hashtags',
    preview:
      '#B2BSaaS #SaaSMarketing #ContentMarketing #LinkedInMarketing #GrowthMarketing #ThoughtLeadership #StartupLife',
    tags: ['saas', 'b2b', 'marketing'],
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    savedAt: 'Aug 20, 2026',
    usageCount: 12,
    status: 'published',
  },
  {
    id: 'lib-005',
    type: 'post',
    title: 'Async work culture post',
    preview:
      'After 3 years of Slack-first culture, we made a decision that changed everything. We went async...',
    tags: ['culture', 'remote-work', 'productivity'],
    author: 'Lisa Tran',
    authorInitials: 'LT',
    savedAt: 'Aug 18, 2026',
    usageCount: 1,
    engagementRate: 5.8,
    status: 'published',
  },
  {
    id: 'lib-006',
    type: 'image',
    title: 'Team photo — SaaStr 2026',
    preview: 'Team photo from SaaStr Annual booth',
    tags: ['event', 'team', 'saas'],
    author: 'Lisa Tran',
    authorInitials: 'LT',
    savedAt: 'Aug 15, 2026',
    usageCount: 2,
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_13c515ccd-1773374405046.png',
    imageAlt: 'Team members gathered at SaaStr Annual conference booth smiling',
    status: 'published',
  },
  {
    id: 'lib-007',
    type: 'caption',
    title: 'Hiring post framework',
    preview:
      "We're looking for a [ROLE] to join our [TEAM] team. Here's why this role is different from every other [ROLE] job...",
    tags: ['hiring', 'talent', 'template'],
    author: 'Jordan Patel',
    authorInitials: 'JP',
    savedAt: 'Aug 12, 2026',
    usageCount: 6,
    status: 'draft',
  },
  {
    id: 'lib-008',
    type: 'hashtag_set',
    title: 'Hiring & culture hashtags',
    preview:
      '#Hiring #WeAreHiring #CompanyCulture #RemoteWork #TechJobs #StartupJobs #BuildingTeams',
    tags: ['hiring', 'culture', 'jobs'],
    author: 'Jordan Patel',
    authorInitials: 'JP',
    savedAt: 'Aug 10, 2026',
    usageCount: 8,
    status: 'published',
  },
  {
    id: 'lib-009',
    type: 'post',
    title: 'LinkedIn engagement question post',
    preview: "What's the biggest mistake companies make with LinkedIn? Drop your answer below...",
    tags: ['engagement', 'question', 'community'],
    author: 'Marcus Chen',
    authorInitials: 'MC',
    savedAt: 'Aug 8, 2026',
    usageCount: 1,
    engagementRate: 8.1,
    status: 'published',
  },
  {
    id: 'lib-010',
    type: 'image',
    title: 'Product dashboard screenshot',
    preview: 'Analytics dashboard feature screenshot',
    tags: ['product', 'screenshot', 'ui'],
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    savedAt: 'Aug 5, 2026',
    usageCount: 3,
    imageUrl: 'https://img.rocket.new/generatedImages/rocket_gen_img_14d48d999-1767793610166.png',
    imageAlt: 'Product analytics dashboard showing engagement metrics and charts',
    status: 'published',
  },
  {
    id: 'lib-011',
    type: 'caption',
    title: 'Thought leadership opener',
    preview:
      "The conventional wisdom on [TOPIC] is wrong. Here's what actually happens when you [ACTION]...",
    tags: ['thought-leadership', 'opener', 'template'],
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    savedAt: 'Aug 1, 2026',
    usageCount: 9,
    status: 'draft',
  },
  {
    id: 'lib-012',
    type: 'post',
    title: 'Page growth milestone post',
    preview:
      'The 5 LinkedIn habits that helped us grow our company page from 800 to 22,000 followers...',
    tags: ['growth', 'linkedin', 'strategy'],
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    savedAt: 'Jul 28, 2026',
    usageCount: 1,
    engagementRate: 3.9,
    status: 'published',
  },
];

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
