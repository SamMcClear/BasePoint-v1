import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  await prisma.connection.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const connection = await prisma.connection.findUnique({ where: { id } });
  if (!connection) return NextResponse.json({ error: 'Connection not found' }, { status: 404 });

  return NextResponse.json(connection);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  const data = await req.json();
  const updatedConnection = await prisma.connection.update({
    where: { id },
    data,
  });

  return NextResponse.json(updatedConnection);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newConnection = await prisma.connection.create({ data });
  return NextResponse.json(newConnection);
}

