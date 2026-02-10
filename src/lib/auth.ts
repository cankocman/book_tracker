
import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any, // Type cast might be needed due to version mismatch in types
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user || !user.password) {
          return null; 
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.sub = user.id;
        }
        return token;
    }
  },
};

export function auth() {
    return getServerSession(authOptions);
}
