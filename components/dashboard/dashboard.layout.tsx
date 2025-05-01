"use client";
import React from "react";
import { MainNav } from "@/components/dashboard/main.nav";
import { UserNav } from "@/components/dashboard/user.nav";
import { DashboardProvider, Option } from "@/app/context/dashboard.context";
import { NavSelector } from "@/components/dashboard/nav.selector";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

interface DashboardLayoutProps {
  children: React.ReactNode;
  options: Option[];
}

export default function DashboardLayout({
  children,
  options,
}: Readonly<DashboardLayoutProps>) {
  const pathname = usePathname();
  const basePath = pathname.split("?")[0];

  return (
    <DashboardProvider initialOptions={options}>
      <div className="flex min-h-screen flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-primary text-white">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-4">
              <Logo />
              <NavSelector />
            </div>
            <MainNav className="mx-6 text-white" currentPath={basePath} />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav
                user={{
                  name: "Sistemas",
                  company: "SkinUp",
                }}
              />
            </div>
          </div>
        </header>
        <main className="flex-1 mt-16">{children}</main>
      </div>
    </DashboardProvider>
  );
}
