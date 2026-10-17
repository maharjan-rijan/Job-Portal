/**
 * Helpers for opening a seeker's resume (uploaded file or pasted link)
 * in a new browser tab.
 *
 *  - Uploaded PDF (stored by the backend under /storage/...) -> our own
 *    /resume-viewer page, opened in a new tab.
 *  - Anything else (Word file, Google Drive / Dropbox / portfolio link,
 *    external .pdf) -> opened directly in a new tab. External sites
 *    often forbid being embedded, so we never try to iframe them.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

/** Origin the Laravel backend (and its /storage files) is served from. */
function backendOrigin() {
  try {
    return new URL(API_BASE, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
}


export function resolveResumeUrl(raw) {
  if (!raw) return raw;
  try {
    const url = new URL(raw, backendOrigin());
    if (url.pathname.startsWith("/storage/")) {
      return `${backendOrigin()}${url.pathname}${url.search}`;
    }
    return url.href;
  } catch {
    return raw;
  }
}

/** true only for http(s) URLs — blocks javascript:, data:, etc. */
export function isSafeUrl(value) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function isStoredFile(url) {
  try {
    return new URL(url).pathname.startsWith("/storage/");
  } catch {
    return false;
  }
}

export function isPdfUrl(url) {
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

export function getResumeHref(url) {
  if (!url || !isSafeUrl(url)) return null;
  if (isStoredFile(url) && isPdfUrl(url)) {
    return `/resume-viewer?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export function previewLocalFile(file) {
  if (!(file instanceof File) || file.type !== "application/pdf") return false;
  const blobUrl = URL.createObjectURL(file);
  window.open(blobUrl, "_blank", "noopener");
  // Give the new tab time to load it before releasing the memory.
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  return true;
}