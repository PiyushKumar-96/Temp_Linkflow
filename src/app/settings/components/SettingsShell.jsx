'use client';

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Building2,
  User,
  Sparkles,
  Bell,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

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

  const [activeTab, setActiveTab] = useState('scheduling'); // 'scheduling' | 'accounts' | 'brandVoice' | 'notifications'
  const [rules, setRules] = useState(defaultRules);
  const [timezone, setTimezone] = useState('America/New_York');

  // Brand Voice State
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

  // Notification Preferences State
  const [notifyOnReview, setNotifyOnReview] = useState(true);
  const [notifyOnPublish, setNotifyOnPublish] = useState(true);
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');

  const updateRule = (idx, patch) => {
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addSlot = (idx) => {
    const rule = rules[idx];
    const lastSlot = rule.slots[rule.slots.length - 1];
    const newTime = lastSlot ? addMinutesToTime(lastSlot.time, 60) : '10:00';
    updateRule(idx, { slots: [...rule.slots, defaultSlot(newTime)] });
  };

  const removeSlot = (ruleIdx, slotId) => {
    setRules((prev) =>
      prev.map((r, i) =>
        i === ruleIdx ? { ...r, slots: r.slots.filter((s) => s.id !== slotId) } : r
      )
    );
  };

  const updateSlot = (ruleIdx, slotId, time) => {
    setRules((prev) =>
      prev.map((r, i) =>
        i === ruleIdx
          ? { ...r, slots: r.slots.map((s) => (s.id === slotId ? { ...s, time } : s)) }
          : r
      )
    );
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setRules(defaultRules);
    toast.info('Rules reset to defaults');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-700 text-foreground">Settings & Guidelines</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure LinkedIn accounts, schedule windows, brand voice rules, and notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-secondary text-xs">
            <RotateCcw size={13} />
            Reset
          </button>
          <button onClick={handleSave} className="btn-primary text-xs">
            <Save size={13} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        {[
          { id: 'scheduling', label: 'Publishing Schedule', icon: Clock },
          { id: 'accounts', label: 'LinkedIn Accounts', icon: Building2 },
          { id: 'brandVoice', label: 'Brand Voice & AI Guidelines', icon: Sparkles },
          { id: 'notifications', label: 'Notification Preferences', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-600 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PUBLISHING SCHEDULE */}
      {activeTab === 'scheduling' && (
        <div className="flex flex-col gap-5">
          <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              <span className="text-xs font-600 text-foreground uppercase tracking-wider">
                Workspace Timezone:
              </span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input-base text-xs py-1 px-2.5 h-8 font-500"
              >
                <option value="America/New_York">Eastern Time (US & Canada) (ET)</option>
                <option value="America/Chicago">Central Time (US & Canada) (CT)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada) (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
              </select>
            </div>
          </div>

          <div className="card p-5 flex flex-col gap-4">
            <h2 className="text-base font-700 text-foreground">Weekly Time Windows</h2>
            <div className="flex flex-col divide-y divide-border">
              {rules.map((rule, idx) => (
                <div
                  key={rule.day}
                  className="py-3 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-3 w-32">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => updateRule(idx, { enabled: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span
                      className={`text-sm font-600 ${rule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {rule.day}
                    </span>
                  </div>

                  {rule.enabled ? (
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {rule.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg border border-border"
                        >
                          <input
                            type="time"
                            value={slot.time}
                            onChange={(e) => updateSlot(idx, slot.id, e.target.value)}
                            className="bg-transparent text-xs font-600 text-foreground outline-none"
                          />
                          {rule.slots.length > 1 && (
                            <button
                              onClick={() => removeSlot(idx, slot.id)}
                              className="text-muted-foreground hover:text-danger p-0.5"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addSlot(idx)}
                        className="p-1 rounded border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors text-xs flex items-center gap-1 px-2"
                      >
                        <Plus size={12} />
                        Add Window
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic flex-1">
                      No posts scheduled
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LINKEDIN ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="card p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-700 text-foreground">Connected LinkedIn Targets</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage personal profiles and company pages authorized for publishing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => {
              const isCurrent = acc.id === activeAccount.id;
              return (
                <div
                  key={acc.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                        {acc.type.includes('Company') ? (
                          <Building2 size={20} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-700 text-sm text-foreground">{acc.name}</h3>
                          {isCurrent && (
                            <span className="text-[10px] bg-primary text-primary-foreground font-700 px-2 py-0.5 rounded-full">
                              Active Context
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {acc.type} · {acc.handle}
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[11px] text-success font-600 bg-success/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={11} />
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      OAuth Token: Valid for 58 days
                    </span>
                    {!isCurrent ? (
                      <button
                        onClick={() => {
                          switchAccount(acc);
                          toast.success(`Active context set to ${acc.name}`);
                        }}
                        className="btn-secondary text-xs py-1 px-2.5"
                      >
                        Set as Active Target
                      </button>
                    ) : (
                      <span className="text-primary font-600 text-xs">Default Target</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-600 text-foreground">
                Connect another LinkedIn Page or Profile
              </p>
              <p className="text-[11px] text-muted-foreground">
                Requires LinkedIn Administrator permissions.
              </p>
            </div>
            <button
              onClick={() => toast.info('Redirecting to LinkedIn OAuth...')}
              className="btn-primary text-xs py-2 px-3.5 whitespace-nowrap"
            >
              + Connect LinkedIn Account
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BRAND VOICE & AI GUIDELINES */}
      {activeTab === 'brandVoice' && (
        <div className="card p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-700 text-foreground">
              Brand Voice & AI Generation Rules
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              These guidelines are injected into every AI drafting and review prompt to ensure
              consistent quality
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-foreground block mb-1">Core Brand Tone</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="input-base text-xs"
              />
              <span className="text-[10px] text-muted-foreground">
                Defines emotional resonance and writing posture.
              </span>
            </div>

            <div>
              <label className="text-xs font-700 text-foreground block mb-1">
                Banned Buzzwords & Phrases (Comma-separated)
              </label>
              <input
                type="text"
                value={bannedKeywords}
                onChange={(e) => setBannedKeywords(e.target.value)}
                className="input-base text-xs"
              />
              <span className="text-[10px] text-muted-foreground">
                The AI engine will automatically filter out and avoid these terms.
              </span>
            </div>

            <div>
              <label className="text-xs font-700 text-foreground block mb-1">
                Target Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="input-base text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-700 text-foreground block mb-1">
                Hook Synthesis Guidelines
              </label>
              <textarea
                value={hookRules}
                onChange={(e) => setHookRules(e.target.value)}
                className="input-base text-xs h-20"
              />
              <span className="text-[10px] text-muted-foreground">
                Instructions applied during step 1 hook generation.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="card p-6 flex flex-col gap-5">
          <div>
            <h2 className="text-base font-700 text-foreground">Notification Channels & Alerts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control where and when approval requests and publish alerts are dispatched
            </p>
          </div>

          <div className="space-y-4 divide-y divide-border">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-700 text-foreground">Post Review Needed (Owner Alert)</p>
                <p className="text-[11px] text-muted-foreground">
                  Send notification immediately when a draft is submitted for review.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnReview}
                onChange={(e) => setNotifyOnReview(e.target.checked)}
                className="rounded border-border text-primary h-4 w-4"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-700 text-foreground">Publish Success Confirmation</p>
                <p className="text-[11px] text-muted-foreground">
                  Alert team when a post is dispatched live to LinkedIn.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnPublish}
                onChange={(e) => setNotifyOnPublish(e.target.checked)}
                className="rounded border-border text-primary h-4 w-4"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-700 text-foreground">Publish Failure & Retry Alerts</p>
                <p className="text-[11px] text-muted-foreground">
                  Trigger urgent notification if LinkedIn API rejects an upload.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnFailure}
                onChange={(e) => setNotifyOnFailure(e.target.checked)}
                className="rounded border-border text-primary h-4 w-4"
              />
            </div>

            <div className="pt-3">
              <label className="text-xs font-700 text-foreground block mb-1">
                Slack Webhook URL
              </label>
              <input
                type="text"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="input-base text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
