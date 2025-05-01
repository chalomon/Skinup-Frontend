import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {PaginationProps} from './types';

export const PaginationComponent: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange}) => {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    />
                </PaginationItem>
                {Array.from({length: totalPages}, (_, i) => i + 1)
                    .filter((pageNumber) => {
                        if (totalPages <= 7) return true;
                        if (currentPage <= 4) return pageNumber <= 5 || pageNumber === totalPages;
                        if (currentPage >= totalPages - 3) return pageNumber >= totalPages - 4 || pageNumber === 1;
                        return pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2 || pageNumber === 1 || pageNumber === totalPages;
                    })
                    .map((pageNumber, index, array) => (
                        <PaginationItem key={`page-${pageNumber}`}>
                            {index > 0 && pageNumber !== array[index - 1] + 1 && (
                                <PaginationEllipsis key={`ellipsis-${pageNumber}`}/>
                            )}
                            <PaginationLink
                                key={`link-${pageNumber}`}
                                onClick={() => onPageChange(pageNumber)}
                                isActive={currentPage === pageNumber}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};