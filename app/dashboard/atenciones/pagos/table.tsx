import { Suspense, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { IDataPayment } from "@/app/api/payments/payments.interface";

// Componente de tabla de datos de ventas
export function TablePayments({
  searchComponent,
  paginatedComponent,
  filterComponent,
  buttonComponent,
  retryButtonComponent,
  data,
  isLoading,
  actions,
  columns,
}: Readonly<DataTableProps<IDataPayment>>) {
  const [sortColumn, setSortColumn] = useState<keyof IDataPayment | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const handleSort = (column: keyof IDataPayment) => {
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
          <div className="flex space-x-4">
            {filterComponent}

            {buttonComponent}

            {retryButtonComponent}
          </div>
        </div>
        <div className="rounded-md border">
          <Suspense fallback={isLoading && <div>Loading...</div>}>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Encabezados de la tabla con capacidad de ordenación */}
                  {columns.map((column) => (
                    <SortableHeader
                      key={String(column.accessor)}
                      column={column}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />

                  ))}
                  {/* Columna de acciones si se proporcionan */}
                  {actions && <TableHead>Acciones</TableHead>}
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
                    <TableRow key={item.id}>
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
          </Suspense>
        </div>
        {/* Componente de paginación */}
        {paginatedComponent}
      </CardContent>
    </Card>
  );
}
