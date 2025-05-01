import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useDashboard } from "@/app/context/dashboard.context";
import PillIntegration from "@/components/ui/pill-Integration";

export function NavSelector() {
  const { options, selectedOption, setSelectedOption } = useDashboard();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-between bg-primary text-primary-foreground border-primary-foreground"
        >
          <PillIntegration
                colorLeft={selectedOption.leftColor}
                colorRight={selectedOption.rightColor}
                />
          <span>{selectedOption.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] bg-primary border-primary-foreground border">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onSelect={() => setSelectedOption(option)}
            className="text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:bg-primary-foreground focus:text-primary"
          >
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
