
export function field(raw, snakeKey, camelKey, fallback = null) {
  return raw?.[snakeKey] ?? raw?.[camelKey] ?? fallback;
}
