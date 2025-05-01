//"use client";
import axios from "axios";
import { decodeJwt } from "jose"; // Usamos la función decodeJwt de 'jose'

import { getSession } from "next-auth/react";

// Centraliza la configuración de los parámetros de entorno en una constante
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const HOURS_SESSION = Number(process.env.NEXT_PUBLIC_HOURS_SESSION);

// Obtener el token de forma asincrónica
export const getToken = async () => {
  const session = await getSession();
  return session?.access_token ?? ""; // Devuelve una cadena vacía si no hay token
};

// Crear una instancia de Axios para usarla en las solicitudes
export const apiClient = async () => {
  const token = await getToken(); // Obtener el token de forma asincrónica
  // Si no hay token, redirigir al login
  if (!token) {
    return null; // Evita continuar con la solicitud si no hay token
  }

  try {
    // Decodificar el token JWT
    const decodedToken = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

    // Verificar si el token ha expirado
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      // Si el token ha expirado, redirigir al login
      return null; // Evita continuar con la solicitud si el token ha expirado
    }

    // Crear el cliente de API si el token es válido
    return axios.create({
      baseURL: BACKEND_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return null; // Evita continuar con la solicitud si el token es inválido
  }
};
