'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  ArrowRight,
  CheckSquare,
  Edit3,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ImageCarouselSelector from '@/components/ui/ImageCarouselSelector';
import StatusBadge from '@/components/ui/StatusBadge';
import { POST_STATUS } from '@/lib/post-status';
import { INITIAL_APPROVAL_POSTS } from '@/app/approval-workflow/_api/queries';
import { getSequentialScheduleSlots, getScheduleSettings } from '@/lib/scheduling';

import { TOPICS } from '@/temp-backend/data/topics';
import { STOCK_IMAGES_LIST } from '@/temp-backend/data/media';

const MOCK_TOPICS = TOPICS.map((t) => t.title);

const MOCK_IMAGES = STOCK_IMAGES_LIST.map((img) => img.url);

const MOCK_CONTENTS = [
  "After 3 years of building in public, here's what nobody tells you about scaling a SaaS product from 0 to 10,000 customers.\n\nThe biggest lesson? Trust compounds faster than revenue.\n\nWhen we started sharing our failures openly, something unexpected happened — our community grew 3x faster than our paid ads ever did.\n\nHere are the 5 principles that changed everything for us:",
  'The conventional wisdom on LinkedIn growth is wrong.\n\nEveryone says: post every day, use trending hashtags, go viral.\n\nWhat actually works: post with intention, build genuine connections, and show up consistently for 90 days.\n\nWe grew from 800 to 22,000 followers doing the opposite of what the gurus say.',
  "We reduced our customer onboarding time by 62% in one quarter.\n\nNot with more automation. Not with AI.\n\nWith one simple change: we stopped assuming we knew what customers needed and started asking them directly.\n\nHere's the full breakdown of what we changed and why it worked:",
];

function generateMockPost(topic, index, scheduleDate, scheduleTime) {
  const content = MOCK_CONTENTS[index % MOCK_CONTENTS.length];
  return {
    id: `ai-gen-${Date.now()}-${index}`,
    title: topic,
    content,
    author: 'Sarah Reeves',
    authorInitials: 'SR',
    authorRole: 'Author',
    category: 'Thought Leadership',
    hashtags: ['#LinkedInMarketing', '#B2BSaaS', '#ContentStrategy', '#GrowthMarketing'],
    candidateImages: MOCK_IMAGES,
    selectedImageIndex: index % MOCK_IMAGES.length,
    imageUrl: MOCK_IMAGES[index % MOCK_IMAGES.length],
    scheduledDate: scheduleDate,
    scheduledTime: scheduleTime,
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    dueDate: scheduleDate,
    status: POST_STATUS.GENERATING, // Starts generating
    stepStage: 'drafting', // 'drafting' | 'reviewing' | 'completed'
    revisions: 1,
    revisionsList: [
      {
        id: `rev-init-${index}`,
        versionNumber: 1,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        author: 'AI Workflow',
        authorType: 'ai',
        summary: `AI batch generation for topic: "${topic}"`,
      },
    ],
    qualityAudit: {
      score: 92,
      grade: 'A',
      verdict: 'High Virality Potential',
      hookScore: 94,
      clarityScore: 92,
      voiceScore: 90,
      readabilityWpm: 225,
      issues: [
        {
          type: 'Formatting',
          severity: 'low',
          message: 'Optimized spacing for LinkedIn mobile viewport',
          suggestion: 'Ensure hook line 1 has high curiosity gap',
        },
      ],
    },
    citations: [
      {
        id: `cite-${index}`,
        sourceName: 'Industry Benchmark Q3',
        domain: 'research-benchmarks.com',
        url: 'https://hbr.org/topic/productivity',
        claim: 'Organic consistency generates 3.2x higher pipeline conversion than paid announcements.',
        verifiedDate: '2026',
        confidence: 94,
      },
    ],
    activityLog: [
      {
        id: `act-gen-${index}`,
        actor: 'AI Generator',
        action: 'Synthesized draft from theme prompt',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
    ],
    comments: [],
  };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function AIGeneratorShell() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [postCount, setPostCount] = useState(3);
  const [generateImages, setGenerateImages] = useState(true);
  const [useScheduleRules, setUseScheduleRules] = useState(true);
  const [startDate, setStartDate] = useState('2026-09-15');
  const [defaultTime, setDefaultTime] = useState('09:00');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [customTopics, setCustomTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  // Per-item simulated polling progression: generating -> auto_review -> awaiting_review
  useEffect(() => {
    if (generatedPosts.length === 0) return;

    const interval = setInterval(() => {
      setGeneratedPosts((prev) =>
        prev.map((p) => {
          if (p.status === POST_STATUS.GENERATING) {
            return {
              ...p,
              status: POST_STATUS.AUTO_REVIEW,
              stepStage: 'reviewing',
            };
          }
          if (p.status === POST_STATUS.AUTO_REVIEW) {
            return {
              ...p,
              status: POST_STATUS.AWAITING_REVIEW,
              stepStage: 'completed',
            };
          }
          return p;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [generatedPosts.length]);

  const handleGenerate = async () => {
    if (!topic && customTopics.length === 0) {
      toast.error('Please enter a topic or add custom topics');
      return;
    }
    setIsGenerating(true);
    setGeneratedPosts([]);

    await new Promise((r) => setTimeout(r, 1000));

    const sequentialSlots = useScheduleRules
      ? getSequentialScheduleSlots(postCount, startDate)
      : [];

    const posts = [];
    for (let i = 0; i < postCount; i++) {
      const postTopic =
        customTopics.length > 0
          ? customTopics[i % customTopics.length]
          : topic || MOCK_TOPICS[i % MOCK_TOPICS.length];
      const slot = useScheduleRules && sequentialSlots[i]
        ? sequentialSlots[i]
        : { date: addDays(startDate, i), time: defaultTime, isSettingsSlot: false };
      posts.push(generateMockPost(postTopic, i, slot.date, slot.time));
    }

    setGeneratedPosts(posts);
    setIsGenerating(false);
    toast.success(`Started generation pipeline for ${postCount} posts!`);
  };

  const handleSendAllToApprovalQueue = () => {
    try {
      const stored = localStorage.getItem('linkedflow_approval_posts');
      const existing = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
      const merged = [...generatedPosts, ...existing];
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify(merged));
      toast.success(`${generatedPosts.length} posts sent to Approval Queue!`);
      navigate('/approval-workflow');
    } catch {
      toast.error('Failed to sync to approval queue');
    }
  };

  const handleSendOneToApprovalQueue = (id) => {
    try {
      const target = generatedPosts.find((p) => p.id === id);
      if (!target) return;
      const stored = localStorage.getItem('linkedflow_approval_posts');
      const existing = stored ? JSON.parse(stored) : INITIAL_APPROVAL_POSTS;
      localStorage.setItem('linkedflow_approval_posts', JSON.stringify([target, ...existing]));
      toast.success('Post dispatched to Approval Queue!');
    } catch {
      toast.error('Failed to sync post');
    }
  };

  const handleRemovePost = (id) => {
    setGeneratedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCustomTopic = () => {
    if (!newTopic.trim()) return;
    setCustomTopics((prev) => [...prev, newTopic.trim()]);
    setNewTopic('');
  };

  const removeCustomTopic = (idx) => {
    setCustomTopics((prev) => prev.filter((_, i) => i !== idx));
  };

  const completedCount = generatedPosts.filter((p) => p.status === POST_STATUS.AWAITING_REVIEW).length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-primary" />
          <div>
            <h1 className="text-2xl font-700 text-foreground">AI Post Generator</h1>
            <span className="text-xs text-muted-foreground">
              Synthesize high-performing LinkedIn posts and visual candidate sets directly into the review pipeline
            </span>
          </div>
        </div>

        {generatedPosts.length > 0 && (
          <Link
            to="/approval-workflow"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <CheckSquare size={13} className="text-primary" />
            <span>Open Approval Queue</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Config panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card p-5 flex flex-col gap-4">
            <h2 className="text-xs font-700 text-foreground uppercase tracking-wider">
              Generation Settings
            </h2>

            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-600 text-foreground">Theme / Core Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. B2B SaaS growth strategies"
                className="input-base text-xs"
              />

              <div className="flex flex-wrap gap-1 mt-1">
                {MOCK_TOPICS.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {t.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom topics */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-600 text-foreground">Custom Topics per Post</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomTopic()}
                  placeholder="Add specific prompt directive..."
                  className="input-base text-xs flex-1"
                />

                <button onClick={addCustomTopic} className="btn-secondary text-xs px-2.5">
                  <Plus size={13} />
                </button>
              </div>
              {customTopics.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  {customTopics.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-2.5 py-1 bg-muted/60 border border-border/60 rounded text-xs"
                    >
                      <span className="truncate">{t}</span>
                      <button
                        onClick={() => removeCustomTopic(i)}
                        className="text-muted-foreground hover:text-danger"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-600 text-foreground">
                Batch Output Count ({postCount} posts)
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={postCount}
                onChange={(e) => setPostCount(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Toggle visual generation */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-600 text-foreground">
                Generate 3 Visual Variations
              </span>
              <input
                type="checkbox"
                checked={generateImages}
                onChange={(e) => setGenerateImages(e.target.checked)}
                className="rounded border-border text-primary h-4 w-4"
              />
            </div>

            {/* Schedule options */}
            <div className="pt-2 border-t border-border flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-foreground">Follow Publishing Schedule Rules</span>
                  <p className="text-[11px] text-muted-foreground">
                    Sequentially books slots from your configured weekly windows in Settings.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={useScheduleRules}
                  onChange={(e) => setUseScheduleRules(e.target.checked)}
                  className="rounded border-border text-primary h-4 w-4 shrink-0"
                />
              </div>
            </div>

            {!useScheduleRules && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="text-[11px] font-600 text-muted-foreground block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-base text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-600 text-muted-foreground block mb-1">
                    Default Time
                  </label>
                  <input
                    type="time"
                    value={defaultTime}
                    onChange={(e) => setDefaultTime(e.target.value)}
                    className="input-base text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-xs font-700 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Generating {postCount} Posts...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate {postCount} Posts Directly</span>
              </>
            )}
          </button>
        </div>

        {/* Generated posts panel */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {generatedPosts.length === 0 && !isGenerating && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4 border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles size={24} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-700 text-foreground">Ready to generate</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Items will progress live through the AI drafting and quality audit stages before entering the review queue.
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={32} className="text-primary animate-spin" />
              <p className="text-sm font-600 text-foreground">AI is crafting your posts...</p>
              <p className="text-xs text-muted-foreground">
                Generating copy, hashtags{generateImages ? ', and 3 visual candidate variations' : ''}
              </p>
            </div>
          )}

          {generatedPosts.length > 0 && (
            <>
              {/* Bulk actions */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs font-600 text-foreground">
                  {generatedPosts.length} posts generated · {completedCount} ready for review
                </p>
                <button
                  onClick={handleSendAllToApprovalQueue}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <CheckSquare size={13} />
                  <span>Send All to Approval Queue ({generatedPosts.length})</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {generatedPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="card overflow-hidden transition-all border border-border"
                  >
                    <div className="flex items-start gap-3 p-4">
                      {generateImages && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs font-700 text-foreground">
                            Post #{idx + 1}: {post.title}
                          </span>
                          <StatusBadge status={post.status} size="sm" />

                          {post.status === POST_STATUS.GENERATING && (
                            <span className="text-[10px] text-indigo-600 font-mono flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin" /> Drafting hook & narrative
                            </span>
                          )}
                          {post.status === POST_STATUS.AUTO_REVIEW && (
                            <span className="text-[10px] text-purple-600 font-mono flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin" /> Automated quality audit
                            </span>
                          )}
                          {post.status === POST_STATUS.AWAITING_REVIEW && (
                            <span className="text-[10px] text-emerald-600 font-600 flex items-center gap-1">
                              <CheckCircle2 size={10} /> Ready for Review
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            Slot: {post.scheduledDate} at {post.scheduledTime}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          {post.hashtags.slice(0, 3).map((h) => (
                            <span key={h} className="text-[11px] text-primary font-500">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Expand details"
                        >
                          {expandedPost === post.id ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemovePost(post.id)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-danger transition-colors"
                          title="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {expandedPost === post.id && (
                      <div className="px-4 pb-4 border-t border-border pt-3 flex flex-col gap-3 bg-muted/10">
                        <p className="text-xs text-foreground whitespace-pre-line leading-relaxed bg-card p-3 rounded-lg border border-border">
                          {post.content}
                        </p>

                        {generateImages && (
                          <div className="mt-1">
                            <ImageCarouselSelector
                              images={post.candidateImages || MOCK_IMAGES}
                              selectedIndex={post.selectedImageIndex ?? 0}
                              onSelectIndex={(newIdx) => {
                                setGeneratedPosts((prev) =>
                                  prev.map((p) =>
                                    p.id === post.id
                                      ? {
                                          ...p,
                                          selectedImageIndex: newIdx,
                                          imageUrl: (post.candidateImages || MOCK_IMAGES)[newIdx],
                                        }
                                      : p
                                  )
                                );
                              }}
                              title="Select Visual Variation (3 AI Options)"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-2">
                          <Link
                            to={`/post-creation-composer?id=${post.id}&mode=edit`}
                            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            <span>Edit in Composer</span>
                          </Link>

                          <button
                            onClick={() => handleSendOneToApprovalQueue(post.id)}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                          >
                            <CheckSquare size={12} />
                            <span>Send to Approval Queue</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
