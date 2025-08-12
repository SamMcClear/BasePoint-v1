import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10');

  const results = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: q || '',
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: q || '',
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          connections: true,
          permissions: true,
        },
      },
    },
    orderBy: [
      { name: 'asc' },
      { email: 'asc' },
    ],
    take: limit,
  });

  return NextResponse.json({ results });
}
