import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { mockUsers } from "@/lib/mock-users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isCognitoLogin: { label: "Is Cognito Login", type: "text" },
        name: { label: "Name", type: "text" },
      },
      authorize: async (credentials) => {
        // Check for Cognito bypass (client-side authenticated)
        if (credentials?.isCognitoLogin === 'true' && credentials?.email) {
          return {
            id: credentials.email as string, // Use email as ID for now
            name: (credentials.name as string) || 'User',
            email: credentials.email as string,
            role: 'mahasiswa', // Default role for new users. In real app, fetch from DB or attributes.
          };
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = mockUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});
