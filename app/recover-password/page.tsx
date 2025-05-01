"use client";

import { useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { BACKEND_URL } from "@/app/api/common/app.api";
import Spinner from "@/components/Spinner";

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] =useState(false);
  // Función para enviar la solicitud de recuperación de contraseña al backend
  const sendPasswordRecoveryEmail = async (email: string) => {
   
    const response = await fetch(`${BACKEND_URL}/auth/recover-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar correo de recuperación");
    }
    return response;
  };

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        // Llamar a la función para enviar el correo de recuperación
        await sendPasswordRecoveryEmail(email);

        toast.success("Se enviaron instrucciones a tu correo.");
        router.push("/login");
      } catch (error) {
        toast.error("Error al enviar correo de recuperación.");
      }
      setLoading(false);
    },
    [email, router]
  );

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
              <h2 className="text-3xl font-semibold">
                Recuperación de Contraseña
              </h2>
              <p className="text-xl text-muted-foreground">
                Ingrese su email para recuperar la contraseña
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

              <Button  
                type="submit"
                className="w-full bg-[#1a1b3b] hover:bg-[#2a2b4b] text-xl py-6"
              >
              {loading ? <Spinner size="sm" /> : "Recuperar Contraseña"}
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
            </form>
          </div>
        </div>

        {/* Right empty column */}
        <div className="hidden md:block md:col-span-1"></div>
      </div>
    </div>
  );
}
