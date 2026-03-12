# User Settings System - Usage Guide

This guide explains how to use the JSON-based user settings system in SchoolBridge.

## Overview

User settings are stored as JSON in the `settings` field of the `User` table. If a setting is not present in the user's JSON, the system automatically falls back to default values defined in the application.

## Architecture

- **Database**: Single `settings` JSON field in `User` table
- **Types**: TypeScript interfaces in `src/types/settings.ts`
- **Utilities**: Helper functions in `src/lib/settings.ts`
- **API**: REST endpoints at `/api/settings`

## Settings Categories

### 1. Notification Settings
Controls which notifications the user wants to receive.

```typescript
{
  notifications: {
    email: boolean;          // Email notifications
    push: boolean;           // Push notifications
    gradePosted: boolean;    // Grade posted alerts
    assignmentDue: boolean;  // Assignment due reminders
    courseAssigned: boolean; // New course assignments
    parentInstruction: boolean; // Parent instruction alerts
    systemAlert: boolean;    // System-wide alerts
  }
}
```

### 2. Display Settings
UI appearance preferences.

```typescript
{
  display: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    showAvatars: boolean;
    sidebarCollapsed: boolean;
  }
}
```

### 3. Privacy Settings
User privacy controls.

```typescript
{
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowParentMessages: boolean;
    allowTeacherMessages: boolean;
  }
}
```

### 4. Accessibility Settings
Accessibility features.

```typescript
{
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reduceMotion: boolean;
    screenReaderOptimized: boolean;
  }
}
```

### 5. Language
User interface language.

```typescript
{
  language: 'FR' | 'EN' | 'MG' | 'ES';
}
```

## API Endpoints

### GET `/api/settings`
Get current user's settings (merged with defaults).

**Response:**
```json
{
  "notifications": {
    "email": true,
    "push": true,
    "gradePosted": true,
    "assignmentDue": true,
    "courseAssigned": true,
    "parentInstruction": true,
    "systemAlert": true
  },
  "display": {
    "theme": "system",
    "compactMode": false,
    "showAvatars": true,
    "sidebarCollapsed": false
  },
  "privacy": {
    "showEmail": true,
    "showPhone": false,
    "allowParentMessages": true,
    "allowTeacherMessages": true
  },
  "accessibility": {
    "fontSize": "medium",
    "highContrast": false,
    "reduceMotion": false,
    "screenReaderOptimized": false
  },
  "language": "FR"
}
```

### PATCH `/api/settings`
Update specific settings (partial update).

**Request:**
```json
{
  "display": {
    "theme": "dark"
  },
  "notifications": {
    "email": false
  }
}
```

**Response:**
```json
{
  "message": "Settings updated successfully",
  "settings": { /* full merged settings */ }
}
```

### PUT `/api/settings`
Replace all settings (full update).

**Request:**
```json
{
  "display": {
    "theme": "dark",
    "compactMode": true
  },
  "language": "EN"
}
```

**Response:**
```json
{
  "message": "Settings replaced successfully",
  "settings": { /* full merged settings */ }
}
```

### DELETE `/api/settings`
Reset to default settings.

**Response:**
```json
{
  "message": "Settings reset to defaults successfully"
}
```

## Usage in Backend Code

### Reading Settings

```typescript
import { getUserSettings, getNotificationSettings } from '@/lib/settings';
import prisma from '@/lib/prisma';

// Get full settings merged with defaults
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { settings: true },
});

const settings = getUserSettings(user.settings);
console.log(settings.display.theme); // Always defined, never undefined

// Get specific category
const notificationSettings = getNotificationSettings(user.settings);
console.log(notificationSettings.email); // Always boolean, never undefined
```

### Updating Settings

```typescript
import { updateUserSettings, sanitizeSettings } from '@/lib/settings';

// Partial update (merge with existing)
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { settings: true },
});

const updated = updateUserSettings(user.settings, {
  display: { theme: 'dark' },
  notifications: { email: false },
});

await prisma.user.update({
  where: { id: userId },
  data: { settings: updated as any },
});

// With validation
const userInput = { display: { theme: 'invalid' } };
const sanitized = sanitizeSettings(userInput);

if (!sanitized) {
  throw new Error('Invalid settings');
}

await prisma.user.update({
  where: { id: userId },
  data: { settings: sanitized as any },
});
```

## Usage in Frontend Code

### Fetching Settings

```typescript
'use client';

import { useEffect, useState } from 'react';
import { UserSettings } from '@/types/settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Theme: {settings?.display?.theme}</h1>
      <p>Email notifications: {settings?.notifications?.email ? 'On' : 'Off'}</p>
    </div>
  );
}
```

### Updating Settings

```typescript
async function updateTheme(theme: 'light' | 'dark' | 'system') {
  const response = await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      display: { theme },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update theme');
  }

  const { settings } = await response.json();
  return settings;
}
```

## Default Values

All default values are defined in `src/types/settings.ts`:

```typescript
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
```

## Benefits of JSON Storage

1. **No Migrations Needed**: Add new settings without altering database schema
2. **Flexible Structure**: Each user can have different settings
3. **Backward Compatible**: Old users without new fields automatically get defaults
4. **Type Safe**: TypeScript interfaces provide compile-time safety
5. **Easy to Query**: PostgreSQL JSON operators allow filtering by settings
6. **Storage Efficient**: Only stores non-default values

## Adding New Settings

To add a new setting:

1. Update `UserSettings` interface in `src/types/settings.ts`
2. Add default value to `DEFAULT_SETTINGS`
3. Update validation in `sanitizeSettings()` if needed
4. No database migration required!

Example - Adding a new display setting:

```typescript
// src/types/settings.ts
export interface DisplaySettings {
  theme?: 'light' | 'dark' | 'system';
  compactMode?: boolean;
  showAvatars?: boolean;
  sidebarCollapsed?: boolean;
  animationsEnabled?: boolean; // NEW SETTING
}

export const DEFAULT_SETTINGS: Required<UserSettings> = {
  // ...
  display: {
    theme: 'system',
    compactMode: false,
    showAvatars: true,
    sidebarCollapsed: false,
    animationsEnabled: true, // NEW DEFAULT
  },
  // ...
};
```

That's it! Existing users will automatically get `animationsEnabled: true` as the default.

## Migration from Schema Fields

If you previously stored settings as individual columns, you can migrate:

```sql
-- Example migration script
UPDATE "User"
SET settings = jsonb_build_object(
  'display', jsonb_build_object('theme', 'system'),
  'language', "languagePreference"
)
WHERE settings IS NULL OR settings = '{}';
```

## Best Practices

1. **Always use helper functions**: Use `getUserSettings()` instead of accessing JSON directly
2. **Validate on write**: Use `sanitizeSettings()` before saving user input
3. **Type safety**: Always import and use TypeScript types
4. **Keep defaults reasonable**: Choose sensible defaults that work for most users
5. **Document new settings**: Update this file when adding new settings
6. **Test with empty JSON**: Ensure app works when user has no settings stored

## Troubleshooting

### Settings not applying
- Check that settings are being saved to database
- Verify `getUserSettings()` is being called to merge with defaults
- Check browser console for API errors

### TypeScript errors
- Ensure types are imported from `@/types/settings`
- Use type assertions if needed: `settings as UserSettings`
- Run `npm run build` to check for type errors

### Invalid settings saved
- Always use `sanitizeSettings()` before saving
- Add validation in API endpoints
- Use Prisma JSON validation if needed
