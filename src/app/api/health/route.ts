
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'online' });
  } catch (error) {
    return NextResponse.json({ status: 'offline' }, { status: 503 });
  } finally {
    await prisma.$disconnect();
  }
}
