'use client';

import React, { useState } from 'react';
import ComposerEditor from './ComposerEditor';
import ComposerPreview from './ComposerPreview';
import ComposerAIPanel from './ComposerAIPanel';
import ComposerToolbar from './ComposerToolbar';
import ScheduleDrawer from './ScheduleDrawer';
import { toast } from 'sonner';

export default function ComposerShell() {
  const [content, setContent] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [hashtags, setHashtags] = useState(['#LinkedInMarketing', '#ContentStrategy', '#B2BSaaS']);
  const [imageUrl, setImageUrl] = useState('');
  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState('Thought Leadership');
  const [assignedTo, setAssignedTo] = useState('');

  const handleAIGenerate = async () => {
    // BACKEND: POST /api/ai/generate-post with { tone, category, prompt }
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));
    setContent(
      `The biggest mistake most B2B companies make on LinkedIn?\n\nThey treat it like a broadcast channel — pushing announcements instead of starting conversations.\n\nHere's what actually works:\n\n→ Share the messy middle, not just the polished outcome\n→ Ask genuine questions your audience cares about\n→ Respond to every comment in the first hour\n→ Write for one person, not your entire ICP\n\nLinkedIn rewards consistency and authenticity — not perfection.\n\nWe grew our company page from 800 to 22,000 followers by following these principles. No paid promotion.\n\nWhat's the one thing that changed your LinkedIn results?`
    );
    setIsGenerating(false);
    toast.success('Post generated with AI ✨');
  };

  const handleSaveDraft = () => {
    // BACKEND: POST /api/posts with { content, hashtags, tone, category, status: 'draft' }
    toast.success('Draft saved');
  };

  const handleSubmitForReview = () => {
    // BACKEND: POST /api/posts with status: 'pending' + notify approvers
    toast.success('Submitted for review — approvers notified');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-700 text-foreground">Post Composer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create and schedule your LinkedIn post
          </p>
        </div>
        <ComposerToolbar
          showAIPanel={showAIPanel}
          onToggleAI={() => setShowAIPanel((s) => !s)}
          onSaveDraft={handleSaveDraft}
          onSubmitReview={handleSubmitForReview}
          onSchedule={() => setShowScheduleDrawer(true)}
          hasContent={content.length > 0}
        />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Editor */}
        <div className={`${showAIPanel ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <ComposerEditor
            content={content}
            onChange={setContent}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            category={category}
            onCategoryChange={setCategory}
            imageUrl={imageUrl}
            onImageChange={setImageUrl}
            isGenerating={isGenerating}
            onAIGenerate={handleAIGenerate}
          />
        </div>

        {/* AI Panel */}
        {showAIPanel && (
          <div className="xl:col-span-1">
            <ComposerAIPanel
              content={content}
              tone={selectedTone}
              onToneChange={setSelectedTone}
              onHashtagsChange={setHashtags}
              onApplySuggestion={setContent}
            />
          </div>
        )}

        {/* Preview */}
        <div className="xl:col-span-2">
          <ComposerPreview
            content={content}
            hashtags={hashtags}
            imageUrl={imageUrl}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Schedule Drawer */}
      {showScheduleDrawer && (
        <ScheduleDrawer
          onClose={() => setShowScheduleDrawer(false)}
          onSchedule={(date, time, assignee) => {
            setShowScheduleDrawer(false);
            // BACKEND: PATCH /api/posts/:id with { scheduledAt: date+time, assignedApprover: assignee, status: 'scheduled' }
            toast.success(`Post scheduled for ${date} at ${time}`);
          }}
        />
      )}
    </div>
  );
}
