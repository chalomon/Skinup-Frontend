import NextAuth, { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import { BACKEND_URL, HOURS_SESSION } from "@/app/api/common/app.api";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, ingresa email y contraseña");
        }

        const res = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const data = await res.json();
        if (res.ok && data) {
          // Retorna tanto el user como el token
          return {
            ...data.user, // id, email, name
            access_token: data.token,
          };
        }

        throw new Error("Credenciales inválidas");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario inicia sesión, agrega los datos del usuario y el token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.rol = user.rol;
        token.access_token = (user as any).access_token; // Incluye el access_token
      }

      return token;
    },
    async session({ session, token }) {
      // Propaga los datos del token a la sesión
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          rol: token.rol,
        };
        session.access_token = token.access_token as string; // Incluye el access_token en la sesión
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: HOURS_SESSION * 60 * 60, // 2 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
