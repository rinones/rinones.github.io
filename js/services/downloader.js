/**
 * Triggers a browser file download for a given relative or absolute URL.
 * Creates a temporary anchor element, clicks it programmatically, and cleans it up.
 * Throws an Error if the provided URL is missing or invalid.
 */
export function triggerDownload(url, filename = "") {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid download URL.");
  }

  const link = document.createElement("a");
  link.href = url;
  link.download = typeof filename === "string" ? filename : "";
  link.rel = "noopener noreferrer";
  link.style.display = "none";

  document.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
  }
}