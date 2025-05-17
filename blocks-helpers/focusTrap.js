/**
 * Traps focus in a menu.
 * @function
 * @param {Element} focusTrapContainer - the wrapper we wish to trap a user within
 * @return a cleanup function
 */

export const createFocusTrap = (focusTrapContainer) => {
  if (!focusTrapContainer) {
    return;
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = focusTrapContainer.querySelectorAll(
      'a[href], button, input'
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  focusTrapContainer.addEventListener('keydown', handleKeyDown);

  const removeFocusTrap = (focusTrapContainer) => {
    focusTrapContainer.removeEventListener('keydown', handleKeyDown);
  };

  return removeFocusTrap;
}
