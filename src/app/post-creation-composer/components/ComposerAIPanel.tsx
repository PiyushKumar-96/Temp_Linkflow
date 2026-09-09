'use client';

import React, { useState } from 'react';
import { Sparkles, Hash, RefreshCw, Wand2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import type { Tone } from './ComposerShell';
import Icon from '@/components/ui/AppIcon';


const hashtagSuggestions = [
  '#LinkedInTips', '#ContentMarketing', '#B2BSaaS', '#GrowthMarketing',
  '#SocialMediaStrategy', '#ThoughtLeadership', '#StartupLife', '#MarketingStrategy',
  '#LinkedInMarketing', '#DigitalMarketing', '#BrandBuilding', '#ContentCreation',
];

const toneSuggestions: { tone: Tone; preview: string }[] = [
  { tone: 'professional', preview: 'We\'re excited to announce that our platform has reached a significant milestone...' },
  { tone: 'conversational', preview: 'Can I be honest with you? Most LinkedIn advice is completely wrong. Here\'s what actually works...' },
  { tone: 'inspirational', preview: 'Three years ago we had zero customers. Today we serve 10,000 teams. The lesson? Just start.' },
  { tone: 'educational', preview: 'Here are the 5 LinkedIn metrics that actually predict pipeline growth (and how to track them)...' },
];

interface Props {
  content: string;
  tone: Tone;
  onToneChange: (t: Tone) => void;
  onHashtagsChange: (h: string[]) => void;
  onApplySuggestion: (s: string) => void;
}

export default function ComposerAIPanel({ content, tone, onToneChange, onHashtagsChange, onApplySuggestion }: Props) {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['#LinkedInMarketing', '#ContentStrategy', '#B2BSaaS']);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openSection, setOpenSection] = useState<'hashtags' | 'tone' | 'improve' | null>('hashtags');

  const toggleHashtag = (tag: string) => {
    const next = selectedHashtags.includes(tag)
      ? selectedHashtags.filter(h => h !== tag)
      : [...selectedHashtags, tag];
    setSelectedHashtags(next);
    onHashtagsChange(next);
  };

  const handleRefreshHashtags = async () => {
    // BACKEND: POST /api/ai/hashtag-suggestions with { content, tone }
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsRefreshing(false);
    toast.success('Hashtags refreshed');
  };

  const handleImprove = async (instruction: string) => {
    // BACKEND: POST /api/ai/improve-post with { content, instruction }
    toast.info(`Improving: "${instruction}"`);
  };

  const improveOptions = [
    'Make it more concise',
    'Add a stronger hook',
    'Include a call to action',
    'Make it more engaging',
    'Improve readability',
    'Add more data points',
  ];

  const Section = ({ id, title, icon: Icon, children }: { id: typeof openSection; title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-accent" />
          <span className="text-sm font-600 text-foreground">{title}</span>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${openSection === id ? 'rotate-180' : ''}`} />
      </button>
      {openSection === id && (
        <div className="p-3 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="card p-4 flex flex-col gap-3 sticky top-20">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg gradient-accent">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-600 text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Powered by GPT-4o</p>
        </div>
      </div>

      {/* Hashtag section */}
      <Section id="hashtags" title="Hashtag Suggestions" icon={Hash}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{selectedHashtags.length} selected</span>
          <button
            onClick={handleRefreshHashtags}
            disabled={isRefreshing}
            className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {hashtagSuggestions.map(tag => (
            <button
              key={`ai-tag-${tag}`}
              onClick={() => toggleHashtag(tag)}
              className={`px-2 py-0.5 text-xs font-500 rounded-full border transition-all duration-150 ${
                selectedHashtags.includes(tag)
                  ? 'bg-primary/10 border-primary/30 text-primary' :'bg-muted border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </Section>

      {/* Tone rewrite section */}
      <Section id="tone" title="Rewrite by Tone" icon={Wand2}>
        <div className="flex flex-col gap-2">
          {toneSuggestions.map(({ tone: t, preview }) => (
            <button
              key={`tone-sug-${t}`}
              onClick={() => {
                onToneChange(t);
                onApplySuggestion(preview + '\n\n[Continue writing...]');
                toast.success(`Tone switched to ${t}`);
              }}
              className={`text-left p-2 rounded-lg border text-xs transition-all duration-150 ${
                tone === t
                  ? 'border-primary/30 bg-primary/5 text-foreground'
                  : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="font-600 capitalize block mb-0.5">{t}</span>
              <span className="line-clamp-2 leading-relaxed">{preview}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Improve section */}
      <Section id="improve" title="Improve Post" icon={Sparkles}>
        <div className="flex flex-col gap-1.5">
          {improveOptions.map(opt => (
            <button
              key={`improve-${opt}`}
              onClick={() => handleImprove(opt)}
              disabled={!content}
              className="text-left px-3 py-2 text-xs font-500 rounded-lg border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {opt}
            </button>
          ))}
        </div>
        {!content && (
          <p className="text-xs text-muted-foreground mt-2 text-center">Write or generate a post first</p>
        )}
      </Section>
    </div>
  );
}