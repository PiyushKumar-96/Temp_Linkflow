'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTopicInputSchema } from '@/lib/contracts/topic.schema';
import { X, Calendar, Sparkles, Building2, User, Target } from 'lucide-react';

const DEFAULT_SERIES = [
  { id: 'series-1', name: 'Thought Leadership' },
  { id: 'series-2', name: 'Case Studies' },
  { id: 'series-3', name: 'Engineering Culture' },
  { id: 'series-4', name: 'Industry Insights' },
];

export default function TopicFormDialog({
  isOpen,
  onClose,
  initialData = null,
  initialDate = null,
  onSubmit,
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateTopicInputSchema),
    defaultValues: {
      title: initialData?.title || '',
      seriesId: initialData?.seriesId || 'series-1',
      seriesName: initialData?.seriesName || 'Thought Leadership',
      account: initialData?.account || 'personal',
      audience: initialData?.audience || 'B2B SaaS Founders',
      publicationDate: initialData?.publicationDate || initialDate || new Date().toISOString().split('T')[0],
      brief: initialData?.brief || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        seriesId: initialData.seriesId || 'series-1',
        seriesName: initialData.seriesName || 'Thought Leadership',
        account: initialData.account || 'personal',
        audience: initialData.audience || 'B2B SaaS Founders',
        publicationDate: initialData.publicationDate || new Date().toISOString().split('T')[0],
        brief: initialData.brief || '',
      });
    } else if (initialDate) {
      reset({
        title: '',
        seriesId: 'series-1',
        seriesName: 'Thought Leadership',
        account: 'personal',
        audience: 'B2B SaaS Founders',
        publicationDate: initialDate,
        brief: '',
      });
    } else {
      reset({
        title: '',
        seriesId: 'series-1',
        seriesName: 'Thought Leadership',
        account: 'personal',
        audience: 'B2B SaaS Founders',
        publicationDate: new Date().toISOString().split('T')[0],
        brief: '',
      });
    }
  }, [initialData, initialDate, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    const matchedSeries = DEFAULT_SERIES.find((s) => s.id === data.seriesId);
    onSubmit({
      ...data,
      seriesName: matchedSeries ? matchedSeries.name : data.seriesName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white">
              <Target size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {initialData ? 'Edit Planned Topic' : 'Plan New Topic'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Define the editorial angle before generating downstream content
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 overflow-y-auto p-6 gap-4">
          {/* Topic Title */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Topic Title / Angle <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Why B2B Teams Should Ditch Daily Standups"
              {...register('title')}
              className={`input w-full text-xs ${errors.title ? 'border-destructive' : ''}`}
            />
            {errors.title && (
              <span className="text-[10px] text-destructive mt-1 block">{errors.title.message}</span>
            )}
          </div>

          {/* Series & Target Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Series Category
              </label>
              <select
                {...register('seriesId')}
                onChange={(e) => {
                  const s = DEFAULT_SERIES.find((item) => item.id === e.target.value);
                  setValue('seriesId', e.target.value);
                  if (s) setValue('seriesName', s.name);
                }}
                className="input w-full text-xs bg-input"
              >
                {DEFAULT_SERIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Target Account
              </label>
              <select {...register('account')} className="input w-full text-xs bg-input">
                <option value="personal">Personal Profile</option>
                <option value="company">Company Page</option>
              </select>
            </div>
          </div>

          {/* Target Audience & Publication Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. Engineering Managers, CTOs"
                {...register('audience')}
                className="input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Planned Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                {...register('publicationDate')}
                className={`input w-full text-xs ${errors.publicationDate ? 'border-destructive' : ''}`}
              />
              {errors.publicationDate && (
                <span className="text-[10px] text-destructive mt-1 block">
                  {errors.publicationDate.message}
                </span>
              )}
            </div>
          </div>

          {/* Brief / Prompt Notes */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Topic Brief & Prompt Guidelines (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Outline specific takeaways, metrics to highlight, or audience pain points for the AI generator..."
              {...register('brief')}
              className="input w-full text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline text-xs px-4 py-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
              disabled={isSubmitting}
            >
              <Sparkles size={13} />
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Plan Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
