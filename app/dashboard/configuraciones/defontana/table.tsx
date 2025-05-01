
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UseContext } from "@/app/dashboard/configuraciones/defontana/context";


const TableDefontana = () => {
  const { data } = UseContext();
  return (
    <Table>
      <TableCaption>Configuración Defontana</TableCaption>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">URL API</TableCell>
          <TableCell>{data?.urlApi}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">Cliente</TableCell>
          <TableCell>{data?.client}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">Compañia</TableCell>
          <TableCell>{data?.company}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">Usuario</TableCell>
          <TableCell>{data?.user}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">password</TableCell>
          <TableCell>{"**********"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium uppercase">Verificación</TableCell>
          <TableCell>
            {data?.configIsValid ? <Badge variant={"success"}>valida</Badge> : <Badge variant={"destructive"}>Pendiente</Badge>}
          </TableCell>
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

export default TableDefontana;