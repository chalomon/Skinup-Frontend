import React from 'react';
import {TableHead} from "@/components/ui/table";
import {SortProps} from './types';

export function SortableHeader<T>({column, sortColumn, sortDirection, onSort}: Readonly<SortProps<T>>) {
    return (
        <TableHead
            className={column.sortable ? 'cursor-pointer select-none' : ''}
            onClick={() => column.sortable && onSort(column.accessor)}
        >
            {column.header}
            {column.sortable && sortColumn === column.accessor && (
                <span className="ml-2">
          {sortDirection === 'asc' ? '▲' : '▼'}
        </span>
            )}
        </TableHead>
    );
}