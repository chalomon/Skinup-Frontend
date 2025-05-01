import { apiClient } from "@/app/api/common/app.api";

import { ICrateCredentialResponse,ICreateCredencialDto } from "@/app/api/oauth/defontana/interface/Icreate";

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
  body: ICreateCredencialDto
): Promise<ICrateCredentialResponse> {
  const instance = await apiClientInstance();
  const { data } = await instance.post<ICrateCredentialResponse>(
    "defontana/credential",
    body
  );
  return data;
}

//listar informacion de credenciales multivende
export async function GetWithOutPassowordCredential(): Promise<
  ICrateCredentialResponse
> {
  const instance = await apiClientInstance();
  const { data } = await instance.get<ICrateCredentialResponse>(
    "defontana/credential"
  );
  return data;
}

export async function postValidCredential(): Promise<
  ICrateCredentialResponse
> {
  const instance = await apiClientInstance();
  const { data } = await instance.post<ICrateCredentialResponse>(
    "defontana/credential/valid"
  );
  return data;
}



