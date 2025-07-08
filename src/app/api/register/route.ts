// app/api/register/route.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
	}

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return NextResponse.json({ error: 'User already exists' }, { status: 409 });
	}

	const hashed = await hash(password, 10);

	await prisma.user.create({
		data: {
			email,
			password: hashed,
		},
	});

	return NextResponse.json({ success: true }, { status: 201 });
}

