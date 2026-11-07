/**
 * Session-based frequency control for Monetag ad triggers.
 */

const STORAGE_KEY = 'monetag_action_count';
const LAST_TRIGGER_KEY = 'monetag_last_trigger_time';

// Configuration defaults
const DEFAULT_CONFIG = {
  actionsPerAd: 3,       // Trigger an ad every 3 user actions (e.g., downloads/conversions)
  cooldownSeconds: 30,   // Minimum time gap between ads (30 seconds)
  maxAdsPerSession: 5    // Hard cap on total ads per user session
};

/**
 * Executes a callback with rate-limited ad triggers.
 * @param {Function} callback - Main task logic (e.g., file download)
 * @param {Object} options - Custom frequency thresholds
 */
export const triggerAdWithFrequency = (callback, options = {}) => {
  const config = { ...DEFAULT_CONFIG, ...options };

  try {
    // Session counter checks
    let currentActions = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10) + 1;
    sessionStorage.setItem(STORAGE_KEY, currentActions.toString());

    const lastTrigger = parseInt(sessionStorage.getItem(LAST_TRIGGER_KEY) || '0', 10);
    const now = Date.now();
    const secondsElapsed = (now - lastTrigger) / 1000;

    // Determine if condition to show ad is met
    const isThresholdReached = currentActions % config.actionsPerAd === 0;
    const isCooldownPassed = secondsElapsed >= config.cooldownSeconds;

    if (isThresholdReached && isCooldownPassed) {
      sessionStorage.setItem(LAST_TRIGGER_KEY, now.toString());

      // Monetag execution check
      if (typeof window.show_88304008 === 'function') {
        window.show_88304008()
          .then(() => callback?.())
          .catch(() => callback?.());
        return;
      }
    }

    // Default fallback if conditions aren't met or ad script isn't active
    callback?.();
  } catch {
    // Fail-safe execution
    callback?.();
  }
};
