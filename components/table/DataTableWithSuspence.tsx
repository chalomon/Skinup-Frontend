import React, { Suspense } from 'react';
import { DataTableProps } from '@/components/table/types';
import DataTable from '@/components/table/DataTable'

const DataTableWithSuspense = <T extends { _id: string }>(props: DataTableProps<T>) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DataTable {...props} />
        </Suspense>
    );
};

export default DataTableWithSuspense;
