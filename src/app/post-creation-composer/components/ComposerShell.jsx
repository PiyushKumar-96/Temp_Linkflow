'use client';

import React, { useState } from 'react';
import ComposerEditor from './ComposerEditor';
import ComposerPreview from './ComposerPreview';
import ComposerAIPanel from './ComposerAIPanel';
import ComposerToolbar from './ComposerToolbar';
import ScheduleDrawer from './ScheduleDrawer';
import { toast } from 'sonner';

const MOCK_CANDIDATE_IMAGES = [
  {
    url: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b4fc0b68-1773435165826.png',
    alt: 'Clean modern data dashboard with growth metrics and trend graphs',
  },
  {
    url: 'https://img.rocket.new/generatedImages/rocket_gen_img_11c4a0e7e-1767621207129.png',
    alt: 'Team collaboration in a modern creative workspace',
  },
  {
    url: 'https://img.rocket.new/generatedImages/rocket_gen_img_13c515ccd-1773374405046.png',
    alt: 'SaaS product launch announcement visual banner',
  },
];

export default function ComposerShell() {
  const [content, setContent] = useState('');
  const [cta, setCta] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [hashtags, setHashtags] = useState(['#LinkedInMarketing', '#ContentStrategy', '#B2BSaaS']);
  const [imageUrl, setImageUrl] = useState('');
  const [candidateImages, setCandidateImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState('Thought Leadership');

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));

    setContent(
      `The biggest mistake most B2B companies make on LinkedIn?\n\nThey treat it like a broadcast channel — pushing announcements instead of starting conversations.\n\nHere's what actually works:\n\n→ Share the messy middle, not just the polished outcome\n→ Ask genuine questions your audience cares about\n→ Respond to every comment in the first hour\n→ Write for one person, not your entire ICP\n\nLinkedIn rewards consistency and authenticity — not perfection.\n\nWe grew our company page from 800 to 22,000 followers by following these principles. No paid promotion.`
    );

    const generatedCta =
      "What's the one thing that changed your LinkedIn results? Drop your thoughts below 👇";
    setCta(generatedCta);

    // Provide 3 AI candidate images in carousel
    setCandidateImages(MOCK_CANDIDATE_IMAGES);
    setSelectedImageIndex(0);
    setImageUrl(MOCK_CANDIDATE_IMAGES[0].url);

    setIsGenerating(false);
    toast.success('Generated draft and 3 image candidates with AI ✨');
  };

  const handleSelectImageIndex = (idx) => {
    setSelectedImageIndex(idx);
    if (candidateImages[idx]) {
      setImageUrl(candidateImages[idx].url || candidateImages[idx]);
      toast.success(`Attached Image Variation #${idx + 1}`);
    }
  };

  const handleRemoveCandidates = () => {
    setCandidateImages([]);
    setImageUrl('');
    toast.info('Visual removed');
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved');
  };

  const handleSubmitForReview = () => {
    toast.success('Submitted for review — approvers notified');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-700 text-foreground">Post Composer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, refine, and attach visual candidates for your LinkedIn post
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Editor */}
        <div className={`${showAIPanel ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <ComposerEditor
            content={content}
            onChange={setContent}
            cta={cta}
            onCtaChange={setCta}
            selectedTone={selectedTone}
            onToneChange={setSelectedTone}
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            category={category}
            onCategoryChange={setCategory}
            imageUrl={imageUrl}
            onImageChange={setImageUrl}
            candidateImages={candidateImages}
            selectedImageIndex={selectedImageIndex}
            onSelectImageIndex={handleSelectImageIndex}
            onRemoveCandidates={handleRemoveCandidates}
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
            cta={cta}
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
          onSchedule={(date, time, _assignee) => {
            setShowScheduleDrawer(false);
            toast.success(`Post scheduled for ${date} at ${time}`);
          }}
        />
      )}
    </div>
  );
}
