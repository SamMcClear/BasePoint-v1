import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  const results = await prisma.connection.findMany({
    where: {
      OR: [
        // Search by connection name
        {
          name: {
            contains: q || '',
            mode: 'insensitive',
          },
        },
        // Search by owner name
        {
          owner: {
            name: {
              contains: q || '',
              mode: 'insensitive',
            },
          },
        },
        // Search by owner email
        {
          owner: {
            email: {
              contains: q || '',
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      sharedWith: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          sharedWith: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ results });
}
