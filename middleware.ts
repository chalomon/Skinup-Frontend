import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(req: NextRequest) {
    // Obtén el token usando getToken, pasando el request y configurando la secret
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const currentPath = req.nextUrl.pathname;
    // // Verifica si la URL contiene 'configuraciones' y si el rol no es 'Admin'
    if (currentPath.includes("configuraciones") && token?.rol !== "Admin") {
      // Si no es admin, redirige a la página de inicio
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // // Verifica si la URL contiene 'configuraciones' y si el rol no es 'Admin'
    if (currentPath.includes("users") && token?.rol !== "Admin") {
      // Si no es admin, redirige a la página de inicio
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Si el token no está presente o no es válido, redirige a la página de login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // Redirige aquí si no está autenticado
    },

    callbacks: {
      authorized: ({ req }) => {
        // verify token and return a boolean
        let cookie = "next-auth.session-token";
        if (process.env.NODE_ENV != "development") {
          cookie = "__Secure-next-auth.session-token";
        }
        const sessionToken = req.cookies.get(cookie);
        //console.log(token);
        if (sessionToken) return true;
        else return false;
      },
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };