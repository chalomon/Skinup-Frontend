"use client"
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import dayjs from "dayjs";

//configuraciones
import PageDefontana from "@/app/dashboard/configuraciones/defontana/defontana";
import { ContextProvider } from "@/app/dashboard/configuraciones/defontana/context";

//api
import { ICrateCredentialResponse } from "@/app/api/oauth/defontana/interface/Icreate";
import { GetWithOutPassowordCredential } from "@/app/api/oauth/defontana/oauth.api";


export default function ProviderDefontana() {
  const [data, setData] = useState<ICrateCredentialResponse>();
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const fetchDataCredential = async () => {
    setLoading(true);
    try {
      const response = await GetWithOutPassowordCredential();
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
        <PageDefontana />
      )}

    </ContextProvider>
  )
}


