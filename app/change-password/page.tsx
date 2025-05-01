"use client";

import { useState, FormEvent, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { BACKEND_URL } from "@/app/api/common/app.api";
import Spinner from "@/components/Spinner";

export default function PasswordResetPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("t");
  const [loading, setLoading] = useState<boolean>(false);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = useCallback(
    (field: "password" | "confirmPassword") => {
      setShowPasswords((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    []
  );

  const handlePasswordChange = useCallback(
    (field: "password" | "confirmPassword", value: string) => {
      setPasswords((prev) => ({
        ...prev,
        [field]: value,
      }));
      setError("");
    },
    []
  );

  const validatePasswords = useCallback(() => {
    if (passwords.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (passwords.password !== passwords.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  }, [passwords]);

  const changePassword = async (password: string, token: string) => {
    const response = await fetch(`${BACKEND_URL}/auth/new-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password, token }),
    });
    return response;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      if (!validatePasswords()) return;
      if (token) {
        try {
          // Aquí iría la lógica para actualizar la contraseña
          const response = await changePassword(passwords.password, token);
          toast.success("Constraseña actualizada exitosamente");
          router.push("/login");
        } catch (error) {
          console.error("Error al actualizar contraseña", error);
          toast.error(
            typeof error === "string" ? error : "Error al actualizar contraseña"
          );
        }
      }
      setLoading(false);
    },
    [validatePasswords, router]
  );

  useEffect(() => {
    if (token) {
      setLoading(true);
    }
    console.log(token);
  }, [token]);

  if (!loading) {
    return <div>cargando....</div>;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-8">
      {/* Left side with pattern */}
      <div className="hidden md:flex md:col-span-2 bg-[#1a1b3b] items-center justify-center p-8 relative">
        <Image
          src="/fondoFixlabs.png"
          alt="Background Pattern"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Right side with 3 columns */}
      <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-5">
        {/* Left empty column */}
        <div className="hidden md:block md:col-span-1"></div>

        {/* Middle column with form */}
        <div className="flex items-center justify-center p-8 md:col-span-3">
          <div className="w-full max-w-lg">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <Image
                  src="/skinup-logo.jpg"
                  alt="SkinUp Logo"
                  width={271}
                  height={49}
                />
              </div>
              <h2 className="text-3xl font-semibold">Cambiar Contraseña</h2>
              <p className="text-xl text-muted-foreground">
                Ingrese y confirme su nueva contraseña
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Nueva contraseña"
                    id="password"
                    name="password"
                    type={showPasswords.password ? "text" : "password"}
                    value={passwords.password}
                    onChange={(e) =>
                      handlePasswordChange("password", e.target.value)
                    }
                    required
                    className="text-lg p-6 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center w-10 h-10"
                    aria-label={
                      showPasswords.password
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPasswords.password ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Confirmar contraseña"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirmPassword ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    required
                    className="text-lg p-6 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center w-10 h-10"
                    aria-label={
                      showPasswords.confirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>

              <Button  
                type="submit"
                className="w-full bg-[#1a1b3b] hover:bg-[#2a2b4b] text-xl py-6"
              >
              {loading ? <Spinner size="sm" /> : "Actualizar Contraseña"}
              </Button>

              <div className="text-center space-y-4">
                <div className="text-lg text-muted-foreground">
                  <p>Si tienes problemas para cambiar tu contraseña</p>
                  <p>
                    Ingresa al siguiente&nbsp;
                    <Button
                      variant="link"
                      className="p-0 h-auto text-lg"
                      onClick={() => router.push("/login")}
                    >
                      link
                    </Button>
                    .
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right empty column */}
        <div className="hidden md:block md:col-span-1"></div>
      </div>
    </div>
  );
}
