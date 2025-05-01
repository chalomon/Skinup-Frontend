"use client";
import { z } from "zod"
import React, { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";

import { ErrorResponse } from "@/app/api/common/error.interface";
//contexto multivende
import { UseContext } from "@/app/dashboard/configuraciones/medilink/context";
import {IresponseCredencial  } from "@/app/api/oauth/medilink/interface/Icreate";
import { upsertOauthCredential } from "@/app/api/oauth/medilink/oauth.api";

interface IformProds {
  textBtn: string,
}

//validaciones zod
const formSchema = z.object({
  appName: z.string().min(1, { message: "El appName es requerido" }),
  urlApi: z.string().url({ message: "Ingresa una URL válida" }),
  idClient: z.string().min(1, { message: "El Client ID es requerido" }),
  token: z.string().min(1, { message: "El token es requerido" }),
});

//formulario credenciales multivende
const FormMultivende = ({ textBtn }: IformProds) => {

  const [loading, setLoading] = useState(false);
  //contexto credenciales
  const { data, upContext } = UseContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: data?.appName ?? "",
      idClient: data?.idClient ?? "",
      urlApi: data?.urlApi ?? "",
      token: data?.token ?? "",
    },
  })

  //funcion para validar estado de respuesta api createCredential
  const isCredentialResponse = (
    value: IresponseCredencial | ErrorResponse
  ): value is IresponseCredencial => {
    return (value as IresponseCredencial).appName !== undefined;
  };
  // Manejo del guardado desde el formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      //guardar registro en base de datos
      const data = await upsertOauthCredential(values);
      //validar parametros guardados
      if (data && isCredentialResponse(data)) {
        toast.success("Datos guardados con éxito");
        //actualizar contexto
        upContext(data)
      } else {
        toast.error("error datos no guardados");
      }
    } catch (error: any) {
      toast.error("Por favor corrige los errores antes de guardar");
    }
    setLoading(false);
  }


  return (
    <div>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-2 gap-5">
            {/*urlApi*/}
            <FormField
              control={form.control}
              name="urlApi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url API</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    URl API configuración Medilink.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*client*/}
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>appName aplicación</FormLabel>
                  <FormControl>
                    <Input placeholder="appName aplicación" {...field} />
                  </FormControl>
                  <FormDescription>
                    cliente configuración Medilink.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*user*/}
            <FormField
              control={form.control}
              name="idClient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>idClient aplicacion</FormLabel>
                  <FormControl>
                    <Input placeholder="idClient aplicacion" {...field} />
                  </FormControl>
                  <FormDescription>
                  idClient aplicacion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/*token*/}
             <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>token aplicacion</FormLabel>
                  <FormControl>
                    <Input placeholder="token aplicacion" {...field} />
                  </FormControl>
                  <FormDescription>
                  token configuración Medilink.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {!loading ? textBtn : <Spinner size="sm" />}
            </Button>
          </div>
        </form>
      </Form>
    </div >
  );
};

export default FormMultivende;