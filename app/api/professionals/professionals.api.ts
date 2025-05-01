import { saveAs } from "file-saver";
import { apiClient, BACKEND_URL } from "@/app/api/common/app.api";
import { IDataMedilinkProfessional, IDataProfessional, IGetParamsProfessionals } from "./interface/professionals.interface";
import { CentrosNegocio } from "./interface/business.center.interface";
import { AccountItem } from "./interface/account.plan.interface";

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
export async function getProfessionals(params: IGetParamsProfessionals) {
  try {
    const { page, pageSize, fechaDesde, fechaHasta, search } =
      params;
    // Construir los parámetros de consulta dinámicamente
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (pageSize) queryParams.append("limit", pageSize.toString());
    if (fechaDesde) queryParams.append("fechaDesde", fechaDesde);
    if (fechaHasta) queryParams.append("fechaHasta", fechaHasta);
    if (search) queryParams.append("search", search);
    const instance = await apiClientInstance();
    const url = `${BACKEND_URL}/professionals`;
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

export async function saveProfessional(data: IDataProfessional) {
  try {
    const instance = await apiClientInstance();
    const url = `${BACKEND_URL}/professionals`;
    const response = await instance.post(
      url,
      data,
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


//External data
export async function getMedilinkProfessionals(): Promise<IDataMedilinkProfessional[]> {
  try {
    const instance = await apiClientInstance();
    const url = `${BACKEND_URL}/medilink/professionals`;
    const response = await instance.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data as unknown as IDataMedilinkProfessional[];
  } catch (error) {
    console.log(error);
    return error as unknown as IDataMedilinkProfessional[];
  }
}

export async function getBusinessCenters(): Promise<CentrosNegocio[]> {
  try {
    const instance = await apiClientInstance();
    const url = `${BACKEND_URL}/defontana/voucher/getBusinessCenter`;
    const response = await instance.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.centrosNegocios as unknown as CentrosNegocio[];
  } catch (error) {
    console.log(error);
    return error as unknown as CentrosNegocio[];
  }
}

export async function getAccountPlans(): Promise<AccountItem[]> {
  try {
    const instance = await apiClientInstance();
    const url = `${BACKEND_URL}/defontana/voucher/getAccountPlan`;
    const response = await instance.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data.items as unknown as AccountItem[];
  } catch (error) {
    console.log(error);
    return error as unknown as AccountItem[];
  }
}


//Export data
export async function exportProfessional(params: IGetParamsProfessionals) {
  try {
    const { page, pageSize, fechaDesde, fechaHasta, search } =
      params;
    // Construir los parámetros de consulta dinámicamente
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (pageSize) queryParams.append("limit", pageSize.toString());
    if (fechaDesde) queryParams.append("fechaDesde", fechaDesde);
    if (fechaHasta) queryParams.append("fechaHasta", fechaHasta);
    if (search) queryParams.append("search", search);

    const instance = await apiClientInstance();
    const { data } = await instance.post(
      `/professionals/export?${queryParams.toString()}`,
      {},
      {
        responseType: "blob", // Asegúrate de recibir la respuesta como un blob
      }
    );

    // Usamos file-saver para descargar el archivo directamente
    saveAs(data, "professionals.xlsx"); // 'payments.xlsx' es el nombre del archivo descargado
  } catch (error) {
    console.error("Error al exportar los pagos:", error);
    throw error;
  }
}


//Format functions

export async function flattenCentros(centros: CentrosNegocio[]): Promise<CentrosNegocio[]> {
  let result: CentrosNegocio[] = [];

  for (const centro of centros) {
    // Copiamos el objeto sin los descendientes
    const { descendientes, ...rest } = centro;
    result.push({ ...rest, descendientes: null });

    // Si tiene descendientes, llamamos recursivamente
    if (descendientes && descendientes.length > 0) {
      result = result.concat(await flattenCentros(descendientes));
    }
  }

  return result;
}

export async function flattenPlans(plans: AccountItem[]): Promise<AccountItem[]> {
  let result: AccountItem[] = [];

  for (const plan of plans) {
    // Copiamos el objeto sin los descendientes
    const { childs, ...rest } = plan;
    result.push({ ...rest, childs: null });

    // Si tiene descendientes, llamamos recursivamente
    if (childs && childs.length > 0) {
      result = result.concat(await flattenPlans(childs));
    }
  }

  return result;
}

