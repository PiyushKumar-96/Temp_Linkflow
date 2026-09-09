'use client';

import React, { useState } from 'react';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Check,
  X,
  Send,
  Clock,
  RefreshCw,
  Sparkles,
  Download,
  Edit3,
  ShieldAlert,
  FileText,
  Link as LinkIcon,
  MessageSquareQuote,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ImageCarouselSelector from '@/components/ui/ImageCarouselSelector';
import { toast } from 'sonner';

const commentTypeColors = {
  comment: 'bg-muted/60 border border-border/40',
  revision_request: 'bg-warning/10 border border-warning/30 text-warning-foreground',
  approval: 'bg-success/10 border border-success/30 text-success-foreground',
  rejection: 'bg-danger/10 border border-danger/30 text-danger-foreground',
};

const commentTypeLabels = {
  comment: '',
  revision_request: '↩ Revision requested',
  approval: '✓ Approved',
  rejection: '✗ Rejected',
};

export default function ApprovalDetail({ post, onApprove, onReject, onAddComment }) {
  const { isOwner } = useAuth();

  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'research' | 'history'
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Candidate images for review
  const candidateImages = post.images || [
    'https://img.rocket.new/generatedImages/rocket_gen_img_1b4fc0b68-1773435165826.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_11c4a0e7e-1767621207129.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_13c515ccd-1773374405046.png',
  ];

  // Helper to split content into hook, body, and CTA
  const parsePostParts = (rawContent = '') => {
    const lines = rawContent.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      return { hook: '', body: '', cta: '' };
    }
    const hook = lines[0] || '';
    let cta = '';
    let bodyLines = lines.slice(1);

    // If last line has a question or CTA markers
    const lastLine = lines[lines.length - 1];
    if (
      lastLine.includes('?') ||
      lastLine.toLowerCase().includes('comment') ||
      lastLine.toLowerCase().includes('save') ||
      lastLine.toLowerCase().includes('share')
    ) {
      cta = lastLine;
      bodyLines = lines.slice(1, lines.length - 1);
    }

    return {
      hook,
      body: bodyLines.join('\n\n'),
      cta: cta || "What's your take? Drop a comment below 👇",
    };
  };

  const { hook, body, cta } = parsePostParts(post.content);

  const handleApprove = async () => {
    if (!isOwner) {
      toast.error('Permission denied: Only Account Owners can authorize publication.');
      return;
    }
    setIsApproving(true);
    await new Promise((r) => setTimeout(r, 600));
    onApprove();
    setIsApproving(false);
    toast.success('Post approved & queued for publication!');
  };

  const handleReject = async () => {
    setIsRejecting(true);
    await new Promise((r) => setTimeout(r, 500));
    onReject();
    setIsRejecting(false);
    toast.error('Post rejected — author notified with comments');
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    onAddComment(comment.trim());
    setComment('');
    toast.success('Comment logged');
  };

  const handleDownloadManual = () => {
    const textBlob = new Blob([`${post.content}\n\n${(post.hashtags || []).join(' ')}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.id}-post-copy.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Post copy downloaded for manual publishing');
  };

  return (
    <div className="card flex flex-col h-full overflow-hidden border border-border shadow-md">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={post.status} />
              <span className="text-xs px-2.5 py-0.5 bg-muted rounded-full text-muted-foreground font-500">
                {post.category}
              </span>
              {post.revisions > 0 && (
                <span className="text-xs flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                  <RefreshCw size={10} />
                  {post.revisions} revision{post.revisions > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-700">{post.authorInitials}</span>
                </div>
                <span className="font-500 text-foreground">
                  {post.author} · {post.authorRole}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                Submitted {post.submittedAt}
              </span>
              <span className="flex items-center gap-1 text-warning font-500">
                <Clock size={11} />
                Due {post.dueDate}
              </span>
            </div>
          </div>

          {/* Decision Actions Bar */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Download for manual publishing */}
            <button
              onClick={handleDownloadManual}
              className="btn-secondary text-xs py-1.5 px-2.5"
              title="Download post text & assets for manual publishing"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* Edit in Composer */}
            <Link href="/post-creation-composer">
              <button className="btn-secondary text-xs py-1.5 px-2.5" title="Open in full editor">
                <Edit3 size={13} />
                <span className="hidden sm:inline">Edit Draft</span>
              </button>
            </Link>

            {post.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="btn-danger text-xs py-1.5 px-3 disabled:opacity-50"
                >
                  {isRejecting ? <RefreshCw size={13} className="animate-spin" /> : <X size={13} />}
                  Reject
                </button>

                {/* Role-Gated Approve Button */}
                <div className="relative group">
                  <button
                    onClick={handleApprove}
                    disabled={!isOwner || isApproving}
                    className={`text-xs py-1.5 px-3.5 rounded-lg font-600 flex items-center gap-1.5 transition-all ${
                      isOwner
                        ? 'btn-success cursor-pointer shadow-sm'
                        : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                    }`}
                  >
                    {isApproving ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Approve & Publish
                  </button>

                  {!isOwner && (
                    <div className="absolute right-0 bottom-full mb-2 w-56 p-2 bg-foreground text-primary-foreground text-[11px] rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      <div className="flex items-center gap-1 text-warning font-600 mb-0.5">
                        <ShieldAlert size={12} />
                        <span>Owner Role Required</span>
                      </div>
                      Only Account Owners can authorize publishing to LinkedIn. Switch role in
                      topbar.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mt-4 border-t border-border/60 pt-3">
          {[
            { id: 'review', label: 'Structured Review' },
            { id: 'research', label: 'Research Package' },
            { id: 'history', label: `Activity (${post.comments?.length || 0})` },
          ].map((tab) => (
            <button
              key={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-600 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {/* TAB 1: STRUCTURED REVIEW */}
        {activeTab === 'review' && (
          <div className="flex flex-col gap-5">
            {/* AI Review Quality Card */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl gradient-primary flex flex-col items-center justify-center text-white shrink-0 shadow-sm">
                  <span className="text-base font-800 leading-none">94</span>
                  <span className="text-[9px] opacity-80 uppercase tracking-tighter">Score</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-700 text-foreground">
                      AI Quality Audit: Grade A
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-success/20 text-success font-600">
                      High Virality Potential
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Clear narrative structure, high hook contrast, and compliant with brand voice
                    rules.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs shrink-0 bg-card px-3 py-1.5 rounded-lg border border-border">
                <div className="flex flex-col text-center">
                  <span className="text-primary font-700">9.6</span>
                  <span className="text-[10px] text-muted-foreground">Hook</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex flex-col text-center">
                  <span className="text-primary font-700">9.3</span>
                  <span className="text-[10px] text-muted-foreground">Clarity</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex flex-col text-center">
                  <span className="text-primary font-700">9.5</span>
                  <span className="text-[10px] text-muted-foreground">Voice</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Column: Structured Draft Parts */}
              <div className="flex flex-col gap-4">
                {/* 1. Hook */}
                <div className="p-3.5 rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-700 text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} />
                      Part 1: The Hook (First 2 Lines)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {hook.length} chars
                    </span>
                  </div>
                  <p className="text-sm font-600 text-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/40">
                    {hook}
                  </p>
                </div>

                {/* 2. Body */}
                <div className="p-3.5 rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-700 text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={12} />
                      Part 2: Core Body Narrative
                    </span>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap bg-muted/20 p-2.5 rounded-lg border border-border/40 max-h-64 overflow-y-auto">
                    {body}
                  </div>
                </div>

                {/* 3. Call to Action */}
                <div className="p-3.5 rounded-xl border border-border bg-card">
                  <span className="text-[11px] font-700 text-accent uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <MessageSquareQuote size={12} />
                    Part 3: Call to Action (CTA)
                  </span>
                  <p className="text-xs font-500 text-foreground bg-accent/5 p-2.5 rounded-lg border border-accent/20 italic">
                    {cta}
                  </p>
                </div>

                {/* 4. Hashtags */}
                {post.hashtags?.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-border bg-card">
                    <span className="text-[11px] font-700 text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Target Hashtags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {post.hashtags.map((tag) => (
                        <span
                          key={`post-tag-${tag}`}
                          className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Preview & AI Carousel */}
              <div className="flex flex-col gap-4">
                <ImageCarouselSelector
                  images={candidateImages}
                  selectedIndex={selectedImageIdx}
                  onSelectIndex={setSelectedImageIdx}
                  title="Generated Visual Review"
                />

                {/* Quick Comment & Feedback Input */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="text-xs font-600 text-foreground block mb-1.5">
                    Leave Reviewer Feedback
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                      placeholder="e.g. Needs clearer CTA, or approved for Tuesday..."
                      className="input-base text-xs flex-1"
                    />
                    <button
                      onClick={handleSendComment}
                      disabled={!comment.trim()}
                      className="btn-primary text-xs px-3 disabled:opacity-50"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESEARCH PACKAGE */}
        {activeTab === 'research' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-700 text-foreground mb-1">
                Verified Research Sources & Citations
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Sources retrieved and evaluated during AI research synthesis.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: 'Async Work Benchmark Study 2026',
                    domain: 'hbr.org',
                    date: 'May 2026',
                    claim:
                      'Teams switching to async communication report 34% higher employee satisfaction and +3.6 hours of uninterrupted focus time per day.',
                    url: 'https://hbr.org/topic/async-productivity',
                  },
                  {
                    title: 'State of B2B Remote Work Culture',
                    domain: 'mckinsey.com',
                    date: 'Jan 2026',
                    claim:
                      'Companies reducing mandatory meeting slots see 42% faster decision velocity in distributed software teams.',
                    url: 'https://mckinsey.com/insights/future-of-work',
                  },
                  {
                    title: 'Internal Team Notion Retrospective',
                    domain: 'internal-vault',
                    date: 'Q2 2026',
                    claim:
                      'Sprint completion rate grew from 71% to 94% following adoption of 24hr async SLA.',
                    url: '#',
                  },
                ].map((src, i) => (
                  <div
                    key={`source-${i}`}
                    className="p-3 rounded-lg border border-border/80 bg-muted/20 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-600 text-foreground">{src.title}</span>
                      <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {src.domain} · {src.date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      &ldquo;{src.claim}&rdquo;
                    </p>
                    {src.url !== '#' && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 w-fit mt-0.5"
                      >
                        <LinkIcon size={11} />
                        View source citation
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY & AUDIT LOG */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3">
            {post.comments?.length > 0 ? (
              post.comments.map((c) => (
                <div key={c.id} className={`rounded-lg p-3.5 ${commentTypeColors[c.type]}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-white text-[9px] font-700">{c.authorInitials}</span>
                    </div>
                    <span className="text-xs font-600 text-foreground">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                    {commentTypeLabels[c.type] && (
                      <span className="text-[10px] font-700 ml-auto uppercase tracking-wide">
                        {commentTypeLabels[c.type]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed pl-8">{c.text}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
                No previous review comments. This draft is in initial review.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
