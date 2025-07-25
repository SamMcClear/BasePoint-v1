// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email: string;
      role: string;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email: string;
    role: string;
  }
}

