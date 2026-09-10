'use client';

import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Check, BookOpen, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SeriesSettingSchema } from '@/lib/contracts/settings.schema';
import { toast } from 'sonner';

export default function SeriesTab({ series = [], onUpdateSeries }) {
  const [editingSeries, setEditingSeries] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SeriesSettingSchema),
    defaultValues: {
      id: '',
      name: '',
      cadence: 'weekly',
      guidelines: '',
    },
  });

  const handleOpenCreate = () => {
    setEditingSeries(null);
    reset({
      id: `series-${Date.now()}`,
      name: '',
      cadence: 'weekly',
      guidelines: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingSeries(item);
    reset({
      id: item.id,
      name: item.name,
      cadence: item.cadence,
      guidelines: item.guidelines || '',
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    const next = series.filter((s) => s.id !== id);
    onUpdateSeries(next);
    toast.success('Series deleted');
  };

  const onSubmit = (data) => {
    if (editingSeries) {
      const next = series.map((s) => (s.id === data.id ? data : s));
      onUpdateSeries(next);
      toast.success(`Series "${data.name}" updated`);
    } else {
      onUpdateSeries([...series, data]);
      toast.success(`Series "${data.name}" created`);
    }
    setModalOpen(false);
  };

  return (
    <div className="card p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-700 text-foreground">Content Series & Cadence</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize thematic marketing pillars with specific publishing frequencies and brand guidelines
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Series</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {series.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3 hover:border-border/80 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Layers size={14} />
                  </div>
                  <h3 className="text-sm font-700 text-foreground">{item.name}</h3>
                </div>
                <span className="text-[10px] font-600 uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Clock size={10} />
                  {item.cadence}
                </span>
              </div>

              {item.guidelines ? (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 bg-muted/20 p-2 rounded border border-border/40 mt-2">
                  {item.guidelines}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground italic mt-2">No specific guidelines provided</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/40">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground text-xs flex items-center gap-1"
                title="Edit series"
              >
                <Edit2 size={13} />
                <span className="text-[11px]">Edit</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger text-xs flex items-center gap-1"
                title="Delete series"
              >
                <Trash2 size={13} />
                <span className="text-[11px]">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal with React Hook Form + Zod */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-xl card-shadow-md w-full max-w-md slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2 font-600 text-foreground">
                <Layers size={17} className="text-primary" />
                <h2 className="text-base">{editingSeries ? 'Edit Series' : 'Create New Series'}</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-600 text-foreground mb-1">
                  Series Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Async Work Transition"
                  {...register('name')}
                  className="input-base text-xs w-full"
                />
                {errors.name && (
                  <p className="text-[11px] text-danger mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-600 text-foreground mb-1">
                  Cadence & Target Frequency
                </label>
                <select {...register('cadence')} className="input-base text-xs w-full bg-card">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly (Recommended)</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-600 text-foreground mb-1">
                  Series Guidelines & Prompt Instructions
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Focus on pragmatic workflows, case studies, and concrete productivity metrics. Tone should be calm and authoritative."
                  {...register('guidelines')}
                  className="input-base text-xs w-full resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                  <Check size={14} />
                  <span>{editingSeries ? 'Save Changes' : 'Create Series'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
