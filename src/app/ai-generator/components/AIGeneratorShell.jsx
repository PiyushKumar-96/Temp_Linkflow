'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import ImageCarouselSelector from '@/components/ui/ImageCarouselSelector';

const MOCK_TOPICS = [
  'Thought leadership in B2B SaaS',
  'Remote work culture insights',
  'Product launch announcement',
  'Customer success story',
  'Industry trend analysis',
  'Team milestone celebration',
  'Educational how-to guide',
  'Engagement question post',
];

const MOCK_IMAGES = [
  'https://img.rocket.new/generatedImages/rocket_gen_img_1b4fc0b68-1773435165826.png',
  'https://img.rocket.new/generatedImages/rocket_gen_img_11c4a0e7e-1767621207129.png',
  'https://img.rocket.new/generatedImages/rocket_gen_img_13c515ccd-1773374405046.png',
];

const MOCK_CONTENTS = [
  "After 3 years of building in public, here's what nobody tells you about scaling a SaaS product from 0 to 10,000 customers.\n\nThe biggest lesson? Trust compounds faster than revenue.\n\nWhen we started sharing our failures openly, something unexpected happened — our community grew 3x faster than our paid ads ever did.\n\nHere are the 5 principles that changed everything for us:",
  'The conventional wisdom on LinkedIn growth is wrong.\n\nEveryone says: post every day, use trending hashtags, go viral.\n\nWhat actually works: post with intention, build genuine connections, and show up consistently for 90 days.\n\nWe grew from 800 to 22,000 followers doing the opposite of what the gurus say.',
  "We reduced our customer onboarding time by 62% in one quarter.\n\nNot with more automation. Not with AI.\n\nWith one simple change: we stopped assuming we knew what customers needed and started asking them directly.\n\nHere's the full breakdown of what we changed and why it worked:",
];

function generateMockPost(topic, index, scheduleDate, scheduleTime) {
  const content = MOCK_CONTENTS[index % MOCK_CONTENTS.length];
  return {
    id: `ai-post-${Date.now()}-${index}`,
    title: topic,
    content,
    hashtags: ['#LinkedInMarketing', '#B2BSaaS', '#ContentStrategy', '#GrowthMarketing'],
    candidateImages: MOCK_IMAGES,
    selectedImageIndex: index % MOCK_IMAGES.length,
    imageUrl: MOCK_IMAGES[index % MOCK_IMAGES.length],
    imageAlt: `AI generated image for post about ${topic}`,
    scheduledDate: scheduleDate,
    scheduledTime: scheduleTime,
    status: 'ready',
    topic,
  };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function AIGeneratorShell() {
  const [topic, setTopic] = useState('');
  const [postCount, setPostCount] = useState(5);
  const [generateImages, setGenerateImages] = useState(true);
  const [useScheduleRules, setUseScheduleRules] = useState(true);
  const [startDate, setStartDate] = useState('2026-09-10');
  const [defaultTime, setDefaultTime] = useState('09:00');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [customTopics, setCustomTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  const handleGenerate = async () => {
    if (!topic && customTopics.length === 0) {
      toast.error('Please enter a topic or add custom topics');
      return;
    }
    setIsGenerating(true);
    setGeneratedPosts([]);
    setScheduledCount(0);

    // Simulate AI generation with mock delay
    await new Promise((r) => setTimeout(r, 1500));

    const posts = [];
    for (let i = 0; i < postCount; i++) {
      const postTopic =
        customTopics.length > 0
          ? customTopics[i % customTopics.length]
          : topic || MOCK_TOPICS[i % MOCK_TOPICS.length];
      const schedDate = addDays(startDate, i);
      posts.push(generateMockPost(postTopic, i, schedDate, defaultTime));
    }

    setGeneratedPosts(posts);
    setIsGenerating(false);
    toast.success(`${postCount} posts generated successfully!`);
  };

  const handleScheduleAll = () => {
    setGeneratedPosts((prev) => prev.map((p) => ({ ...p, status: 'scheduled' })));
    setScheduledCount(generatedPosts.length);
    toast.success(`${generatedPosts.length} posts scheduled to Content Library & Calendar!`);
  };

  const handleScheduleOne = (id) => {
    setGeneratedPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'scheduled' } : p)));
    setScheduledCount((prev) => prev + 1);
    toast.success('Post scheduled to Content Library & Calendar');
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

  const readyCount = generatedPosts.filter((p) => p.status === 'ready').length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-primary" />
        <h1 className="text-2xl font-700 text-foreground">AI Post Generator</h1>
        <span className="text-sm text-muted-foreground">
          · Generate, schedule, and publish LinkedIn posts with AI
        </span>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Config panel */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-700 text-foreground uppercase tracking-wide">
              Generation Settings
            </h2>

            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground">Topic / Theme</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. B2B SaaS growth strategies"
                className="input-base text-sm"
              />

              <div className="flex flex-wrap gap-1 mt-1">
                {MOCK_TOPICS.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {t.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom topics */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground">Custom Topics per Post</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomTopic()}
                  placeholder="Add specific topic..."
                  className="input-base text-sm flex-1"
                />

                <button onClick={addCustomTopic} className="btn-secondary p-2">
                  <Plus size={14} />
                </button>
              </div>
              {customTopics.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  {customTopics.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-muted rounded-lg"
                    >
                      <span className="text-xs text-foreground truncate">{t}</span>
                      <button
                        onClick={() => removeCustomTopic(i)}
                        className="text-muted-foreground hover:text-danger ml-2"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground">Number of Posts</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={postCount}
                  onChange={(e) => setPostCount(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />

                <span className="text-lg font-700 text-primary w-8 text-center tabular-nums">
                  {postCount}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>

            {/* Tone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-foreground">Writing Tone</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['professional', 'conversational', 'inspirational', 'educational'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-600 capitalize transition-all border ${tone === t ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground border-transparent hover:border-border'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Images toggle */}
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div className="flex items-center gap-2">
                <ImageIcon size={14} className="text-muted-foreground" />
                <span className="text-sm font-600 text-foreground">Generate Images</span>
              </div>
              <div
                onClick={() => setGenerateImages(!generateImages)}
                className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${generateImages ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${generateImages ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </div>
            </div>
          </div>

          {/* Schedule settings */}
          <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              <h2 className="text-sm font-700 text-foreground uppercase tracking-wide">
                Schedule Settings
              </h2>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-600 text-foreground">Use Ruleset from Settings</span>
              <div
                onClick={() => setUseScheduleRules(!useScheduleRules)}
                className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${useScheduleRules ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useScheduleRules ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </div>
            </div>

            {!useScheduleRules && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-600 text-foreground">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-base text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-600 text-foreground">Default Post Time</label>
                  <input
                    type="time"
                    value={defaultTime}
                    onChange={(e) => setDefaultTime(e.target.value)}
                    className="input-base text-sm"
                  />
                </div>
              </>
            )}

            {useScheduleRules && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-lg">
                <Clock size={13} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Posts will be scheduled using your Mon–Sun ruleset defined in Settings. Each post
                  gets the next available slot.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm font-700"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating {postCount} posts...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate {postCount} Posts
              </>
            )}
          </button>
        </div>

        {/* Generated posts panel */}
        <div className="col-span-3 flex flex-col gap-4">
          {generatedPosts.length === 0 && !isGenerating && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles size={28} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-base font-700 text-foreground">Ready to generate</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your settings and click Generate
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={32} className="text-primary animate-spin" />
              <p className="text-sm font-600 text-foreground">AI is crafting your posts...</p>
              <p className="text-xs text-muted-foreground">
                Generating content, hashtags{generateImages ? ', and images' : ''}
              </p>
            </div>
          )}

          {generatedPosts.length > 0 && (
            <>
              {/* Bulk actions */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-600 text-foreground">
                  {generatedPosts.length} posts generated · {scheduledCount} scheduled
                </p>
                {readyCount > 0 && (
                  <button
                    onClick={handleScheduleAll}
                    className="btn-primary text-sm flex items-center gap-1.5"
                  >
                    <Calendar size={14} />
                    Schedule All ({readyCount})
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {generatedPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className={`card overflow-hidden transition-all ${post.status === 'scheduled' ? 'border-success/30 bg-success/5' : ''}`}
                  >
                    <div className="flex items-start gap-3 p-4">
                      {generateImages && (
                        <img
                          src={post.imageUrl}
                          alt={post.imageAlt}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-700 text-muted-foreground">
                            Post {idx + 1}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={10} />
                            {post.scheduledDate} at {post.scheduledTime}
                          </span>
                          {post.status === 'scheduled' && (
                            <span className="ml-auto flex items-center gap-1 text-xs font-600 text-success">
                              <CheckCircle2 size={12} />
                              Scheduled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.hashtags.slice(0, 3).map((h) => (
                            <span key={h} className="text-xs text-primary/70 font-500">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
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
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {expandedPost === post.id && (
                      <div className="px-4 pb-4 border-t border-border pt-3 flex flex-col gap-3">
                        <p className="text-sm text-foreground whitespace-pre-line">
                          {post.content}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.map((h) => (
                            <span key={h} className="text-xs text-primary font-500">
                              {h}
                            </span>
                          ))}
                        </div>
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
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={post.scheduledDate}
                            onChange={(e) =>
                              setGeneratedPosts((prev) =>
                                prev.map((p) =>
                                  p.id === post.id ? { ...p, scheduledDate: e.target.value } : p
                                )
                              )
                            }
                            className="input-base text-xs py-1.5 flex-1"
                          />

                          <input
                            type="time"
                            value={post.scheduledTime}
                            onChange={(e) =>
                              setGeneratedPosts((prev) =>
                                prev.map((p) =>
                                  p.id === post.id ? { ...p, scheduledTime: e.target.value } : p
                                )
                              )
                            }
                            className="input-base text-xs py-1.5 w-28"
                          />

                          {post.status !== 'scheduled' && (
                            <button
                              onClick={() => handleScheduleOne(post.id)}
                              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                            >
                              <Calendar size={12} />
                              Schedule
                            </button>
                          )}
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
