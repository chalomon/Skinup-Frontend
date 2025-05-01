"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, ChevronsUpDown, Component, Download, Search } from "lucide-react";

import { numberFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Column, IDateRange } from "@/components/table/types";
import { IDataSettlement } from "@/app/api/settlements/settlements.interface";
import {
  exportSettlements,
  getSettlements,
} from "@/app/api/settlements/settlements.api";
import { TableSettlement } from "@/app/dashboard/atenciones/liquidaciones/table";
import { Badge } from "@/components/ui/badge";
import { Pill } from "@/components/ui/pill";
import { SettlementDetails } from "./settlements.details";

const formSchema = z.object({
  status: z.string(),
});

export default function DataSettlements({ from, to }: Readonly<IDateRange>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [settlementData, setSettlementData] = useState<IDataSettlement[]>([]);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<string>("todos");

    const [selectedSettlement, setSelectedSettlement] = useState< IDataSettlement | null>(null);
    const [isSettlementDetails, setIsSettlementDetails] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status,
    },
  });

  const [pagination, setPagination] = useState({
    current: 1,
    totalPages: 0,
    pageSize: 10, // Definir el tamaño de la página aquí, si lo deseas
  });

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getSettlements({
        page: pagination.current,
        pageSize: pagination.pageSize,
        fechaDesde: formatDate(new Date(from)),
        fechaHasta: formatDate(new Date(to)),
        search: searchTerm,
        status,
      });
      setSettlementData(data ?? []);
      setPagination((prev) => ({
        ...prev,
        totalPages,
      }));
    } catch (error) {
      setFetchError(
        error instanceof Error
          ? error
          : new Error(
              "Error desconocido al obtener las Atentiones desde medilink"
            )
      );
    }
    setLoading(false);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function mappingStatus(statusPayments: string) {
    let status = "pending";
    if (statusPayments == "completed") {
      status = "completed";
    }
    return status;
  }
  const closeStatus = () => {
    form.setValue("status", "todos");
    setStatus(() => "todos");
    setIsDialogOpen(false);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };
  // Obtener datos de ventas al montar el componente
  useEffect(() => {
    fetchSettlements();
  }, [searchTerm, from, to, pagination.current, status, selectedSettlement]);

  const SearchComponent = (
    <div className="flex justify-left gap-10">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar en la tabla..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {status !== "todos" && (
        <div className="flex items-center space-x-2">
          <small>Estado: </small>
          <Badge variant="neutral">{mappingStatus(status)}</Badge>
          <button
            onClick={closeStatus}
            className="text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, current: page }));
    }
  };

  const PaginateComponent = (
    <Pagination className="justify-end mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(pagination.current - 1)}
          />
        </PaginationItem>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
          .filter((pageNumber) => {
            if (pagination.totalPages <= 9) return true;
            if (pagination.current <= 5)
              return pageNumber <= 9 || pageNumber === pagination.totalPages;
            if (pagination.current >= pagination.totalPages - 4)
              return (
                pageNumber >= pagination.totalPages - 8 || pageNumber === 1
              );
            return (
              pageNumber === 1 ||
              pageNumber === pagination.totalPages ||
              (pageNumber >= pagination.current - 4 &&
                pageNumber <= pagination.current + 4)
            );
          })
          .map((pageNumber, index, array) => (
            <>
              {index > 0 && pageNumber !== array[index - 1] + 1 && (
                <PaginationItem key={`ellipsis-${pageNumber}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNumber)}
                  isActive={pagination.current === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            </>
          ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(pagination.current + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  const clearFilters = () => {
    form.setValue("status", "todos");
    setStatus("todos");
  };

  const applyFilters = () => {
    setIsDialogOpen(false);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchSettlements();
  };

  const ButtonComponent = (
    <Button
      onClick={() =>
        exportSettlements({
          fechaDesde: formatDate(new Date(from)),
          fechaHasta: formatDate(new Date(to)),
          status,
        })
      }
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar Excel
    </Button>
  );

  // State componente
  const FilterComponent = (
    <div className="relative w-full sm:w-28">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            Filtros <ChevronsUpDown color="#8c8c8c" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtrar datos</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            {/* Primer Select: Consulta / Procedimiento */}
            <Form {...form}>
              {/* Segundo Select: Estados Pending / Failed */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar Estado</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setStatus(value);
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </Form>
            <div className="flex justify-between mt-4">
              <Button
                variant="link"
                onClick={clearFilters}
                className="text-destructive"
              >
                Quitar filtros
              </Button>
              <Button onClick={applyFilters}>Aplicar filtros</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const columns: Column<IDataSettlement>[] = [
    {
      header: "ID",
      accessor: "id",
    },
    { header: "Nombre Profesional", accessor: "nombre" },
    { header: "Rut Profesional", accessor: "rut" },
    {
      header: "Fecha de Inicio",
      accessor: "fecha_inicio",
      cell: (value: any) => {
        if (!value) return "N/A";
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      header: "Fecha de Término",
      accessor: "fecha_termino",
      cell: (value: any) => {
        if (!value) return "N/A";
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      header: "Monto",
      accessor: "monto",
      cell: (value) => numberFormat(value as number),
    },
    {
      header: "Estado",
      accessor: "status",
      filterable: true,
      sortable: true,
      cell: (value) => {
        let pillColor;
        let fontColor;
        let iconStatus;
        let statusText;
        switch (value) {
          case "received":
            pillColor = "#898e96";
            fontColor = "#ffffff";
            statusText = "Recibido";
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
            break;
            case "pending":
              pillColor = "#AC954A";
              fontColor = "#ffffff";
              statusText = "Pendiente";
              iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
              break;
            case "process":
              pillColor = "#6778aa";
              fontColor = "#ffffff";
              statusText = "Procesando";
              iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
              break;
          case "completed":
            pillColor = "#67AA81";
            fontColor = "#ffffff";
            statusText = "Completado";
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
            break;
          case "error":
            pillColor = "#67AA81";
            fontColor = "#ffffff";
            statusText = "Error";
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
            break;
          default:
            pillColor = "#AC954A";
            fontColor = "#ffffff";
            statusText = "Pendiente";
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
            break;
        }
        return (
          <Pill
            color={fontColor}
            text={statusText}
            backgroundColor={pillColor}
            iconChip={iconStatus}
            justifyContent="center"
          />
        );
      },
    }
  ];

    // Manejar acciones para cada elemento de venta
    const handleActions = (settlement: IDataSettlement) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            ...
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem             
            onClick={() => {
              setSelectedSettlement(settlement);
              setIsSettlementDetails(true);
            }}>
            Revisar liquidación <ChevronRight className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
  <>
    <TableSettlement
      searchComponent={SearchComponent}
      paginatedComponent={PaginateComponent}
      filterComponent={FilterComponent}
      buttonComponent={ButtonComponent}
      data={settlementData}
      columns={columns}
      actions={handleActions}
      isLoading={loading}
      error={fetchError ? fetchError.message : null}
    />

    <SettlementDetails 
      isOpen={isSettlementDetails}
      onClose={() => {
        setIsSettlementDetails(false);
        setSelectedSettlement(null);
      }}
      settlement={selectedSettlement}
    />
  </>
  );
}
