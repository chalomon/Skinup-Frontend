"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { CentrosNegocio } from "@/app/api/professionals/interface/business.center.interface"
import { flattenCentros, getBusinessCenters } from "@/app/api/professionals/professionals.api"


interface CentroComboboxProps {
  value: CentrosNegocio | null
  onChange: (value: CentrosNegocio | null) => void
}


export function CentroCombobox({ value, onChange }: CentroComboboxProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<CentrosNegocio[]>([])

  const fetchData = async () => {
    const businessCenters = await getBusinessCenters();

    const data = await flattenCentros(businessCenters);
    setData(data)
    return;
  }
  
  useEffect(() => {
    fetchData()
  }, [])

    const formatCenter = (centro: CentrosNegocio) => {
      return `${centro.code} - ${centro.description}`
    }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? value.description : "Seleccionar..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {data.map((centro) => (
                <CommandItem
                  key={centro.code}
                  value={formatCenter(centro)}
                  onSelect={() => {
                    onChange(centro)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                  {formatCenter(centro)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
