/**
 * Deterministic Grouped Spec Extraction from Prompt Text
 *
 * Handles single-group and compound multi-group descriptions:
 * e.g., "2 text posts on AI impact and 3 image posts on AI impact"
 *
 * Fills up to MAX_GROUPS (4) in one extraction call.
 * If more groups are provided, fills what fits and notes dropped groups.
 * Ambiguous attributes are left untouched for deliberate user click.
 */

export const THEME_OPTIONS = [
  'Thought Leadership',
  'Case Studies',
  'Engineering Culture',
  'Industry Insights',
];

export const FORMAT_OPTIONS = [
  { id: 'image', label: 'Image' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'none', label: 'Text only' },
];

export const MAX_GROUPS = 4;

export function createDefaultGroup(id = 'g1', overrides = {}) {
  return {
    id,
    topic: '',
    pillar: 'Thought Leadership',
    format: 'image',
    count: 3,
    ...overrides,
  };
}

/**
 * Parse format keyword from a segment
 */
function parseFormat(segment) {
  const lower = segment.toLowerCase();
  if (lower.includes('carousel') || lower.includes('deck') || lower.includes('slides')) return 'carousel';
  if (lower.includes('infographic') || lower.includes('chart') || lower.includes('metric card')) return 'infographic';
  if (lower.includes('image') || lower.includes('photo') || lower.includes('visual')) return 'image';
  if (lower.includes('text only') || lower.includes('text-only') || lower.includes('text post') || lower.includes('plain text') || lower.includes('no media') || lower.includes('text')) return 'none';
  return null;
}

/**
 * Parse pillar keyword from a segment
 */
function parsePillar(segment) {
  const lower = segment.toLowerCase();
  if (lower.includes('engineering') || lower.includes('culture') || lower.includes('developer') || lower.includes('devops') || lower.includes('architecture')) {
    return 'Engineering Culture';
  }
  if (lower.includes('case study') || lower.includes('case studies') || lower.includes('customer proof') || lower.includes('churn breakdown')) {
    return 'Case Studies';
  }
  if (lower.includes('industry') || lower.includes('market insights') || lower.includes('trends') || lower.includes('analysis')) {
    return 'Industry Insights';
  }
  if (lower.includes('thought leadership') || lower.includes('founder') || lower.includes('saas growth') || lower.includes('leadership')) {
    return 'Thought Leadership';
  }
  return null;
}

/**
 * Parse count from a segment
 */
function parseCount(segment) {
  const countMatch = segment.match(/\b([1-5])\s*(?:posts?|items?|drafts?|pieces?|carousels?|images?|infographics?|texts?)?\b/i);
  if (countMatch && countMatch[1]) {
    const num = parseInt(countMatch[1], 10);
    if (num >= 1 && num <= 5) return num;
  }
  return null;
}

/**
 * Clean and extract topic string from a clause
 */
function parseTopic(segment) {
  let cleaned = segment
    // Remove leading count & format words (e.g. "2 text posts on", "3 image posts about")
    .replace(/^\s*(?:and\s+)?(?:\d+\s+)?(?:text\s+only|text|image|carousel|infographic|plain\s+text)?\s*(?:posts?|items?|drafts?|pieces?)?\s*(?:on|about|for|regarding)?\s*/i, '')
    // Remove command verbs
    .replace(/^(?:generate|create|write|draft|make)\s*(?:a\s+batch\s+of\s+)?(?:\d+\s+)?(?:posts?|drafts?)?\s*(?:about|on|for)?/i, '')
    // Remove trailing format/pillar directives
    .replace(/\b(?:as|in|with)\s+(?:carousels?|images?|infographics?|text\s+only|plain\s+text)\b/gi, '')
    .replace(/\b(?:under|in)\s+(?:thought leadership|engineering culture|case studies|industry insights)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If ends with punctuation or dangling words, clean it
  cleaned = cleaned.replace(/^[:\-,]\s*/, '').replace(/[:\-,]\s*$/, '').trim();
  return cleaned;
}

/**
 * Split prompt into distinct group clauses (e.g. split on " and ", ";", or newline when compound)
 */
function splitPromptClauses(promptText) {
  const text = promptText.trim();
  // Check if text has compound connectors with numbers (e.g., "2 text posts on X and 3 image posts on Y")
  // Or "1 carousel on X; 2 images on Y"
  const splitPattern = /\s*(?:;\s*|\n+|\s+and\s+(?=\d+\s+)|,\s*(?=\d+\s+))\s*/i;
  const parts = text.split(splitPattern).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

export function extractGroupsFromPrompt(promptText, currentGroups) {
  const text = (promptText || '').trim();
  if (!text) {
    return {
      groups: currentGroups,
      changes: [],
    };
  }

  const clauses = splitPromptClauses(text);
  const changes = [];
  let droppedCount = 0;

  let targetClauses = clauses;
  if (clauses.length > MAX_GROUPS) {
    droppedCount = clauses.length - MAX_GROUPS;
    targetClauses = clauses.slice(0, MAX_GROUPS);
  }

  const newGroups = targetClauses.map((clause, index) => {
    const existing = currentGroups[index] || createDefaultGroup(`g${Date.now()}-${index}`);
    const updated = { ...existing };

    const parsedCount = parseCount(clause);
    const parsedFormat = parseFormat(clause);
    const parsedPillar = parsePillar(clause);
    const parsedTopic = parseTopic(clause);

    const groupChanges = [];

    if (parsedCount !== null && parsedCount !== existing.count) {
      groupChanges.push(`count: ${existing.count} → ${parsedCount}`);
      updated.count = parsedCount;
    }

    if (parsedFormat !== null && parsedFormat !== existing.format) {
      const fromFmt = FORMAT_OPTIONS.find((f) => f.id === existing.format)?.label || existing.format;
      const toFmt = FORMAT_OPTIONS.find((f) => f.id === parsedFormat)?.label || parsedFormat;
      groupChanges.push(`format: ${fromFmt.toLowerCase()} → ${toFmt.toLowerCase()}`);
      updated.format = parsedFormat;
    }

    if (parsedPillar !== null && parsedPillar !== existing.pillar) {
      groupChanges.push(`pillar: ${existing.pillar} → ${parsedPillar}`);
      updated.pillar = parsedPillar;
    }

    if (parsedTopic && parsedTopic.length >= 3 && parsedTopic !== existing.topic) {
      const fromTopic = existing.topic ? `"${existing.topic.slice(0, 18)}..."` : 'empty';
      groupChanges.push(`topic: ${fromTopic} → "${parsedTopic}"`);
      updated.topic = parsedTopic;
    }

    if (groupChanges.length > 0) {
      const prefix = targetClauses.length > 1 ? `Group ${index + 1}: ` : '';
      groupChanges.forEach((gc) => {
        changes.push({
          groupId: updated.id,
          field: gc.split(':')[0],
          label: `${prefix}${gc}`,
        });
      });
    }

    return updated;
  });

  if (droppedCount > 0) {
    changes.push({
      groupId: null,
      field: 'dropped',
      label: `Exceeded max 4 groups: dropped ${droppedCount} extra clause${droppedCount > 1 ? 's' : ''}`,
    });
  }

  return {
    groups: newGroups,
    changes,
  };
}
