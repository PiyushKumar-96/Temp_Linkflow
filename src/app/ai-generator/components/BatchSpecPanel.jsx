import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Layers, BarChart2, FileText, Loader2, Sparkles, Plus, Trash2, ArrowUpRight } from 'lucide-react';
import { FORMAT_OPTIONS, MAX_GROUPS, getPlannedTopicOptions } from '../extractSpec';

const COUNTS = [1, 2, 3, 4, 5];

export default function BatchSpecPanel({
  groups,
  onChangeGroup,
  onAddGroup,
  onRemoveGroup,
  globalSchedule,
  onChangeGlobalSchedule,
  flashFields = {},
  isGenerating,
  onGenerate,
  submittedEmpty,
}) {
  const navigate = useNavigate();
  const plannedTopics = getPlannedTopicOptions();
  const isMultiGroup = groups.length > 1;
  const totalCount = groups.reduce((acc, g) => acc + (g.count || 0), 0);

  // Validation: Topic must have at least 3 non-whitespace characters
  const isGroupValid = (g) => Boolean(g.topic && g.topic.trim().length >= 3);
  const isAnyTopicInvalid = groups.some((g) => !isGroupValid(g));

  const invalidGroupIndices = groups
    .map((g, idx) => (!isGroupValid(g) ? idx : -1))
    .filter((idx) => idx !== -1);

  return (
    <div className="aig-spec-panel">
      {/* Spec Header */}
      <div className="aig-spec-head-row">
        <div className="flex items-center gap-2">
          <h2 className="aig-spec-title">Batch Spec</h2>
          {isMultiGroup && (
            <span className="aig-group-count-badge">
              {groups.length} groups &bull; {totalCount} posts
            </span>
          )}
        </div>
      </div>

      {/* Render Groups */}
      {groups.map((group, groupIdx) => {
        const trimmed = (group.topic || '').trim();
        const isTouched = Boolean(submittedEmpty || (group.topic && group.topic.length > 0));
        const isTopicInvalid = isTouched && trimmed.length < 3;

        const groupFlash = flashFields[group.id] || {};

        return (
          <div
            key={group.id}
            className={`aig-group-item ${isMultiGroup ? 'aig-group-item-multi' : ''}`}
          >
            {isMultiGroup && (
              <div className="aig-group-header">
                <span className="aig-group-name">Group {groupIdx + 1}</span>
                <button
                  type="button"
                  onClick={() => onRemoveGroup(group.id)}
                  className="aig-btn-remove-group"
                  title={`Remove group ${groupIdx + 1}`}
                  aria-label={`Remove group ${groupIdx + 1}`}
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>
            )}

            {/* 1. Topic (Populated from Planned Topics) */}
            <div className="aig-field" data-flash={Boolean(groupFlash.topic)}>
              <div className="aig-label-row">
                <label
                  htmlFor={`aig-topic-select-${group.id}`}
                  className="aig-label"
                >
                  Topic
                </label>
                {isTopicInvalid ? (
                  <span className="aig-label-missing">
                    {trimmed.length === 0
                      ? 'Topic is required'
                      : 'Topic too short (min 3 characters)'}
                  </span>
                ) : (
                  <span className="aig-label-opt">Required</span>
                )}
              </div>

              {plannedTopics.length === 0 ? (
                <div className="aig-topic-empty-banner">
                  <span>No topics planned yet.</span>
                  <button
                    type="button"
                    onClick={() => navigate('/topics')}
                    className="aig-topic-empty-link flex items-center gap-1"
                  >
                    <span>Plan in Topics</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              ) : (
                <select
                  id={`aig-topic-select-${group.id}`}
                  value={group.topic || plannedTopics[0]?.title}
                  onChange={(e) =>
                    onChangeGroup(group.id, { topic: e.target.value })
                  }
                  className="aig-select"
                  aria-label={`Topic for group ${groupIdx + 1}`}
                >
                  {plannedTopics.map((top) => (
                    <option key={top.id} value={top.title}>
                      {top.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 2. Visual Format */}
            <div className="aig-field" data-flash={Boolean(groupFlash.format)}>
              <div className="aig-label-row">
                <label className="aig-label">Format</label>
              </div>
              <div
                className="aig-format-grid"
                role="group"

                aria-label={`Visual format for group ${groupIdx + 1}`}
              >
                {FORMAT_OPTIONS.map((fmt) => {
                  const isSelected = group.format === fmt.id;
                  const Icon =
                    fmt.id === 'image'
                      ? ImageIcon
                      : fmt.id === 'carousel'
                        ? Layers
                        : fmt.id === 'infographic'
                          ? BarChart2
                          : FileText;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() =>
                        onChangeGroup(group.id, { format: fmt.id })
                      }
                      className="aig-format-btn"
                      aria-pressed={isSelected}
                    >
                      <Icon size={12} />
                      <span>{fmt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Post Count */}
            <div className="aig-field" data-flash={Boolean(groupFlash.count)}>
              <div className="aig-label-row">
                <label className="aig-label">Count</label>
              </div>
              <div
                className="aig-count-grid"
                role="group"
                aria-label={`Post count for group ${groupIdx + 1}`}
              >
                {COUNTS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => onChangeGroup(group.id, { count: cnt })}
                    className="aig-count-btn"
                    aria-pressed={group.count === cnt}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Group Action: Quiet secondary below spec */}
      {groups.length < MAX_GROUPS && (
        <button
          type="button"
          onClick={onAddGroup}
          className="aig-btn-add-group"
        >
          <Plus size={13} />
          <span>Add group</span>
        </button>
      )}

      {/* 5. Auto-schedule Toggle */}
      <div className="aig-field">
        <div className="aig-toggle-row">
          <div>
            <div className="aig-label">Auto-schedule</div>
            <div className="aig-toggle-desc">Slots posts into open calendar windows</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={globalSchedule.autoSchedule}
            onClick={() =>
              onChangeGlobalSchedule({
                autoSchedule: !globalSchedule.autoSchedule,
              })
            }
            className="aig-switch"
            aria-label="Toggle auto-schedule"
          >
            <span className="aig-switch-thumb" />
          </button>
        </div>

        {!globalSchedule.autoSchedule && (
          <div className="aig-schedule-fields">
            <div>
              <label
                htmlFor="aig-start-date"
                className="aig-label-opt"
                style={{ display: 'block', marginBottom: 4 }}
              >
                Start date
              </label>
              <input
                id="aig-start-date"
                type="date"
                value={globalSchedule.startDate}
                onChange={(e) =>
                  onChangeGlobalSchedule({ startDate: e.target.value })
                }
                className="aig-input"
              />
            </div>
            <div>
              <label
                htmlFor="aig-default-time"
                className="aig-label-opt"
                style={{ display: 'block', marginBottom: 4 }}
              >
                Time
              </label>
              <input
                id="aig-default-time"
                type="time"
                value={globalSchedule.defaultTime}
                onChange={(e) =>
                  onChangeGlobalSchedule({ defaultTime: e.target.value })
                }
                className="aig-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Readiness Status Indicator: Explicitly states what is missing/blocking */}
      {isAnyTopicInvalid && (
        <div className="aig-readiness-warning" role="status">
          <span>
            {invalidGroupIndices.length === 1 && !isMultiGroup
              ? 'Enter a valid topic (min 3 characters) to generate'
              : `Group ${invalidGroupIndices.map((i) => i + 1).join(', ')}: Enter a valid topic (min 3 characters) to generate`}
          </span>
        </div>
      )}

      {/* Generate Button: --brand primary action */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || isAnyTopicInvalid}
        className="aig-btn-generate"
      >
        {isGenerating ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Generating {totalCount}…</span>
          </>
        ) : (
          <>
            <Sparkles size={14} />
            <span>Generate {totalCount}</span>
          </>
        )}
      </button>
    </div>
  );
}
