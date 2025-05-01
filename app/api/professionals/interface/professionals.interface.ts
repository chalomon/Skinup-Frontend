export interface IGetParamsProfessionals {
  page?: number;
  pageSize?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
}

export interface IresponseProfessionals{
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  data: IDataProfessional[];
}

export interface IDataProfessional {
  id: string;
  rut: string;
  nombre: string;
  apellidos: string;
  id_plan_cuenta?: string;
  plan_cuenta?: string;
  id_centro_negocios?: string;
  centro_negocios?: string;
  active?: boolean;
}

export interface ProfessionalDto extends IDataProfessional {
  mode: "create" | "update";
 }


//Profesionales desde medilink pasados por el middleware
export interface IResponseProfessional {
  data: IDataMedilinkProfessional[]
}

export interface Links {
  current: string
  next?: string
  prev?: string
}

export interface IDataMedilinkProfessional {
  id: string
  rut: string
  nombre: string
  apellidos: string
  celular: string
  telefono: string
  ciudad: string
  comuna: string
  direccion: string
  email: string
  id_especialidad: number
  especialidad: string
  agenda_online: number
  intervalo: number
  habilitado: number
  links: Link[]
}

export interface Link {
  rel: string
  href: string
  method: string
}
