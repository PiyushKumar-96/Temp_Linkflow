'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { POST_STATUS, normalizeStatus } from '@/lib/post-status';
import { toast } from 'sonner';
import { AVATARS, STOCK_IMAGES } from '@/temp-backend/data/media';

import RejectFeedbackDialog from './RejectFeedbackDialog';
import ChangeBriefDialog from './ChangeBriefDialog';
import VersionHistoryDialog from '@/components/VersionHistoryDialog';

import ApprovalDetailHeader from './ApprovalDetailHeader';
import ApprovalFailedAlert from './ApprovalFailedAlert';
import ApprovalPostPreview from './ApprovalPostPreview';

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

  // Dialog States
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [changeBriefDialogOpen, setChangeBriefDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const authorAvatar =
    AVATARS[post.authorInitials?.toLowerCase()] ||
    AVATARS[post.author?.toLowerCase()] ||
    (post.author?.includes('Sarah')
      ? AVATARS.sarah
      : post.author?.includes('Marcus')
        ? AVATARS.marcus
        : post.author?.includes('Lisa')
          ? AVATARS.lisa
          : AVATARS.sarah);

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

  const targetSlotText = post.scheduledDate
    ? `${post.scheduledDate}${post.scheduledTime ? ` at ${post.scheduledTime}` : ''}`
    : post.dueDate
      ? `${post.dueDate}${post.scheduledTime ? ` at ${post.scheduledTime}` : ''}`
      : 'Scheduled Slot';

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <ApprovalDetailHeader
        post={post}
        targetSlotText={targetSlotText}
        isOwner={isOwner}
        isApproving={isApproving}
        onOpenReject={() => setRejectDialogOpen(true)}
        onApprove={handleApprove}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
        {/* Failed Post Alert Banner */}
        {normalizeStatus(post.status) === POST_STATUS.FAILED && (
          <ApprovalFailedAlert
            post={post}
            onChangeBrief={onChangeBrief}
            onDownloadManual={handleDownloadManual}
          />
        )}

        {/* Clean Modern Post Preview */}
        <ApprovalPostPreview
          post={post}
          authorAvatar={authorAvatar}
          targetSlotText={targetSlotText}
          qualityAudit={qualityAudit}
          candidateImages={candidateImages}
        />
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
