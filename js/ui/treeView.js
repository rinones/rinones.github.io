/**
 * DOM controller for the directory tree view.
 * Renders the current path and file list, updates active row styling,
 * and delegates pointer interactions via event delegation.
 */

const pathEl = document.getElementById("current-path");
const listEl = document.getElementById("file-list");

/**
 * Extracts the numeric row index from a delegated DOM event target.
 * Returns null if the event did not originate inside a ".tree-item" element.
 */
function getRowIndexFromEvent(event) {
  const row = event.target.closest(".tree-item");

  if (!row || !listEl.contains(row)) {
    return null;
  }

  const index = Number(row.dataset.index);
  return Number.isNaN(index) ? null : index;
}

/**
 * Binds pointer hover and click listeners once on the list container
 * using event delegation, forwarding indices to the coordinator callbacks.
 */
export function initTreeView({ onHover, onOpen }) {
  if (!pathEl || !listEl) {
    throw new Error("Required tree view DOM elements are missing.");
  }

  listEl.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    const index = getRowIndexFromEvent(event);
    if (index !== null) {
      onHover(index);
    }
  });

  listEl.addEventListener("click", (event) => {
    const index = getRowIndexFromEvent(event);
    if (index !== null) {
      onOpen(index);
    }
  });
}

/**
 * Renders the current working directory path and rebuilds the list of entries
 * inside a DocumentFragment to trigger only a single DOM reflow.
 */
export function renderTree(path, items, selectedIndex) {
  if (!pathEl || !listEl) {
    return;
  }

  pathEl.textContent = path;
  listEl.replaceChildren();

  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    const isActive = index === selectedIndex;
    const li = document.createElement("li");

    li.className = isActive ? "tree-item active" : "tree-item";
    li.textContent = item.name;
    li.dataset.index = String(index);
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", String(isActive));

    fragment.appendChild(li);
  });

  listEl.appendChild(fragment);
}

/**
 * Updates only the active highlight and accessibility state on existing rows
 * without destroying and recreating the DOM list.
 */
export function updateSelection(selectedIndex) {
  if (!listEl) {
    return;
  }

  const rows = listEl.children;

  for (let i = 0; i < rows.length; i += 1) {
    const isActive = i === selectedIndex;
    const row = rows[i];

    row.classList.toggle("active", isActive);
    row.setAttribute("aria-selected", String(isActive));

    if (isActive) {
      row.scrollIntoView({ block: "nearest" });
    }
  }
}