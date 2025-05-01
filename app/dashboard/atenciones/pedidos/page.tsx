import DataPedidos from "@/app/dashboard/atenciones/pedidos/data";

export default function PagePedidos({from, to}:any) {
  return <DataPedidos from={from} to={to} />;
}