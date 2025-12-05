import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: {
            walisantri: true,
            guru: true,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // ✅ PERBAIKAN: Tambahkan guru_id dan walisantri_id
        return {
          id: user.id, // ini user.id
          username: user.username,
          role: user.role,
          name: user.walisantri?.nama || user.guru?.nama || user.username,
          guru_id: user.guru?.id || null, // ✅ tambahkan ini
          walisantri_id: user.walisantri?.id || null, // ✅ tambahkan ini
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; // user.id dari tabel User
        token.guru_id = user.guru_id; // ✅ tambahkan
        token.walisantri_id = user.walisantri_id; // ✅ tambahkan
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id; // user.id
        session.user.guru_id = token.guru_id; // ✅ tambahkan
        session.user.walisantri_id = token.walisantri_id; // ✅ tambahkan
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
