import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      rol: string;
    } & DefaultSession["user"];
    access_token: string; // Agregamos el access_token a la sesión
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string;
    rol: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    rol: string;
    access_token?: string; // Agregamos el access_token al JWT
  }
}
