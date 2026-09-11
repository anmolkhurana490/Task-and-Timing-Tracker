import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginUserAPI } from "@/features/auth/repository";
import type { AuthApiError } from "@/features/auth/types/api";

export const authOptions: NextAuthConfig = {
  providers: [
    // Google({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),

    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          const email = credentials.email;
          const password = credentials.password;
          if (typeof email !== "string" || typeof password !== "string") return null;

          const response = await loginUserAPI({ email, password });
          return {
            ...response.user,
            accessToken: response.token,
          };
        } catch (error: unknown) {
          const apiError = error as AuthApiError;
          const message = apiError.error ?? apiError.message ?? "Authentication failed";

          const errorInstance = new CredentialsSignin();
          errorInstance.code = encodeURIComponent(JSON.stringify({ code: "credentials", message }));
          throw errorInstance;
        }
      }
    }),
  ],

  callbacks: {
    // Carry the backend user and access token from sign-in into the JWT session.
    async jwt({ token, user, account }) {
      if (user) token.user = user;
      if (account?.type === 'oauth' && account.id_token) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const tokenUser = token.user as import("next-auth").User;
        session.user = {
          ...session.user,
          id: tokenUser.id ?? session.user.id,
          email: tokenUser.email ?? session.user.email ?? "",
          name: tokenUser.name,
          accessToken: tokenUser.accessToken,
        };
      }
      return session;
    }
  },

  pages: {
    signIn: '/auth/login',
    error: `/auth/login?error=${encodeURIComponent('Authentication failed')
      }`,
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);