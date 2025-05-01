"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserConfig } from "@/components/dashboard/types";
import { signOut, useSession } from "next-auth/react";

interface UserNavProps {
  user: UserConfig;
}
const handleLogout = async () => {
  await signOut(); // Redirige a la página de login después de cerrar sesión
};

export function UserNav({ user }: Readonly<UserNavProps>) {
  const { data } = useSession(); // Obtén la sesión y el estado de la sesión
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 text-primary-foreground">
        <span>{data?.user.name}</span>
        <span>|</span>
        <span>{user.company}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuGroup>
            {data?.user.rol == "Admin" && (
              <Link href={"/dashboard/usuarios"}>
                <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                  Usuarios
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem
              onClick={() => handleLogout()}
              className="cursor-pointer px-4 py-2 hover:bg-gray-200"
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
