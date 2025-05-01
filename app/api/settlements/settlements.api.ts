import axios from "axios";
import { saveAs } from "file-saver";

import { apiClient, BACKEND_URL } from "@/app/api/common/app.api";
import { IGetParamsSettlements } from "@/app/api/settlements/settlements.interface";

const getToken = () => {
  return localStorage.getItem("token");
};

const apiClientInstance = async () => {
  const instance = await apiClient();
  if (!instance) {
    throw new Error("Por favor inicie sesión nuevamente.");
  }
  return instance;
};

export async function getSettlements(params: IGetParamsSettlements) {
  try {
    const { page, pageSize, fechaDesde, fechaHasta, search, status } = params;
    // Construir los parámetros de consulta dinámicamente
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (pageSize) queryParams.append("limit", pageSize.toString());
    if (fechaDesde) queryParams.append("fechaDesde", fechaDesde);
    if (fechaHasta) queryParams.append("fechaHasta", fechaHasta);
    if (search) queryParams.append("search", search);
    if (status && status != "todos")
      queryParams.append("statusMIddleware", status);

    const response = await axios.get(
      `${BACKEND_URL}/settlements?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function exportSettlements(params: IGetParamsSettlements) {
  try {
    let { fechaDesde, fechaHasta, status } = params;

    const queryParams = new URLSearchParams();

    if (fechaDesde) queryParams.append("fechaDesde", fechaDesde);
    if (fechaHasta) queryParams.append("fechaHasta", fechaHasta);
    if (status && status != "todos")
      queryParams.append("statusMIddleware", status);

    const instance = await apiClientInstance();
    const { data } = await instance.post(
      `/settlements/export?${queryParams.toString()}`,
      {},
      {
        responseType: "blob", // Asegúrate de recibir la respuesta como un blob
      }
    );

    // Usamos file-saver para descargar el archivo directamente
    saveAs(data, "settlements.xlsx"); // 'settlements.xlsx' es el nombre del archivo descargado
  } catch (error) {
    console.error("Error al exportar los liquidaciones:", error);
    throw error;
  }
}
