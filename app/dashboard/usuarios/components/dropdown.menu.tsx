import { useState } from "react";
// Componentes de shandcn
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; 
import { Button } from "@/components/ui/button";
//Incono de Lucide 
import { Ellipsis } from 'lucide-react';

interface UserActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserActionsDropdown({
  onEdit,
  onDelete,
}: UserActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-2">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            onEdit();
            setIsOpen(false);
          }}
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDelete();
            setIsOpen(false);
          }}
          className="text-red-600"
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}