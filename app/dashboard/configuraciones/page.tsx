// app/dashboard/configuraciones/page.tsx
'use client'
import Image from "next/image";
import { useState } from 'react'
import { RelationshipProvider } from '@/app/context/RelationshipContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProviderDefontana from '@/app/dashboard/configuraciones/defontana/provider'
import ProviderMedilink from '@/app/dashboard/configuraciones/medilink/provider'

export default function ConfiguracionesPage() {
  const [activeTab, setActiveTab] = useState('defontana')

  return (
    <RelationshipProvider>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Configuraciones</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="gap-15">
            <TabsTrigger value="defontana">
              Defontana
              <Image
                src={"/defontana.svg"}
                height={20}
                width={20}
                alt="logo-defontana"
                className='mx-2'
              />
            </TabsTrigger>
          </TabsList>
          <TabsList className="gap-15">
            <TabsTrigger value="medilink">
              Medilink
              <Image
                src={"/medilink.png"}
                height={20}
                width={20}
                alt="logo-medilink"
                className='mx-2'
              />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="defontana">
            <Card>
              <CardHeader>
                <CardTitle>Datos de integración con Defontana</CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderDefontana />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="medilink">
            <Card>
              <CardHeader>
                <CardTitle>Datos de integración con Medilink</CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderMedilink />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RelationshipProvider>
  )
}