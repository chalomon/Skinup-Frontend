"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { AccountItem } from "@/app/api/professionals/interface/account.plan.interface"
import { flattenPlans, getAccountPlans } from "@/app/api/professionals/professionals.api"


interface CuentasComboboxProps {
  value: AccountItem | null
  onChange: (value: AccountItem | null) => void
}


export function CuentasCombobox({ value, onChange }: CuentasComboboxProps) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<AccountItem[]>([])

  const fetchData = async () => {
    const accountPlans = await getAccountPlans();

    const data = await flattenPlans(accountPlans);
    setData(data)
    return;
  }
  
  useEffect(() => {
    fetchData()
  }, [])

    const formatAccount = (cuenta: AccountItem) => {
      return `${cuenta.code} - ${cuenta.description}`
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
              {data.map((cuenta) => (
                <CommandItem
                  key={cuenta.code}
                  value={formatAccount(cuenta)}
                  onSelect={() => {
                    onChange(cuenta)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                  {formatAccount(cuenta)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
