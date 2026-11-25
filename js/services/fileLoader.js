/**
 * In-memory cache storing already fetched file contents.
 * Keys are file paths (e.g., "content/about.txt"), values are plain text strings.
 */
const fileCache = new Map();

/**
 * Fetches a text file from the given relative path and caches its content.
 * Throws a descriptive Error if the path is invalid, the network fails,
 * or the server returns a non-OK HTTP status (e.g., 404).
 */
export async function loadFileContent(src) {
  if (!src || typeof src !== "string") {
    throw new Error("Invalid file path.");
  }

  if (fileCache.has(src)) {
    return fileCache.get(src);
  }

  let response;

  try {
    response = await fetch(src);
  } catch (networkError) {
    throw new Error(`Network error while loading "${src}".`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} error while loading "${src}".`);
  }

  const text = await response.text();
  fileCache.set(src, text);

  return text;
}