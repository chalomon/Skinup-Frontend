import React from "react";
import DashboardLayout from "@/components/dashboard/dashboard.layout";
import { Option } from "@/app/context/dashboard.context";

const pillColor = {
  medilink: { color: "#13b0e3" }, // azul cielo vibrante
  blueExpress: { color: "#7ceaf6" }, // azul cielo claro
  blueExpress2: { color: "#378ab8" }, // azul acero
  defontana: { color: "#FF5100" }, // naranja intenso / rojo anaranjado
  defontana2: { color: "#00D0CA" }, // turquesa brillante
  laudus: { color: "#416BA9" }, // azul acero / azul medio oscuro
  multivende: { color: "#2D9CDB" }, // azul cielo vibrante
  odoo: { color: "#714B67" }, // morado ciruela
  SAP: { color: "#0070f2" }, // azul electrico
  toteat: { color: "#FF7F50" }, // coral anaranjado
};

const options: Option[] = [
  {
    name: "Medilink - Defontana",
    leftColor: pillColor.medilink.color,
    rightColor: pillColor.defontana.color,
    modules: [
      { label: "Atenciones", href: "/dashboard/atenciones", onlyAdmin: false },
      {
        label: "Configuraciones",
        href: "/dashboard/configuraciones",
        onlyAdmin: true,
      },
    ],
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardLayout options={options}>
      <div className="flex-1 space-y-6 p-8 pt-6">{children}</div>
    </DashboardLayout>
  );
}
