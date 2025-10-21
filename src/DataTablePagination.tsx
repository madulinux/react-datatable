import React from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

interface DataTablePaginationProps {
    page: number;
    totalPages: number;
    perPage: number;
    total: number;
    dataLength: number;
    screenSize: 'mobile' | 'tablet' | 'desktop';
    showRecordInfo?: boolean;
    paginationAlignment?: 'left' | 'center' | 'right' | 'between';
    compactMode?: boolean;
    isMobileView?: boolean;
    onPageChange: (page: number) => void;
}

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

const PAGINATION_CONFIG = {
    maxPagesMobile: 3,
    maxPagesDesktop: 5,
} as const;

/**
 * DataTablePagination - Pagination component for DataTable
 * Handles page navigation and displays record information
 */
export function DataTablePagination({
    page,
    totalPages,
    perPage,
    total,
    dataLength,
    screenSize,
    showRecordInfo = true,
    paginationAlignment = 'between',
    compactMode = false,
    isMobileView = false,
    onPageChange,
}: DataTablePaginationProps) {
    if (totalPages <= 1) return null;

    const maxPage = screenSize === 'mobile' ? PAGINATION_CONFIG.maxPagesMobile : PAGINATION_CONFIG.maxPagesDesktop;

    return (
        <div
            className={classNames(
                'flex gap-2',
                paginationAlignment === 'left'
                    ? 'justify-start'
                    : paginationAlignment === 'center'
                      ? 'justify-center'
                      : paginationAlignment === 'right'
                        ? 'justify-end'
                        : paginationAlignment === 'between'
                          ? 'flex-col justify-between sm:flex-row sm:items-center'
                          : 'flex-col justify-between sm:flex-row sm:items-center',
            )}
        >
            {/* Record Info */}
            {showRecordInfo && (
                <div
                    className={classNames(
                        'text-sm text-gray-600',
                        paginationAlignment === 'between' ? 'order-2 sm:order-1' : '',
                        compactMode && isMobileView && 'text-center text-xs sm:text-left',
                    )}
                    role="status"
                    aria-live="polite"
                >
                    Menampilkan {dataLength === 0 ? 0 : (page - 1) * perPage + 1}
                    {' - '}
                    {dataLength === 0 ? 0 : (page - 1) * perPage + dataLength}
                    {' dari '}
                    {total} data
                </div>
            )}

            {/* Pagination Controls */}
            <div
                className={classNames(
                    'flex justify-center',
                    paginationAlignment === 'between'
                        ? 'order-1 w-full sm:order-2 sm:w-auto'
                        : paginationAlignment === 'left'
                          ? 'w-full justify-start'
                          : paginationAlignment === 'right'
                            ? 'w-full justify-end'
                            : 'w-full',
                )}
            >
                <Pagination>
                    <PaginationContent>
                        {/* First page */}
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(1);
                                    }}
                                    isActive={page === 1}
                                    aria-label="Go to first page"
                                >
                                    <ChevronsLeft className="size-4" />
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Previous page */}
                        {page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) onPageChange(page - 1);
                                    }}
                                    aria-disabled={page === 1}
                                    style={page === 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                />
                            </PaginationItem>
                        )}

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(totalPages, maxPage) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= maxPage) {
                                pageNum = i + 1;
                            } else if (page <= Math.floor(maxPage / 2)) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - Math.floor(maxPage / 2)) {
                                pageNum = totalPages - maxPage + i + 1;
                            } else {
                                pageNum = page - Math.floor(maxPage / 2) + i;
                            }

                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(pageNum);
                                        }}
                                        isActive={pageNum === page}
                                        aria-label={`Go to page ${pageNum}`}
                                        aria-current={pageNum === page ? 'page' : undefined}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        {/* Next page */}
                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < totalPages) onPageChange(page + 1);
                                    }}
                                    aria-disabled={page === totalPages}
                                    style={page === totalPages ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                />
                            </PaginationItem>
                        )}

                        {/* Last page */}
                        {page < totalPages && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(totalPages);
                                    }}
                                    isActive={page === totalPages}
                                    aria-label="Go to last page"
                                >
                                    <ChevronsRight className="size-4" />
                                </PaginationLink>
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

export default DataTablePagination;
