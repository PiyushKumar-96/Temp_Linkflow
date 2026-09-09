'use client';

import React, { useState } from 'react';
import ApprovalQueue from './ApprovalQueue';
import ApprovalDetail from './ApprovalDetail';
import { CheckSquare } from 'lucide-react';

// BACKEND: GET /api/posts?status=pending&workspace=acme
const mockPosts = [
  {
    id: 'appr-001',
    title: 'Why we switched from Slack to async communication...',
    content: `After 3 years of Slack-first culture, we made a decision that changed everything.\n\nWe went async.\n\nHere's what happened:\n\n→ Response time expectations dropped from "within 15 min" to "within 24 hrs"\n→ Deep work blocks went from 1.2 hrs/day to 4.8 hrs/day\n→ Team satisfaction scores jumped 34% in one quarter\n\nThe hardest part wasn't the tools. It was the mindset shift.\n\nNot every message is urgent. Not every question needs an immediate answer. Most decisions can wait.\n\nIf you're drowning in notifications, maybe the problem isn't your productivity system — it's your communication culture.\n\nWhat's your experience with async work? Would love to hear from teams who've made the switch.`,
    author: 'Lisa Tran',
    authorInitials: 'LT',
    authorRole: 'Brand Strategist',
    submittedAt: '2026-09-07 14:32',
    dueDate: '2026-09-09',
    status: 'pending',
    category: 'Thought Leadership',
    hashtags: ['#AsyncWork', '#RemoteWork', '#TeamCulture', '#Productivity'],
    revisions: 1,
    comments: [
      {
        id: 'cmt-001',
        author: 'Marcus Chen',
        authorInitials: 'MC',
        text: 'Love the data points. Can you add the specific tool you switched to? Makes it more concrete.',
        timestamp: '2026-09-07 15:10',
        type: 'comment',
      },
      {
        id: 'cmt-002',
        author: 'Lisa Tran',
        authorInitials: 'LT',
        text: 'Good point — updated. We use Loom + Notion for async video and docs.',
        timestamp: '2026-09-07 16:45',
        type: 'revision_request',
      },
    ],
  },
  {
    id: 'appr-002',
    title: 'How content marketing drives 40% of our inbound leads...',
    content: `Most SaaS companies treat content as a "nice to have."\n\nWe treated it as our primary growth channel — and it now drives 40% of inbound leads.\n\nHere's the exact playbook we used:\n\n1. Publish one long-form piece per week (not daily fluff)\n2. Repurpose each piece into 5 LinkedIn posts\n3. Track which posts drive demo requests (not just likes)\n4. Double down on the formats that convert\n\nThe insight that changed everything: engagement ≠ pipeline.\n\nA post with 500 reactions and 0 demo requests is entertainment. A post with 50 reactions and 8 demo requests is business.\n\nWe stopped optimizing for likes. We started optimizing for conversations.\n\nWhat's your content attribution model? Curious how other B2B teams measure this.`,
    author: 'Marcus Chen',
    authorInitials: 'MC',
    authorRole: 'Senior Writer',
    submittedAt: '2026-09-07 09:15',
    dueDate: '2026-09-10',
    status: 'pending',
    category: 'Case Study',
    hashtags: ['#ContentMarketing', '#B2BGrowth', '#LinkedInStrategy', '#Inbound'],
    revisions: 0,
    comments: [],
  },
  {
    id: 'appr-003',
    title: 'Celebrating 3 years of building in public!',
    content: `3 years ago today, we posted our first LinkedIn update.\n\n17 followers. No product. Just an idea.\n\nToday: 22,000 followers, 10,000+ customers, $4.2M ARR.\n\nThe one thing that made the difference? We shared everything — the wins, the failures, the pivots, the doubts.\n\nBuilding in public isn't a marketing strategy. It's a commitment to honesty.\n\nThank you to every person who followed along, commented, shared, or just lurked. You made this possible.\n\nHere's to the next 3 years. 🚀`,
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    authorRole: 'Content Manager',
    submittedAt: '2026-09-06 11:00',
    dueDate: '2026-09-09',
    status: 'approved',
    category: 'Company News',
    hashtags: ['#BuildingInPublic', '#Milestone', '#Gratitude', '#SaaS'],
    revisions: 0,
    comments: [
      {
        id: 'cmt-003',
        author: 'Jordan Patel',
        authorInitials: 'JP',
        text: 'This is great. Approved — schedule for Sep 15 at 9am.',
        timestamp: '2026-09-06 14:20',
        type: 'approval',
      },
    ],
  },
  {
    id: 'appr-004',
    title: 'Q3 product roadmap — transparency is a core value...',
    content: `Our Q3 roadmap is live.\n\nWe believe our customers deserve to know what we're building and why. So here it is:\n\n✅ AI post generation (shipped Aug 15)\n🔄 Team approval workflows (in progress — 80% done)\n📅 Advanced scheduling rules (Q3 target)\n📊 LinkedIn analytics integration (Q4)\n\nWhat's NOT on the roadmap (and why):\n\n❌ Twitter/X integration — our customers are LinkedIn-first\n❌ Agency white-labeling — we're building for internal teams, not agencies\n\nTransparency isn't just a value — it's a product strategy.\n\nWhat would you add to this list? Genuinely asking.`,
    author: 'Jordan Patel',
    authorInitials: 'JP',
    authorRole: 'Marketing Lead',
    submittedAt: '2026-09-05 16:30',
    dueDate: '2026-09-08',
    status: 'rejected',
    category: 'Product Update',
    hashtags: ['#ProductRoadmap', '#Transparency', '#SaaS', '#LinkedFlow'],
    revisions: 2,
    comments: [
      {
        id: 'cmt-004',
        author: 'Sarah Reeves',
        authorInitials: 'SR',
        text: "The ARR figure shouldn't be public yet — we haven't announced it. Please remove and resubmit.",
        timestamp: '2026-09-05 17:45',
        type: 'revision_request',
      },
      {
        id: 'cmt-005',
        author: 'Jordan Patel',
        authorInitials: 'JP',
        text: 'Understood — removed the ARR mention. Resubmitting.',
        timestamp: '2026-09-06 09:10',
        type: 'comment',
      },
      {
        id: 'cmt-006',
        author: 'Sarah Reeves',
        authorInitials: 'SR',
        text: "Still references the Q4 analytics integration — that timeline isn't confirmed. Rejecting for now — please align with product team first.",
        timestamp: '2026-09-06 10:30',
        type: 'rejection',
      },
    ],
  },
  {
    id: 'appr-005',
    title: 'The metrics that matter for B2B LinkedIn growth...',
    content: `Everyone tracks likes and followers.\n\nAlmost nobody tracks the metrics that actually predict pipeline.\n\nHere are the 4 LinkedIn metrics we obsess over:\n\n1. Profile visits per post — are viewers curious enough to learn more?\n2. Connection requests after posting — are the right people finding you?\n3. DMs from content — is your content starting conversations?\n4. Demo requests attributed to LinkedIn — is it actually driving revenue?\n\nLikes are vanity. Pipeline is sanity.\n\nWe built an entire attribution model around these 4 metrics. It changed how we write every post.\n\nSave this for your next content review.`,
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    authorRole: 'Content Manager',
    submittedAt: '2026-09-08 08:00',
    dueDate: '2026-09-11',
    status: 'pending',
    category: 'Educational',
    hashtags: ['#LinkedInMetrics', '#B2BMarketing', '#ContentROI', '#GrowthMarketing'],
    revisions: 0,
    comments: [],
  },
];

export default function ApprovalShell() {
  const [posts, setPosts] = useState(mockPosts);
  const [selectedId, setSelectedId] = useState(mockPosts[0].id);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);
  const selected = posts.find((p) => p.id === selectedId) || null;

  const handleApprove = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p)));
  };

  const handleReject = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p)));
  };

  const handleAddComment = (id, text) => {
    const newComment = {
      id: `cmt-${Date.now()}`,
      author: 'Sarah Reeves',
      authorInitials: 'SR',
      text,
      timestamp: '2026-09-08 08:00',
      type: 'comment',
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  const pendingCount = posts.filter((p) => p.status === 'pending').length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare size={20} className="text-primary" />
          <h1 className="text-2xl font-700 text-foreground">Approval Queue</h1>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-700 bg-warning/20 text-warning rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-500 rounded-md capitalize transition-all duration-150 ${
                filter === f
                  ? 'bg-card text-foreground card-shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Split panel */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5" style={{ minHeight: 640 }}>
        <div className="xl:col-span-2">
          <ApprovalQueue posts={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <div className="xl:col-span-3">
          {selected ? (
            <ApprovalDetail
              post={selected}
              onApprove={() => handleApprove(selected.id)}
              onReject={() => handleReject(selected.id)}
              onAddComment={(text) => handleAddComment(selected.id, text)}
            />
          ) : (
            <div className="card flex items-center justify-center h-full min-h-[400px]">
              <p className="text-sm text-muted-foreground">Select a post to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
