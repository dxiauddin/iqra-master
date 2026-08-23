import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@repo/database";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      authorization: {
        params: { scope: "email public_profile" },
      },
      allowDangerousEmailAccountLinking: true,
    } as any),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signup",
  },
});

export const { GET, POST } = handlers;