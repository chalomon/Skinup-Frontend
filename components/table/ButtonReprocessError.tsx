import { BadgeCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getHexColor, OrderState } from '@/lib/utils'
// Asegúrate de que la ruta de importación sea correcta

export function ReprocessError() {
    const fallbackColor = getHexColor(OrderState.FALLIDO);

    return (
        <Button 
            style={{ 
                backgroundColor: fallbackColor
            }}
        >
            <BadgeCheck className="mr-2 h-4 w-4" />
            Reprocesar errores
        </Button>
    );
}
