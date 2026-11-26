/**
 * Application entry point and central coordinator.
 * Connects state management, UI views, input controllers, and services
 * while keeping every individual module decoupled from the others.
 */

import {
  getCurrentPath,
  getCurrentItems,
  getSelectedIndex,
  getSelectedItem,
  setSelectedIndex,
  moveSelection,
  enterDirectory,
  leaveDirectory,
  isModalOpen,
  setModalOpen
} from "./core/state.js";

import {
  initTreeView,
  renderTree,
  updateSelection
} from "./ui/treeView.js";

import {
  initModalView,
  openModal,
  closeModal
} from "./ui/modalView.js";

import { initKeyboard } from "./input/keyboard.js";
import { loadFileContent } from "./services/fileLoader.js";
import { triggerDownload } from "./services/downloader.js";
import { trackEvent, trackInputMethod } from "./services/analytics.js";

/**
 * Tracks the latest async file request to prevent stale responses
 * from overwriting the modal if the user closes or switches files quickly.
 */
let activeRequestId = 0;

/**
 * Renders the full directory tree using the current application state.
 */
function syncTreeView() {
  renderTree(getCurrentPath(), getCurrentItems(), getSelectedIndex());
}

/**
 * Closes the modal, updates state, and invalidates any in-flight file fetch.
 */
function handleCloseModal() {
  activeRequestId += 1;
  setModalOpen(false);
  closeModal();
}

/**
 * Opens a text file inside the modal, fetching its content on demand.
 */
async function handleOpenFile(fileNode) {
  const requestId = ++activeRequestId;

  setModalOpen(true);
  openModal(fileNode.name, "Loading...");

  trackEvent("open_file", {
    name: fileNode.name,
    path: `${getCurrentPath()}/${fileNode.name}`
  });

  try {
    const content = await loadFileContent(fileNode.src);

    if (requestId !== activeRequestId || !isModalOpen()) {
      return;
    }

    openModal(fileNode.name, content);
  } catch (error) {
    if (requestId !== activeRequestId || !isModalOpen()) {
      return;
    }

    openModal(fileNode.name, `Error: ${error.message}`);
  }
}

/**
 * Triggers a static file download and displays an error in the modal on failure.
 */
function handleDownload(downloadNode) {
  trackEvent("download_file", {
    name: downloadNode.name,
    filename: downloadNode.filename || downloadNode.name
  });

  try {
    triggerDownload(downloadNode.url, downloadNode.filename);
  } catch (error) {
    setModalOpen(true);
    openModal(downloadNode.name, `Error: ${error.message}`);
  }
}

/**
 * Opens an external link in a new tab, falling back to the current tab if blocked.
 */
function handleOpenLink(linkNode) {
  trackEvent("open_link", { name: linkNode.name });

  const openedWindow = window.open(linkNode.href, "_blank");
  if (openedWindow) {
    openedWindow.opener = null;
  } else {
    window.location.assign(linkNode.href);
  }
}

/**
 * Navigates one level up to the parent directory and re-renders the tree.
 */
function handleGoBack() {
  const didChange = leaveDirectory();

  if (didChange) {
    syncTreeView();
  }
}

/**
 * Dispatches the appropriate action based on the activated node's type.
 */
function handleActivateItem(item) {
  if (!item) {
    return;
  }

  switch (item.type) {
    case "parent":
      handleGoBack();
      break;

    case "directory":
      enterDirectory(item);
      syncTreeView();
      trackEvent("open_directory", { path: getCurrentPath() });
      break;

    case "file":
      handleOpenFile(item);
      break;

    case "download":
      handleDownload(item);
      break;

    case "link":
      handleOpenLink(item);
      break;

    default:
      break;
  }
}

/**
 * Moves the keyboard selection cursor up (-1) or down (+1).
 */
function handleMoveSelection(delta) {
  trackInputMethod("keyboard");
  moveSelection(delta);
  updateSelection(getSelectedIndex());
}

/**
 * Synchronizes mouse hover with the active selection without full re-renders.
 */
function handleHover(index) {
  trackInputMethod("pointer");

  if (index === getSelectedIndex()) {
    return;
  }

  setSelectedIndex(index);
  updateSelection(getSelectedIndex());
}

/**
 * Handles clicking or tapping directly on a directory entry.
 */
function handlePointerOpen(index, event) {
  trackInputMethod("pointer");
  setSelectedIndex(index);
  updateSelection(getSelectedIndex());

  const item = getSelectedItem();
  if (item?.type === "link") {
    event.preventDefault();
    handleOpenLink(item);
    return;
  }

  handleActivateItem(item);
}

/**
 * Bootstraps all UI views, input listeners, and the initial render.
 */
function init() {
  try {
    initModalView({
      onClose: handleCloseModal
    });

    initTreeView({
      onHover: handleHover,
      onOpen: handlePointerOpen
    });

    initKeyboard({
      isModalOpen,
      onMoveUp: () => handleMoveSelection(-1),
      onMoveDown: () => handleMoveSelection(1),
      onOpen: () => {
        trackInputMethod("keyboard");
        handleActivateItem(getSelectedItem());
      },
      onBack: () => {
        trackInputMethod("keyboard");
        handleGoBack();
      },
      onCloseModal: handleCloseModal
    });

    syncTreeView();
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
}

init();