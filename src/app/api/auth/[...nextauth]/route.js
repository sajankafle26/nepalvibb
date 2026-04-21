import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    }),
    CredentialsProvider({
      name: "Dummy Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return { id: "dummy-id", name: "Test User", email: "test@example.com" };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = user?.id || token?.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
  },
};

const handler = (req, res) => {
  console.log("NextAuth Request:", req.method);
  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
