"use client";
import { useState, useEffect } from "react"; // Hooks de React para gestionar estado y efectos secundarios.

import { toast } from "sonner"; // Biblioteca para mostrar alertas y notificaciones.
import { BadgeCheck } from "lucide-react"; // libreria de inconos
// Importación de componentes de diseño (ShadCN).
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import UserForm from "@/app/dashboard/usuarios/components/user.form";
import UserActionsDropdown from "@/app/dashboard/usuarios/components/dropdown.menu";

// Funciones API para gestionar usuarios.
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/app/api/users/users.api";
import { UserDto, User } from "@/app/api/users/user.interface";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios.
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Controla la visibilidad del modal de creación.
  const [editingUser, setEditingUser] = useState<User | null>(null); // Usuario que se está editando actualmente.
  const [isLoading, setIsLoading] = useState(false); // Indicador de si los datos están cargando.
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para filtrar usuarios.
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controla la visibilidad del diálogo de confirmación de eliminación.
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // Usuario que se está eliminando actualmente.
  const [currentPage, setCurrentPage] = useState(1); // Página actual.
  const [usersPerPage] = useState(10); // Usuarios por página.

  // Filtra los usuarios según el término de búsqueda ingresado.
  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcula el número total de páginas con base en los usuarios filtrados.
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Calcula los usuarios actuales de acuerdo con la página actual y el filtrado.
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Cambia la página actual.
  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Crea un nuevo usuario.
  const handleCreateUser = async (newUser: UserDto) => {
    try {
      const createdUser = await createUser(newUser); // Llama a la API para crear un usuario.
      setUsers((prevUsers: User[]) => [...prevUsers, createdUser]); // Añade el nuevo usuario a la lista.
      toast.success(`Usuario ${createdUser.name} creado exitosamente.`); // Muestra una notificación de éxito.
      setIsCreateModalOpen(false); // Cierra el modal de creación.
    } catch (error) {
      console.error("Error al crear usuario", error);
      toast.error("Error al crear usuario. Por favor, intente nuevamente."); // Notificación de error.
    }
  };

  // Actualiza los datos de un usuario existente.
  const handleUpdateUser = async (updatedUser: UserDto) => {
    try {
      const updated = await updateUser(updatedUser); // Llama a la API para actualizar un usuario.
      setUsers((prevUsers: User[]) =>
        prevUsers.map((user) => (user.id === updated.id ? updated : user))
      );
      toast.success(`Usuario ${updated.name} actualizado exitosamente.`);
      setEditingUser(null); // Limpia el estado de edición.
    } catch (error) {
      console.error("Error al actualizar usuario", error);
      toast.error(
        "Error al actualizar usuario. Por favor, intente nuevamente."
      );
    }
  };

  // Elimina un usuario por su ID.
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id); // Llama a la API para eliminar un usuario.
      setUsers((prevUsers: User[]) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      ); // Remueve el usuario de la lista.
      toast.success("Usuario eliminado exitosamente.");
      setIsDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error al eliminar usuario", error);
      toast.error("Error al eliminar usuario. Por favor, intente nuevamente.");
    }
  };

  // Efecto que carga los usuarios al montar el componente.
  const fetchUsers = async () => {
    setIsLoading(true); // Muestra el indicador de carga.
    try {
      const data = await getUsers(); // Obtiene los usuarios desde la API.
      setUsers(data); // Actualiza el estado con los usuarios obtenidos.
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error(
        "Error al obtener usuarios. Por favor, inicie sesión nuevamente."
      );
    } finally {
      setIsLoading(false); // Oculta el indicador de carga.
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold mx-3">Usuarios</h2>
        <Button
          className="bg-button-black text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <BadgeCheck /> Crear Usuario
        </Button>
      </div>

      {/* Tarjeta que contiene la tabla y las funcionalidades. */}
      <Card className="p-6">
        {/* Barra de búsqueda */}
        <div className="my-3">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Tabla de usuarios */}
        <Card>
          <Table className="w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableCell className="font-medium">Nombre</TableCell>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell className="font-medium">Rol</TableCell>
                <TableCell className="font-medium">Último acceso</TableCell>
                <TableCell className="font-medium">Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.rol}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <UserActionsDropdown
                      onEdit={() => setEditingUser(user)}
                      onDelete={() => {
                        setUserToDelete(user);
                        setIsDialogOpen(true);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        {/* Paginación */}
        <Pagination>
          <PaginationContent className="flex justify-between w-full">
            <PaginationItem className="text-muted-foreground">
              Página {currentPage} de {totalPages}
            </PaginationItem>
            <div className="flex gap-2 my-1 text-muted-foreground">
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pageNumber) => {
                  if (totalPages <= 7) return true;
                  if (currentPage <= 4)
                    return pageNumber <= 5 || pageNumber === totalPages;
                  if (currentPage >= totalPages - 3)
                    return pageNumber >= totalPages - 4 || pageNumber === 1;
                  return (
                    (pageNumber >= currentPage - 2 &&
                      pageNumber <= currentPage + 2) ||
                    pageNumber === 1 ||
                    pageNumber === totalPages
                  );
                })
                .map((pageNumber, index, array) => (
                  <PaginationItem key={`page-${pageNumber}`}>
                    {index > 0 && pageNumber !== array[index - 1] + 1 && (
                      <PaginationEllipsis key={`ellipsis-${pageNumber}`} />
                    )}
                    <PaginationLink
                      key={`link-${pageNumber}`}
                      onClick={() => onPageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </div>
          </PaginationContent>
        </Pagination>

        {/* Modal para crear usuario */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Usuario</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleCreateUser} />
          </DialogContent>
        </Dialog>

        {/* Modal para confirmar eliminación */}
        <div className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="Flex justify-items-center">
              <DialogHeader>
                <DialogTitle>
                  ¿Estás seguro de eliminar este usuario?{" "}
                </DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground">
                Puedes editar cualquier campo del usuario.
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  className="bg-button-red text-white"
                  onClick={handleDeleteUser}
                >
                  <BadgeCheck />
                  Eliminar
                </Button>
                <Button
                  className="bg-button-gray text-white"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <BadgeCheck />
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Modal para editar usuario */}
        <Dialog
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <UserForm user={editingUser} onSubmit={handleUpdateUser} />
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
