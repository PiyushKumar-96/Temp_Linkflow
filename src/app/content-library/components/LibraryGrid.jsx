'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Type, Image, Hash, TrendingUp, Copy, Pencil, Check, Layers, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import StatusBadge from '@/components/ui/StatusBadge';
import AppImage from '@/components/ui/AppImage';

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

export default function LibraryGrid({ items, selectedIds, onToggleSelect }) {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <div className="card flex items-center justify-center py-16">
        <div className="text-center">
          <BookImage className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-sm font-600 text-foreground mb-1">No assets found</p>
          <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = typeIcons[item.type];
        const isSelected = selectedIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`card flex flex-col overflow-hidden transition-all duration-150 hover:card-shadow-md group cursor-pointer ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
            onClick={() => onToggleSelect(item.id)}
          >
            {/* Image preview or type icon header */}
            {item.type === 'image' && item.imageUrl ? (
              <div className="relative h-36 overflow-hidden bg-muted">
                <AppImage
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div
                  className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-white/80 border-white/60'}`}
                >
                  {isSelected && <Check size={11} className="text-white" />}
                </div>
              </div>
            ) : (
              <div
                className={`h-24 flex items-center justify-center relative ${typeColors[item.type]} bg-opacity-30`}
                style={{
                  background:
                    item.type === 'post'
                      ? 'linear-gradient(135deg, rgba(10,102,194,0.06) 0%, rgba(10,102,194,0.02) 100%)'
                      : undefined,
                }}
              >
                <Icon size={28} className="opacity-40" />
                <div
                  className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                >
                  {isSelected && <Check size={11} className="text-white" />}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-600 px-1.5 py-0.5 rounded-full capitalize ${typeColors[item.type]}`}
                >
                  {item.type.replace('_', ' ')}
                </span>
                <StatusBadge status={item.status} size="sm" />
              </div>

              <p className="text-sm font-600 text-foreground line-clamp-1">{item.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.preview}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={`tag-${item.id}-${tag}`}
                    className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-700" style={{ fontSize: 8 }}>
                      {item.authorInitials}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.publishDate || item.savedAt}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.engagementRate && (
                    <span className="text-xs font-600 text-success flex items-center gap-0.5">
                      <TrendingUp size={10} />
                      {item.engagementRate}%
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator?.clipboard) {
                        navigator.clipboard.writeText(item.preview);
                      }
                      toast.success('Asset content copied to clipboard');
                    }}
                    className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                    title="Copy content"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/post-creation-composer?id=${item.id}&mode=edit`);
                    }}
                    className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                    title="Open in Composer"
                  >
                    <Pencil size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookImage(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
