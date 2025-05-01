"use client";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeCheck } from "lucide-react";
import { User, UserDto, UserRole } from "@/app/api/users/user.interface";

interface UserFormProps {
  user?: User;
  onSubmit: (user: UserDto) => void;
}

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const methods = useForm<UserDto>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      rol: user?.rol ?? UserRole.User,
    },
  });

  const handleSubmit = (values: UserDto) => {
    onSubmit({
      id: user?.id ?? null,
      ...values,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <p className="text-muted-foreground">
          Puedes editar cualquier campo del usuario.
        </p>
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <Input
            id="name"
            {...methods.register("name", {
              required: "El nombre es obligatorio.",
            })}
            placeholder="Ingrese el nombre"
          />
          <p className="text-sm text-red-600">
            {methods.formState.errors.name?.message}
          </p>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            {...methods.register("email", {
              required: "El correo electrónico es obligatorio.",
            })}
            type="email"
            placeholder="Ingrese el correo electrónico"
          />
          <p className="text-sm text-red-600">
            {methods.formState.errors.email?.message}
          </p>
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <Input
            id="password"
            {...methods.register("password", {
              required: !user && "La contraseña es obligatoria.",
            })}
            type="password"
            placeholder="Ingrese la contraseña"
          />
          <p className="text-sm text-red-600">
            {methods.formState.errors.password?.message}
          </p>
        </div>

        {/* Rol */}
        <div>
          <label
            htmlFor="rol"
            className="block text-sm font-medium text-gray-700"
          >
            Rol
          </label>
          <Select
            onValueChange={(value) =>
              methods.setValue("rol", value as UserRole, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger aria-label="Selecciona un rol">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserRole.Admin}>Administrador</SelectItem>
              <SelectItem value={UserRole.User}>Usuario</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-red-600">
            {methods.formState.errors.rol?.message}
          </p>
        </div>
        {/* Botón */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-button-black text-white">
            <BadgeCheck />
            {user ? "Editar" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
