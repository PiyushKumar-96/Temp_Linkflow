'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTopicInputSchema } from '@/lib/contracts/topic.schema';
import { X, Sparkles, Target } from 'lucide-react';
import TopicDateRangePicker from './TopicDateRangePicker';

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
  initialCadence = 'custom',
  onSubmit,
  isSubmitting = false,
}) {
  const [dateError, setDateError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateTopicInputSchema),
    defaultValues: {
      title: '',
      seriesId: 'series-1',
      seriesName: 'Thought Leadership',
      account: 'personal',
      audience: 'B2B SaaS Founders',
      cadence: 'custom',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      publicationDate: new Date().toISOString().split('T')[0],
      brief: '',
    },
  });

  const watchedCadence = watch('cadence');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  useEffect(() => {
    setDateError(null);
    const today = new Date().toISOString().split('T')[0];
    const baseDate = initialData?.startDate || initialData?.publicationDate || initialDate || today;
    const baseEndDate = initialData?.endDate || baseDate;
    const cadence = initialData?.cadence || initialCadence || 'custom';

    reset({
      title: initialData?.title || '',
      seriesId: initialData?.seriesId || 'series-1',
      seriesName: initialData?.seriesName || 'Thought Leadership',
      account: initialData?.account || 'personal',
      audience: initialData?.audience || 'B2B SaaS Founders',
      cadence,
      startDate: baseDate,
      endDate: baseEndDate,
      publicationDate: baseDate,
      brief: initialData?.brief || '',
    });
  }, [initialData, initialDate, initialCadence, reset]);

  if (!isOpen) return null;

  const handleDateChange = (val) => {
    setValue('cadence', val.cadence);
    setValue('startDate', val.startDate);
    setValue('endDate', val.endDate);
    setValue('publicationDate', val.publicationDate);
    if (val.endDate < val.startDate) {
      setDateError('End date cannot be earlier than start date');
    } else {
      setDateError(null);
    }
  };

  const handleFormSubmit = (data) => {
    if (data.endDate && data.endDate < data.startDate) {
      setDateError('End date cannot be earlier than start date');
      return;
    }
    const matched = DEFAULT_SERIES.find((s) => s.id === data.seriesId);
    onSubmit({
      ...data,
      publicationDate: data.startDate,
      seriesName: matched ? matched.name : data.seriesName,
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
                Define editorial scope, cadence, and schedule before generating drafts
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
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Topic Title / Strategic Angle <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Why B2B Teams Should Ditch Daily Standups"
              {...register('title')}
              className={`input w-full text-xs ${errors.title ? 'border-destructive' : ''}`}
            />
            {errors.title && <span className="text-[10px] text-destructive mt-1 block">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Series Category</label>
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
              <label className="block text-xs font-semibold text-foreground mb-1.5">Target Account</label>
              <select {...register('account')} className="input w-full text-xs bg-input">
                <option value="personal">Personal Profile</option>
                <option value="company">Company Page</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Target Audience</label>
            <input
              type="text"
              placeholder="e.g. Engineering Managers, CTOs"
              {...register('audience')}
              className="input w-full text-xs"
            />
          </div>

          {/* Schedule & Date Range Picker */}
          <TopicDateRangePicker
            cadence={watchedCadence}
            startDate={watchedStartDate}
            endDate={watchedEndDate}
            onChange={handleDateChange}
            error={dateError || errors.startDate?.message}
          />

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Topic Brief & Prompt Guidelines (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Outline specific takeaways, metrics to highlight, or audience pain points..."
              {...register('brief')}
              className="input w-full text-xs leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 mt-1 border-t border-border">
            <button type="button" onClick={onClose} className="btn btn-outline text-xs px-4 py-2" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary text-xs px-5 py-2 flex items-center gap-1.5" disabled={isSubmitting}>
              <Sparkles size={13} />
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Plan Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
