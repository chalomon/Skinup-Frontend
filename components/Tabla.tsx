"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
// import { TablePagination } from "@mui/material";

interface Props {
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers: any[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void; 
  onItemsPerPageChange: (items: number) => void;
  isSearchable?: boolean;
  children?: React.ReactNode;
  collection?: string;
}

export const Tabla = ({
  title,
  search,
  onSearchChange,
  data,
  headers,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isSearchable = true,
  children,
  collection,
}: Props) => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex justify-between items-center">
        {isSearchable && (
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
        <div className="flex flex-col items-end">
          {children}
        </div>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead style={{ textAlign: header.align || "left" }} key={index}>
                    {header.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id} >
                  {headers.map((header, index) => (
                    <TableCell
                      style={{ textAlign: header.align || "left" }}
                      key={index}
                    >
                      {header.key
                        ? item[header.key]
                        : header.render && header.render(item)}{" "}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* <TablePagination
            component="div"
            count={totalItems}
            page={currentPage - 1}
            onPageChange={(_, page) => onPageChange(page + 1)}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={(e) =>
              onItemsPerPageChange(parseInt(e.target.value))
            }
          /> */}
        </CardContent>
      </Card>
    </div>
  );
};
