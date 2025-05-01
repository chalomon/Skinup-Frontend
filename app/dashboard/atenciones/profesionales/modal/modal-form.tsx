"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/Spinner";
import { BadgeCheck } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IDataMedilinkProfessional, IDataProfessional, ProfessionalDto } from "@/app/api/professionals/interface/professionals.interface";
import { ProfesionalCombobox } from "./profesional-combobox";
import { AccountItem } from "@/app/api/professionals/interface/account.plan.interface";
import { CentrosNegocio } from "@/app/api/professionals/interface/business.center.interface";
import { CentroCombobox } from "./centro-combobox";
import { CuentasCombobox } from "./cuentas-combobox";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";

interface ProfesionalFormProps {
  isOpen: boolean;
  onClose: () => void;
  professional: IDataProfessional | null;
  onSubmit: (updatedProfessional: ProfessionalDto) => Promise<void>;
  loading: boolean;
  mode: "create" | "update";
}

export default function UpdateProfesionalModal({
  isOpen,
  onClose,
  professional,
  onSubmit,
  loading,
  mode
}: Readonly<ProfesionalFormProps>) {
  const methods = useForm<ProfessionalDto>({
    defaultValues: {
      nombre: professional?.nombre ?? "",
      apellidos: professional?.apellidos ?? "",
      id_plan_cuenta: professional?.id_plan_cuenta ?? "",
      plan_cuenta: professional?.plan_cuenta ?? "",
      id_centro_negocios: professional?.id_centro_negocios ?? "",
      centro_negocios: professional?.centro_negocios ?? "",
    },
  });


  const [profesional, setProfesional] = useState<IDataMedilinkProfessional | null>(null)
  const [centroNegocios, setCentroNegocios] = useState<CentrosNegocio | null>(null)
  const [centroCuentas, setCentroCuentas] = useState<AccountItem | null>(null)
  const [isActive, setIsActive] = useState<boolean>(true)
  // Actualizar los valores del formulario cuando cambie el cliente seleccionado
  useEffect(() => {
    if (professional) {
      methods.reset({
        id: professional.id,
        nombre: professional.nombre,
        apellidos: professional.apellidos,
        rut: professional.rut,
        id_centro_negocios: professional.id_centro_negocios,
        centro_negocios: professional.centro_negocios,
        id_plan_cuenta: professional.id_plan_cuenta,
        plan_cuenta: professional.plan_cuenta,
      });
    }
  }, [professional, methods]);


  const handleSubmit = (values: ProfessionalDto) => {

    const data = {
      id: String(profesional?.id) ?? "",
      nombre: profesional!.nombre,
      apellidos: profesional!.apellidos,
      rut: profesional?.rut ?? "",
      id_centro_negocios: centroNegocios?.code ?? "",
      centro_negocios: centroNegocios?.description ?? "",
      id_plan_cuenta: centroCuentas?.code ?? "",
      plan_cuenta: centroCuentas?.description ?? "",
      active: isActive,
      mode
    }
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader className="bg-background z-10 pb-4">
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <p className="text-muted-foreground">
              Puedes editar cualquier campo del profesional.
            </p>
            {/* Profesional */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="professional"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profesional
                </label>
                <ProfesionalCombobox value={profesional} onChange={setProfesional} />
              </div>
              {/* Centro de negocios */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Centro de negocios
                </label>
                <CentroCombobox value={centroNegocios} onChange={setCentroNegocios} />
              </div>
              {/* Plan de cuentas */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Plan de cuentas
                </label>
                <CuentasCombobox value={centroCuentas} onChange={setCentroCuentas} />
              </div>
              {/* Estado */}
              <div>
                <Label htmlFor="isActive">Activo</Label><br />
                <Switch id="isActive" checked={isActive} onCheckedChange={(e) => setIsActive(e)} />
              </div>

            </div>
            {/* Botones */}
            <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-4">
              <Button
                disabled={!!loading}
                type="submit"
                className="bg-button-black text-white w-full"
              >
                <BadgeCheck className="mr-2" /> Guardar Cambios
                {loading && <Spinner size="sm" />}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}