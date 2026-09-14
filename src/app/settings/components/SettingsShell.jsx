'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Building2,
  User,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import AIProvidersTab from './AIProvidersTab';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const defaultSlot = (time = '09:00') => ({
  id: `slot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  time,
  enabled: true,
});

const defaultRules = DAYS.map((day, i) => ({
  day,
  enabled: i < 5,
  slots: [
    defaultSlot(
      i === 0
        ? '09:00'
        : i === 1
          ? '09:15'
          : i === 2
            ? '10:00'
            : i === 3
              ? '11:00'
              : i === 4
                ? '12:00'
                : '10:00'
    ),
  ],
  offsetFromPrev: i > 0 ? 15 : null,
  useOffset: i > 0 && i < 5,
}));

function addMinutesToTime(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export default function SettingsShell() {
  const { activeAccount, switchAccount, accounts } = useAuth();

  const [activeTab, setActiveTab] = useState('scheduling');
  const [isDirty, setIsDirty] = useState(false);

  // Tab 1: Scheduling
  const [rules, setRules] = useState(defaultRules);
  const [timezone, setTimezone] = useState('America/New_York');

  // Tab 2: AI Providers
  const [providers, setProviders] = useState([]);
  const [defaultProviderId, setDefaultProviderId] = useState(null);

  // Tab 3: Brand Voice
  const [tone, setTone] = useState('Authoritative, data-backed, and conversational');
  const [bannedKeywords, setBannedKeywords] = useState(
    'synergy, game-changer, revolutionary, guru'
  );
  const [targetAudience, setTargetAudience] = useState(
    'B2B SaaS Founders, VP Product, and Growth Marketers'
  );
  const [hookRules, setHookRules] = useState(
    'Start with high-contrast data, a myth debunk, or a personal milestone'
  );

  // Tab 4: Notification Preferences
  const [notifyOnReview, setNotifyOnReview] = useState(true);
  const [notifyOnPublish, setNotifyOnPublish] = useState(true);
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');

  // Load persisted settings on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('linkedflow_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.rules && Array.isArray(parsed.rules)) {
          const normalized = parsed.rules.map((r, i) => ({
            ...r,
            slots:
              Array.isArray(r.slots) && r.slots.length > 0
                ? r.slots
                : defaultRules[i]?.slots || [defaultSlot('10:00')],
          }));
          setRules(normalized);
        }
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.aiProviders && Array.isArray(parsed.aiProviders)) {
          setProviders(parsed.aiProviders);
        }
        if (parsed.defaultProviderId) {
          setDefaultProviderId(parsed.defaultProviderId);
        }
        if (parsed.brandVoice) {
          if (parsed.brandVoice.tone) setTone(parsed.brandVoice.tone);
          if (parsed.brandVoice.bannedKeywords) setBannedKeywords(parsed.brandVoice.bannedKeywords);
          if (parsed.brandVoice.targetAudience) setTargetAudience(parsed.brandVoice.targetAudience);
          if (parsed.brandVoice.hookRules) setHookRules(parsed.brandVoice.hookRules);
        }
        if (parsed.notifications) {
          setNotifyOnReview(parsed.notifications.notifyOnReview ?? true);
          setNotifyOnPublish(parsed.notifications.notifyOnPublish ?? true);
          setNotifyOnFailure(parsed.notifications.notifyOnFailure ?? true);
          setSlackWebhook(parsed.notifications.slackWebhook || '');
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Unsaved changes warning on browser navigate away / close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes that will be lost.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const markDirty = () => setIsDirty(true);

  const updateRule = (idx, patch) => {
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    markDirty();
  };

  const addSlot = (idx) => {
    const rule = rules[idx] || {};
    const slots = Array.isArray(rule.slots) ? rule.slots : [];
    const lastSlot = slots[slots.length - 1];
    const newTime = lastSlot ? addMinutesToTime(lastSlot.time, 60) : '10:00';
    updateRule(idx, { enabled: true, slots: [...slots, defaultSlot(newTime)] });
  };

  const removeSlot = (ruleIdx, slotId) => {
    setRules((prev) =>
      prev.map((r, i) => {
        if (i !== ruleIdx) return r;
        const remainingSlots = (r.slots || []).filter((s) => s.id !== slotId);
        return {
          ...r,
          enabled: remainingSlots.length > 0,
          slots: remainingSlots,
        };
      })
    );
    markDirty();
  };

  const updateSlot = (ruleIdx, slotId, time) => {
    setRules((prev) =>
      prev.map((r, i) =>
        i === ruleIdx
          ? { ...r, slots: (r.slots || []).map((s) => (s.id === slotId ? { ...s, time } : s)) }
          : r
      )
    );
    markDirty();
  };

  const handleSaveProvider = (newProv) => {
    setProviders((prev) => {
      const next = [...prev, newProv];
      if (next.length === 1 && !defaultProviderId) {
        setDefaultProviderId(newProv.id);
      }
      return next;
    });
    if (!defaultProviderId) {
      setDefaultProviderId(newProv.id);
    }
    markDirty();
  };

  const handleRemoveProvider = (provId) => {
    setProviders((prev) => prev.filter((p) => p.id !== provId));
    if (defaultProviderId === provId) {
      const remaining = providers.filter((p) => p.id !== provId);
      setDefaultProviderId(remaining.length > 0 ? remaining[0].id : null);
    }
    markDirty();
  };

  const handleSetDefaultProvider = (provId) => {
    setDefaultProviderId(provId);
    markDirty();
  };

  const handleSave = () => {
    const payload = {
      rules,
      timezone,
      aiProviders: providers,
      defaultProviderId,
      brandVoice: {
        tone,
        bannedKeywords,
        targetAudience,
        hookRules,
      },
      notifications: {
        notifyOnReview,
        notifyOnPublish,
        notifyOnFailure,
        slackWebhook,
      },
    };

    try {
      localStorage.setItem('linkedflow_settings', JSON.stringify(payload));
      setIsDirty(false);
      toast.success('Settings saved and persisted successfully');
    } catch {
      toast.error('Failed to save settings to storage');
    }
  };

  const handleReset = () => {
    setRules(defaultRules);
    setProviders([]);
    setDefaultProviderId(null);
    setTimezone('America/New_York');
    setTone('Authoritative, data-backed, and conversational');
    setBannedKeywords('synergy, game-changer, revolutionary, guru');
    setTargetAudience('B2B SaaS Founders, VP Product, and Growth Marketers');
    setHookRules('Start with high-contrast data, a myth debunk, or a personal milestone');
    markDirty();
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="flex flex-col gap-6 text-[color:var(--text)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight text-[color:var(--text)] leading-tight">
            Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[color:var(--text-muted)]">
            Configure workspace publishing rules, AI models, connected targets, and team notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-[color:var(--text-muted)] flex items-center gap-1 font-500 bg-muted px-2.5 py-1 rounded-full border border-[color:var(--border)]">
              <AlertTriangle size={12} />
              Unsaved changes
            </span>
          )}

          <button onClick={handleReset} className="btn-secondary text-xs">
            <RotateCcw size={13} />
            Reset
          </button>

          {/* SINGLE --brand PRIMARY BUTTON ON SCREEN */}
          <button
            onClick={handleSave}
            className="h-9 px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand-hover)] flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Save changes</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-[color:var(--border)] gap-2 flex-wrap">
        {[
          { id: 'scheduling', label: 'Publishing schedule' },
          { id: 'aiProviders', label: 'AI providers' },
          { id: 'accounts', label: 'LinkedIn accounts' },
          { id: 'brandVoice', label: 'Brand voice & AI guidelines' },
          { id: 'notifications', label: 'Notification preferences' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3.5 py-2 text-xs sm:text-sm font-500 transition-colors whitespace-nowrap border-b-2 -mb-px bg-transparent ${
                isActive
                  ? 'border-[color:var(--text)] text-[color:var(--text)] font-600'
                  : 'border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PUBLISHING SCHEDULE (7 DAY SIDE-BY-SIDE COLUMNS) */}
      {activeTab === 'scheduling' && (
        <div className="card p-5 flex flex-col gap-5">
          {/* Header Folded with Timezone Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[color:var(--border)]">
            <div>
              <h2 className="text-sm font-600 text-[color:var(--text)]">Weekly time windows</h2>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
                Set recurring publishing windows for automated queue dispatch.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-500 text-[color:var(--text-muted)]">
                Workspace timezone
              </span>
              <select
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value);
                  markDirty();
                }}
                className="input-base text-xs py-1 px-2.5 h-8 font-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
              </select>
            </div>
          </div>

          {/* 7-Column Day Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
            {rules.map((rule, idx) => {
              const isWeekend = rule.day === 'Saturday' || rule.day === 'Sunday';
              const hasSlots = Array.isArray(rule.slots) && rule.slots.length > 0;

              return (
                <div
                  key={rule.day}
                  className={`p-3 rounded-lg border flex flex-col justify-between gap-3 transition-colors ${
                    isWeekend ? 'bg-muted/40 border-[color:var(--border)]' : 'bg-card border-[color:var(--border)]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-600 text-[color:var(--text)]">
                        {rule.day}
                      </span>
                      {isWeekend && (
                        <span className="text-[10px] text-[color:var(--text-muted)]">Weekend</span>
                      )}
                    </div>

                    {hasSlots ? (
                      <div className="flex flex-col gap-1.5 pt-1">
                        {rule.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between gap-1 bg-card px-2 py-1.5 rounded-[10px] border border-[color:var(--border)]"
                          >
                            <input
                              type="time"
                              value={slot.time}
                              onChange={(e) => updateSlot(idx, slot.id, e.target.value)}
                              className="bg-transparent text-xs font-500 text-[color:var(--text)] outline-none rounded-[10px] w-full"
                            />
                            <button
                              type="button"
                              onClick={() => removeSlot(idx, slot.id)}
                              className="text-[color:var(--text-muted)] hover:text-[color:var(--text)] p-0.5 transition-colors cursor-pointer bg-transparent border-0"
                              title="Remove window"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <span className="text-xs text-[color:var(--text-muted)] block">
                          No windows set
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => addSlot(idx)}
                    className="w-full py-1.5 px-2 rounded-lg border border-dashed border-[color:var(--border)] hover:border-[color:var(--text)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer bg-transparent"
                  >
                    <Plus size={12} />
                    <span>Add window</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AI PROVIDERS */}
      {activeTab === 'aiProviders' && (
        <AIProvidersTab
          providers={providers}
          defaultProviderId={defaultProviderId}
          onSaveProvider={handleSaveProvider}
          onRemoveProvider={handleRemoveProvider}
          onSetDefaultProvider={handleSetDefaultProvider}
        />
      )}

      {/* TAB 3: LINKEDIN ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="card p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-600 text-[color:var(--text)]">Connected targets</h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              Personal profiles and company pages authorized for publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(accounts || []).map((acc) => {
              const isCurrent = acc?.id === activeAccount?.id;
              return (
                <div
                  key={acc.id}
                  className={`p-4 rounded-lg border flex flex-col justify-between gap-4 transition-colors ${
                    isCurrent
                      ? 'border-[color:var(--text)] bg-muted/30'
                      : 'border-[color:var(--border)] bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-[color:var(--text)] shrink-0 border border-[color:var(--border)]">
                        {acc.type.includes('Company') ? (
                          <Building2 size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-600 text-xs sm:text-sm text-[color:var(--text)]">{acc.name}</h3>
                          {isCurrent && (
                            <span className="text-[11px] text-[color:var(--text-muted)] font-500">
                              (Active target)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[color:var(--text-muted)]">
                          {acc.type} · {acc.handle}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-[color:var(--text-muted)] font-500">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[color:var(--border)] text-xs">
                    <span className="text-[color:var(--text-muted)] text-[11px]">
                      Access authorized for 58 days
                    </span>
                    {!isCurrent ? (
                      <button
                        onClick={() => {
                          switchAccount(acc);
                          toast.success(`Active target set to ${acc.name}`);
                        }}
                        className="btn-secondary text-xs py-1 px-2.5"
                      >
                        Set as active target
                      </button>
                    ) : (
                      <span className="text-[color:var(--text-muted)] font-500 text-xs">Default target</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-lg border border-dashed border-[color:var(--border)] bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-600 text-[color:var(--text)]">
                Connect another LinkedIn page or profile
              </p>
              <p className="text-[11px] text-[color:var(--text-muted)]">
                Requires LinkedIn administrator permissions.
              </p>
            </div>

            {/* SECONDARY OUTLINE BUTTON */}
            <button
              onClick={() => toast.info('Redirecting to LinkedIn authorization...')}
              className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
            >
              + Connect target
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: BRAND VOICE & AI GUIDELINES */}
      {activeTab === 'brandVoice' && (
        <div className="card p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-600 text-[color:var(--text)]">
              Brand voice and generation rules
            </h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              These guidelines are injected into AI drafting prompts to maintain brand consistency.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-600 text-[color:var(--text)] block mb-1">Core brand tone</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => {
                  setTone(e.target.value);
                  markDirty();
                }}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-600 text-[color:var(--text)] block mb-1">
                Banned buzzwords and phrases
              </label>
              <input
                type="text"
                value={bannedKeywords}
                onChange={(e) => {
                  setBannedKeywords(e.target.value);
                  markDirty();
                }}
                className="input-base text-xs"
              />
              <span className="text-[11px] text-[color:var(--text-muted)] mt-1 block">
                Comma-separated list of terms the AI generator will filter out.
              </span>
            </div>

            <div>
              <label className="text-xs font-600 text-[color:var(--text)] block mb-1">
                Target audience persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => {
                  setTargetAudience(e.target.value);
                  markDirty();
                }}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-600 text-[color:var(--text)] block mb-1">
                Hook synthesis guidelines
              </label>
              <textarea
                value={hookRules}
                onChange={(e) => {
                  setHookRules(e.target.value);
                  markDirty();
                }}
                className="input-base text-xs h-20"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="card p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-600 text-[color:var(--text)]">Notification channels and alerts</h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              Control where and when team alerts and review requests are dispatched.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-[color:var(--border)]">
            <div className="pt-2 flex items-start gap-3">
              <input
                type="checkbox"
                id="notifReview"
                checked={notifyOnReview}
                onChange={(e) => {
                  setNotifyOnReview(e.target.checked);
                  markDirty();
                }}
                className="rounded border-[color:var(--border)] text-[color:var(--text)] focus:ring-[color:var(--text)] h-4 w-4 mt-0.5"
              />
              <label htmlFor="notifReview" className="cursor-pointer">
                <p className="text-xs font-600 text-[color:var(--text)]">Post review needed</p>
                <p className="text-[11px] text-[color:var(--text-muted)]">
                  Alert owner immediately when a draft is submitted for review.
                </p>
              </label>
            </div>

            <div className="pt-3 flex items-start gap-3">
              <input
                type="checkbox"
                id="notifPublish"
                checked={notifyOnPublish}
                onChange={(e) => {
                  setNotifyOnPublish(e.target.checked);
                  markDirty();
                }}
                className="rounded border-[color:var(--border)] text-[color:var(--text)] focus:ring-[color:var(--text)] h-4 w-4 mt-0.5"
              />
              <label htmlFor="notifPublish" className="cursor-pointer">
                <p className="text-xs font-600 text-[color:var(--text)]">Publish success confirmation</p>
                <p className="text-[11px] text-[color:var(--text-muted)]">
                  Alert team when a post is dispatched live to LinkedIn.
                </p>
              </label>
            </div>

            <div className="pt-3 flex items-start gap-3">
              <input
                type="checkbox"
                id="notifFailure"
                checked={notifyOnFailure}
                onChange={(e) => {
                  setNotifyOnFailure(e.target.checked);
                  markDirty();
                }}
                className="rounded border-[color:var(--border)] text-[color:var(--text)] focus:ring-[color:var(--text)] h-4 w-4 mt-0.5"
              />
              <label htmlFor="notifFailure" className="cursor-pointer">
                <p className="text-xs font-600 text-[color:var(--text)]">Publish failure and retry alerts</p>
                <p className="text-[11px] text-[color:var(--text-muted)]">
                  Trigger notification if LinkedIn API rejects an upload.
                </p>
              </label>
            </div>

            <div className="pt-3">
              <label className="text-xs font-600 text-[color:var(--text)] block mb-1">
                Slack webhook URL
              </label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => {
                  setSlackWebhook(e.target.value);
                  markDirty();
                }}
                className="input-base text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

