"use client"
import { Card, CardContent } from "@/components/ui/card";
import { IDataAtention } from "@/app/api/invoices/invoices.interface";
import { Suspense, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableHeader } from "@/components/table/SortableHeader";
import { DataTableProps } from "@/components/table/types";

// Componente de tabla de datos de ventas
export function TablePedidos({
  searchComponent,
  paginatedComponent,
  filterComponent,
  buttonComponent,
  data,
  isLoading,
  actions,
  columns,
}: Readonly<DataTableProps<IDataAtention>>) {
  const [sortColumn, setSortColumn] = useState<keyof IDataAtention | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const handleSort = (column: keyof IDataAtention) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  return (
    <Card>
      <CardContent>
      <div className="flex justify-between mb-4 mt-4">
          {searchComponent}
          <div className="flex">
            {filterComponent}
            {buttonComponent}
          </div>
        </div>
        <div className="rounded-md border">
          <Suspense fallback={isLoading && <div>Loading...</div>}>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Encabezados de la tabla con capacidad de ordenación */}
                  {columns.map((column ) => (
                     <SortableHeader
                     key={String(column.accessor)}
                     column={column}
                     sortColumn={sortColumn}
                     sortDirection={sortDirection}
                     onSort={handleSort}
                   />
                  ))}
                  {/* Columna de acciones si se proporcionan */}
                  { actions && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Mostrar mensaje si no hay datos disponibles */}
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (actions ? 1 : 0)}
                      className="text-center"
                    >
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  // Mostrar filas de datos paginados
                  data.map((item) => (
                    <TableRow key={item._id}>
                      {columns.map((column) => (
                        <TableCell key={String(column.accessor)}>
                          {column.cell
                            ? column.cell(item[column.accessor], item)
                            : String(item[column.accessor])}
                        </TableCell>
                      ))}
                      {actions && <TableCell>{actions(item)}</TableCell>}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Componente de paginación */}
            {paginatedComponent}
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}
