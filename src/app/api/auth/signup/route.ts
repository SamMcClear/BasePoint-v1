import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // singleton Prisma client
import { hash } from "bcryptjs";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		if (
			!email ||
			!password ||
			typeof email !== "string" ||
			typeof password !== "string" ||
			email.trim() === "" ||
			password.trim() === ""
		) {
			return NextResponse.json(
				{ message: "Invalid email or password" },
				{ status: 400 }
			);
		}

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 409 }
			);
		}

		// Hash password securely
		const hashedPassword = await hash(password, 12);

		// Create user with default role
		await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				role: "DEVELOPER", // adjust role as needed
			},
		});

		return NextResponse.json({ message: "User created" }, { status: 201 });
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

