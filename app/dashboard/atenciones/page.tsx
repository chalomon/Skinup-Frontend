"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { DateRange } from "react-day-picker";
import PagePedidos from "@/app/dashboard/atenciones/pedidos/page";
import PagePayments from "@/app/dashboard/atenciones/pagos/page";
import PageSettlements from "@/app/dashboard/atenciones/liquidaciones/page";
import PageSettlementsConfig from "./profesionales/page";

const today = new Date();
const last30Days = new Date(today);
last30Days.setDate(today.getDate() - 30);

export default function AtencionPage() {
  // Variables de estado
  const [activeTab, setActiveTab] = useState("Pedidos");
  const [date, setDate] = useState<DateRange>({
    from: last30Days,
    to: today,
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Atenciones</h1>
        <DateRangeFilter
          initialDateRange={{ from: date.from, to: date.to }}
          buttonLabel="Filtrar"
          onFilter={(dateRange) => dateRange && setDate(dateRange)}
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="Pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="Pagos">Pagos</TabsTrigger>
          <TabsTrigger value="Liquidaciones">Liquidaciones</TabsTrigger>
          <TabsTrigger value="Configuraciones">Configuraciones</TabsTrigger>
        </TabsList>
        <TabsContent value="Pedidos">
          <PagePedidos from={date.from} to={date.to} />
        </TabsContent>
        <TabsContent value="Pagos">
          <PagePayments from={date.from} to={date.to} />
        </TabsContent>
        <TabsContent value="Liquidaciones">
          <PageSettlements from={date.from} to={date.to} />
        </TabsContent>
        <TabsContent value="Configuraciones">
          <PageSettlementsConfig from={date.from} to={date.to} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
