export interface IGetParamsInvoices {
  page?: number;
  pageSize?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
  status?: string;
  procedure?: string;
}

export interface IDataAtention {
  _id: string;
  id: number;
  id_defontana: string;
  nombre: string;
  id_tipo: number;
  nombre_tipo: string;
  id_convenio: number;
  nombre_convenio: string;
  fecha: Date;
  finalizado: number;
  bloqueado: number;
  id_paciente: number;
  rut_paciente: string;
  nombre_paciente: string;
  id_profesional: number;
  rut_profesional: string;
  nombre_profesional: string;
  id_sucursal: number;
  nombre_sucursal: string;
  total: number;
  abonado: number;
  abono_libre: number;
  asignado_realizado: number;
  asignado_sin_realizar: number;
  total_realizado: number;
  deuda: number;
  details: Detail[]
  status: string;
}

export interface Detail {
  id: number
  nombre: string
  codigo: string
  id_arancel: number
  nombre_arancel: string
  id_categoria: number
  nombre_categoria: string
  id_tipo: number
  tipo: string
  precio: number
  habilitado: number
  links: Link[]
}

export interface Link {
  rel: string
  href: string
  method: string
}

export interface IResponseAtention {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  data: IDataAtention[];
}

export interface AtentionParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  filters?: Record<string, string[]>;
}
