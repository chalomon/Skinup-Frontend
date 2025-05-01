"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

//context defontana
import { UseContext } from "@/app/dashboard/configuraciones/defontana/context";
//componentes defontana
import TableDefontanaConfig from "@/app/dashboard/configuraciones/defontana/table";
import DialogMDefontana from "@/app/dashboard/configuraciones/defontana/dialog";

import { postValidCredential } from "@/app/api/oauth/defontana/oauth.api";

const PageDefontana: React.FC = () => {
  const { data ,upContext} = UseContext();
  const [btnLoading, setBtnLoading] = useState<boolean>(false); // laoding botones

  const handleValidCredential = async () => {
    setBtnLoading(true);
    try {
      //generar token
      const response = await postValidCredential();
      //valida respuesta de servicio refresh token
      if (response && data) {
        data.configIsValid =true;
        upContext(data);
        toast.success("credenciales verificadas correctamente defontana");
      } else {
        toast.error(
          "error datos incorrectos favor de volver a configurar aplicación defontana"
        );
      }
    } catch (error) {
      toast.error(
        "error datos incorrectos favor de volver a configurar aplicación defontana"
      );
    }
    setTimeout(() => {
      setBtnLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* seccion Tables*/}
      {data && <TableDefontanaConfig />}
      {/* seccion botones */}
      <div className="flex gap-10">
        {/* crear credenciales */}
        {!data && (
          <DialogMDefontana
            title={"Crear credenciales"}
            textBtn={"Crear credenciales"}
          />
        )}
        {/* editar credenciales */}
        {data && (
          <DialogMDefontana
            title={"Editar credenciales"}
            textBtn={"Editar credenciales"}
          />
        )}

        {data && (
          <Button
            type="button"
            disabled={btnLoading}
            onClick={handleValidCredential}
          >
            Verificar credenciales {btnLoading && <Spinner size="sm" />}
          </Button>
        )}
      </div>
    </div>
  );
}
export default PageDefontana;

