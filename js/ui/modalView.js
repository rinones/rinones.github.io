/**
 * DOM controller for the overlay modal window.
 * Handles rendering file contents safely, auto-linking URLs,
 * and delegating close interactions to the central coordinator.
 */

const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalCloseBtn = document.getElementById("modal-close");

const URL_PATTERN = /(https?:\/\/[^\s]+|mailto:[^\s]+)/g;

/**
 * Renders plain text into the modal body while safely converting
 * http(s) and mailto URLs into clickable anchor elements without innerHTML.
 */
function renderContentWithLinks(container, text) {
  container.replaceChildren();

  const fragment = document.createDocumentFragment();
  const safeText = typeof text === "string" ? text : "";
  let lastIndex = 0;

  for (const match of safeText.matchAll(URL_PATTERN)) {
    const url = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      fragment.appendChild(
        document.createTextNode(safeText.slice(lastIndex, matchIndex))
      );
    }

    const link = document.createElement("a");
    link.href = url;
    link.textContent = url.replace(/^mailto:/, "");

    if (url.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    fragment.appendChild(link);
    lastIndex = matchIndex + url.length;
  }

  if (lastIndex < safeText.length) {
    fragment.appendChild(document.createTextNode(safeText.slice(lastIndex)));
  }

  container.appendChild(fragment);
}

/**
 * Binds user interactions that close the modal ([X] button and backdrop click).
 * Delegates the actual state transition to the provided onClose callback.
 */
export function initModalView({ onClose }) {
  if (!modalOverlay || !modalCloseBtn) {
    throw new Error("Required modal DOM elements are missing.");
  }

  modalCloseBtn.addEventListener("click", () => {
    onClose();
  });

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      onClose();
    }
  });
}

/**
 * Displays the modal window with the given file title and text content.
 */
export function openModal(title, content) {
  if (!modalOverlay || !modalTitle || !modalContent) {
    return;
  }

  modalTitle.textContent = title;
  renderContentWithLinks(modalContent, content);
  modalContent.scrollTop = 0;

  modalOverlay.classList.add("open");
  modalContent.focus();
}

/**
 * Hides the modal window from view.
 */
export function closeModal() {
  if (!modalOverlay) {
    return;
  }

  modalOverlay.classList.remove("open");
}