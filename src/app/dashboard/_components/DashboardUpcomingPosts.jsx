'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/ui/StatusBadge';
import {
  Calendar,
  Clock,
  ArrowRight,
  Layers,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Building2,
  User,
} from 'lucide-react';

const formatIcons = {
  carousel: Layers,
  infographic: LayoutGrid,
  image: ImageIcon,
  none: FileText,
};

export default function DashboardUpcomingPosts({ upcomingPosts = [] }) {
  const navigate = useNavigate();
  const [filterAccount, setFilterAccount] = useState('all');

  const filtered = upcomingPosts.filter((p) => {
    if (filterAccount === 'all') return true;
    return p.account === filterAccount;
  });

  return (
    <div className="card flex flex-col overflow-hidden border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-card">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Calendar size={14} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Upcoming Posts (Next 14 Days)</h2>
            <p className="text-[11px] text-muted-foreground">
              Confirmed scheduled dispatches queued for Buffer publication
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="input py-1 text-xs bg-input border border-border"
          >
            <option value="all">All Targets</option>
            <option value="personal">Personal Profile</option>
            <option value="company">Company Page</option>
          </select>

          <button
            onClick={() => navigate('/content-calendar')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Full Calendar
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs">
            No posts scheduled in the next 14 days. Click "Plan Topic" or "New Post" to add content.
          </div>
        ) : (
          filtered.map((post) => {
            const FormatIcon = formatIcons[post.visualFormat] || FileText;

            return (
              <div
                key={post.id}
                onClick={() => navigate(`/content-calendar?month=${post.scheduledDate?.slice(0, 7) || '2026-09'}`)}
                className="p-3.5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                    <FormatIcon size={15} />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground line-clamp-1">
                        {post.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Clock size={11} className="text-muted-foreground" />
                        {post.scheduledDate} {post.scheduledTime || '09:00 UTC'}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{post.visualFormat || 'Image'}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {post.account === 'company' ? (
                          <>
                            <Building2 size={11} /> Company Page
                          </>
                        ) : (
                          <>
                            <User size={11} /> Personal Profile
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={post.status || 'scheduled'} size="sm" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
