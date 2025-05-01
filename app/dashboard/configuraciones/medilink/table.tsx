
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { UseContext } from "@/app/dashboard/configuraciones/medilink/context";

const TableMedilink = () => {
  const { data } = UseContext();
  return (
    <Table>
      <TableCaption>Configuración Medilink</TableCaption>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">URL API</TableCell>
          <TableCell>{data?.urlApi}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">appName</TableCell>
          <TableCell>{data?.appName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">idClient</TableCell>
          <TableCell>{data?.idClient}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">token</TableCell>
          <TableCell>{"**********"}</TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell className="font-medium uppercase">F.Creación</TableCell>
          <TableCell>{data?.createdAt}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">F.Actualización</TableCell>
          <TableCell>{data?.updatedAt}</TableCell>
        </TableRow>
      </TableBody>
    </Table >)
}

export default TableMedilink;