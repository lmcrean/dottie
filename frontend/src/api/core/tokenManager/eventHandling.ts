/**
 * Event Handling Utilities
 * Manages token change events and notifications
 */

/**
 * Dispatch token change event to notify other parts of the application
 */
export const dispatchTokenChangeEvent = (): void => {
  try {
    window.dispatchEvent(new Event('authToken_changed'));
  } catch (e) {
    console.error('[Event Handler] Failed to dispatch token change event:', e);
  }
};
