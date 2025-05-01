export interface IGetParamsPayments {
  page?: number;
  pageSize?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
  medio_pago?: string;
  status?: string;
}

export interface IresponsePayment {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  data: IDataPayment[];
}

export interface IDataPayment {
  _id: string;
  id: number;
  id_atencion: string;
  id_pagador: number;
  nombre_pagador: string;
  tipo_pagador: string;
  id_paciente: number;
  nombre_paciente: string;
  monto_pago: number;
  id_medio_pago: number;
  medio_pago: string;
  nombre_banco: string;
  fecha_recepcion: string;
  fecha_vencimiento: string;
  numero_referencia: string;
  fecha_creacion: string;
  id_caja: number;
  id_sucursal: number;
  nombre_sucursal: string;
  links: Link[];
  status?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Link {
  rel: string;
  href: string;
  method: string;
}
