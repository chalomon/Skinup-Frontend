"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IDataMedilinkProfessional } from "@/app/api/professionals/interface/professionals.interface"
import { useEffect, useState } from "react"
import { getMedilinkProfessionals } from "@/app/api/professionals/professionals.api"
import { SelectValue } from '@/components/ui/select';


interface ProfesionalComboboxProps {
  value: IDataMedilinkProfessional | null
  onChange: (value: IDataMedilinkProfessional | null) => void
}

export function ProfesionalCombobox({ value, onChange }: ProfesionalComboboxProps) {

  
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<IDataMedilinkProfessional[]>([])
  
  const fetchData = async () => {
    const data = await getMedilinkProfessionals();
    setData(data)
    return;
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  const formatProfesional = (profesional: IDataMedilinkProfessional) => {
    return `${profesional.rut} - ${profesional.nombre} ${profesional.apellidos}`
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? formatProfesional(value) : "Seleccionar profesional..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 max-h-[350px]">
        <Command>
          <CommandInput placeholder="Buscar profesional..." />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {data.map((profesional) => (
                <CommandItem
                  key={profesional.id}
                  value={formatProfesional(profesional)}
                  onSelect={() => {
                    onChange(profesional)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value?.id === profesional.id ? "opacity-100" : "opacity-0")} />
                  {formatProfesional(profesional)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
