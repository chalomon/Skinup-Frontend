"use client"
import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BadgeCheck, ChevronsUpDown, Component, Download, Search, Loader } from "lucide-react"

import { numberFormat } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Pill } from "@/components/ui/pill"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import type { Column, IDateRange } from "@/components/table/types"
import type { IDataPayment } from "@/app/api/payments/payments.interface"
import { exportPayments, getPayments, retryPayments } from "@/app/api/payments/payments.api"
import { TablePayments } from "@/app/dashboard/atenciones/pagos/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const formSchema = z.object({
  medio_pago: z.string(),
  status: z.string(),
})

export default function DataPayments({ from, to }: Readonly<IDateRange>) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [paymentsData, setPaymentsData] = useState<IDataPayment[]>([])
  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [medioPago, setMedioPago] = useState<string>("todos")
  const [status, setStatus] = useState<string>("todos")
  const [selectedPayment, setSelectedPayment] = useState<IDataPayment | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isRetryingAll, setIsRetryingAll] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medio_pago: medioPago,
      status,
    },
  })

  const [pagination, setPagination] = useState({
    current: 1,
    totalPages: 0,
    pageSize: 10, // Definir el tamaño de la página aquí, si lo deseas
  })

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const { data, totalPages } = await getPayments({
        page: pagination.current,
        pageSize: pagination.pageSize,
        fechaDesde: formatDate(new Date(from)),
        fechaHasta: formatDate(new Date(to)),
        search: searchTerm,
        medio_pago: medioPago,
        status,
      })
      setPaymentsData(data ?? [])
      setPagination((prev) => ({
        ...prev,
        totalPages,
      }))
    } catch (error) {
      setFetchError(
        error instanceof Error ? error : new Error("Error desconocido al obtener las Atentiones desde medilink"),
      )
    }
    setLoading(false)
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  // Obtener datos de ventas al montar el componente
  useEffect(() => {
    fetchPayments()
  }, [searchTerm, from, to, pagination.current, medioPago, status])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, current: page }))
    }
  }

  const clearFilters = () => {
    form.setValue("medio_pago", "todos")
    form.setValue("status", "todos")
    setMedioPago("todos")
    setStatus("todos")
  }

  const applyFilters = () => {
    setIsDialogOpen(false)
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }))
    fetchPayments()
  }

  function mappingMedioPago(medioPagoPayments: string) {
    let medioPago = "Tarjeta de débito"
    if (medioPagoPayments == "Tarjeta de crédito") {
      medioPago = "Tarjeta de crédito"
    }
    if (medioPagoPayments == "Shopify") {
      medioPago = "Shopify"
    }
    if (medioPagoPayments == "Efectivo") {
      medioPago = "Efectivo"
    }
    return medioPago
  }
  const closemedioPago = () => {
    form.setValue("medio_pago", "todos")
    setMedioPago(() => "todos")
    setIsDialogOpen(false)
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }))
  }

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

      {medioPago !== "todos" && (
        <div className="flex items-center space-x-2">
          <small>Filtro: </small>
          <Badge variant="neutral">{mappingMedioPago(medioPago)}</Badge>
          <button
            onClick={closemedioPago}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )

  const PaginateComponent = (
    <Pagination className="justify-end mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageChange(pagination.current - 1)} />
        </PaginationItem>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
          .filter((pageNumber) => {
            if (pagination.totalPages <= 9) return true
            if (pagination.current <= 5) return pageNumber <= 9 || pageNumber === pagination.totalPages
            if (pagination.current >= pagination.totalPages - 4)
              return pageNumber >= pagination.totalPages - 8 || pageNumber === 1
            return (
              pageNumber === 1 ||
              pageNumber === pagination.totalPages ||
              (pageNumber >= pagination.current - 4 && pageNumber <= pagination.current + 4)
            )
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
          <PaginationNext onClick={() => handlePageChange(pagination.current + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )

  const ButtonComponent = (
    <Button
      onClick={() =>
        exportPayments({
          fechaDesde: formatDate(new Date(from)),
          fechaHasta: formatDate(new Date(to)),
          medio_pago: medioPago,
          status,
        })
      }
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar Excel
    </Button>
  )

  const retryButtonComponent = (
    <Button
      className="bg-[#FF5757] text-white hover:bg-[#e04e4e] relative"
      onClick={() => {
        setIsRetryingAll(true)
        retryPayments()
        toast.success("Reintentando pagos...")

        setTimeout(() => {
          setIsRetryingAll(false)
        }, 5000)
      }}
      disabled={isRetryingAll}
    >
      {isRetryingAll ? (
        <div className="flex items-center justify-center">
          <Loader className="h-4 w-4 animate-spin transition-opacity duration-200 ease-in-out" />
          <span className="ml-2 opacity-70">Procesando...</span>
        </div>
      ) : (
        <>
          <BadgeCheck className="mr-2 h-4 w-4" />
          Reintentar Errores
        </>
      )}
    </Button>
  )

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
                name="medio_pago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar Medio de Pago</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setMedioPago(value)
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="Tarjeta de débito">Tarjeta de débito</SelectItem>
                        <SelectItem value="Tarjeta de crédito">Tarjeta de crédito</SelectItem>
                        <SelectItem value="Shopify">Shopify</SelectItem>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seleccionar Estado</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setStatus(value)
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="process">En proceso</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="blocked">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </Form>
            <div className="flex justify-between mt-4">
              <Button variant="link" onClick={clearFilters} className="text-destructive">
                Quitar filtros
              </Button>
              <Button onClick={applyFilters}>Aplicar filtros</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  const columns: Column<IDataPayment>[] = [
    { header: "ID", accessor: "id" },
    {
      header: "Atención",
      accessor: "id_atencion",
      cell: (value: any) => value ?? "N/A",
    },
    {
      header: "ID Caja",
      accessor: "id_caja",
    },
    { header: "Nombre", accessor: "nombre_pagador" },
    { header: "Medio de Pago", accessor: "medio_pago" },
    {
      header: "Total",
      accessor: "monto_pago",
      cell: (value) => numberFormat(value as number),
    },
    {
      header: "Fecha",
      accessor: "fecha_recepcion",
      cell: (value: any) => value ?? "N/A",
    },
    {
      header: "Estado",
      accessor: "status",
      cell: (value, row) => {
        let pillColor
        let fontColor
        let iconStatus
        let statusText

        switch (value) {
          case "pending":
            pillColor = "#AC954A"
            fontColor = "#ffffff"
            statusText = "Pendiente"
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />
            break
          case "completed":
            pillColor = "#67AA81"
            fontColor = "#ffffff"
            statusText = "Completado"
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />
            break
          case "error":
            pillColor = "#FF6666"
            fontColor = "#ffffff"
            statusText = "Error"
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />
            break
          case "process":
            pillColor = "#6778aa"
            fontColor = "#ffffff"
            statusText = "Procesando"
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />
            break
          case "blocked":
            pillColor = "#FF6666"
            fontColor = "#ffffff"
            statusText = "Bloqueado"
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />
            break
          default:
            pillColor = "#FF6666"
            fontColor = "#ffffff"
            statusText = "Pendiente"
            iconStatus = <Component size={21} color="#ffffff" strokeWidth={2} />
            break
        }

        return (
          <Pill
            color={fontColor}
            text={statusText}
            backgroundColor={pillColor}
            iconChip={iconStatus}
            justifyContent="center"
          />
        )
      },
    },
  ]

  const handleActions = (payment: IDataPayment) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          ...
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {payment.status === "error" ? (
          <DropdownMenuItem
            onClick={() => {
              setSelectedPayment(payment)
              setErrorMessage(payment.error || "Error en el procesamiento del pago")
              setIsModalOpen(true)
            }}
            className="text-red-600"
          >
            Reprocesar
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              toast.info("Solo se pueden reprocesar pagos con estado de error")
            }}
            className="text-gray-400"
          >
            Reprocesar (No disponible)
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <TablePayments
        searchComponent={SearchComponent}
        paginatedComponent={PaginateComponent}
        filterComponent={FilterComponent}
        buttonComponent={ButtonComponent}
        retryButtonComponent={retryButtonComponent}
        actions={handleActions}
        data={paymentsData}
        columns={columns}
        isLoading={loading}
        error={fetchError ? fetchError.message : null}
      />
      <Dialog open={isModalOpen && selectedPayment?.status === "error"} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Error de Procesamiento</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">{errorMessage}</div>
            <p className="text-center font-medium">¿Seguro que desea reprocesar este pago?</p>
          </div>
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#FF5757] text-white hover:bg-[#e04e4e]"
              onClick={() => {
                if (selectedPayment) {
                  retryPayments(`/${selectedPayment.id}`)
                  toast.success("Reprocesando pago...")
                  setIsModalOpen(false)
                }
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
