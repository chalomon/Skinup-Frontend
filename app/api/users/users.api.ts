import { User, UserDto, UsersResponse } from "@/app/api/users/user.interface";
import { apiClient } from "@/app/api/common/app.api";

// Función que obtiene una instancia del cliente de API.
// Si no se puede obtener, lanza un error solicitando al usuario que inicie sesión nuevamente.
const apiClientInstance = async () => {
  const instance = await apiClient();
  if (!instance) {
    throw new Error("Por favor inicie sesión nuevamente.");
  }
  return instance;
};

// Función para obtener todos los usuarios.
// Realiza una solicitud GET a la API y mapea los datos de la respuesta a la estructura de usuario esperada.
export async function getUsers(): Promise<User[]> {
  try {
    const instance = await apiClientInstance();
    const { data } = await instance.get<UsersResponse[]>("/users");
    return data.map(mappedData);
  } catch (error) {
    throw error;
  }
}

// Función para crear un nuevo usuario.
// Realiza una solicitud POST a la API con los datos proporcionados y retorna el usuario creado.
export async function createUser(newUser: UserDto): Promise<User> {
  try {
    const instance = await apiClientInstance();
    const { id, ...payload } = newUser; // Elimina el ID del objeto ya que no es necesario al crear un usuario.
    const { data } = await instance.post<UsersResponse>("/auth/user", payload);
    return mappedData(data);
  } catch (error) {
    throw error;
  }
}

// Función para eliminar un usuario.
// Realiza una solicitud DELETE a la API utilizando el ID del usuario.
export async function deleteUser(id: string): Promise<string> {
  try {
    const apiClient = await apiClientInstance();
    const { data } = await apiClient.delete<{ message: string }>(
      `/users/${id}`
    );
    return data.message;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Función para actualizar un usuario existente.
// Realiza una solicitud PUT a la API con los datos actualizados del usuario.
export async function updateUser(updatedUser: UserDto): Promise<User> {
  try {
    const apiClient = await apiClientInstance();
    const { id, ...payload } = updatedUser; // Elimina el ID del objeto para procesar los datos.

    // Elimina el campo de contraseña si no se proporciona.
    if (!payload.password) {
      delete payload.password;
    }

    // Valida que el ID del usuario esté presente.
    if (!id) {
      throw new Error("El ID del usuario no puede estar vacío.");
    }

    const { data } = await apiClient.put<UsersResponse>(
      `/users/${id}`,
      payload
    );
    return mappedData(data);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function changePassword(newPassword: string, token: string) {
  try {
    const apiClient = await apiClientInstance();
    const { data } = await apiClient.post<any>("/new-password", {
      newPassword,
      token,
    });

    return data;
  } catch (error) {
    console.error("Error change password:", error);
    throw error;
  }
}

// Función para mapear los datos de la respuesta de la API a la estructura de usuario.
// Se asegura de manejar distintos formatos de ID y establece un estado legible para los usuarios.
const mappedData = (data: UsersResponse): User => ({
  id: data._id ?? data.id ?? "",
  name: data.name,
  email: data.email,
  rol: data.rol,
  lastLogin: data.lastLogin,
  status: data.status ? "Activo" : "Inactivo",
});
