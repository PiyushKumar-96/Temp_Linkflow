'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Type, Image, Hash, TrendingUp, Copy, Pencil, Check, Layers, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';

const typeIcons = {
  post: FileText,
  caption: Type,
  image: Image,
  carousel: Layers,
  infographic: LayoutGrid,
  hashtag_set: Hash,
};

const typeColors = {
  post: 'bg-primary/10 text-primary',
  caption: 'bg-accent/10 text-accent',
  image: 'bg-emerald-50 text-emerald-600',
  carousel: 'bg-indigo-50 text-indigo-600',
  infographic: 'bg-purple-50 text-purple-600',
  hashtag_set: 'bg-amber-50 text-amber-600',
};

export default function LibraryList({ items, selectedIds, onToggleSelect }) {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <div className="card flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">No assets match your filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="w-8 px-4 py-2.5" />
            <th className="text-left px-4 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">
              Asset
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">
              Type
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">
              Status
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">
              Author
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">
              Post Date
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-600 text-muted-foreground uppercase tracking-wide">
              Eng. Rate
            </th>
            <th className="px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const Icon = typeIcons[item.type];
            const isSelected = selectedIds.includes(item.id);
            return (
              <tr
                key={item.id}
                className={`border-b border-border last:border-0 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/40'}`}
                onClick={() => onToggleSelect(item.id)}
              >
                <td className="px-4 py-3">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}
                  >
                    {isSelected && <Check size={9} className="text-white" />}
                  </div>
                </td>
                <td className="px-4 py-3 min-w-[240px]">
                  <p className="text-sm font-600 text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {item.preview}
                  </p>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-500 px-2 py-0.5 rounded-full capitalize ${typeColors[item.type]}`}
                  >
                    <Icon size={10} />
                    {item.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={item.status} size="sm" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-white font-700" style={{ fontSize: 8 }}>
                        {item.authorInitials}
                      </span>
                    </div>
                    <span className="text-xs text-foreground">{item.author.split(' ')[0]}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {item.publishDate || item.savedAt || '—'}
                </td>
                <td className="px-3 py-3">
                  {item.engagementRate ? (
                    <span className="text-xs font-600 text-success flex items-center gap-1">
                      <TrendingUp size={10} />
                      {item.engagementRate}%
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div
                    className="flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        if (navigator?.clipboard) {
                          navigator.clipboard.writeText(item.preview);
                        }
                        toast.success('Asset content copied to clipboard');
                      }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                      title="Copy content"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => navigate(`/post-creation-composer?id=${item.id}&mode=edit`)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                      title="Open in Composer"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
