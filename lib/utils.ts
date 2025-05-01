import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberFormat(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(value as number);
}

export function getBgColor(value: string): string {
  const bgColorMap: { [key: string]: string } = {
    Pendiente: "bg-blue-200",
    Procesando: "bg-yellow-200",
    Creado: "bg-green-200",
    Pagado: "bg-green-200",
    Fallido: "bg-red-200",
  };
  return bgColorMap[value] || "bg-gray-200";
}

export function getTextColor(value: string): string {
  const textColorMap: { [key: string]: string } = {
    Completado: "text-white",
    Pendiente: "text-blue-800",
    Procesando: "text-yellow-800",
    Creado: "text-green-800",
    Pagado: "text-green-800",
    Fallido: "text-red-800",
  };
  return textColorMap[value] || "text-gray-800";
}
export enum OrderState {
  PENDIENTE = "Pendiente",
  PROCESANDO = "Procesando",
  PROVEEDOR_CREADO = "Proveedor Creado",
  ORDEN_CREADA = "Orden Creada",
  FACTURA_CREADA = "Factura Creada",
  FALLIDO = "Fallido",
}
export function getHexColor(value: OrderState): string {
  const hexagesimalColorMap: { [key: string]: string } = {
    Pendiente: "#AC954A",
    Procesando: "#AC954A",
    "Proveedor Creado": "#67AA81",
    "Orden Creada": "#67AA81",
    "Factura Creada": "#67AA81",
    Fallido: "#FF5757",
    Completado: "#67AA81",
  };
  return hexagesimalColorMap[value] || "#D1D5DB";
}
