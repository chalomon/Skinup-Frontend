"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { numberFormat } from "@/lib/utils";
import { IDataSettlement } from "@/app/api/settlements/settlements.interface";

// Definición de la interfaz para las propiedades del modal de revisión de orden
interface SettlementDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: IDataSettlement | null;
}

// Componente para mostrar el modal de revisión de orden
export function SettlementDetails({
  isOpen,
  onClose,
  settlement,
}: Readonly<SettlementDetailsProps>) {
  if (!settlement?.details?.length) return null;
  // Mapeo de los productos
  const services = settlement?.details?.map((item) => ({
    id: item.id_prestacion,
    nombre: item.nombre_prestacion,
    fecha: item.fecha,
    medio_pago: item.medio_pago,
    total: item.total,
  }));


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-200 text-gray-800 border-0 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-xl font-bold">Detalles de liquidación N° {settlement.id}</DialogTitle>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-300">
              <TableHead className="text-gray-600">ID</TableHead>
              <TableHead className="text-gray-600">Nombre</TableHead>
              <TableHead className="text-gray-600">Fecha</TableHead>
              <TableHead className="text-gray-600">Medio de pago</TableHead>
              <TableHead className="text-gray-600">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((service, index) => (
              <TableRow key={index} className="border-b border-gray-300">
                <TableCell className="text-gray-800">{service.id}</TableCell>
                <TableCell className="text-gray-800">{service.nombre}</TableCell>
                <TableCell className="text-gray-800">{service.fecha}</TableCell>
                <TableCell className="text-gray-800">{service.medio_pago}</TableCell>
                <TableCell className="text-gray-800">
                  {numberFormat(service.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Botones de acción en la parte inferior */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md flex items-center justify-center"
          >
            <X className="mr-2 h-4 w-4" /> Cerrar
          </button>
          {/* <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md flex items-center justify-center">
            <span className="mr-2">○</span> Reintentar 
          </button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
