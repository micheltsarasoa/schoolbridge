import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const sidebarLinkSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  type: z.literal('link'),
  label: z.string().min(1, 'Label is required'),
  icon: z.string().optional(),
  href: z.string().min(1, 'Href is required'),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

const sidebarDividerSchema = z.object({
  type: z.literal('divider'),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
});

const sidebarGroupSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  type: z.literal('group'),
  label: z.string().min(1, 'Label is required'),
  icon: z.string().optional(),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  children: z.array(sidebarLinkSchema),
});

const sidebarItemSchema = z.union([
  sidebarLinkSchema,
  sidebarDividerSchema,
  sidebarGroupSchema,
]);

const configurationSchema = z.object({
  items: z.array(sidebarItemSchema),
});

export async function GET(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!params.schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }

  try {
    const sidebarConfig = await prisma.sidebarConfiguration.findUnique({
      where: {
        schoolId: params.schoolId,
        isDeleted: false,
      },
    });

    if (!sidebarConfig) {
      // Return a default or empty configuration to avoid errors on the frontend
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(sidebarConfig.configuration);
  } catch (error) {
    console.error('Error fetching sidebar configuration:', error);
    return NextResponse.json({ error: 'Failed to fetch sidebar configuration' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { schoolId: string } }
) {
  const session = await auth();
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!params.schoolId) {
    return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
  }
  
  try {
    const body = await request.json();
    const validation = configurationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid configuration format', details: validation.error.flatten() }, { status: 400 });
    }

    const school = await prisma.school.findUnique({
        where: { id: params.schoolId, isDeleted: false },
    });

    if (!school) {
        return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }
    
    const updatedConfig = await prisma.sidebarConfiguration.upsert({
      where: {
        schoolId: params.schoolId,
      },
      update: {
        configuration: validation.data,
        clientUpdatedAt: new Date(),
      },
      create: {
        schoolId: params.schoolId,
        configuration: validation.data,
        clientId: session.user.id,
      },
    });

    return NextResponse.json(updatedConfig.configuration);
  } catch (error) {
    console.error('Error updating sidebar configuration:', error);
    return NextResponse.json({ error: 'Failed to update sidebar configuration' }, { status: 500 });
  }
}