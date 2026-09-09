'use client';

import React, { useState } from 'react';
import TemplatesHeader from './TemplatesHeader';
import TemplatesGrid from './TemplatesGrid';
import TemplateEditModal from './TemplateEditModal';

// BACKEND: GET /api/templates?workspace=acme
const mockTemplates = [
  {
    id: 'tpl-001',
    name: 'Milestone Announcement',
    category: 'Thought Leadership',
    description: 'Celebrate a company or personal milestone with context and gratitude',
    body: `[NUMBER] [UNIT] ago, we [STARTING POINT].\n\nToday: [CURRENT MILESTONE].\n\nThe [ONE THING] that made the difference? [KEY INSIGHT].\n\n[3-4 bullet points with specific lessons]\n\nThank you to [AUDIENCE] who [CONTRIBUTION].\n\nHere's to [NEXT MILESTONE]. 🚀`,
    tone: 'inspirational',
    hashtags: ['#Milestone', '#Gratitude', '#BuildingInPublic'],
    usageCount: 8,
    lastUsed: 'Sep 4, 2026',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    isDefault: true,
  },
  {
    id: 'tpl-002',
    name: 'Case Study Framework',
    category: 'Case Study',
    description: 'Share a before/after story with specific metrics and a transferable lesson',
    body: `How we [RESULT] in [TIMEFRAME] (full breakdown inside).\n\nThe problem: [SPECIFIC PAIN POINT].\n\nWhat we tried first (and failed): [FAILED ATTEMPT]\n\nThe insight that changed everything: [KEY INSIGHT]\n\nWhat we actually did:\n\n→ [Step 1]\n→ [Step 2]\n→ [Step 3]\n\nThe result: [SPECIFIC METRIC WITH NUMBER]\n\nThe lesson: [TRANSFERABLE TAKEAWAY]\n\nSave this if you're facing [SIMILAR CHALLENGE].`,
    tone: 'educational',
    hashtags: ['#CaseStudy', '#B2BGrowth', '#GrowthMarketing'],
    usageCount: 5,
    lastUsed: 'Sep 2, 2026',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    isDefault: true,
  },
  {
    id: 'tpl-003',
    name: 'Product Feature Launch',
    category: 'Product Update',
    description: 'Announce a new feature with context on why you built it and who it helps',
    body: `We just shipped [FEATURE NAME].\n\nHere's why we built it:\n\n[CUSTOMER PAIN POINT that inspired it]\n\nWhat it does:\n✅ [Benefit 1]\n✅ [Benefit 2]\n✅ [Benefit 3]\n\nWho it's for: [TARGET USER DESCRIPTION]\n\n[Optional: How to access it]\n\nWe'd love your feedback — what would you add?`,
    tone: 'professional',
    hashtags: ['#ProductUpdate', '#SaaS', '#NewFeature'],
    usageCount: 11,
    lastUsed: 'Aug 31, 2026',
    author: 'Jordan Patel',
    authorInitials: 'JP',
    isDefault: true,
  },
  {
    id: 'tpl-004',
    name: 'Hiring Post',
    category: 'Hiring',
    description:
      'Attract candidates by leading with culture and differentiation, not just the role',
    body: `We're looking for a [ROLE] to join our [TEAM] team.\n\nBut first — here's what makes this different from every other [ROLE] job posting:\n\n[3 things that make your company/role unique]\n\nWhat you'll actually do:\n→ [Responsibility 1]\n→ [Responsibility 2]\n→ [Responsibility 3]\n\nWhat we offer:\n→ [Benefit 1]\n→ [Benefit 2]\n\nIf this sounds like you, [CALL TO ACTION].\n\nKnow someone perfect? Tag them below 👇`,
    tone: 'conversational',
    hashtags: ['#Hiring', '#WeAreHiring', '#TechJobs'],
    usageCount: 6,
    lastUsed: 'Aug 27, 2026',
    author: 'Jordan Patel',
    authorInitials: 'JP',
    isDefault: false,
  },
  {
    id: 'tpl-005',
    name: 'Event Promotion',
    category: 'Event',
    description: 'Drive attendance or awareness for an upcoming event or speaking slot',
    body: `[EVENT NAME] is [TIMEFRAME AWAY].\n\nIf you're going, come find me at [LOCATION/BOOTH].\n\nHere's what I'll be talking about: [TOPIC]\n\nWhy this matters right now: [CONTEXT]\n\nI'll also be sharing [EXCLUSIVE CONTENT/OFFER] — only for people who stop by.\n\n[CALL TO ACTION — register, DM, comment]\n\nSee you there! 👋`,
    tone: 'conversational',
    hashtags: ['#Event', '#Conference', '#Networking'],
    usageCount: 3,
    lastUsed: 'Aug 25, 2026',
    author: 'Lisa Tran',
    authorInitials: 'LT',
    isDefault: false,
  },
  {
    id: 'tpl-006',
    name: 'Engagement Question',
    category: 'Engagement',
    description: 'Spark conversation by asking a pointed question your audience genuinely debates',
    body: `[PROVOCATIVE STATEMENT or COUNTERINTUITIVE TAKE].\n\nMost [AUDIENCE] [COMMON BEHAVIOR].\n\nBut here's what we've found: [INSIGHT]\n\n[SHORT EXPLANATION — 2-3 lines max]\n\n[DIRECT QUESTION for audience]\n\nDrop your answer below 👇`,
    tone: 'conversational',
    hashtags: ['#OpenQuestion', '#Community', '#LinkedInConversation'],
    usageCount: 9,
    lastUsed: 'Aug 21, 2026',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    isDefault: true,
  },
  {
    id: 'tpl-007',
    name: 'Contrarian Take',
    category: 'Thought Leadership',
    description: 'Challenge conventional wisdom in your industry with evidence and nuance',
    body: `The conventional wisdom on [TOPIC] is wrong.\n\nEveryone says [COMMON BELIEF].\n\nWe tested it. Here's what actually happened:\n\n[FINDING 1]\n[FINDING 2]\n[FINDING 3]\n\nWhy does the conventional wisdom persist? [EXPLANATION]\n\nWhat actually works: [YOUR RECOMMENDATION]\n\nControversial take? Maybe. But the data doesn't lie.\n\nWhat's your experience?`,
    tone: 'professional',
    hashtags: ['#ThoughtLeadership', '#ContraryView', '#DataDriven'],
    usageCount: 4,
    lastUsed: 'Aug 15, 2026',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    isDefault: false,
  },
  {
    id: 'tpl-008',
    name: 'Lessons Learned List',
    category: 'Thought Leadership',
    description: 'Share numbered lessons from a specific experience or time period',
    body: `[NUMBER] things I learned from [EXPERIENCE] that changed how I [AREA]:\n\n1. [LESSON] — [1-sentence explanation]\n\n2. [LESSON] — [1-sentence explanation]\n\n3. [LESSON] — [1-sentence explanation]\n\n4. [LESSON] — [1-sentence explanation]\n\n5. [LESSON] — [1-sentence explanation]\n\nThe hardest one to accept: [PICK THE MOST SURPRISING]\n\nWhich of these resonates most with you?`,
    tone: 'educational',
    hashtags: ['#Lessons', '#Growth', '#Learning'],
    usageCount: 7,
    lastUsed: 'Aug 10, 2026',
    author: 'Lisa Tran',
    authorInitials: 'LT',
    isDefault: false,
  },
  {
    id: 'tpl-009',
    name: 'Industry Insight Report',
    category: 'Industry Insight',
    description: 'Share a key finding from research, a report, or your own data',
    body: `We analyzed [NUMBER] [SUBJECT] over [TIMEFRAME].\n\nThe most surprising finding:\n\n[HEADLINE STAT]\n\nBreaking it down:\n\n→ [Finding 1 with number]\n→ [Finding 2 with number]\n→ [Finding 3 with number]\n\nWhat this means for [AUDIENCE]:\n\n[IMPLICATION 1]\n[IMPLICATION 2]\n\nFull report in the comments 👇\n\nWhat data surprised you most?`,
    tone: 'professional',
    hashtags: ['#IndustryResearch', '#DataInsights', '#B2B'],
    usageCount: 2,
    lastUsed: 'Aug 5, 2026',
    author: 'Marcus Chen',
    authorInitials: 'MC',
    isDefault: false,
  },
  {
    id: 'tpl-010',
    name: 'Company Culture Spotlight',
    category: 'Company News',
    description: 'Highlight a team value, ritual, or culture moment that attracts talent',
    body: `At [COMPANY], we have a rule: [CULTURE RULE or RITUAL].\n\nHere's why we started it: [ORIGIN STORY — 2-3 sentences]\n\nWhat it looks like in practice:\n\n[SPECIFIC EXAMPLE 1]\n[SPECIFIC EXAMPLE 2]\n\nThe impact? [MEASURABLE OUTCOME or TEAM REACTION]\n\nWe're not perfect. But [CULTURE ELEMENT] is something we'll never compromise on.\n\nWhat's a culture ritual your team swears by?`,
    tone: 'conversational',
    hashtags: ['#CompanyCulture', '#TeamValues', '#BuildingInPublic'],
    usageCount: 3,
    lastUsed: 'Jul 28, 2026',
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    isDefault: false,
  },
  {
    id: 'tpl-011',
    name: 'Tutorial / How-To',
    category: 'Educational',
    description: 'Walk through a specific process step-by-step your audience can replicate',
    body: `How to [ACHIEVE SPECIFIC OUTCOME] in [TIMEFRAME]:\n\nStep 1: [ACTION]\n[1-2 sentence explanation]\n\nStep 2: [ACTION]\n[1-2 sentence explanation]\n\nStep 3: [ACTION]\n[1-2 sentence explanation]\n\nStep 4: [ACTION]\n[1-2 sentence explanation]\n\nStep 5: [ACTION]\n[1-2 sentence explanation]\n\nThe most common mistake: [PITFALL TO AVOID]\n\nSave this for when you need it.`,
    tone: 'educational',
    hashtags: ['#HowTo', '#Tutorial', '#TipsAndTricks'],
    usageCount: 5,
    lastUsed: 'Jul 20, 2026',
    author: 'Jordan Patel',
    authorInitials: 'JP',
    isDefault: false,
  },
  {
    id: 'tpl-012',
    name: 'Personal Story',
    category: 'Thought Leadership',
    description: 'Share a personal failure, pivot, or turning point with a universal lesson',
    body: `[TIMEFRAME] ago, I [MADE A MISTAKE / FACED A CHALLENGE].\n\nHere's what I wish someone had told me:\n\n[CONTEXT — 2-3 sentences of the situation]\n\nWhat I did: [ACTION]\n\nWhat actually happened: [UNEXPECTED OUTCOME]\n\nThe lesson I carry with me: [INSIGHT]\n\nIf you're facing [SIMILAR SITUATION] right now — [ADVICE].\n\nWhat's a lesson you learned the hard way?`,
    tone: 'inspirational',
    hashtags: ['#PersonalStory', '#Lessons', '#Vulnerability'],
    usageCount: 6,
    lastUsed: 'Jul 15, 2026',
    author: 'Lisa Tran',
    authorInitials: 'LT',
    isDefault: false,
  },
];

const allCategories = ['All', ...Array.from(new Set(mockTemplates.map((t) => t.category)))];

export default function TemplatesShell() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const filtered = templates.filter((t) => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSave = (tpl) => {
    // BACKEND: POST /api/templates or PATCH /api/templates/:id
    if (templates.find((t) => t.id === tpl.id)) {
      setTemplates((prev) => prev.map((t) => (t.id === tpl.id ? tpl : t)));
    } else {
      setTemplates((prev) => [...prev, tpl]);
    }
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleDelete = (id) => {
    // BACKEND: DELETE /api/templates/:id
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDuplicate = (tpl) => {
    const dup = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      usageCount: 0,
      lastUsed: '—',
      isDefault: false,
    };
    setTemplates((prev) => [...prev, dup]);
  };

  return (
    <div className="flex flex-col gap-5">
      <TemplatesHeader
        categories={allCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
        totalCount={filtered.length}
        onCreateNew={() => setIsCreating(true)}
      />

      <TemplatesGrid
        templates={filtered}
        onEdit={setEditingTemplate}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onUse={(tpl) => {
          // Navigate to composer with template pre-filled
          window.location.href = '/post-creation-composer';
        }}
      />

      {(editingTemplate || isCreating) && (
        <TemplateEditModal
          template={
            editingTemplate || {
              id: `tpl-${Date.now()}`,
              name: '',
              category: 'Thought Leadership',
              description: '',
              body: '',
              tone: 'professional',
              hashtags: [],
              usageCount: 0,
              lastUsed: '—',
              author: 'Sarah Reeves',
              authorInitials: 'SR',
              isDefault: false,
            }
          }
          onSave={handleSave}
          onClose={() => {
            setEditingTemplate(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}
