export interface IGetParamsSettlements {
  page?: number;
  pageSize?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
  status?: string;
}

export interface IDataSettlement {
  id: string;
  id_profesional: string;
  nombre: string;
  rut: string;
  id_sucursal: number;
  fecha_inicio: string;
  fecha_termino: string;
  monto: number;
  activa: number;
  status: string;
  details?: IDetailSettlement[];
}

export interface IDetailSettlement {
  id: string;
  id_liquidacion: string;
  id_prestacion: string;
  nombre_prestacion: string;
  id_tratamiento: string;
  nombre_tratamiento: string;
  id_paciente: number;
  nombre_paciente: string;
  fecha: string;
  pieza: string;
  monto: number;
  medio_pago: string;
  total: number;
  links: Link[];
}

export interface Link {
  rel: string;
  href: string;
  method: string;
}
