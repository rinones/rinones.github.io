/**
 * Decoupled analytics service for privacy-friendly event tracking.
 * Safely delegates events to an external provider (e.g., Umami or GoatCounter)
 * if loaded, and fails silently when blocked or not configured.
 */

let hasTrackedInputMethod = false;

/**
 * Sends a custom event to the configured analytics provider.
 * Never throws, ensuring ad blockers or offline states cannot break the UI.
 */
export function trackEvent(eventName, metadata = {}) {
  if (!eventName || typeof eventName !== "string") {
    return;
  }

  try {
    if (typeof window.umami?.track === "function") {
      window.umami.track(eventName, metadata);
      return;
    }

    if (typeof window.goatcounter?.count === "function") {
      window.goatcounter.count({
        path: eventName,
        title: JSON.stringify(metadata),
        event: true
      });
    }
  } catch {
    // Fail silently if analytics is blocked or throws an unexpected error
  }
}

/**
 * Records the user's primary navigation method ("keyboard" or "pointer")
 * only once per session to avoid redundant events.
 */
export function trackInputMethod(method) {
  if (hasTrackedInputMethod) {
    return;
  }

  if (method !== "keyboard" && method !== "pointer") {
    return;
  }

  hasTrackedInputMethod = true;
  trackEvent("input_method", { method });
}