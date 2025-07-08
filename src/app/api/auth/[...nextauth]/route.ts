import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "credentials",
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

				// Return user object - make sure id is a string for NextAuth
				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name,
					image: user.image,
					role: user.role,
				};
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
	session: {
		strategy: "jwt", // Change to JWT for credentials provider compatibility
	},
	callbacks: {
		async jwt({ token, user }) {
			// Add user info to JWT token
			if (user) {
				token.role = user.role;
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			// Add user info to session
			if (token && session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Redirect all sign-ins to dashboard
			return `${baseUrl}/dashboard`;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development", // Add debug logging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
