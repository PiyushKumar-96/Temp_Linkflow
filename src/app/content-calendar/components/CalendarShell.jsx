'use client';

import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';

// Mock posts — BACKEND: GET /api/posts?month=2026-09
const mockPosts = [
  {
    id: 'cal-001',
    title: "We just crossed 10,000 customers — here's what we learned...",
    status: 'published',
    date: '2026-09-04',
    time: '10:00',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    category: 'Thought Leadership',
  },
  {
    id: 'cal-002',
    title: 'How we reduced onboarding time by 62% in one quarter...',
    status: 'published',
    date: '2026-09-02',
    time: '12:00',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    category: 'Case Study',
  },
  {
    id: 'cal-003',
    title: 'New AI-powered analytics dashboard is live!',
    status: 'published',
    date: '2026-08-31',
    time: '09:00',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    category: 'Product Update',
  },
  {
    id: 'cal-004',
    title: "We're hiring a Senior Product Designer...",
    status: 'published',
    date: '2026-08-27',
    time: '11:00',
    author: 'Jordan Patel',
    authorInitials: 'JP',
    category: 'Hiring',
  },
  {
    id: 'cal-005',
    title: 'Join us at SaaStr Annual next week!',
    status: 'published',
    date: '2026-08-25',
    time: '14:00',
    author: 'Lisa Tran',
    authorInitials: 'LT',
    category: 'Event',
  },
  {
    id: 'cal-006',
    title: "What's the biggest LinkedIn mistake? Drop your answer...",
    status: 'published',
    date: '2026-08-21',
    time: '10:00',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    category: 'Engagement',
  },
  {
    id: 'cal-007',
    title: 'The 5 LinkedIn habits that grew our page to 22k...',
    status: 'scheduled',
    date: '2026-09-10',
    time: '12:00',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    category: 'Thought Leadership',
  },
  {
    id: 'cal-008',
    title: 'Q3 product roadmap — transparency is a core value...',
    status: 'scheduled',
    date: '2026-09-12',
    time: '10:00',
    author: 'Jordan Patel',
    authorInitials: 'JP',
    category: 'Product Update',
  },
  {
    id: 'cal-009',
    title: 'Celebrating 3 years of building in public!',
    status: 'approved',
    date: '2026-09-15',
    time: '09:00',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    category: 'Company News',
  },
  {
    id: 'cal-010',
    title: 'Why we switched from Slack to async communication...',
    status: 'pending',
    date: '2026-09-17',
    time: '11:00',
    author: 'Lisa Tran',
    authorInitials: 'LT',
    category: 'Thought Leadership',
  },
  {
    id: 'cal-011',
    title: 'How content marketing drives 40% of our inbound leads...',
    status: 'pending',
    date: '2026-09-19',
    time: '12:00',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    category: 'Case Study',
  },
  {
    id: 'cal-012',
    title: "We're expanding to EMEA — here's our story...",
    status: 'draft',
    date: '2026-09-22',
    time: '10:00',
    author: 'Jordan Patel',
    authorInitials: 'JP',
    category: 'Company News',
  },
  {
    id: 'cal-013',
    title: 'The metrics that matter for B2B LinkedIn growth...',
    status: 'scheduled',
    date: '2026-09-24',
    time: '12:00',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    category: 'Educational',
  },
  {
    id: 'cal-014',
    title: 'Open question: What content do you want more of?',
    status: 'draft',
    date: '2026-09-26',
    time: '14:00',
    author: 'Lisa Tran',
    authorInitials: 'LT',
    category: 'Engagement',
  },
  {
    id: 'cal-015',
    title: 'End of Q3 retrospective — wins, lessons, next steps...',
    status: 'draft',
    date: '2026-09-30',
    time: '09:00',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    category: 'Thought Leadership',
  },
];

export default function CalendarShell() {
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date('2026-09-01'));
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterMember, setFilterMember] = useState('all');

  const filteredPosts =
    filterMember === 'all' ? mockPosts : mockPosts.filter((p) => p.authorInitials === filterMember);

  return (
    <div className="flex flex-col gap-5">
      <CalendarHeader
        view={view}
        onViewChange={setView}
        currentDate={currentDate}
        onNavigate={setCurrentDate}
        filterMember={filterMember}
        onFilterChange={setFilterMember}
      />

      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          posts={filteredPosts}
          selectedPost={selectedPost}
          onSelectPost={setSelectedPost}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          posts={filteredPosts}
          selectedPost={selectedPost}
          onSelectPost={setSelectedPost}
        />
      )}
    </div>
  );
}
