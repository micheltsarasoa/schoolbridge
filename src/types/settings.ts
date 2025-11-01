/**
 * User Settings Types
 *
 * Settings are stored as JSON in the database.
 * If a field is not present in the user's settings JSON,
 * the default value from DEFAULT_SETTINGS will be used.
 */

export interface NotificationSettings {
  email?: boolean;
  push?: boolean;
  gradePosted?: boolean;
  assignmentDue?: boolean;
  courseAssigned?: boolean;
  parentInstruction?: boolean;
  systemAlert?: boolean;
}

export interface DisplaySettings {
  theme?: 'light' | 'dark' | 'system';
  compactMode?: boolean;
  showAvatars?: boolean;
  sidebarCollapsed?: boolean;
}

export interface PrivacySettings {
  showEmail?: boolean;
  showPhone?: boolean;
  allowParentMessages?: boolean;
  allowTeacherMessages?: boolean;
}

export interface AccessibilitySettings {
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast?: boolean;
  reduceMotion?: boolean;
  screenReaderOptimized?: boolean;
}

export interface UserSettings {
  notifications?: NotificationSettings;
  display?: DisplaySettings;
  privacy?: PrivacySettings;
  accessibility?: AccessibilitySettings;
  language?: 'FR' | 'EN' | 'MG' | 'ES';
}

/**
 * Default settings applied when user settings are not specified
 */
export const DEFAULT_SETTINGS: Required<UserSettings> = {
  notifications: {
    email: true,
    push: true,
    gradePosted: true,
    assignmentDue: true,
    courseAssigned: true,
    parentInstruction: true,
    systemAlert: true,
  },
  display: {
    theme: 'system',
    compactMode: false,
    showAvatars: true,
    sidebarCollapsed: false,
  },
  privacy: {
    showEmail: true,
    showPhone: false,
    allowParentMessages: true,
    allowTeacherMessages: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReaderOptimized: false,
  },
  language: 'FR',
};

/**
 * Type guard to check if an object is valid UserSettings
 */
export function isValidUserSettings(obj: any): obj is UserSettings {
  if (typeof obj !== 'object' || obj === null) return false;

  // Basic validation - can be extended as needed
  if (obj.display?.theme && !['light', 'dark', 'system'].includes(obj.display.theme)) {
    return false;
  }

  if (obj.language && !['FR', 'EN', 'MG', 'ES'].includes(obj.language)) {
    return false;
  }

  return true;
}
