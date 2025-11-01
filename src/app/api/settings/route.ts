import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getUserSettings, updateUserSettings, sanitizeSettings } from '@/lib/settings';
import { UserSettings } from '@/types/settings';

// GET /api/settings - Get current user's settings merged with defaults
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get settings merged with defaults
    const settings = getUserSettings(user.settings);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - Update user settings (partial update)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Sanitize and validate settings
    const sanitized = sanitizeSettings(body);
    if (!sanitized) {
      return NextResponse.json(
        { message: 'Invalid settings format' },
        { status: 400 }
      );
    }

    // Get current settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Merge with existing settings
    const updated = updateUserSettings(user.settings, sanitized);

    // Save to database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { settings: updated as any },
    });

    // Return merged settings with defaults
    const mergedSettings = getUserSettings(updated);

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: mergedSettings,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Replace all user settings (full update)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Sanitize and validate settings
    const sanitized = sanitizeSettings(body);
    if (!sanitized) {
      return NextResponse.json(
        { message: 'Invalid settings format' },
        { status: 400 }
      );
    }

    // Replace settings entirely
    await prisma.user.update({
      where: { id: session.user.id },
      data: { settings: sanitized as any },
    });

    // Return merged settings with defaults
    const mergedSettings = getUserSettings(sanitized);

    return NextResponse.json({
      message: 'Settings replaced successfully',
      settings: mergedSettings,
    });
  } catch (error) {
    console.error('Error replacing user settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/settings - Reset to default settings
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Reset to empty object (defaults will be applied on read)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { settings: {} },
    });

    return NextResponse.json({
      message: 'Settings reset to defaults successfully',
    });
  } catch (error) {
    console.error('Error resetting user settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
