import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // Logic to fetch a specific course by id
  return NextResponse.json({ message: `GET course with id: ${id}` });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // Logic to update a specific course by id
  return NextResponse.json({ message: `UPDATE course with id: ${id}` });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // Logic to delete a specific course by id
  return NextResponse.json({ message: `DELETE course with id: ${id}` });
}
