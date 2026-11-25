/**
 * Keyboard input controller.
 * Listens for global keydown events and translates navigation keys
 * into semantic callbacks provided by the central coordinator.
 */

/**
 * Registers the global keyboard listener for directory and modal navigation.
 * Expects a configuration object containing state readers and action callbacks.
 */
export function initKeyboard({
  isModalOpen,
  onMoveUp,
  onMoveDown,
  onOpen,
  onBack,
  onCloseModal
}) {
  document.addEventListener("keydown", (event) => {
    // Do not intercept browser or OS shortcuts (e.g., Ctrl+R, Cmd+C, Alt+Left)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    // While the modal is open, only Escape closes it; other keys keep default behavior
    if (isModalOpen()) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseModal();
      }
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        onMoveUp();
        break;

      case "ArrowDown":
        event.preventDefault();
        onMoveDown();
        break;

      case "Enter":
        event.preventDefault();
        onOpen();
        break;

      case "Backspace":
        event.preventDefault();
        onBack();
        break;

      default:
        break;
    }
  });
}