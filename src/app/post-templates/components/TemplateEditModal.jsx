'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';

const tones = ['professional', 'conversational', 'inspirational', 'educational', 'humorous'];
const categories = [
  'Thought Leadership',
  'Case Study',
  'Product Update',
  'Hiring',
  'Event',
  'Engagement',
  'Company News',
  'Industry Insight',
  'Educational',
];

export default function TemplateEditModal({ template, onSave, onClose }) {
  const [hashtags, setHashtags] = useState(template.hashtags);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: template.name,
      category: template.category,
      description: template.description,
      body: template.body,
      tone: template.tone,
    },
  });

  const addHashtag = () => {
    const tag = hashtagInput.trim().startsWith('#')
      ? hashtagInput.trim()
      : `#${hashtagInput.trim()}`;
    if (tag.length > 1 && !hashtags.includes(tag)) {
      setHashtags((prev) => [...prev, tag]);
    }
    setHashtagInput('');
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({ ...template, ...data, hashtags });
    setIsSaving(false);
    toast.success(template.name ? 'Template updated' : 'Template created');
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={template.name ? `Edit: ${template.name}` : 'Create New Template'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4">
        {/* Name & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-600 text-foreground block mb-1">
              Template Name <span className="text-danger">*</span>
            </label>
            <input
              {...register('name', { required: 'Template name is required' })}
              className="input-base text-sm"
              placeholder="e.g. Milestone Announcement"
            />

            {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-xs font-600 text-foreground block mb-1">
              Category <span className="text-danger">*</span>
            </label>
            <select {...register('category')} className="input-base text-sm">
              {categories.map((c) => (
                <option key={`edit-cat-${c}`} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-600 text-foreground block mb-1">Description</label>
          <p className="text-xs text-muted-foreground mb-1">
            Brief explanation of when to use this template
          </p>
          <input
            {...register('description')}
            className="input-base text-sm"
            placeholder="e.g. Celebrate a company or personal milestone with context and gratitude"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="text-xs font-600 text-foreground block mb-2">Tone</label>
          <div className="flex gap-2 flex-wrap">
            {tones.map((t) => (
              <label key={`tone-radio-${t}`} className="cursor-pointer">
                <input type="radio" value={t} {...register('tone')} className="sr-only" />
                <span
                  className={`px-3 py-1.5 text-xs font-500 rounded-full border capitalize inline-block transition-all`}
                >
                  {t}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Body */}
        <div>
          <label className="text-xs font-600 text-foreground block mb-1">
            Template Body <span className="text-danger">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-1">
            Use [PLACEHOLDER] syntax for variable parts
          </p>
          <textarea
            {...register('body', { required: 'Template body is required' })}
            className="input-base text-sm font-mono leading-relaxed"
            rows={10}
            placeholder="Write your template with [PLACEHOLDERS] for variable content..."
          />

          {errors.body && <p className="text-xs text-danger mt-1">{errors.body.message}</p>}
        </div>

        {/* Hashtags */}
        <div>
          <label className="text-xs font-600 text-foreground block mb-1">Default Hashtags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHashtag();
                }
              }}
              placeholder="Add hashtag (press Enter)"
              className="input-base text-sm flex-1"
            />

            <button type="button" onClick={addHashtag} className="btn-secondary">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <span
                key={`modal-tag-${tag}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-500 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setHashtags((prev) => prev.filter((h) => h !== tag))}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : template.name ? (
              'Save Changes'
            ) : (
              'Create Template'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
