"use client";

import * as React from "react";
import { format } from "date-fns";
import { BadgeCheck, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangeFilterProps {
  className?: string;
  onFilter?: (dateRange: DateRange | undefined) => void;
  initialDateRange?: DateRange;
  align?: "start" | "center" | "end";
  buttonLabel?: string;
  placeholder?: string;
}

export function DateRangeFilter({
  className,
  onFilter,
  initialDateRange,
  align = "start",
  buttonLabel = "Filtrar",
  placeholder = "Seleccionar fechas",
}: Readonly<DateRangeFilterProps>) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateRange
  );
  const [isOpen, setIsOpen] = React.useState(false);

  // Format the date range for display
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    if (!range.to) return format(range.from, "d MMMM yyyy", { locale: es });
    return `${format(range.from, "d MMMM yyyy", { locale: es })} - ${format(
      range.to,
      "d MMMM yyyy",
      { locale: es }
    )}`;
  };
  const handleDateRangeSelect = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    if (newDateRange?.to) setIsOpen(false);
  };
  const handleFilterClick = () => {
    if (onFilter) onFilter(date);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateRangeSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
      <Button
        className="bg-[#0A0F29] text-white hover:bg-[#1A1F39]"
        onClick={handleFilterClick}
      >
        <BadgeCheck />
        {buttonLabel}
      </Button>
    </div>
  );
}