"use client"
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import dayjs from "dayjs";

//configuraciones
import PageMedilink from "@/app/dashboard/configuraciones/medilink/medilink";
import { ContextProvider } from "@/app/dashboard/configuraciones/medilink/context";

//api
import { IresponseCredencial } from "@/app/api/oauth/medilink/interface/Icreate";
import { GetCredential } from "@/app/api/oauth/medilink/oauth.api";


export default function ProviderConfigMedilink() {
  const [data, setData] = useState<IresponseCredencial>();
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const fetchDataCredential = async () => {
    setLoading(true);
    try {
      const response = await GetCredential();
      if (response._id) {
        const formattedData = response;
        // Formatear las fechas
        formattedData.createdAt = dayjs(formattedData.createdAt).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        formattedData.updatedAt = dayjs(formattedData.updatedAt).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        setData(formattedData); // Guarda el objeto formateado
      } else {
        toast.error("No se encontraron datos para cargar");
      }
    } catch (error) {
      toast.error("Error inesperado al cargar los datos");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchDataCredential();
  }, []);
  return (
    <ContextProvider data={data}>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <PageMedilink />
      )}

    </ContextProvider>
  )
}


