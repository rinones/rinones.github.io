/**
 * Fetches a text file from the given relative path, revalidating the browser cache.
 * Throws a descriptive Error if the path is invalid, the network fails,
 * or the server returns a non-OK HTTP status (e.g., 404).
 */
export async function loadFileContent(src) {
  if (!src || typeof src !== "string") {
    throw new Error("Invalid file path.");
  }

  let response;

  try {
    response = await fetch(src, { cache: "no-cache" });
  } catch (networkError) {
    throw new Error(`Network error while loading "${src}".`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} error while loading "${src}".`);
  }

  return response.text();
}