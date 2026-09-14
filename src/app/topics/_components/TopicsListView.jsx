import React, { useState } from 'react';
import {
  Building2,
  User,
  Pencil,
  Trash2,
  Sparkles,
  CheckCircle2,
  CircleDashed,
  Plus,
} from 'lucide-react';
import MonthStepperHeader, {
  MONTH_DATA,
  parseDate,
  formatTopicDate,
} from './MonthStepperHeader';

export default function TopicsListView({
  topics = [],
  currentMonthIndex = 8,
  onMonthChange,
  onPlanTopic,
  onEditTopic,
  onDeleteTopic,
  onStartGeneration,
  onBulkReschedule,
  onBulkDelete,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const monthInfo = MONTH_DATA[currentMonthIndex] || MONTH_DATA[8];

  // Month-scoped topics filtering
  const monthTopics = topics.filter((t) => {
    const start = parseDate(t.startDate || t.publicationDate);
    const end = parseDate(t.endDate || t.startDate || t.publicationDate);
    if (!start) return false;
    const startMonth = start.getUTCFullYear() === 2026 ? start.getUTCMonth() : -1;
    const endMonth = end ? (end.getUTCFullYear() === 2026 ? end.getUTCMonth() : 11) : startMonth;
    return monthInfo.index >= startMonth && monthInfo.index <= endMonth;
  });

  // Sort topics chronologically
  const sortedTopics = [...monthTopics].sort((a, b) => {
    const startA = a.startDate || a.publicationDate || '2026-01-01';
    const startB = b.startDate || b.publicationDate || '2026-01-01';
    return startA.localeCompare(startB);
  });

  const isAllSelected = sortedTopics.length > 0 && selectedIds.length === sortedTopics.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedTopics.map((t) => t.id));
    }
  };

  const handleToggleOne = (e, id) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkRescheduleDays = (days) => {
    onBulkReschedule(selectedIds, days);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Month Stepper Header */}
      <MonthStepperHeader
        currentMonthIndex={currentMonthIndex}
        onMonthChange={onMonthChange}
        topics={topics}
      />

      {/* Bulk Action Bar (when selected) */}
      {selectedIds.length > 0 && (
        <div className="tpc-bulk-bar">
          <span className="tpc-bulk-count">
            {selectedIds.length} {selectedIds.length === 1 ? 'topic' : 'topics'} selected
          </span>

          <div className="tpc-bulk-actions">
            {/* Shift Date Actions */}
            <div className="tpc-bulk-shift-group">
              <span className="tpc-bulk-shift-label">Shift:</span>
              <button
                type="button"
                onClick={() => handleBulkRescheduleDays(-14)}
                className="tpc-bulk-shift-btn"
                title="Shift planned dates backward by 14 days"
              >
                &minus;14d
              </button>
              <button
                type="button"
                onClick={() => handleBulkRescheduleDays(-7)}
                className="tpc-bulk-shift-btn"
                title="Shift planned dates backward by 7 days"
              >
                &minus;7d
              </button>
              <button
                type="button"
                onClick={() => handleBulkRescheduleDays(7)}
                className="tpc-bulk-shift-btn"
                title="Shift planned dates forward by 7 days"
              >
                +7d
              </button>
              <button
                type="button"
                onClick={() => handleBulkRescheduleDays(14)}
                className="tpc-bulk-shift-btn"
                title="Shift planned dates forward by 14 days"
              >
                +14d
              </button>
            </div>

            {/* Separated Destructive Delete Action (Subordinate & Quiet) */}
            <button
              type="button"
              onClick={() => {
                onBulkDelete(selectedIds);
                setSelectedIds([]);
              }}
              className="tpc-bulk-delete-btn"
              title="Delete selected topics"
            >
              <Trash2 size={12} />
              Delete selected
            </button>

            {/* Deselect Action */}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="tpc-bulk-deselect-btn"
              title="Deselect all rows"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="tpc-list-table-card">
        <table className="tpc-list-table">
          <thead>
            <tr>
              <th className="tpc-th-check">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  aria-label="Select all topics"
                  disabled={sortedTopics.length === 0}
                />
              </th>
              <th className="tpc-th tpc-col-main">Topic and strategic angle</th>
              <th className="tpc-th tpc-col-profile">Target profile</th>
              <th className="tpc-th tpc-col-audience">Audience</th>
              <th className="tpc-th tpc-col-dates">Cadence and dates</th>
              <th className="tpc-th tpc-col-content">Content</th>
              <th className="tpc-th tpc-th-actions tpc-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTopics.length === 0 ? (
              <tr>
                <td colSpan={7} className="tpc-empty-row">
                  <div className="tpc-list-empty-state">
                    <p className="tpc-list-empty-title">No topics planned for {monthInfo.fullName}</p>
                    <p className="tpc-list-empty-subtitle">
                      All weeks in this month are currently open.
                    </p>
                    {onPlanTopic && (
                      <button
                        type="button"
                        onClick={onPlanTopic}
                        className="tpc-btn-secondary tpc-list-empty-btn"
                      >
                        <Plus size={13} />
                        Plan topic for {monthInfo.name}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sortedTopics.map((topic) => {
                const isSelected = selectedIds.includes(topic.id);
                const formattedDate = formatTopicDate(topic.startDate, topic.endDate);
                const hasContent = Boolean(topic.downstreamPostId || topic.status === 'published');

                return (
                  <tr
                    key={topic.id}
                    className="tpc-list-row"
                    data-selected={isSelected ? 'true' : 'false'}
                    onClick={() => onEditTopic(topic)}
                    title={`Click to edit: ${topic.title}`}
                  >
                    {/* Checkbox */}
                    <td className="tpc-td-check" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleOne(e, topic.id)}
                        aria-label={`Select topic ${topic.title}`}
                      />
                    </td>

                    {/* Topic Title & Strategic Brief */}
                    <td className="tpc-td-main tpc-col-main">
                      <div className="tpc-list-title-wrap">
                        <span className="tpc-list-title">{topic.title}</span>
                        {topic.brief && (
                          <span className="tpc-list-brief">{topic.brief}</span>
                        )}
                      </div>
                    </td>

                    {/* Target Profile */}
                    <td className="tpc-td-profile tpc-col-profile">
                      <div className="tpc-profile-cell">
                        {topic.account === 'company' ? (
                          <>
                            <Building2 size={13} className="text-muted-foreground" />
                            <span>Company page</span>
                          </>
                        ) : (
                          <>
                            <User size={13} className="text-muted-foreground" />
                            <span>Personal profile</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Audience */}
                    <td className="tpc-td-audience tpc-col-audience">
                      <span className="tpc-audience-text">{topic.audience || '—'}</span>
                    </td>

                    {/* Cadence and Dates */}
                    <td className="tpc-td-dates tpc-col-dates">
                      <div className="tpc-dates-cell">
                        <span className="tpc-cadence-badge">{topic.cadence || 'custom'}</span>
                        <span className="tpc-date-range">{formattedDate}</span>
                      </div>
                    </td>

                    {/* Topic-level Content State */}
                    <td className="tpc-td-content tpc-col-content">
                      <div className="tpc-content-cell">
                        {hasContent ? (
                          <span className="tpc-content-status has-content" title="Draft generated / published">
                            <CheckCircle2 size={13} />
                            <span>Draft ready</span>
                          </span>
                        ) : (
                          <span className="tpc-content-status no-content" title="No draft generated yet">
                            <CircleDashed size={13} />
                            <span>No draft</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="tpc-td-actions tpc-col-actions" onClick={(e) => e.stopPropagation()}>
                      <div className="tpc-actions-cell">
                        {!hasContent && (
                          <button
                            type="button"
                            onClick={() => onStartGeneration(topic.id)}
                            className="tpc-row-generate-btn"
                            title="Start AI drafting pipeline"
                          >
                            <Sparkles size={11} />
                            Generate
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onEditTopic(topic)}
                          className="tpc-row-action-icon"
                          title="Edit topic"
                          aria-label="Edit topic"
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteTopic(topic.id)}
                          className="tpc-row-action-icon hover-danger"
                          title="Delete topic"
                          aria-label="Delete topic"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
