import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FilterProps, getUniqueValues } from "@/components/table/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Filter<T>({
  columns,
  filters,
  onFilterChange,
  data,
}: FilterProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempFilters, setTempFilters] =
    useState<Record<string, string>>(filters);
  const [searchInputs, setSearchInputs] = useState<Record<string, string>>({});
  const [filteredOptions, setFilteredOptions] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleTempFilterChange = (accessor: keyof T, value: string) => {
    setTempFilters((prev) => ({ ...prev, [accessor.toString()]: value }));
  };

  const handleSearchInputChange = (accessor: keyof T, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [accessor.toString()]: value }));
  };

  const applyFilters = () => {
    const combinedFilters = { ...tempFilters };
    Object.keys(searchInputs).forEach((key) => {
      if (searchInputs[key]) {
        combinedFilters[key] = searchInputs[key];
      }
    });
    onFilterChange(combinedFilters);
    setIsDialogOpen(false);
  };

  const clearFilters = () => {
    setTempFilters({});
    setSearchInputs({});
    setFilteredOptions({});
    onFilterChange({});
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Filtros</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar datos</DialogTitle>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-4">
          {columns
            .filter((column) => column.filterable)
            .map((column) => {
              const uniqueValues = getUniqueValues(
                data,
                column.accessor as keyof T
              );
              const useSearchInput = uniqueValues.length > 7;

              return (
                <div
                  key={String(column.accessor)}
                  className="grid grid-cols-2 items-center gap-4"
                >
                  <Label
                    htmlFor={String(column.accessor)}
                    className="text-left"
                  >
                    {column.header}
                  </Label>
                  {useSearchInput ? (
                    <div className="relative">
                      <Input
                        type="text"
                        id={String(column.accessor)}
                        value={searchInputs[column.accessor.toString()] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSearchInputChange(column.accessor, value);

                          const filtered = uniqueValues.filter((option) =>
                            option
                              .toLocaleLowerCase()
                              .includes(value.toLocaleLowerCase())
                          );
                          setFilteredOptions((prev) => ({
                            ...prev,
                            [column.accessor.toString()]: filtered,
                          }));
                        }}
                        placeholder="Buscar..."
                      />
                      {searchInputs[column.accessor.toString()] &&
                        filteredOptions[column.accessor.toString()]?.length >
                          0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredOptions[column.accessor.toString()]?.map(
                              (option, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointer hover:bg-gray-100 p-2"
                                  onClick={() => {
                                    handleSearchInputChange(
                                      column.accessor,
                                      option
                                    );
                                    handleTempFilterChange(
                                      column.accessor,
                                      option
                                    );
                                  }}
                                >
                                  {option || "N/A"}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ) : (
                    <Select
                      onValueChange={(value) =>
                        handleTempFilterChange(column.accessor, value)
                      }
                      value={tempFilters[column.accessor.toString()] || "all"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          <div className="flex justify-between mt-4">
            <Button
              variant="link"
              onClick={clearFilters}
              className="text-destructive"
            >
              Quitar filtros
            </Button>
            <Button onClick={applyFilters}>Aplicar filtros</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}