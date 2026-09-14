'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Target, AlignLeft, Clock } from 'lucide-react';



function inferCadence(startDate, endDate) {
  if (!startDate || !endDate || startDate === endDate) {
    return 'daily';
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays >= 25) return 'monthly';
  if (diffDays >= 6 && diffDays <= 8) return 'weekly';
  return 'custom';
}

export default function TopicPlanningPanel({
  isOpen,
  onClose,
  topic = null,
  initialDraft = null,
  onSave,
  onDelete,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    seriesName: 'Thought Leadership',
    seriesId: 'series-1',
    account: 'personal',
    audience: 'Early-stage Founders',
    cadence: 'weekly',
    startDate: '',
    endDate: '',
    publicationDate: '',
    brief: '',
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const titleInputRef = React.useRef(null);

  useEffect(() => {
    setHasAttemptedSubmit(false);
    if (topic) {
      const start = topic.startDate || topic.publicationDate || '';
      const end = topic.endDate || start;
      setFormData({
        title: topic.title || '',
        seriesName: topic.seriesName || 'Thought Leadership',
        seriesId: topic.seriesId || 'series-1',
        account: topic.account || 'personal',
        audience: topic.audience || 'B2B Founders & Tech Leads',
        cadence: topic.cadence || inferCadence(start, end),
        startDate: start,
        endDate: end,
        publicationDate: topic.publicationDate || start,
        brief: topic.brief || '',
      });
    } else if (initialDraft) {
      const start = initialDraft.startDate || '';
      const end = initialDraft.endDate || start;
      const inferred = inferCadence(start, end);
      setFormData({
        title: '',
        seriesName: initialDraft.pillar || 'Thought Leadership',
        seriesId: 'series-1',
        account: 'personal',
        audience: 'B2B SaaS Founders',
        cadence: inferred,
        startDate: start,
        endDate: end,
        publicationDate: start,
        brief: '',
      });
    } else {
      setFormData({
        title: '',
        seriesName: 'Thought Leadership',
        seriesId: 'series-1',
        account: 'personal',
        audience: 'B2B SaaS Founders',
        cadence: 'custom',
        startDate: '',
        endDate: '',
        publicationDate: '',
        brief: '',
      });
    }
  }, [topic, initialDraft, isOpen]);

  // Ensure field is viewed from the beginning (scrollLeft = 0) and cursor at index 0 on open
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.scrollLeft = 0;
      if (typeof titleInputRef.current.setSelectionRange === 'function') {
        try {
          titleInputRef.current.setSelectionRange(0, 0);
        } catch (_) {
          // Ignore unsupported input types or selection errors
        }
      }
    }
  }, [isOpen, topic]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'startDate') {
        next.publicationDate = value;
        next.cadence = inferCadence(value, next.endDate);
      } else if (field === 'endDate') {
        next.cadence = inferCadence(next.startDate, value);
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (!formData.title.trim()) return;

    onSave({
      ...formData,
      publicationDate: formData.startDate || formData.publicationDate,
      id: topic?.id,
    });
  };

  const isEditing = Boolean(topic?.id);
  const isTitleEmpty = !formData.title.trim();
  const showRequiredError = hasAttemptedSubmit && isTitleEmpty;

  return (
    <aside className="tpc-side-panel" aria-label="Topic planning panel">
      {/* Panel Header */}
      <div className="tpc-panel-head">
        <h2 className="tpc-panel-title">
          {isEditing ? 'Edit topic' : 'Plan topic'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="tpc-panel-close"
          aria-label="Close planning panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Panel Form Body */}
      <form onSubmit={handleSubmit} className="tpc-panel-body" noValidate>
        {/* Title */}
        <div className="tpc-form-field">
          <div className="tpc-form-label-row">
            <label className="tpc-form-label" htmlFor="tpc-input-title">
              Topic and angle
            </label>
            <span
              className={
                showRequiredError
                  ? 'tpc-form-hint text-rose-600 font-medium'
                  : 'tpc-form-hint'
              }
            >
              Required
            </span>
          </div>
          <input
            ref={titleInputRef}
            id="tpc-input-title"
            type="text"
            className="tpc-form-input"
            placeholder="e.g. B2B marketing stack consolidation"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Date Range & Cadence */}
        <div className="tpc-form-row-2">
          <div className="tpc-form-field">
            <label className="tpc-form-label" htmlFor="tpc-input-start">
              Start date
            </label>
            <input
              id="tpc-input-start"
              type="date"
              className="tpc-form-input"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
          <div className="tpc-form-field">
            <label className="tpc-form-label" htmlFor="tpc-input-end">
              End date
            </label>
            <input
              id="tpc-input-end"
              type="date"
              className="tpc-form-input"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Cadence & Target */}
        <div className="tpc-form-row-2">
          <div className="tpc-form-field">
            <label className="tpc-form-label" htmlFor="tpc-input-cadence">
              Cadence (inferred)
            </label>
            <select
              id="tpc-input-cadence"
              className="tpc-select w-full"
              value={formData.cadence}
              onChange={(e) => handleChange('cadence', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly theme</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          <div className="tpc-form-field">
            <label className="tpc-form-label" htmlFor="tpc-input-target">
              Target profile
            </label>
            <select
              id="tpc-input-target"
              className="tpc-select w-full"
              value={formData.account}
              onChange={(e) => handleChange('account', e.target.value)}
            >
              <option value="personal">Personal profile</option>
              <option value="company">Company page</option>
            </select>
          </div>
        </div>

        {/* Audience */}
        <div className="tpc-form-field">
          <label className="tpc-form-label" htmlFor="tpc-input-audience">
            Target audience
          </label>
          <input
            id="tpc-input-audience"
            type="text"
            className="tpc-form-input"
            placeholder="e.g. Enterprise buyers and tech leads"
            value={formData.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
          />
        </div>

        {/* Strategic Brief */}
        <div className="tpc-form-field">
          <label className="tpc-form-label" htmlFor="tpc-input-brief">
            Strategic brief and notes
          </label>
          <textarea
            id="tpc-input-brief"
            className="tpc-form-textarea"
            placeholder="Outline core arguments, proof points, or customer examples..."
            value={formData.brief}
            onChange={(e) => handleChange('brief', e.target.value)}
          />
        </div>

        {/* Footer Actions */}
        <div className="tpc-panel-footer mt-auto">
          {isEditing ? (
            <button
              type="button"
              onClick={() => onDelete(topic.id)}
              className="tpc-btn-delete"
              disabled={isSubmitting}
            >
              <Trash2 size={13} />
              Delete
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="tpc-btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tpc-btn-primary"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Plan topic'}
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
}
