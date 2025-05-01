"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchComponent } from "@/components/table/Search";
import { SortableHeader } from "@/components/table/SortableHeader";
import { DataTableProps } from "@/components/table/types";
import PaginationTable from "@/components/PaginateTable";
import { Filter } from "./Filter";
import { ExportButton } from "./ExportButton";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function DataTable<T extends { _id: string; }>({
  data,
  columns,
  itemsPerPage = 10,
  isLoading,
  error,
  actions,
  search,
  onSearchChange,
  searchComponent
}: Readonly<DataTableProps<T>>) {

  // const router = useRouter();
  // const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");


  // useEffect(() => {
  //   const pageFromUrl = searchParams.get("page");
  //   const searchFromUrl = searchParams.get("search");
  //   const sortColumnFromUrl = searchParams.get("sortColumn");
  //   const sortDirectionFromUrl = searchParams.get("sortDirection") as
  //     | "asc"
  //     | "desc";
  //   if (pageFromUrl) setPage(parseInt(pageFromUrl));
  //   if (searchFromUrl) setSearchTerm(searchFromUrl);
  //   if (sortColumnFromUrl) setSortColumn(sortColumnFromUrl as keyof T);
  //   if (sortDirectionFromUrl) setSortDirection(sortDirectionFromUrl);
  // }, [searchParams]);

  // // Actualizar la URL con los parámetros de búsqueda
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("page", page.toString());
  //   params.set("filters", JSON.stringify(filters));
  //   params.set("search", searchTerm);
  //   if (sortColumn) params.set("sortColumn", sortColumn as string);
  //   params.set("sortDirection", sortDirection);

  //   router.push(`?${params.toString()}`, { scroll: false });
  // }, [
  //   page,
  //   filters,
  //   searchTerm,
  //   sortColumn,
  //   sortDirection,
  //   router,
  //   searchParams,
  // ]);

  // Manejar la ordenación de columnas
  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    if (error || !Array.isArray(data)) return [];
    const result = data.filter(
      (item: T) =>
        Object.entries(filters).every(([key, value]) => {
          const itemValue = item[key as keyof T];
          return (
            value === "" ||
            (typeof itemValue === "string" &&
              itemValue.toLowerCase().includes(value.toLowerCase()))
          );
        }) &&
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, searchTerm, sortColumn, sortDirection, error]);

  const totalItems = filteredAndSortedData.length;
  const paginatedData = filteredAndSortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">Cargando...</div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="mb-6">{searchComponent}</div>
         <div className="flex gap-2">
          <Filter
            columns={columns}
            filters={filters}
            onFilterChange={handleFilterChange}
            data={data || []}
          />
          <ExportButton 
            data={data || []} 
            columns={columns} 
          />
        </div>
      </div>

      <div className="rounded-md border">
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
            {paginatedData.length === 0 ? (
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
              paginatedData.map((item) => (
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
      </div>
      {/* Componente de paginación */}
      <PaginationTable
        currentPage={page}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}