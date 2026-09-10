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
  History,
  AlertCircle,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  CarouselVisual,
  InfographicVisual,
  MarketingImageVisual,
  TextOnlyVisual,
} from '@/components/visuals';
import { POST_STATUS, normalizeStatus, canReview } from '@/lib/post-status';
import { toast } from 'sonner';
import RejectFeedbackDialog from './RejectFeedbackDialog';
import ChangeBriefDialog from './ChangeBriefDialog';
import VersionHistoryDialog from './VersionHistoryDialog';
import PipelineStageStepper from '@/components/PipelineStageStepper';

const commentTypeColors = {
  comment: 'bg-muted/60 border border-border/40',
  revision_request: 'bg-warning/10 border border-warning/30 text-warning-foreground',
  approval: 'bg-success/10 border border-success/30 text-success-foreground',
  rejection: 'bg-danger/10 border border-danger/30 text-danger-foreground',
};

const commentTypeLabels = {
  comment: 'Comment',
  revision_request: 'Brief Change / Revision',
  approval: 'Approved',
  rejection: 'Rejected',
};

import { STOCK_IMAGES } from '@/temp-backend/data/media';

const candidateImages = [
  {
    id: STOCK_IMAGES.teamBrainstorm.id,
    url: STOCK_IMAGES.teamBrainstorm.url,
    alt: STOCK_IMAGES.teamBrainstorm.label,
  },
  {
    id: STOCK_IMAGES.modernWorkspace.id,
    url: STOCK_IMAGES.modernWorkspace.url,
    alt: STOCK_IMAGES.modernWorkspace.label,
  },
  {
    id: STOCK_IMAGES.growthDashboard.id,
    url: STOCK_IMAGES.growthDashboard.url,
    alt: STOCK_IMAGES.growthDashboard.label,
  },
];

export default function ApprovalDetail({
  post,
  onApprove,
  onReject,
  onChangeBrief,
  onAddComment,
  isApproving = false,
}) {
  const { isOwner } = useAuth();
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('review');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Dialog States
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [changeBriefDialogOpen, setChangeBriefDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  // Split Post into Hook, Body, and CTA
  const parsePostParts = (content = '') => {
    const lines = content.split('\n').filter((l) => l.trim() !== '');
    if (lines.length <= 1) {
      return { hook: content, body: '', cta: '' };
    }
    const hook = lines.slice(0, 2).join('\n');
    const cta = lines[lines.length - 1];
    const body = lines.slice(2, lines.length - 1).join('\n\n');
    return { hook, body, cta };
  };

  const { hook, body, cta } = parsePostParts(post.content);

  const handleApprove = () => {
    if (!isOwner) {
      toast.error('Permission denied: Only Account Owners can authorize publication.');
      return;
    }
    onApprove();
  };

  const handleRejectConfirm = (feedback) => {
    if (!isOwner) {
      toast.error('Permission denied: Only Account Owners can reject posts.');
      return;
    }
    onReject(feedback);
  };

  const handleChangeBriefConfirm = (newBrief) => {
    onChangeBrief(newBrief);
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    onAddComment(comment.trim());
    setComment('');
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
    toast.success('Post copy and hashtags downloaded for manual publishing');
  };

  const qualityAudit = post.qualityAudit || {
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
        suggestion: 'Maintain double line breaks for scannability on mobile feeds',
      },
      {
        type: 'Call to Action',
        severity: 'medium',
        message: 'Question CTA could ask for specific tools',
        suggestion: 'Prompt reader for their team’s current async stack',
      },
    ],
  };

  const citations = post.citations || [];
  const activityLog = post.activityLog || [];
  const revisionsCount = post.revisions || (post.revisionsList?.length || 0);

  const targetSlotText = post.scheduledDate
    ? `${post.scheduledDate}${post.scheduledTime ? ` at ${post.scheduledTime}` : ''}`
    : post.dueDate
      ? `${post.dueDate}${post.scheduledTime ? ` at ${post.scheduledTime}` : ''}`
      : 'Scheduled Slot';

  return (
    <div className="card flex flex-col h-full overflow-hidden border border-border shadow-md">
      {/* Pipeline Stepper showing exact lifecycle stage & next step */}
      <div className="p-3.5 border-b border-border bg-muted/20">
        <PipelineStageStepper status={post.status} post={post} />
      </div>

      {/* Header bar */}
      <div className="px-5 py-4 border-b border-border bg-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusBadge status={post.status} />
              <span className="text-xs px-2.5 py-0.5 bg-muted rounded-full text-muted-foreground font-semibold">
                Series: {post.series || post.category || 'General'}
              </span>

              {/* Version History Button */}
              <button
                onClick={() => setHistoryDialogOpen(true)}
                className="text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                title="View full version history and revision diffs"
              >
                <History size={11} className="text-primary" />
                <span>
                  {revisionsCount > 0 ? `${revisionsCount} revisions` : '1 version (Initial draft)'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-700">{post.authorInitials}</span>
                </div>
                <span className="font-500 text-foreground">
                  {post.author} · {post.authorRole || 'Author'}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                Submitted {post.submittedAt || 'Recently'}
              </span>
              {post.dueDate && (
                <span className="flex items-center gap-1 text-warning font-500">
                  <Clock size={11} />
                  Due {post.dueDate}
                </span>
              )}
            </div>
          </div>

          {/* All 5 Reviewer Decision Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* 1. Download for manual publishing */}
            <button
              onClick={handleDownloadManual}
              className="btn-secondary text-xs py-1.5 px-2.5"
              title="Download post text & assets for manual publishing"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* 2. Edit in Composer */}
            <Link to={`/post-creation-composer?id=${post.id}&mode=edit`}>
              <button
                className="btn-secondary text-xs py-1.5 px-2.5"
                title="Open loaded in Composer to create a new revision"
              >
                <Edit3 size={13} />
                <span className="hidden sm:inline">Edit Draft</span>
              </button>
            </Link>

            {/* 3. Change Topic or Brief (loops back to regeneration) */}
            <button
              onClick={() => setChangeBriefDialogOpen(true)}
              className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
              title="Update brief directive and trigger AI regeneration"
            >
              <Sparkles size={13} className="text-primary" />
              <span className="hidden sm:inline">Change Brief</span>
            </button>

            {/* 4 & 5. Reject and Approve (gated by status & role) */}
            {(canReview(post.status) || normalizeStatus(post.status) === POST_STATUS.AWAITING_REVIEW) && (
              <>
                {/* 4. Reject with Feedback */}
                <button
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={!isOwner}
                  className={`text-xs py-1.5 px-3 rounded-lg font-600 flex items-center gap-1.5 transition-all ${
                    isOwner
                      ? 'btn-danger cursor-pointer'
                      : 'bg-muted text-muted-foreground cursor-not-allowed border border-border opacity-70'
                  }`}
                  title={!isOwner ? 'Only Account Owners can reject posts' : 'Reject post with feedback'}
                >
                  <X size={13} />
                  Reject
                </button>

                {/* 5. Approve (Optimistic) */}
                <div className="relative group">
                  <button
                    onClick={handleApprove}
                    disabled={!isOwner || isApproving}
                    className={`text-xs py-1.5 px-3.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      isOwner
                        ? 'btn-success cursor-pointer shadow-sm'
                        : 'bg-muted text-muted-foreground cursor-not-allowed border border-border opacity-70'
                    }`}
                    title={`Approves this post and locks it into publishing slot (${targetSlotText})`}
                  >
                    {isApproving ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Approve & Schedule for {targetSlotText}
                  </button>

                  {!isOwner && (
                    <div className="absolute right-0 bottom-full mb-2 w-56 p-2 bg-foreground text-primary-foreground text-[11px] rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      <div className="flex items-center gap-1 text-warning font-600 mb-0.5">
                        <ShieldAlert size={12} />
                        <span>Owner Role Required</span>
                      </div>
                      Only Account Owners can authorize publishing to LinkedIn. Switch role in topbar.
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
            { id: 'research', label: `Research Package (${citations.length})` },
            {
              id: 'history',
              label: `Activity (${(post.comments?.length || 0) + activityLog.length})`,
            },
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
        {/* Failed Post Alert Banner */}
        {normalizeStatus(post.status) === POST_STATUS.FAILED && (
          <div className="mb-5 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-destructive text-white flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-destructive">
                    Publishing Pipeline Dispatch Halted
                  </h4>
                  <p className="text-xs text-foreground font-medium mt-0.5">
                    {post.failureDetails?.errorMessage || 'Buffer API 429: LinkedIn profile quota exceeded'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-destructive/20 text-destructive font-semibold">
                {post.failureDetails?.requestId || 'req_9f41b2f'}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-destructive/20 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span>Failed: {post.failureDetails?.failedAt || 'Today'}</span>
                <span>Attempts: {post.failureDetails?.attemptCount || 3} of {post.failureDetails?.maxAttempts || 3}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onChangeBrief(post.id, 'Retry dispatch worker connection');
                    toast.success('Restarted generation and dispatch pipeline');
                  }}
                  className="btn btn-primary text-xs py-1 px-3 bg-destructive hover:bg-destructive/90 text-white flex items-center gap-1.5"
                >
                  <RotateCw size={12} />
                  Retry Dispatch
                </button>
                <button
                  onClick={handleDownloadManual}
                  className="btn btn-outline text-xs py-1 px-3 flex items-center gap-1.5"
                >
                  <Download size={12} />
                  Publish Manually
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: STRUCTURED REVIEW */}
        {activeTab === 'review' && (
          <div className="flex flex-col gap-5">
            {/* AI Review Quality Audit Panel */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex flex-col items-center justify-center text-white shrink-0 shadow-sm">
                    <span className="text-base font-800 leading-none">{qualityAudit.score}</span>
                    <span className="text-[9px] opacity-80 uppercase tracking-tighter">Score</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-700 text-foreground">
                        AI Quality Audit: Grade {qualityAudit.grade}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-success/20 text-success font-600">
                        {qualityAudit.verdict || 'Ready for Review'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Target speed: {qualityAudit.readabilityWpm || 220} wpm · Evaluated against brand voice rules.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs shrink-0 bg-card px-3 py-1.5 rounded-lg border border-border">
                  <div className="flex flex-col text-center">
                    <span className="text-primary font-700">{qualityAudit.hookScore / 10}</span>
                    <span className="text-[10px] text-muted-foreground">Hook</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex flex-col text-center">
                    <span className="text-primary font-700">{qualityAudit.clarityScore / 10}</span>
                    <span className="text-[10px] text-muted-foreground">Clarity</span>
                  </div>
                  <div className="w-px h-6 bg-border" />
                  <div className="flex flex-col text-center">
                    <span className="text-primary font-700">{qualityAudit.voiceScore / 10}</span>
                    <span className="text-[10px] text-muted-foreground">Voice</span>
                  </div>
                </div>
              </div>

              {/* Actionable Issues List */}
              {qualityAudit.issues?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-primary/10 space-y-1.5">
                  <span className="text-[11px] font-700 text-muted-foreground uppercase tracking-wider">
                    Actionable Improvement Suggestions ({qualityAudit.issues.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {qualityAudit.issues.map((issue, idx) => (
                      <div
                        key={`issue-${idx}`}
                        className="p-2.5 rounded-lg bg-card border border-border text-xs flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-600 text-foreground">{issue.type}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-600 uppercase ${
                              issue.severity === 'high'
                                ? 'bg-danger/15 text-danger'
                                : issue.severity === 'medium'
                                ? 'bg-warning/15 text-warning'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-[11px] text-primary/90 font-500">
                            → {issue.suggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

              {/* Right Column: Visual Preview according to format */}
              <div className="flex flex-col gap-4">
                {post.visualFormat === 'carousel' ? (
                  <CarouselVisual isEditable={false} />
                ) : post.visualFormat === 'infographic' ? (
                  <InfographicVisual isEditable={false} />
                ) : post.visualFormat === 'none' ? (
                  <TextOnlyVisual content={post.content} />
                ) : (
                  <MarketingImageVisual
                    candidateImages={candidateImages}
                    imageUrl={post.imageUrl || candidateImages[selectedImageIdx]?.url}
                    onSelectImage={(url) => {
                      const idx = candidateImages.findIndex((c) => c.url === url);
                      if (idx !== -1) setSelectedImageIdx(idx);
                    }}
                    isEditable={false}
                  />
                )}

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

              {citations.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl">
                  No external research citations attached to this draft.
                </div>
              ) : (
                <div className="space-y-3">
                  {citations.map((src) => (
                    <div
                      key={src.id}
                      className="p-3.5 rounded-lg border border-border bg-muted/20 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-600 text-foreground">{src.sourceName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {src.domain} {src.verifiedDate ? `· ${src.verifiedDate}` : ''}
                          </span>
                          {src.confidence && (
                            <span className="text-[10px] font-600 text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              {src.confidence}% verified
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed italic bg-card p-2.5 rounded border border-border/60">
                        &ldquo;{src.claim}&rdquo;
                      </p>
                      {src.url && src.url !== '#' && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 w-fit mt-0.5"
                        >
                          <LinkIcon size={11} />
                          <span>View source citation ({src.domain})</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY & AUDIT LOG */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3">
            {/* Audit log events */}
            {activityLog.length > 0 && (
              <div className="mb-2 space-y-2">
                <span className="text-[11px] font-700 text-muted-foreground uppercase tracking-wider block mb-1">
                  Automated Audit Trail
                </span>
                {activityLog.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg border border-border/80 bg-muted/30 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-600 text-foreground">{act.actor}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{act.action}</span>
                      </div>
                      {act.details && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {act.details}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Review Comments */}
            <span className="text-[11px] font-700 text-muted-foreground uppercase tracking-wider block mb-1">
              Review Decisions & Comments
            </span>
            {post.comments?.length > 0 ? (
              post.comments.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg p-3.5 ${
                    commentTypeColors[c.type] || commentTypeColors.comment
                  }`}
                >
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

      {/* Modals */}
      <RejectFeedbackDialog
        isOpen={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
      />

      <ChangeBriefDialog
        isOpen={changeBriefDialogOpen}
        onClose={() => setChangeBriefDialogOpen(false)}
        onConfirm={handleChangeBriefConfirm}
      />

      <VersionHistoryDialog
        isOpen={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        revisions={post.revisionsList || []}
        currentPostTitle={post.title}
      />
    </div>
  );
}
