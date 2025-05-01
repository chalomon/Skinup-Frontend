import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { Column } from './types';
import * as XLSX from 'xlsx';

interface ExportButtonProps<T> {
    data: T[];
    columns: Column<T>[];
}

export function ExportButton<T>({data, columns}: ExportButtonProps<T>) {
    const exportToXLSX = () => {
        const headers = columns.map(column => column.header);
        const rows = data.map(item =>
            columns.map(column => item[column.accessor])
        );
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'exported_data.xlsx');
    };

    return (
        <Button onClick={exportToXLSX}>
            <Download className="mr-2 h-4 w-4"/>
            Descargar Excel
        </Button>
    );
}