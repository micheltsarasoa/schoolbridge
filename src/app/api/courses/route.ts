import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Logic to fetch all courses
  return NextResponse.json({ message: 'GET all courses' });
}

export async function POST(request: Request) {
  // Logic to create a new course
  return NextResponse.json({ message: 'Create new course' });
}