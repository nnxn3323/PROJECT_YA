import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type AdminLevel, type UserRole } from "@/db/schema";
import { verifyPassword } from "@/lib/password";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      adminLevel: AdminLevel | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    adminLevel: AdminLevel | null;
  }
}

type RoleToken = {
  sub?: string;
  role?: UserRole;
  adminLevel?: AdminLevel | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "temporary-auth-secret-change-before-production",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!db || !email || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !(await verifyPassword(password, user.passwordHash))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          adminLevel: user.adminLevel
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      const roleToken = token as RoleToken;
      if (user) {
        roleToken.role = user.role;
        roleToken.adminLevel = user.adminLevel;
      }
      return token;
    },
    session({ session, token }) {
      const roleToken = token as RoleToken;
      if (session.user) {
        session.user.id = roleToken.sub ?? "";
        session.user.role = roleToken.role ?? "STUDENT";
        session.user.adminLevel = roleToken.adminLevel ?? null;
      }
      return session;
    }
  }
});
