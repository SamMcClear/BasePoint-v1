// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Email and Password",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) return null;

				const isValid = await compare(credentials.password, user.password);
				if (!isValid) return null;

				return user;
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.role = user.role;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Redirect all sign-ins to dashboard
			return `${baseUrl}/dashboard`;
		},
	},
	session: {
		strategy: "database", // Use database sessions for better security
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

