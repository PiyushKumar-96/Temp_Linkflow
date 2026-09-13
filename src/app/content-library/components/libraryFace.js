/**
 * Face selection for library tiles.
 *
 * A library item is a finished post. Rather than badge its type, the tile shows
 * the post itself, so the type only decides which of three faces it gets:
 *
 *   photo — the post's own image
 *   stack — a carousel, drawn as the dark slide from the approval queue
 *   type  — everything else, with the hook line set as the visual
 */

export function faceOf(item) {
  if (item.type === 'carousel') return 'stack';
  if (item.imageUrl) return 'photo';
  return 'type';
}

/** First line of the post — what a reader actually sees first on LinkedIn. */
export function hookOf(item) {
  const raw = (item.preview || item.title || '').trim();
  const firstLine = raw.split('\n').find((l) => l.trim().length > 0) || raw;
  return firstLine.trim();
}

/** Step the hook down a size as it gets longer, so the face stays full. */
export function hookLength(hook) {
  if (hook.length <= 58) return 'short';
  if (hook.length <= 130) return 'medium';
  return 'long';
}

/** Human label for a type, used only in the list view's tooltip and alt text. */
export function typeLabel(type) {
  if (!type) return 'Post';
  return type.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase());
}
