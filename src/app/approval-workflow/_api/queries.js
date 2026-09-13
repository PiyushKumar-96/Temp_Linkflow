import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export const INITIAL_APPROVAL_POSTS = [
  {
    id: 'appr-001',
    title: 'Why we switched from Slack to async communication...',
    content: `After 3 years of Slack-first culture, we made a decision that changed everything.\n\nWe went async.\n\nHere's what happened:\n\n→ Response time expectations dropped from "within 15 min" to "within 24 hrs"\n→ Deep work blocks went from 1.2 hrs/day to 4.8 hrs/day\n→ Team satisfaction scores jumped 34% in one quarter\n\nThe hardest part wasn't the tools. It was the mindset shift.\n\nNot every message is urgent. Not every question needs an immediate answer. Most decisions can wait.\n\nIf you're drowning in notifications, maybe the problem isn't your productivity system — it's your communication culture.\n\nWhat's your experience with async work? Would love to hear from teams who've made the switch.`,
    author: 'Lisa Tran',
    authorInitials: 'LT',
    authorRole: 'Brand Strategist',
    submittedAt: '2026-09-07 14:32',
    dueDate: '2026-09-09',
    status: 'awaiting_review',
    category: 'Thought Leadership',
    hashtags: ['#AsyncWork', '#RemoteWork', '#TeamCulture', '#Productivity'],
    revisions: 2,
    revisionsList: [
      {
        id: 'rev-1',
        versionNumber: 1,
        createdAt: '2026-09-07 14:30',
        author: 'AI Workflow',
        authorType: 'ai',
        summary: 'Initial draft generated from brief "Async Work Transition"',
      },
      {
        id: 'rev-2',
        versionNumber: 2,
        createdAt: '2026-09-07 16:45',
        author: 'Lisa Tran',
        authorType: 'human',
        summary: 'Added concrete tool metrics & refined call to action',
        diff: '+ We use Loom + Notion for async video and docs.',
      },
    ],
    qualityAudit: {
      score: 94,
      grade: 'A',
      verdict: 'High Virality Potential',
      hookScore: 96,
      clarityScore: 93,
      voiceScore: 95,
      readabilityWpm: 218,
      issues: [
        {
          type: 'Formatting',
          severity: 'low',
          message: 'Paragraph spacing in body section',
          suggestion:
            'Maintain double break between arrow bullet points for optimal mobile scannability',
        },
        {
          type: 'Call to Action',
          severity: 'medium',
          message: 'Question CTA could prompt specific tool mentions',
          suggestion: 'Ask audience what async tools they currently standardize on',
        },
        {
          type: 'Brand Voice',
          severity: 'low',
          message: 'Tone aligns well with calm editorial guidelines',
          suggestion: 'Zero promotional words detected, high credibility factor',
        },
      ],
    },
    citations: [
      {
        id: 'cite-001',
        sourceName: 'Harvard Business Review',
        domain: 'hbr.org',
        url: 'https://hbr.org/topic/async-productivity',
        claim:
          'Teams switching to async communication report 34% higher employee satisfaction and +3.6 hours of uninterrupted focus time per day.',
        verifiedDate: 'May 2026',
        confidence: 96,
      },
      {
        id: 'cite-002',
        sourceName: 'McKinsey Global Institute',
        domain: 'mckinsey.com',
        url: 'https://mckinsey.com/insights/future-of-work',
        claim:
          'Companies reducing mandatory meeting slots see 42% faster decision velocity in distributed software teams.',
        verifiedDate: 'Jan 2026',
        confidence: 92,
      },
      {
        id: 'cite-003',
        sourceName: 'Internal Team Notion Retrospective',
        domain: 'internal-vault',
        url: 'https://notion.so/workspace/retro-q2',
        claim: 'Sprint completion rate grew from 71% to 94% following adoption of 24hr async SLA.',
        verifiedDate: 'Q2 2026',
        confidence: 98,
      },
    ],
    activityLog: [
      {
        id: 'act-1',
        actor: 'AI Generator',
        action: 'Draft synthesized from research brief',
        timestamp: '2026-09-07 14:30',
        details: 'Evaluated 3 peer-reviewed citations and 1 internal benchmark.',
      },
      {
        id: 'act-2',
        actor: 'Quality Auditor',
        action: 'Auto review completed: Grade A (Score 94)',
        timestamp: '2026-09-07 14:31',
        details: 'Passed hook contrast check and brand voice filters.',
      },
      {
        id: 'act-3',
        actor: 'Lisa Tran',
        action: 'Edited draft and submitted for final review',
        timestamp: '2026-09-07 16:45',
        details: 'Updated tool examples in response to peer comment.',
      },
    ],
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
    status: 'awaiting_review',
    category: 'Case Study',
    hashtags: ['#ContentMarketing', '#B2BGrowth', '#LinkedInStrategy', '#Inbound'],
    revisions: 0,
    revisionsList: [
      {
        id: 'rev-201',
        versionNumber: 1,
        createdAt: '2026-09-07 09:15',
        author: 'Marcus Chen',
        authorType: 'human',
        summary: 'Original submitted draft with 4-step framework',
      },
    ],
    qualityAudit: {
      score: 91,
      grade: 'A',
      verdict: 'High Virality Potential',
      hookScore: 94,
      clarityScore: 92,
      voiceScore: 89,
      readabilityWpm: 230,
      issues: [
        {
          type: 'Voice Consistency',
          severity: 'low',
          message: 'Opening contrast sentence is assertive and punchy',
          suggestion: 'Ensure follow-up statistics match public revenue announcements',
        },
      ],
    },
    citations: [
      {
        id: 'cite-004',
        sourceName: 'HubSpot State of Marketing 2026',
        domain: 'hubspot.com',
        url: 'https://hubspot.com/reports/state-of-marketing',
        claim:
          'B2B companies with structured repurposing pipelines generate 2.8x more organic pipeline per writer.',
        verifiedDate: 'Feb 2026',
        confidence: 94,
      },
    ],
    activityLog: [
      {
        id: 'act-201',
        actor: 'Marcus Chen',
        action: 'Created and submitted case study draft',
        timestamp: '2026-09-07 09:15',
      },
    ],
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
    revisionsList: [],
    qualityAudit: {
      score: 97,
      grade: 'A+',
      verdict: 'Exceptional Engagement Expected',
      hookScore: 98,
      clarityScore: 97,
      voiceScore: 96,
      readabilityWpm: 240,
      issues: [],
    },
    citations: [],
    activityLog: [
      {
        id: 'act-301',
        actor: 'Sarah Reeves',
        action: 'Authored milestone story',
        timestamp: '2026-09-06 11:00',
      },
      {
        id: 'act-302',
        actor: 'Jordan Patel',
        action: 'Approved post for scheduling',
        timestamp: '2026-09-06 14:20',
      },
    ],
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
    revisionsList: [],
    qualityAudit: {
      score: 82,
      grade: 'B',
      verdict: 'Revision Advised',
      hookScore: 85,
      clarityScore: 84,
      voiceScore: 78,
      readabilityWpm: 210,
      issues: [
        {
          type: 'Compliance',
          severity: 'high',
          message: 'Unconfirmed roadmap target for Q4',
          suggestion: 'Remove specific quarter for analytics until engineering sign-off',
        },
      ],
    },
    citations: [],
    activityLog: [
      {
        id: 'act-401',
        actor: 'Sarah Reeves',
        action: 'Rejected post with feedback',
        timestamp: '2026-09-06 10:30',
        details: 'References unconfirmed Q4 analytics timeline.',
      },
    ],
    comments: [
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
    title: '5 AI Automation Workflows That Save Our Content Team 12 Hours a Week',
    content: `Automation isn't about replacing human judgment — it's about amplifying it.\n\nHere are 5 workflows running 24/7 in our company:\n\n1. Research synthesis from 10+ industry sources\n2. Hook generation and virality scoring\n3. Visual carousel page generation\n4. Multi-stakeholder approval routing\n5. Scheduled Buffer publishing with auto-tagging\n\nWhat workflow does your marketing team need most?`,
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    authorRole: 'Content Manager',
    submittedAt: '2026-09-08 08:20',
    dueDate: '2026-09-09',
    status: 'failed',
    category: 'Thought Leadership',
    hashtags: ['#AIAutomation', '#ContentOps', '#B2BGrowth'],
    revisions: 1,
    revisionsList: [],
    failureDetails: {
      errorMessage:
        'Buffer API Error 429: LinkedIn profile quota exceeded for current billing window',
      failedAt: '2026-09-08 14:15 UTC',
      attemptCount: 3,
      maxAttempts: 3,
      requestId: 'req_9f41b2f0a1c',
      service: 'Buffer Dispatch Worker',
    },
    qualityAudit: {
      score: 92,
      grade: 'A',
      verdict: 'Ready to Publish',
      hookScore: 94,
      clarityScore: 90,
      voiceScore: 92,
      readabilityWpm: 220,
      issues: [],
    },
    citations: [],
    activityLog: [
      {
        id: 'act-501',
        actor: 'Publishing Worker',
        action: 'Publishing dispatch failed [req_9f41b2f0a1c]',
        timestamp: '2026-09-08 14:15',
        details: 'Buffer API rate limit 429 exceeded after 3 attempts.',
      },
    ],
    comments: [],
  },
];

export function useApprovalPosts() {
  return useQuery({
    queryKey: ['posts', 'approval-queue'],
    queryFn: async () => {
      let result = null;
      try {
        const data = await apiClient.get('/posts', { params: { queue: 'approval' } });
        const list = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : null;
        if (list && list.length > 0) result = list;
      } catch {
        // Fallback below
      }
      if (!result) {
        const stored = localStorage.getItem('linkedflow_approval_posts');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) result = parsed;
          } catch {
            // Ignore parse error
          }
        }
      }
      if (!result) result = INITIAL_APPROVAL_POSTS;

      return result.map((p) => ({
        ...p,
        source:
          p.source ||
          (p.id?.startsWith('bulk-') || p.id === 'up-3' || p.id === 'appr-003'
            ? 'bulk_upload'
            : p.id?.startsWith('comp-') ||
                p.id === 'up-1' ||
                p.id === 'up-4' ||
                p.id === 'appr-002' ||
                p.id === 'appr-004'
              ? 'composer'
              : 'ai_generator'),
      }));
    },
    staleTime: 30 * 1000,
  });
}
