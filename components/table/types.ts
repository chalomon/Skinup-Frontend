// import React from "react";
// import { DateRange } from "react-day-picker";

export interface Column<T> {
  header: string;
  accessor: Exclude<keyof T, "any">;
  filterable?: boolean;
  sortable?: boolean;
  cell?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  searchComponent?:React.ReactNode
  paginatedComponent?:React.ReactNode
  filterComponent?:React.ReactNode,
  buttonComponent?:React.ReactNode;
  retryButtonComponent?:React.ReactNode;
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  isLoading: boolean;
  error: string | null;
  actions?: (item: T) => React.ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
  setCurrentPage?: (value: number) => void;
  setSearch?: (value: string) => void;
}

export interface IDateRange {
  from: Date;
  to: Date;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface FilterProps<T> {
  columns: Column<T>[];
  filters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
  data: T[];
}

export interface SortProps<T> {
  column: Column<T>;
  sortColumn: keyof T | null;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof T) => void;
}

export const getUniqueValues = <T, K extends keyof T>(
  data: T[],
  accessor: K
): string[] => {
  return Array.from(
    new Set(
      data
        .map((item) => item[accessor])
        .filter(
          (value): value is NonNullable<typeof value> =>
            value !== null && value !== undefined && value !== ""
        )
        .map(String)
    )
  );
};
