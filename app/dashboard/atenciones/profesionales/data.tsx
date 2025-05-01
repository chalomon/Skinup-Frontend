"use client"
import { useEffect, useState } from "react"
import { Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { TableProfessionals } from "./table"
import { exportProfessional, getProfessionals, saveProfessional } from "@/app/api/professionals/professionals.api"
import { IDataProfessional, ProfessionalDto } from "@/app/api/professionals/interface/professionals.interface"
import UpdateProfesionalModal from "./modal/modal-form"

export default function DataProfessionals({ from, to }: Readonly<IDateRange>) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [professionalsData, setProfessionalsData] = useState<IDataProfessional[]>([])
  const [fetchError, setFetchError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<IDataProfessional | null>(null)
  const [professionals, setProfessionals] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "update">("create")
  // const [isDialogOpen, setIsDialogOpen] = useState(false)
  // const [errorMessage, setErrorMessage] = useState<string>("")
  // const [isRetryingAll, setIsRetryingAll] = useState(false)


  const [pagination, setPagination] = useState({
    current: 1,
    totalPages: 0,
    pageSize: 10, // Definir el tamaño de la página aquí, si lo deseas
  })

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const { data, totalPages } = await getProfessionals({
        page: pagination.current,
        pageSize: pagination.pageSize,
        fechaDesde: formatDate(new Date(from)),
        fechaHasta: formatDate(new Date(to)),
        search: searchTerm,
      })
      setProfessionalsData(data ?? [])
      setPagination((prev) => ({
        ...prev,
        totalPages,
      }))
    } catch (error) {
      setFetchError(
        error instanceof Error ? error : new Error("Error desconocido al obtener los profesionales y su información"),
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

  const handleModalSubmit = async (updateProfessional: ProfessionalDto ) => {
    setLoading(true);

    const data: IDataProfessional = {
      id: updateProfessional.id,
      nombre: updateProfessional.nombre,
      apellidos: updateProfessional.apellidos,
      rut: updateProfessional.rut,
      id_plan_cuenta: updateProfessional.id_plan_cuenta,
      plan_cuenta: updateProfessional.plan_cuenta,
      id_centro_negocios: updateProfessional.id_centro_negocios,
      centro_negocios: updateProfessional.centro_negocios,
      active: updateProfessional.active,
    }

    switch (updateProfessional.mode) {
      case "create":

      try {
        await saveProfessional(data)
        await fetchPayments();
      } catch (error) {
        console.error("Error al crear cliente", error)
        setFetchError(
          error instanceof Error ? error : new Error("Error desconocido al crear el cliente"),
        )
        
      }
        setIsModalOpen(false)
        break;
      case "update":
        //lógica
        break;
      default:
        break; 
    }
    // try {
    //   await PutAddressCustomer(updatedCustomer);
    //   toast.success(`Cliente actualizado exitosamente.`);
    // } catch (error) {
    //   console.error("Error al actualizar cliente", error);
    //   toast.error(
    //     "Error al actualizar cliente. Por favor, intente nuevamente."
    //   );
    // }
    setLoading(false);
  };
  // Obtener datos de ventas al montar el componente
  useEffect(() => {
    fetchPayments()
  }, [searchTerm, from, to, pagination.current])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, current: page }))
    }
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
  <>
    <Button
      onClick={
        () => {
          setSelectedProfessional(null);
          setIsModalOpen(true);
          setModalMode("create");
        }
      }
    >
      <Download className="mr-2 h-4 w-4" />
      Crear nuevo registro
    </Button>
    <Button
      onClick={() =>
        exportProfessional({
          fechaDesde: formatDate(new Date(from)),
          fechaHasta: formatDate(new Date(to)),
        })
      }
    >
      <Download className="mr-2 h-4 w-4" />
      Descargar Excel
    </Button>
  
  </>
  )

  const columns: Column<IDataProfessional>[] = [
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre", cell: (_value: unknown, row: IDataProfessional) => `${row.nombre} ${row.apellidos}` },
    { header: "Rut", accessor: "rut" },
    { header: "ID Cuenta", accessor: "id_plan_cuenta" },
    { header: "Nombre Cuenta", accessor: "plan_cuenta" },
    { header: "ID Centro de negocios", accessor: "id_centro_negocios" },
    { header: "Nombre centro de negocios", accessor: "centro_negocios" },
  ]

  const handleActions = (professional: IDataProfessional) => (
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
              setSelectedProfessional(professional)
              setIsModalOpen(true)
            }}
          >
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setSelectedProfessional(professional)
              setIsModalOpen(true)
              setModalMode("update")
            }}
            className="text-red-600"
          >
            Eliminar
          </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    
    <>
      <TableProfessionals
        searchComponent={SearchComponent}
        paginatedComponent={PaginateComponent}
        buttonComponent={ButtonComponent}
        actions={handleActions}
        data={professionalsData}
        columns={columns}
        isLoading={loading}
        error={fetchError ? fetchError.message : null}
      />

      <UpdateProfesionalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        professional={selectedProfessional}
        onSubmit={handleModalSubmit}
        loading={loading}
        mode={modalMode}
      />
    </>
  )
}
