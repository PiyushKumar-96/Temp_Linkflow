import React from 'react';
import { Shield, User, Eye, Lock } from 'lucide-react';

const roleMeta = {
  owner: {
    label: 'Account Owner',
    icon: Shield,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Can approve, reject, and publish posts to LinkedIn',
  },
  marketing: {
    label: 'Marketing User',
    icon: User,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Can draft, generate, and edit post content',
  },
  reviewer: {
    label: 'Reviewer',
    icon: Eye,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Can comment and review without publish permissions',
  },
};

export default function MemberList({ members = [], isOwner, onRoleChange }) {
  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Member
              </th>
              <th className="px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Role & Privileges
              </th>
              <th className="px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {safeMembers.map((member) => {
              const meta = roleMeta[member.role] || roleMeta.marketing;
              const RoleIcon = meta.icon;

              return (
                <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                  {/* Name and Email */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-700">{member.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-600 text-foreground truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Selector / Display */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-600 border ${meta.badgeClass}`}
                        title={meta.description}
                      >
                        <RoleIcon size={12} />
                        {meta.label}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    {member.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-600 bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-600 bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Pending Invite
                      </span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="px-4 py-3.5 text-xs text-muted-foreground tabular-nums">
                    {member.joinedAt}
                  </td>

                  {/* Change Role Action Gated to Owners */}
                  <td className="px-4 py-3.5 text-right">
                    {isOwner ? (
                      <select
                        aria-label={`Change role for ${member.name}`}
                        value={member.role}
                        onChange={(e) => onRoleChange(member.id, e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        <option value="owner">Account Owner</option>
                        <option value="marketing">Marketing User</option>
                        <option value="reviewer">Reviewer</option>
                      </select>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 py-1 px-2 rounded cursor-not-allowed"
                        title="Only Account Owners can modify member roles"
                      >
                        <Lock size={12} />
                        <span>Owner only</span>
                      </span>
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
