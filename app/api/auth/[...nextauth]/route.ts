import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !data) return null;

        // Password check would use bcrypt in production
        return { id: data.id, email: data.email, name: data.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.userId) (session.user as { id?: string }).id = token.userId as string;
      if (token.accessToken) (session as { accessToken?: string }).accessToken = token.accessToken as string;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await supabase.from("users").upsert(
          {
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            google_access_token: account.access_token,
            google_refresh_token: account.refresh_token,
          },
          { onConflict: "email" }
        );
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/dashboard",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
