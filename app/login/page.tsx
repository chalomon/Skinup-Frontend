"use client";
import { useState, FormEvent, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import SpinnerComponent from "@/components/Spinner"; // Importa el spinner
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Iniciar el estado de carga
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      toast.error("Error en el inicio de sesión");
      setLoading(false); // Detener el estado de carga
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const { status } = useSession(); // Obtén la sesión y el estado de la sesión
  useEffect(() => {
    if (status == "authenticated") {
      toast.success("Inicio de sesión correctamente");
      router.push("/dashboard/atenciones");
    }
  }, [status]); // Se ejecuta cuando la sesión cambia

  if (status == "loading") {
    // Mientras se carga la sesión, puedes mostrar un loading spinner o mensaje
    return <SpinnerComponent size="lg" />;
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
              <h2 className="text-3xl font-semibold">Panel de Integración</h2>
              <p className="text-xl text-muted-foreground">
                Ingrese su email para entrar al panel
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-8">
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="text-lg p-6 pr-12"
                />
                <Mail
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              <div className="relative">
                <Input
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-lg p-6 pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center justify-center w-10 h-10"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1a1b3b] hover:bg-[#2a2b4b] text-xl py-6"
              >
                {loading ? <SpinnerComponent size="sm" /> : "Iniciar sesión"}
              </Button>
              <div className="text-center space-y-4">
                <Button
                  type="button"
                  variant="link"
                  className="text-lg"
                  onClick={() => router.push("/recover-password")}
                >
                  Recuperar contraseña
                </Button>

                <div className="text-center space-y-4">
                  <div className="text-lg text-muted-foreground">
                    <p>Si tienes problemas para iniciar sesión</p>
                    <p>
                      Ingresa al siguiente&nbsp;
                      <Button variant="link" className="p-0 h-auto text-lg">
                        <Link href="https://fixlabs.cl/">link</Link>
                      </Button>
                    </p>
                  </div>
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
