import React from 'react';
import { isCustomized, getEffectivePermissions } from './PermissionEditPanel';

const ROLE_LABELS = {
  owner: 'Account owner',
  marketing: 'Marketing user',
  reviewer: 'Reviewer',
  viewer: 'Viewer',
};

function formatPermissionsSummary(role, permissions) {
  if (role === 'owner') return 'Full access — all 8 capabilities';

  const effective = getEffectivePermissions(role, permissions);
  if (!Array.isArray(effective) || effective.length === 0) return 'View only';
  if (effective.length === 1 && effective[0] === 'view_analytics') return 'View analytics';

  const parts = [];
  if (effective.includes('create_drafts')) parts.push('Write');
  if (effective.includes('schedule_posts')) parts.push('schedule');
  if (effective.includes('approve_posts')) parts.push('approve');
  if (effective.includes('publish_linkedin')) parts.push('publish');
  if (effective.includes('manage_topics')) parts.push('topics');
  if (effective.includes('view_analytics')) parts.push('analytics');
  if (effective.includes('manage_team')) parts.push('team');
  if (effective.includes('edit_settings')) parts.push('settings');

  if (parts.length <= 3) return parts.join(', ');
  const first = parts.slice(0, parts.length - 1).join(', ');
  return `${first} & ${parts[parts.length - 1]}`;
}

function formatDateString(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export default function MemberList({
  members = [],
  isOwner,
  onRoleChange,
  onRemoveMember,
  onResendInvite,
  onOpenEditPermissions,
}) {
  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-[14px] overflow-hidden shadow-none flex-1 min-w-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--chip)]/50 text-[12px] font-semibold text-[color:var(--text-muted)]">
              <th className="px-5 py-3 font-semibold">Member</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Permissions</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)] text-[13.5px]">
            {safeMembers.map((member) => {
              const isAccountOwnerRow = member.role === 'owner';
              const customized = isCustomized(member.role, member.permissions);
              const summaryText = formatPermissionsSummary(member.role, member.permissions);

              return (
                <tr key={member.id} className="hover:bg-[color:var(--chip)]/30 transition-colors">
                  {/* Member Name and Email */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[color:var(--chip)] text-[color:var(--text)] border border-[color:var(--border)] flex items-center justify-center shrink-0 text-xs font-bold">
                        <span>{member.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[color:var(--text)] truncate">{member.name}</p>
                        <p className="text-xs text-[color:var(--text-muted)] truncate">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Column — Restored single role dropdown for editable rows */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isAccountOwnerRow ? (
                      <span className="font-semibold text-[color:var(--text)] text-xs">
                        Account owner
                      </span>
                    ) : isOwner ? (
                      <select
                        aria-label={`Role for ${member.name}`}
                        value={member.role}
                        onChange={(e) => onRoleChange?.(member.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-md border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] transition-colors cursor-pointer"
                      >
                        <option value="owner">Account owner</option>
                        <option value="marketing">Marketing user</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="text-xs font-normal text-[color:var(--text-muted)]">
                        {ROLE_LABELS[member.role] || 'Marketing user'}
                      </span>
                    )}
                  </td>

                  {/* Permissions Column — Concise 1-line summary + quiet (custom) marker + explicit 'Edit' link */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-between max-w-[360px]">
                      <p className="text-xs text-[color:var(--text-muted)] font-normal truncate">
                        {summaryText}
                        {customized && (
                          <span className="ml-1 text-[color:var(--text-muted)] italic font-normal">
                            (custom)
                          </span>
                        )}
                      </p>

                      {!isAccountOwnerRow && isOwner && (
                        <button
                          type="button"
                          onClick={() => onOpenEditPermissions?.(member)}
                          className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] font-medium underline underline-offset-2 shrink-0 bg-transparent border-0 p-0 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {member.status === 'active' ? (
                      <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--success-text)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] shrink-0" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--warning-text)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--warning)] shrink-0" />
                        <span>Pending invite</span>
                      </div>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-3.5 text-xs text-[color:var(--text-muted)] tabular-nums whitespace-nowrap">
                    {formatDateString(member.joinedAt)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {isAccountOwnerRow ? (
                      <span className="text-xs text-[color:var(--text-subtle)] font-normal">
                        Primary account
                      </span>
                    ) : member.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => onResendInvite?.(member.id)}
                        className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] font-normal transition-colors cursor-pointer bg-transparent border-0 p-0"
                      >
                        Resend invite
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRemoveMember?.(member.id)}
                        className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] font-normal transition-colors cursor-pointer bg-transparent border-0 p-0"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
