import { FILE_SYSTEM } from "../data/filesystem.js";

/**
 * Private runtime state of the application.
 * Only exposed through the exported getters and mutators below.
 */
const state = {
  stack: [FILE_SYSTEM],
  selectedIndex: 0,
  modalOpen: false
};

/**
 * Returns the directory node currently at the top of the navigation stack.
 */
export function getCurrentDirectory() {
  return state.stack[state.stack.length - 1];
}

/**
 * Builds the formatted path string for the current directory (e.g., "~/projects").
 */
export function getCurrentPath() {
  return state.stack
    .map((dir) => dir.name.replace(/\/$/, ""))
    .join("/");
}

/**
 * Returns the list of selectable entries in the current directory.
 * Prepends a virtual ".." entry whenever the user is inside a subdirectory.
 */
export function getCurrentItems() {
  const currentDir = getCurrentDirectory();
  const items = [];

  if (state.stack.length > 1) {
    items.push({ name: "..", type: "parent" });
  }

  return items.concat(currentDir.children);
}

/**
 * Returns the index of the currently highlighted row.
 */
export function getSelectedIndex() {
  return state.selectedIndex;
}

/**
 * Returns the currently highlighted node object.
 */
export function getSelectedItem() {
  const items = getCurrentItems();
  return items[state.selectedIndex];
}

/**
 * Sets the active row index if it falls within valid bounds.
 */
export function setSelectedIndex(index) {
  const items = getCurrentItems();

  if (index >= 0 && index < items.length) {
    state.selectedIndex = index;
  }
}

/**
 * Moves the selection up (-1) or down (+1), wrapping seamlessly around the list.
 */
export function moveSelection(delta) {
  const items = getCurrentItems();

  if (items.length === 0) {
    return;
  }

  state.selectedIndex = (state.selectedIndex + delta + items.length) % items.length;
}

/**
 * Pushes a subdirectory onto the stack and resets the cursor to the first item.
 */
export function enterDirectory(directoryNode) {
  if (!directoryNode || directoryNode.type !== "directory") {
    return;
  }

  state.stack.push(directoryNode);
  state.selectedIndex = 0;
}

/**
 * Pops the current subdirectory from the stack to return to its parent.
 * Returns true if the directory changed, or false if already at root.
 */
export function leaveDirectory() {
  if (state.stack.length <= 1) {
    return false;
  }

  state.stack.pop();
  state.selectedIndex = 0;
  return true;
}

/**
 * Returns whether the modal window is currently open.
 */
export function isModalOpen() {
  return state.modalOpen;
}

/**
 * Updates the open/closed state of the modal window.
 */
export function setModalOpen(isOpen) {
  state.modalOpen = Boolean(isOpen);
}