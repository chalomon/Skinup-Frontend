"use client";
import React, { useState } from "react";


//context medilink
import { UseContext } from "@/app/dashboard/configuraciones/medilink/context";
//componentes medilink
import TableMedilinkConfig from "@/app/dashboard/configuraciones/medilink/table";
import DialogMedilink from "@/app/dashboard/configuraciones/medilink/dialog";

const PageMedilink: React.FC = () => {
  const { data } = UseContext();
  const [btnLoading, setBtnLoading] = useState<boolean>(false); // laoding botones


  return (
    <div className="w-full">
      {/* seccion Tables*/}
      {data && <TableMedilinkConfig />}
      {/* seccion botones */}
      <div className="flex gap-10">
        {/* crear credenciales */}
        {!data && (
          <DialogMedilink
            title={"Crear credenciales"}
            textBtn={"Crear credenciales"}
          />
        )}
        {/* editar credenciales */}
        {data && (
          <DialogMedilink
            title={"Editar credenciales"}
            textBtn={"Editar credenciales"}
          />
        )}

      </div>
    </div>
  );
}
export default PageMedilink;