/**
 * Settings Utilities
 *
 * Helper functions for working with user settings stored as JSON.
 * Automatically merges user settings with defaults.
 */

import {
  UserSettings,
  DEFAULT_SETTINGS,
  NotificationSettings,
  DisplaySettings,
  PrivacySettings,
  AccessibilitySettings,
  isValidUserSettings,
} from '@/types/settings';

/**
 * Deep merge two objects, with second object taking precedence
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/**
 * Get user settings merged with defaults
 * If user settings are invalid or missing, returns defaults
 *
 * @param userSettingsJson - Raw JSON from database
 * @returns Merged settings with all required fields
 */
export function getUserSettings(userSettingsJson: any): Required<UserSettings> {
  // Handle null, undefined, or empty cases
  if (!userSettingsJson) {
    return DEFAULT_SETTINGS;
  }

  // Parse if it's a string
  let parsed: any;
  if (typeof userSettingsJson === 'string') {
    try {
      parsed = JSON.parse(userSettingsJson);
    } catch {
      console.warn('Failed to parse user settings JSON, using defaults');
      return DEFAULT_SETTINGS;
    }
  } else {
    parsed = userSettingsJson;
  }

  // Validate structure
  if (!isValidUserSettings(parsed)) {
    console.warn('Invalid user settings structure, using defaults');
    return DEFAULT_SETTINGS;
  }

  // Deep merge with defaults
  return deepMerge(DEFAULT_SETTINGS, parsed);
}

/**
 * Get notification settings only
 */
export function getNotificationSettings(
  userSettingsJson: any
): Required<NotificationSettings> {
  const settings = getUserSettings(userSettingsJson);
  return settings.notifications as Required<NotificationSettings>;
}

/**
 * Get display settings only
 */
export function getDisplaySettings(userSettingsJson: any): Required<DisplaySettings> {
  const settings = getUserSettings(userSettingsJson);
  return settings.display as Required<DisplaySettings>;
}

/**
 * Get privacy settings only
 */
export function getPrivacySettings(userSettingsJson: any): Required<PrivacySettings> {
  const settings = getUserSettings(userSettingsJson);
  return settings.privacy as Required<PrivacySettings>;
}

/**
 * Get accessibility settings only
 */
export function getAccessibilitySettings(
  userSettingsJson: any
): Required<AccessibilitySettings> {
  const settings = getUserSettings(userSettingsJson);
  return settings.accessibility as Required<AccessibilitySettings>;
}

/**
 * Update user settings (partial update)
 * Merges new settings with existing settings
 *
 * @param currentSettingsJson - Current settings from database
 * @param updates - Partial settings to update
 * @returns Updated settings JSON ready to save to database
 */
export function updateUserSettings(
  currentSettingsJson: any,
  updates: Partial<UserSettings>
): UserSettings {
  const current = getUserSettings(currentSettingsJson);
  const updated = deepMerge(current, updates);

  // Remove default values to keep JSON lean
  // (Defaults will be applied on read anyway)
  return updated;
}

/**
 * Validate and sanitize settings before saving to database
 *
 * @param settings - Settings to validate
 * @returns Sanitized settings or null if invalid
 */
export function sanitizeSettings(settings: Partial<UserSettings>): UserSettings | null {
  if (!isValidUserSettings(settings)) {
    return null;
  }

  // Remove any extra fields not in UserSettings type
  const sanitized: UserSettings = {};

  if (settings.notifications) {
    sanitized.notifications = {};
    const validNotificationKeys: (keyof NotificationSettings)[] = [
      'email',
      'push',
      'gradePosted',
      'assignmentDue',
      'courseAssigned',
      'parentInstruction',
      'systemAlert',
    ];
    for (const key of validNotificationKeys) {
      if (typeof settings.notifications[key] === 'boolean') {
        sanitized.notifications[key] = settings.notifications[key];
      }
    }
  }

  if (settings.display) {
    sanitized.display = {};
    if (['light', 'dark', 'system'].includes(settings.display.theme || '')) {
      sanitized.display.theme = settings.display.theme;
    }
    if (typeof settings.display.compactMode === 'boolean') {
      sanitized.display.compactMode = settings.display.compactMode;
    }
    if (typeof settings.display.showAvatars === 'boolean') {
      sanitized.display.showAvatars = settings.display.showAvatars;
    }
    if (typeof settings.display.sidebarCollapsed === 'boolean') {
      sanitized.display.sidebarCollapsed = settings.display.sidebarCollapsed;
    }
  }

  if (settings.privacy) {
    sanitized.privacy = {};
    if (typeof settings.privacy.showEmail === 'boolean') {
      sanitized.privacy.showEmail = settings.privacy.showEmail;
    }
    if (typeof settings.privacy.showPhone === 'boolean') {
      sanitized.privacy.showPhone = settings.privacy.showPhone;
    }
    if (typeof settings.privacy.allowParentMessages === 'boolean') {
      sanitized.privacy.allowParentMessages = settings.privacy.allowParentMessages;
    }
    if (typeof settings.privacy.allowTeacherMessages === 'boolean') {
      sanitized.privacy.allowTeacherMessages = settings.privacy.allowTeacherMessages;
    }
  }

  if (settings.accessibility) {
    sanitized.accessibility = {};
    if (
      ['small', 'medium', 'large', 'extra-large'].includes(
        settings.accessibility.fontSize || ''
      )
    ) {
      sanitized.accessibility.fontSize = settings.accessibility.fontSize;
    }
    if (typeof settings.accessibility.highContrast === 'boolean') {
      sanitized.accessibility.highContrast = settings.accessibility.highContrast;
    }
    if (typeof settings.accessibility.reduceMotion === 'boolean') {
      sanitized.accessibility.reduceMotion = settings.accessibility.reduceMotion;
    }
    if (typeof settings.accessibility.screenReaderOptimized === 'boolean') {
      sanitized.accessibility.screenReaderOptimized =
        settings.accessibility.screenReaderOptimized;
    }
  }

  if (settings.language && ['FR', 'EN', 'MG', 'ES'].includes(settings.language)) {
    sanitized.language = settings.language;
  }

  return sanitized;
}
