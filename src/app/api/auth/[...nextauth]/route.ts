// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: { email: credentials?.email },
				});

				if (user && user.password && await compare(credentials.password, user.password)) {
					return user;
				}

				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, user }) {
			// Add user ID and role to session for access later
			if (session.user) {
				session.user.id = user.id;
				session.user.role = user.role;
			}
			return session;
		},

		async redirect({ url, baseUrl }) {
			// Always redirect to dashboard after login
			return `${baseUrl}/dashboard`;
		}
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
	session: {
		strategy: 'database', // or 'jwt' if you're using JWTs
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

