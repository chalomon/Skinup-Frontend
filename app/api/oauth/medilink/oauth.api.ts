import { apiClient } from "@/app/api/common/app.api";

import { ICreateCredencial,IresponseCredencial } from "@/app/api/oauth/medilink/interface/Icreate";

const apiClientInstance = async () => {
  const instance = await apiClient(); // Esperar a que se resuelva la promesa
  // Comprobar si apiClientInstance es null antes de intentar hacer la solicitud
  if (!instance) {
    throw new Error(
      "No se pudo crear una instancia de apiClient, por favor inicie sesión nuevamente."
    );
  }
  return instance;
};

//guadar informacion en base de datos
export async function upsertOauthCredential(
  body: ICreateCredencial
): Promise<IresponseCredencial> {
  const instance = await apiClientInstance();
  const { data } = await instance.post<IresponseCredencial>(
    "medilink/credential",
    body
  );
  return data;
}

//listar informacion de credenciales
export async function GetCredential(): Promise<
IresponseCredencial
> {
  const instance = await apiClientInstance();
  const { data } = await instance.get<IresponseCredencial>(
    "medilink/credential"
  );
  return data;
}





