'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/ui/StatusBadge';
import { CheckSquare, ArrowRight, Sparkles, Check, ChevronRight } from 'lucide-react';

export default function DashboardPendingReview({
  pendingPosts = [],
  onQuickApprove,
}) {
  const navigate = useNavigate();

  return (
    <div className="card flex flex-col overflow-hidden border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <CheckSquare size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">Pending Human Review</h2>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-700">
                {pendingPosts.length} Queued
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              AI generated drafts needing stakeholder review before scheduling
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/approval-workflow')}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          Open Approval Queue
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="divide-y divide-border">
        {pendingPosts.length === 0 ? (
          <div className="p-8 text-center">
            <Check className="mx-auto text-emerald-500 mb-2" size={24} />
            <p className="text-xs font-semibold text-foreground">Queue Clean!</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              No drafts currently waiting for human approval.
            </p>
          </div>
        ) : (
          pendingPosts.slice(0, 4).map((post) => (
            <div
              key={post.id}
              className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E4E2DC] text-[#6B6B70]">
                    {post.category || 'Thought Leadership'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#6B6B70] font-semibold bg-white border border-[#E4E2DC] px-2 py-0.5 rounded-full">
                    Quality {post.qualityAudit?.score || 90}%
                  </div>
                  <span className="text-[10px] text-muted-foreground">by {post.author}</span>
                </div>

                <p className="text-xs font-semibold text-foreground line-clamp-1">{post.title}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onQuickApprove(post.id)}
                  className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-1 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                  title="Approve immediately"
                >
                  <Check size={12} />
                  Approve
                </button>

                <button
                  onClick={() => navigate(`/approval-workflow?post=${post.id}`)}
                  className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  Review
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
