"use client";
import "./globals.css";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import React from "react";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="fixlabs-favicon.svg" type="image/svg+xml" />
        <title>Dashboard | SkinUp</title>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <Toaster richColors position="top-center" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
