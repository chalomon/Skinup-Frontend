"use client";
import { useEffect, useState } from "react";
import { Component, ChevronRight, Search, Download, ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { numberFormat } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Pill } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column, IDateRange } from "@/components/table/types";

import { IDataAtention, Detail } from "@/app/api/invoices/invoices.interface";
import { exportInvoices, getAtentions } from "@/app/api/invoices/invoices.api";
import { TablePedidos } from "@/app/dashboard/atenciones/pedidos/table";
import { Badge } from "@/components/ui/badge";
import { AtentionDetails } from "./atention.details";

//colums
const columns: Column<IDataAtention>[] = [
  {
    header: "Atención",
    accessor: "id",
  },
  {
    header: "Descripción",
    accessor: "nombre",
    cell: (value: any) => value ?? "N/A",
  },
  {
    header: "Tipo",
    accessor: "nombre_tipo",
    filterable: true,
    sortable: true,
  },
  {
    header: "Fecha",
    accessor: "fecha",
    cell: (value) => new Date(value as string).toLocaleDateString(),
  },
  {
    header: "Nombre Profesional",
    accessor: "nombre_profesional",
    cell: (value) => value as string,
  },
  {
    header: "Nombre Paciente",
    accessor: "nombre_paciente",
    cell: (value) => value as string,
  },
  {
    header: "Rut Paciente",
    accessor: "rut_paciente",
    cell: (value) => value as string,
  },

  {
    header: "Abonado",
    accessor: "abonado",
    cell: (value) => numberFormat(value as number),
  },
  {
    header: "Total",
    accessor: "total",
    cell: (value) => numberFormat(value as number),
  },
  {
    header: "Folio Defontana",
    accessor: "id_defontana",
    cell: (value: any) => value ?? "N/A",
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
        case "pending":
          pillColor = "#AC954A";
          fontColor = "#ffffff";
          statusText = "Pendiente";
          iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
          break;
        case "completed":
          pillColor = "#67AA81";
          fontColor = "#ffffff";
          statusText = "Completado";
          iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
          break;
        case "failed":
          pillColor = "#67AA81";
          fontColor = "#ffffff";
          statusText = "Fallido";
          iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
          break;
        case "process":
          pillColor = "#6778aa";
          fontColor = "#ffffff";
          statusText = "Procesando";
          iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />;
          break;
        default:
          pillColor = "#FF6666";
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
  },
];

const formSchema = z.object({
  procedure: z.string(),
  status: z.string(),
});

export default function DataPedidos({ from, to }: Readonly<IDateRange>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pedidosData, setPedidosData] = useState<IDataAtention[]>([]);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAtention, setSelectedAtention] = useState< IDataAtention | null>(null);
  const [isAtentionDetails, setIsAtentionDetails] = useState(false);
  const [details, setDetails] = useState<Detail | null>(null);
  // Define los estados con tipo string | null
  const [procedure, setProcedure] = useState<string>("todos");
  const [status, setStatus] = useState<string>("todos");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedure,
      status,
    },
  });

  // state paginate
  const [pagination, setPagination] = useState({
    current: 1,
    totalPages: 0,
    pageSize: 10, // Definir el tamaño de la página aquí, si lo deseas
  });

  //cargar data desde endpoint
  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await getAtentions({
        page: pagination.current,
        pageSize: pagination.pageSize,
        fechaDesde: formatDate(new Date(from)),
        fechaHasta: formatDate(new Date(to)),
        search: searchTerm,
        status,
        procedure,
      });
      setPedidosData(data ?? []);
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

  //formatear fecha
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // cambio de pagina
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, current: page }));
    }
  };

  const clearFilters = () => {
    form.setValue("procedure", "todos");
    form.setValue("status", "todos");
    setStatus("todos");
    setProcedure("todos");
  };

  const applyFilters = () => {
    setIsDialogOpen(false);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchSales();
  };

  function mappingStatus(statusPayments: string) {
    let status = "Pendiente";
    if (statusPayments == "completed") {
      status = "Completado";
    }
    if (statusPayments == "failed") {
      status = "Failed";
    }
    return status;
  }

  function mappingProcedure(procedurePayments: string) {
    let procedure = "Consulta";
    if (procedurePayments == "Plan de tratamiento") {
      procedure = "Plan de tratamiento";
    }
    if (procedurePayments == "Procedimiento") {
      procedure = "Procedimiento";
    }
    return procedure;
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

  const closeProcedure = () => {
    form.setValue("procedure", "todos");
    setProcedure(() => "todos");
    setIsDialogOpen(false);
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
  };

  const ButtonComponent = (
    <Button
      onClick={() =>
        exportInvoices({
          fechaDesde: formatDate(new Date(from)),
          fechaHasta: formatDate(new Date(to)),
          status,
          procedure,
        })
      }
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar Excel
    </Button>
  );

  // Pagina componente
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

  // search componente
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

      {procedure !== "todos" && (
        <div className="flex items-center space-x-2">
          <small>Tipo: </small>
          <Badge variant="neutral">{mappingProcedure(procedure)}</Badge>
          <button
            onClick={closeProcedure}
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
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar Tipo</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setProcedure(value);
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="Consulta">Consulta</SelectItem>
                        <SelectItem value="Plan de tratamiento">
                          Plan de tratamiento
                        </SelectItem>
                        <SelectItem value="Procedimiento">
                          Procedimiento
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
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
                        <SelectItem value="failed">Fallido</SelectItem>
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

  // Manejar acciones para cada elemento de venta
  const handleActions = (sale: IDataAtention) => (
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
              setSelectedAtention(sale);
              setIsAtentionDetails(true);
            }}>
          Revisar Orden <ChevronRight className="ml-2 h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Ver documento", sale.details)}>
          Ver Documento
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => console.log("Reprocesar", sale)}
        >
          Reprocesar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Obtener datos de boleyas al montar de renderizar table
  useEffect(() => {
    fetchSales();
  }, [
    searchTerm, from, to, pagination.current, status, procedure, 
    //selectedAtention
  ]);


  return (
    <>
    <TablePedidos
      searchComponent={SearchComponent}
      paginatedComponent={PaginateComponent}
      filterComponent={FilterComponent}
      buttonComponent={ButtonComponent}
      data={pedidosData}
      actions={handleActions}
      columns={columns}
      isLoading={loading}
      error={fetchError ? fetchError.message : null}
    />
    <AtentionDetails
      isOpen={isAtentionDetails}
      onClose={() => {
        setIsAtentionDetails(false);
        setSelectedAtention(null);
        setDetails(null);
      }}
      atention={selectedAtention}
      />
    </>
  );
}
