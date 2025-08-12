import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalConnections, totalUsers, recentConnections] = await Promise.all([
      prisma.connection.count(),
      prisma.user.count(),
      prisma.connection.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalConnections,
      totalUsers,
      recentConnections,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
