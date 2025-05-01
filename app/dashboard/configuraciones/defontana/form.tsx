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
import { UseContext } from "@/app/dashboard/configuraciones/defontana/context";
import { ICrateCredentialResponse } from "@/app/api/oauth/defontana/interface/Icreate";
import { upsertOauthCredential } from "@/app/api/oauth/defontana/oauth.api";

interface IformProds {
  textBtn: string,
}

//validaciones zod
const formSchema = z.object({
  client: z.string().min(1, { message: "El código es requerido" }),
  company: z.string().min(1, { message: "Merchant ID es requerido" }),
  urlApi: z.string().url({ message: "Ingresa una URL válida" }),
  password: z.string().min(1, { message: "El Client ID es requerido" }),
  user: z.string().min(1, { message: "El Client Secret es requerido" }),
});

//formulario credenciales multivende
const FormMultivende = ({ textBtn }: IformProds) => {

  const [loading, setLoading] = useState(false);
  //contexto credenciales
  const { data, upContext } = UseContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: data?.client ?? "",
      company: data?.company ?? "",
      password: "",
      urlApi: data?.urlApi ?? "",
      user: data?.user ?? "",
    },
  })

  //funcion para validar estado de respuesta api createCredential
  const isCredentialResponse = (
    value: ICrateCredentialResponse | ErrorResponse
  ): value is ICrateCredentialResponse => {
    return (value as ICrateCredentialResponse).client !== undefined;
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
                    URl API configuración Defontana.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*client*/}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente aplicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Cliente aplicación" {...field} />
                  </FormControl>
                  <FormDescription>
                    cliente configuración Defontana.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*user*/}
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>usuario aplicacion</FormLabel>
                  <FormControl>
                    <Input placeholder="Usuario aplicacion" {...field} />
                  </FormControl>
                  <FormDescription>
                    Usuario aplicacion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/*Company*/}
             <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compañia aplicacion</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    Compañia configuración Defontana.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/*password*/}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password configuración defontana.
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