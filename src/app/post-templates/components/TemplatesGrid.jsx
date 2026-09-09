'use client';

import React, { useState } from 'react';
import { Copy, Pencil, Trash2, Play, MoreHorizontal, Star, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const toneColors = {
  professional: 'bg-primary/10 text-primary',
  conversational: 'bg-emerald-50 text-emerald-700',
  inspirational: 'bg-violet-50 text-violet-700',
  educational: 'bg-amber-50 text-amber-700',
  humorous: 'bg-pink-50 text-pink-700',
};

const categoryColors = {
  'Thought Leadership': 'bg-primary/5 border-primary/15',
  'Case Study': 'bg-violet-50 border-violet-200',
  'Product Update': 'bg-emerald-50 border-emerald-200',
  Hiring: 'bg-amber-50 border-amber-200',
  Event: 'bg-orange-50 border-orange-200',
  Engagement: 'bg-pink-50 border-pink-200',
  'Company News': 'bg-blue-50 border-blue-200',
  'Industry Insight': 'bg-indigo-50 border-indigo-200',
  Educational: 'bg-teal-50 border-teal-200',
};

export default function TemplatesGrid({ templates, onEdit, onDelete, onDuplicate, onUse }) {
  const [expandedId, setExpandedId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  if (templates.length === 0) {
    return (
      <div className="card flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-sm font-600 text-foreground mb-1">No templates found</p>
          <p className="text-xs text-muted-foreground">Try a different category or search term</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {templates.map((tpl) => {
        const isExpanded = expandedId === tpl.id;
        const catColor = categoryColors[tpl.category] || 'bg-muted border-border';

        return (
          <div
            key={tpl.id}
            className={`card flex flex-col overflow-hidden transition-all duration-200 hover:card-shadow-md border ${catColor}`}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {tpl.isDefault && (
                      <Star size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                    )}
                    <span className="text-xs text-muted-foreground font-500">{tpl.category}</span>
                  </div>
                  <h3 className="text-sm font-700 text-foreground">{tpl.name}</h3>
                </div>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuId(menuId === tpl.id ? null : tpl.id)}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                  {menuId === tpl.id && (
                    <div className="absolute right-0 top-6 z-20 w-36 bg-card border border-border rounded-lg card-shadow-md py-1 fade-in">
                      <button
                        onClick={() => {
                          onEdit(tpl);
                          setMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          onDuplicate(tpl);
                          setMenuId(null);
                          toast.success('Template duplicated');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                      >
                        <Copy size={12} /> Duplicate
                      </button>
                      {!tpl.isDefault && (
                        <button
                          onClick={() => {
                            onDelete(tpl.id);
                            setMenuId(null);
                            toast.success('Template deleted');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-danger hover:bg-danger/5 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{tpl.description}</p>
            </div>

            {/* Body preview */}
            <div className="mx-4 mb-3 p-3 bg-muted/40 rounded-lg">
              <p
                className={`text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono ${isExpanded ? '' : 'line-clamp-4'}`}
              >
                {tpl.body}
              </p>
              {tpl.body.split('\n').length > 5 && (
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tpl.id)}
                  className="text-xs text-primary font-500 mt-1.5 hover:underline"
                >
                  {isExpanded ? 'Show less' : 'Show full template'}
                </button>
              )}
            </div>

            {/* Hashtags */}
            {tpl.hashtags.length > 0 && (
              <div className="px-4 pb-3 flex flex-wrap gap-1">
                {tpl.hashtags.map((tag) => (
                  <span key={`htag-${tpl.id}-${tag}`} className="text-xs text-primary font-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto px-4 py-3 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-500 px-2 py-0.5 rounded-full capitalize ${toneColors[tpl.tone]}`}
                >
                  {tpl.tone}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp size={11} />
                  <span>Used {tpl.usageCount}×</span>
                </div>
              </div>

              <button onClick={() => onUse(tpl)} className="btn-primary text-xs py-1.5 px-3">
                <Play size={11} />
                Use Template
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
