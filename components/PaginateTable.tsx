import {Button} from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}
export default function PaginationTable({
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
  }: PaginationProps) {
    const pageCount = Math.ceil(totalItems / itemsPerPage);
  
    const renderPaginationItems = () => {
      const items = [];
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisiblePages);
      const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
      if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
      if (startPage > 1) {
        items.push(
          <Button
            key="first"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="px-2 py-1"
          >
            1
          </Button>
        );
        if (startPage > 2) {
          items.push(<span key="ellipsis-start">...</span>);
        }
      }
  
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <Button
            key={i}
            variant={i === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className="px-2 py-1"
          >
            {i}
          </Button>
        );
      }
  
      if (endPage < pageCount) {
        if (endPage < pageCount - 1) items.push(<span key="ellipsis-end">...</span>);
        items.push(
          <Button
            key="last"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageCount)}
            className="px-2 py-1"
          >
            {pageCount}
          </Button>
        );
      }
  
      return items;
    };
  
    return (
      <div className="flex items-center justify-between">
        {/* <div className="text-sm text-muted-foreground">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} resultados
        </div> */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          {renderPaginationItems()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage === pageCount}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  }