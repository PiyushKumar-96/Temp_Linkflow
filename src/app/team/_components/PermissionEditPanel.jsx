import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';

export const ALL_PERMISSIONS = [
  { id: 'create_drafts', label: 'Create drafts' },
  { id: 'schedule_posts', label: 'Schedule posts' },
  { id: 'approve_posts', label: 'Approve posts' },
  { id: 'publish_linkedin', label: 'Publish to LinkedIn' },
  { id: 'manage_topics', label: 'Manage topics' },
  { id: 'view_analytics', label: 'View analytics' },
  { id: 'manage_team', label: 'Manage team' },
  { id: 'edit_settings', label: 'Edit settings' },
];

export const ROLE_BASELINES = {
  owner: [
    'create_drafts',
    'schedule_posts',
    'approve_posts',
    'publish_linkedin',
    'manage_topics',
    'view_analytics',
    'manage_team',
    'edit_settings',
  ],
  marketing: ['create_drafts', 'schedule_posts', 'manage_topics', 'view_analytics'],
  reviewer: ['approve_posts', 'view_analytics'],
  viewer: ['view_analytics'],
};

export const ROLE_LABELS = {
  owner: 'Account owner',
  marketing: 'Marketing user',
  reviewer: 'Reviewer',
  viewer: 'Viewer',
};

export function getEffectivePermissions(role, customPermissions) {
  if (role === 'owner') return [...ROLE_BASELINES.owner];
  if (Array.isArray(customPermissions) && customPermissions.length > 0) return [...customPermissions];
  return ROLE_BASELINES[role] ? [...ROLE_BASELINES[role]] : [];
}

export function isCustomized(role, permissions) {
  if (role === 'owner') return false;
  if (!Array.isArray(permissions)) return false; // Not customized if using role baseline
  const baseline = ROLE_BASELINES[role] || [];
  if (baseline.length !== permissions.length) return true;
  return !baseline.every((p) => permissions.includes(p));
}

export default function PermissionEditPanel({
  isOpen,
  onClose,
  member,
  onSavePermissions,
}) {
  const [selectedRole, setSelectedRole] = useState('marketing');
  const [activePermissions, setActivePermissions] = useState([]);
  const [showRoleResetNotice, setShowRoleResetNotice] = useState(false);

  useEffect(() => {
    if (member) {
      const r = member.role || 'marketing';
      setSelectedRole(r);
      const effective = getEffectivePermissions(r, member.permissions);
      setActivePermissions(effective);
      setShowRoleResetNotice(false);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const roleBaseline = ROLE_BASELINES[selectedRole] || [];

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    const newBaseline = ROLE_BASELINES[newRole] || [];
    setActivePermissions([...newBaseline]);
    setShowRoleResetNotice(true);
  };

  const handleTogglePermission = (permId) => {
    setActivePermissions((prev) => {
      if (prev.includes(permId)) {
        return prev.filter((id) => id !== permId);
      } else {
        return [...prev, permId];
      }
    });
  };

  const handleResetToBaseline = () => {
    const defaultBaseline = ROLE_BASELINES[selectedRole] || [];
    setActivePermissions([...defaultBaseline]);
    setShowRoleResetNotice(false);
  };

  const handleSave = () => {
    onSavePermissions(member.id, selectedRole, activePermissions);
    onClose();
  };

  const isCurrentCustomized = isCustomized(selectedRole, activePermissions);

  return (
    <aside
      className="w-[380px] shrink-0 bg-[color:var(--card)] border border-[color:var(--border)] rounded-[14px] shadow-lg flex flex-col overflow-hidden self-start transition-all duration-200"
      aria-label="Edit member permissions panel"
    >
      {/* Header: Name and Email */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border)] bg-[color:var(--chip)]/40">
        <div className="min-w-0 pr-2">
          <p className="text-xs font-semibold text-[color:var(--text)] truncate">
            {member.name}
          </p>
          <p className="text-[11px] text-[color:var(--text-muted)] truncate">
            {member.email}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--chip)] transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body: Role Selector & Permissions List */}
      <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-220px)]">
        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-[color:var(--text)] mb-1.5">
            Role baseline
          </label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] transition-colors cursor-pointer"
          >
            <option value="marketing">Marketing user</option>
            <option value="reviewer">Reviewer</option>
            <option value="viewer">Viewer</option>
          </select>
          {showRoleResetNotice && (
            <p className="text-[11px] text-[color:var(--text-muted)] mt-1.5 italic">
              Role changed. Permissions reset to {ROLE_LABELS[selectedRole]} defaults.
            </p>
          )}
        </div>

        {/* Permissions List Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-[color:var(--text)]">
            Capabilities
          </span>
          {isCurrentCustomized && (
            <button
              type="button"
              onClick={handleResetToBaseline}
              className="inline-flex items-center gap-1 text-[11px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] font-normal transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              <RotateCcw size={11} />
              <span>Reset to role defaults</span>
            </button>
          )}
        </div>

        {/* 8 System Permissions with 4 States */}
        <div className="flex flex-col gap-2.5">
          {ALL_PERMISSIONS.map((perm) => {
            const isChecked = activePermissions.includes(perm.id);
            const inRole = roleBaseline.includes(perm.id);

            let stateLabel = '';
            if (isChecked && inRole) stateLabel = 'From role';
            else if (isChecked && !inRole) stateLabel = 'Added';
            else if (!isChecked && inRole) stateLabel = 'Removed';

            return (
              <label
                key={perm.id}
                className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[color:var(--chip)]/50 cursor-pointer text-xs select-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTogglePermission(perm.id)}
                    className="w-4 h-4 rounded border-[color:var(--border)] text-[color:var(--brand)] focus:ring-[color:var(--brand)] cursor-pointer"
                  />
                  <span className="text-[color:var(--text)] font-normal">
                    {perm.label}
                  </span>
                </div>

                {stateLabel && (
                  <span className="text-[11px] text-[color:var(--text-muted)] font-normal tabular-nums">
                    {stateLabel}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer: Save & Cancel */}
      <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[color:var(--border)] bg-[color:var(--chip)]/30">
        <button
          type="button"
          onClick={onClose}
          className="text-xs px-3.5 py-2 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--text)] font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="text-xs px-4 py-2 rounded-lg bg-[color:var(--brand)] text-white hover:bg-[color:var(--brand-hover)] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]"
        >
          Save permissions
        </button>
      </div>
    </aside>
  );
}
