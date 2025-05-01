import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboard, Module } from "@/app/context/dashboard.context";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  currentPath?: string;
}

export function MainNav({
  className,
  currentPath = "/",
  ...props
}: Readonly<MainNavProps>) {
  const { selectedOption } = useDashboard();
  const { data: session, status } = useSession(); // Obtén la sesión y el estado de la sesión
  const [filteredMenuItems, setFilteredMenuItems] = useState(
    selectedOption.modules
  );

  useEffect(() => {
    if (status == "unauthenticated") {
      redirect("/");
    }
    if (session) {
      // Filtramos los elementos del menú según el rol del usuario
      const updatedMenuItems = selectedOption.modules.filter(
        (item) =>
          !item.onlyAdmin || (item.onlyAdmin && session.user?.rol === "Admin")
      );
      setFilteredMenuItems(updatedMenuItems);
    }
  }, [session, status]); // Se ejecuta cuando la sesión cambia

  if (status === "loading") {
    // Mientras se carga la sesión, puedes mostrar un loading spinner o mensaje
    return null;
  }

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {filteredMenuItems.map((item: Module) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary-foreground",
            currentPath === item.href
              ? "text-primary-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
