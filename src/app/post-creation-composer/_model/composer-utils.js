// Shared constants + pure helpers for the composer.
// Nothing here touches React, so it's easy to unit test.

export const TARGETS = [
  { id: 'personal', label: 'Personal profile' },
  { id: 'company', label: 'Company page' },
];

// Mirrors the Content pillars card on the dashboard.
// BACKEND: replace planned/goal with the same query the dashboard card uses.
// `category` keeps old posts and other pages working (they still read post.category).
export const PILLARS = [
  { id: 'thought-leadership', label: 'Thought leadership', target: 'personal', category: 'Thought Leadership', tone: 'green', planned: 12, goal: 15 },
  { id: 'case-studies', label: 'Case studies & proof', target: 'company', category: 'Case Study', tone: 'blue', planned: 6, goal: 8 },
  { id: 'engineering-culture', label: 'Engineering culture', target: 'company', category: 'Company News', tone: 'violet', planned: 5, goal: 6 },
  { id: 'industry-insights', label: 'Industry insights', target: 'personal', category: 'Industry Insight', tone: 'amber', planned: 4, goal: 5 },
];

export function getPillar(id) {
  return PILLARS.find((p) => p.id === id) || PILLARS[0];
}

export function pillarIdFromPost(post) {
  if (post?.pillar && PILLARS.some((p) => p.id === post.pillar)) return post.pillar;
  const byCategory = PILLARS.find((p) => p.category === post?.category);
  return byCategory ? byCategory.id : PILLARS[0].id;
}

// Approximate point where LinkedIn collapses a post behind "…more".
// It varies by client, so treat these as tunable, not exact.
export const FOLD = {
  desktop: { chars: 210, lines: 3 },
  mobile: { chars: 140, lines: 3 },
};

export function getFoldIndex(text, device = 'desktop') {
  if (!text) return null;
  const { chars, lines } = FOLD[device] || FOLD.desktop;
  let index = Math.min(chars, text.length);
  let newlines = 0;
  for (let i = 0; i < index; i += 1) {
    if (text[i] === '\n') {
      newlines += 1;
      if (newlines === lines) {
        index = i;
        break;
      }
    }
  }
  if (text.slice(index).trim() === '') return null;
  // LinkedIn cuts at a word boundary, so step back out of a half-cut word.
  if (index < text.length && !/\s/.test(text[index]) && !/\s/.test(text[index - 1] || ' ')) {
    const before = text.slice(0, index);
    const lastSpace = Math.max(before.lastIndexOf(' '), before.lastIndexOf('\n'));
    if (lastSpace > 0 && index - lastSpace <= 30) index = lastSpace;
  }
  return index;
}

export function composePostText(content, cta, hashtags) {
  return [content, cta, (hashtags || []).join(' ')].filter((part) => part && part.trim()).join('\n\n');
}

export function getQualityChecks({ content, cta, hashtags, visualFormat, imageUrl, foldIndex }) {
  const text = (content || '').trim();
  const firstLine = text.split('\n')[0].trim();
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const tagCount = (hashtags || []).length;
  const visualReady = visualFormat === 'image' ? Boolean(imageUrl) : true;
  const missingTags = 3 - tagCount;

  return [
    {
      id: 'hook',
      label: 'Hook fits before “…more”',
      hint: 'Shorten your first line so it shows in the feed.',
      weight: 25,
      ok: firstLine.length > 0 && (foldIndex == null || firstLine.length <= foldIndex),
    },
    {
      id: 'scan',
      label: 'Short paragraphs that are easy to scan',
      hint: 'Split paragraphs longer than about three lines.',
      weight: 20,
      ok: paragraphs.length > 0 && paragraphs.every((p) => p.length <= 280),
    },
    {
      id: 'cta',
      label: 'Ends with a question or call to action',
      hint: 'Add a call to action under the post.',
      weight: 20,
      ok: Boolean(cta && cta.trim()) || /\?\s*$/.test(text),
    },
    {
      id: 'tags',
      label: '3–5 relevant hashtags',
      hint: missingTags > 0 ? `Add ${missingTags} more hashtag${missingTags === 1 ? '' : 's'}.` : 'Remove hashtags until you have 5 or fewer.',
      weight: 15,
      ok: tagCount >= 3 && tagCount <= 5,
    },
    {
      id: 'visual',
      label: 'Visual attached, or text-only chosen',
      hint: 'Pick an image, or switch the visual to text-only.',
      weight: 20,
      ok: text.length > 0 && visualReady,
    },
  ];
}

export function getQualityScore(checks) {
  return checks.reduce((sum, check) => sum + (check.ok ? check.weight : 0), 0);
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Same format as the dashboard: "Tue, 15 Sep" + "09:00 UTC"
export function formatSlot(date, time) {
  if (!date) return { day: 'No slot yet', time: 'Pick a publishing slot', isPast: false };
  const parsed = new Date(`${date}T${time || '00:00'}:00Z`);
  if (Number.isNaN(parsed.getTime())) return { day: date, time: time || '', isPast: false };
  return {
    day: `${WEEKDAYS[parsed.getUTCDay()]}, ${parsed.getUTCDate()} ${MONTHS[parsed.getUTCMonth()]}`,
    time: `${time} UTC`,
    isPast: parsed.getTime() < Date.now(),
  };
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
