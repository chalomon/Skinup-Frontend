import { saveAs } from "file-saver";

import { apiClient, BACKEND_URL } from "@/app/api/common/app.api";
import { IGetParamsPayments } from "@/app/api/payments/payments.interface";

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
export async function getPayments(params: IGetParamsPayments) {
  try {
    const { page, pageSize, fechaDesde, fechaHasta, search, medio_pago, status } =
      params;
    // Construir los parámetros de consulta dinámicamente
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (pageSize) queryParams.append("limit", pageSize.toString());
    if (fechaDesde) queryParams.append("fechaDesde", fechaDesde);
    if (fechaHasta) queryParams.append("fechaHasta", fechaHasta);
    if (search) queryParams.append("search", search);
    if (medio_pago && medio_pago != "todos")
      queryParams.append("medio_pago", medio_pago);
    if (status && status != "todos")
      queryParams.append("statusMIddleware", status);
    const instance = await apiClientInstance();
    const url = `${BACKEND_URL}/payments?${queryParams.toString()}`;
    console.log(url)
    const response = await instance.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function retryPayments(id: string = "") {
  try {
    const instance = await apiClientInstance();
    await instance.get(
      `${BACKEND_URL}/payments/retry${id}`,
    );
    return true;
  } catch (error) {
    console.error("Error al reintentar el documento:", error);
    return false;
  }
}

export async function exportPayments(params: IGetParamsPayments) {
  try {
    const { page, pageSize, fechaDesde, fechaHasta, search, medio_pago } =
      params;
    // Construir los parámetros de consulta dinámicamente
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (pageSize) queryParams.append("limit", pageSize.toString());
    if (fechaDesde) queryParams.append("fechaDesde", fechaDesde);
    if (fechaHasta) queryParams.append("fechaHasta", fechaHasta);
    if (search) queryParams.append("search", search);
    if (medio_pago && medio_pago != "todos")
      queryParams.append("medio_pago", medio_pago);

    const instance = await apiClientInstance();
    const { data } = await instance.post(
      `/payments/export?${queryParams.toString()}`,
      {},
      {
        responseType: "blob", // Asegúrate de recibir la respuesta como un blob
      }
    );

    // Usamos file-saver para descargar el archivo directamente
    saveAs(data, "payments.xlsx"); // 'payments.xlsx' es el nombre del archivo descargado
  } catch (error) {
    console.error("Error al exportar los pagos:", error);
    throw error;
  }
}
