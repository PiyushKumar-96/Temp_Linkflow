'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, Sparkles, Loader2 } from 'lucide-react';
import AIGeneratedCard from './AIGeneratedCard';
import { getPostContent } from '../postLibrary';
import { POST_STATUS } from '@/lib/post-status';
import { STOCK_IMAGES_LIST } from '@/temp-backend/data/media';
import { matchPlannedTopic, getPlannedTopicOptions } from '../extractSpec';

const MOCK_IMAGES = STOCK_IMAGES_LIST.map((img) => img.url);

const STARTER_PROMPTS = [
  'Draft 2 posts on B2B marketing stack consolidation with image visuals',
  'Give me 3 carousel outlines analyzing customer churn research',
  'Write a post breaking down async engineering culture',
  'Create 2 text-only posts on modular monolith architecture',
];

const ON_TOPIC_KEYWORDS = [
  'post', 'posts', 'draft', 'drafts', 'write', 'generate', 'create', 'linkedin',
  'carousel', 'image', 'infographic', 'text', 'b2b', 'marketing', 'churn',
  'engineering', 'culture', 'industry', 'insights', 'stack', 'content', 'growth',
  'saas', 'velocity', 'metric', 'framework', 'founder', 'team', 'product', 'monolith'
];

function isTopicRelevant(text) {
  const lower = text.toLowerCase();
  return ON_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Chat-specific generation synthesizing distinct titles and body previews from postLibrary
 */
function synthesizeChatResponse(userPrompt, turnIndex) {
  const lower = userPrompt.toLowerCase();

  // 1. Off-topic redirection
  if (!isTopicRelevant(userPrompt)) {
    return {
      type: 'message',
      text: 'This generator drafts LinkedIn posts, carousels, and visual insights. Describe a planned topic or format to generate content.',
      posts: [],
    };
  }

  // 2. Clarifying question if prompt is excessively short/vague
  if (userPrompt.trim().split(/\s+/).length <= 2 && !lower.includes('post') && !lower.includes('draft')) {
    return {
      type: 'message',
      text: `Which angle would you like to explore for "${userPrompt.trim()}" — actionable tactics, metrics breakdown, or a high-level summary?`,
      posts: [],
    };
  }

  // 3. Post generation
  let format = 'image';
  if (lower.includes('carousel') || lower.includes('deck') || lower.includes('slides')) format = 'carousel';
  else if (lower.includes('infographic') || lower.includes('chart') || lower.includes('metric')) format = 'infographic';
  else if (lower.includes('text only') || lower.includes('text-only') || lower.includes('plain text')) format = 'none';

  // Match topic against planned topics list
  const planned = getPlannedTopicOptions();
  const matchedTopic = matchPlannedTopic(userPrompt);
  const topicTitle = matchedTopic || (planned.length > 0 ? planned[0].title : 'B2B marketing stack consolidation');

  const countMatch = lower.match(/\b([1-3])\s*(?:posts?|pieces?|drafts?)?\b/);
  const count = countMatch && countMatch[1] ? parseInt(countMatch[1], 10) : 2;

  const generatedPosts = Array.from({ length: count }).map((_, i) => {
    const postData = getPostContent(topicTitle, turnIndex * 2 + i);
    const postTitle = postData.title;
    const bodyContent = `${postData.hookPrefix}\n\n${postData.takeaways.join('\n')}\n\nWhat is your team experience with this? Drop your thoughts below.`;

    let imageUrl = null;
    let carouselSlides = null;

    if (format === 'image') {
      imageUrl = MOCK_IMAGES[(turnIndex + i) % MOCK_IMAGES.length];
    } else if (format === 'carousel') {
      carouselSlides = [
        { id: `slide-chat-${i}-1`, headline: postTitle, tag: 'SLIDE 01 / 04' },
        { id: `slide-chat-${i}-2`, headline: 'Phase 1: Architecture Diagnosis', tag: 'SLIDE 02 / 04' },
        { id: `slide-chat-${i}-3`, headline: 'Phase 2: Execution & SLAs', tag: 'SLIDE 03 / 04' },
        { id: `slide-chat-${i}-4`, headline: 'Summary & Actionable Takeaways', tag: 'SLIDE 04 / 04' },
      ];
    }

    return {
      id: `chat-gen-${Date.now()}-${turnIndex}-${i}`,
      state: 'generated',
      title: postTitle,
      content: bodyContent,
      cta: 'What is your team experience with this? Drop your thoughts below.',
      author: 'Sarah Reeves',
      authorInitials: 'SR',
      authorRole: 'Content Strategist',
      category: topicTitle,
      topic: topicTitle,
      visualFormat: format,
      imageUrl,
      carouselSlides,
      scheduledDate: '2026-09-16',
      scheduledTime: '09:00',
      source: 'ai_generator',
      status: POST_STATUS.AWAITING_REVIEW,
    };
  });

  return {
    type: 'generation',
    text: `Drafted ${count} ${format === 'none' ? 'text-only' : format} post${count > 1 ? 's' : ''} on "${topicTitle}":`,
    posts: generatedPosts,
  };
}


export default function ChatModeView({
  chatTurns,
  onAddTurn,
  onUpdatePostInTurn,
  onDismissPostInTurn,
  onPreviewPost,
  onSendToQueue,
}) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const logEndRef = useRef(null);

  // Auto-scroll when new message arrives
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatTurns, isProcessing]);

  const handleSubmit = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isProcessing) return;

    setInputText('');
    const userTurnIndex = chatTurns.length;

    // Append user query turn
    const userTurn = {
      id: `turn-u-${Date.now()}`,
      role: 'user',
      text: query,
    };

    onAddTurn(userTurn);
    setIsProcessing(true);

    // Simulate generation
    await new Promise((r) => setTimeout(r, 600));

    const response = synthesizeChatResponse(query, userTurnIndex);

    // Support single post failure simulation in chat: if prompt includes "simulate error", fail post index 1
    if (query.toLowerCase().includes('simulate error') && response.posts.length > 1) {
      response.posts[1].state = 'failed';
      response.posts[1].failureReason = 'API rate limit on synthesis engine.';
    }

    const assistantTurn = {
      id: `turn-a-${Date.now()}`,
      role: 'assistant',
      text: response.text,
      posts: response.posts || [],
    };

    onAddTurn(assistantTurn);
    setIsProcessing(false);
  };

  const handleRetryCard = async (turnId, postId) => {
    onUpdatePostInTurn(turnId, postId, { state: 'generating' });
    await new Promise((r) => setTimeout(r, 600));
    onUpdatePostInTurn(turnId, postId, { state: 'generated', failureReason: null });
  };

  return (
    <div className="aig-chat-container">
      {/* Scrollable conversation thread */}
      <div className="aig-chat-thread" role="log" aria-label="Chat conversation log">
        {chatTurns.length === 0 ? (
          <div className="aig-chat-empty">
            <div className="aig-chat-empty-icon">
              <Sparkles size={20} />
            </div>
            <h3 className="aig-chat-empty-title">Start a brainstorming session</h3>
            <p className="aig-chat-empty-sub">
              Ask for post ideas, outlines, or specific content formats. The assistant drafts posts inline.
            </p>

            <div className="aig-chat-starters">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSubmit(prompt)}
                  className="aig-chat-starter-btn"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="aig-chat-messages">
            {chatTurns.map((turn) => {
              if (turn.role === 'user') {
                return (
                  <div key={turn.id} className="aig-msg-user">
                    <div className="aig-msg-bubble-user">{turn.text}</div>
                  </div>
                );
              }

              return (
                <div key={turn.id} className="aig-msg-assistant">
                  <div className="aig-msg-text">{turn.text}</div>

                  {/* Inline Generated Post Cards */}
                  {turn.posts && turn.posts.length > 0 && (
                    <div className="aig-chat-cards-grid">
                      {turn.posts.map((post) => (
                        <AIGeneratedCard
                          key={post.id}
                          post={post}
                          onDismiss={(postId) => onDismissPostInTurn(turn.id, postId)}
                          onPreview={onPreviewPost}
                          onSendToQueue={() => onSendToQueue(post.id, post)}
                          onRetry={(postId) => handleRetryCard(turn.id, postId)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isProcessing && (
              <div className="aig-msg-assistant">
                <div className="aig-chat-thinking">
                  <Loader2 size={13} className="animate-spin text-[color:var(--aig-brand)]" />
                  <span>Synthesizing response…</span>
                </div>
              </div>
            )}

            <div ref={logEndRef} style={{ height: 1 }} />
          </div>
        )}
      </div>

      {/* Pinned Bottom Input Bar (Always visible above viewport bottom without scrolling) */}
      <div className="aig-chat-bar-dock">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="aig-chat-bar-form"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe what you want to explore or draft…"
            className="aig-chat-bar-input"
            disabled={isProcessing}
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="aig-chat-bar-submit"
            title="Send message"
            aria-label="Send message"
          >
            <CornerDownLeft size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
