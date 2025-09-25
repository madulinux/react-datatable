import Select2 from './Select2';
import {
    ChevronDown,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    Download,
    Eye,
    EyeOff,
    FileSpreadsheet,
    FileText,
    Filter,
    GripVertical,
    Loader2,
    Plus,
    Settings2,
    X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { DatePicker } from './ui/date-picker';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination'; // Fix import path for pagination components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';

export interface DataTableColumn<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    width?: string;
    visible?: boolean;
    pinned?: boolean; // For future: pin columns left/right
    priority?: number; // 1 = highest priority (always show), 5 = lowest (hide first on mobile)
    mobileLabel?: string; // Custom label for mobile view
}

export interface DataTableFilter {
    key: string;
    label: string;
    options?: { value: string | number; label: string }[];
    customElement?: React.ReactNode;
    type?: 'select' | 'multiselect' | 'daterange' | 'date' | 'search' | 'number' | 'boolean' | 'text';
    placeholder?: string;
    searchable?: boolean; // For multiselect with search
}

export interface DataTableAdvancedFilter {
    key: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'daterange' | 'date' | 'number' | 'boolean';
    options?: { value: string | number; label: string }[];
    operators?: ('equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'notIn')[];
    defaultOperator?: string;
    placeholder?: string;
    searchable?: boolean;
    multiple?: boolean;
}

export interface DataTableFilterRule {
    field: string;
    operator: string;
    value: string | number | boolean | string[] | number[] | [string | number, string | number];
    condition?: 'AND' | 'OR';
}

export interface DataTableFilterGroup {
    rules: DataTableFilterRule[];
    condition: 'AND' | 'OR';
    groups?: DataTableFilterGroup[];
}

export interface DataTableExportConfig {
    enableExport?: boolean;
    exportFormats?: ('csv' | 'excel')[];
    exportFileName?: string;
    exportAllData?: boolean; // Export semua data atau hanya yang tampil
    exportEndpoint?: string; // Custom export endpoint
}

export interface DataTableBulkAction<T> {
    label: string;
    icon?: React.ReactNode;
    action: (selectedRows: T[]) => void | Promise<void>;
    variant?: 'default' | 'destructive';
    requiresConfirmation?: boolean;
    confirmationMessage?: string;
}

export interface DataTableSelectionConfig<T> {
    enableRowSelection?: boolean;
    selectionMode?: 'single' | 'multiple';
    bulkActions?: DataTableBulkAction<T>[];
    onSelectionChange?: (selectedRows: T[]) => void;
}

export interface DataTableResponsiveConfig {
    enableResponsive?: boolean;
    breakpoints?: {
        mobile: number; // Default: 768px
        tablet: number; // Default: 1024px
        desktop: number; // Default: 1280px
    };
    mobileStackedView?: boolean; // Stack columns vertically on mobile
    priorityColumns?: string[]; // Columns that should always be visible
    hideColumnsOnMobile?: string[]; // Columns to hide on mobile
    compactMode?: boolean; // Reduce padding and font size on mobile
}

export interface DataTableLayoutConfig {
    toolbarLayout?: 'default' | 'compact' | 'stacked'; // Toolbar layout style
    searchPosition?: 'left' | 'right' | 'full'; // Search input position
    actionsPosition?: 'right' | 'left' | 'bottom'; // Actions position
    filtersLayout?: 'inline' | 'wrapped' | 'dropdown'; // Filters layout
    showLabels?: boolean; // Show/hide labels on mobile
    compactButtons?: boolean; // Use compact button sizes
    paginationPosition?: 'top' | 'bottom' | 'both'; // Pagination position
    showRecordInfo?: boolean; // Show record count info
    paginationAlignment?: 'left' | 'center' | 'right' | 'between'; // Pagination alignment
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    defaultOrderDir?: 'asc' | 'desc';
    defaultOrderBy?: string;
    fetchData: (params: {
        page: number;
        perPage: number;
        search: string;
        orderBy: string;
        orderDir: 'asc' | 'desc';
        filters: Record<string, string | number | undefined>;
    }) => Promise<{
        data: T[];
        total: number;
    }>;
    filters?: DataTableFilter[];
    actions?: (row: T) => React.ReactNode;
    perPageOptions?: number[];
    defaultPerPage?: number;
    className?: string;
    filterValues?: Record<string, string | number | undefined>;
    enableColumnVisibility?: boolean;
    enableColumnReordering?: boolean;
    storageKey?: string; // For persisting column preferences
    exportConfig?: DataTableExportConfig;
    selectionConfig?: DataTableSelectionConfig<T>;
    responsiveConfig?: DataTableResponsiveConfig;
    layoutConfig?: DataTableLayoutConfig;
    advancedFilters?: DataTableAdvancedFilter[];
    enableAdvancedFilters?: boolean;
    onAdvancedFilter?: (filterGroup: DataTableFilterGroup) => void;
}

function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export function DataTable<T extends { id: number | string }>({
    columns: initialColumns,
    defaultOrderDir = 'asc',
    defaultOrderBy = '',
    fetchData,
    filters = [],
    actions,
    perPageOptions = [10, 25, 50],
    defaultPerPage = 10,
    className = '',
    filterValues: externalFilterValues,
    enableColumnVisibility = true,
    enableColumnReordering = true,
    storageKey,
    exportConfig,
    selectionConfig,
    responsiveConfig,
    layoutConfig,
    advancedFilters = [],
    enableAdvancedFilters = false,
    onAdvancedFilter,
}: DataTableProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(defaultPerPage);
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [orderDir, setOrderDir] = useState<'asc' | 'desc'>(defaultOrderDir);
    const [filterValues, setFilterValues] = useState<Record<string, string | number | undefined>>({});
    const [loading, setLoading] = useState(false);

    // Column management state
    const [columns, setColumns] = useState<DataTableColumn<T>[]>(() => {
        // Load from localStorage if storageKey is provided
        if (storageKey && typeof window !== 'undefined') {
            const saved = localStorage.getItem(`datatable-${storageKey}`);
            if (saved) {
                try {
                    const savedConfig = JSON.parse(saved);
                    // Merge saved config with initial columns
                    return initialColumns
                        .map((col, index) => ({
                            ...col,
                            visible: savedConfig.columnVisibility?.[col.key as string] ?? col.visible ?? true,
                            order: savedConfig.columnOrder?.indexOf(col.key as string) ?? index,
                        }))
                        .sort((a, b) => (a.order || 0) - (b.order || 0));
                } catch (e) {
                    console.warn('Failed to parse saved column config:', e);
                }
            }
        }
        return initialColumns;
    });

    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Advanced Filters State
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [activeFilterGroup, setActiveFilterGroup] = useState<DataTableFilterGroup>({
        rules: [],
        condition: 'AND',
        groups: [],
    });
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [isMobileView, setIsMobileView] = useState(false);
    const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

    // Get visible columns
    const visibleColumns = columns.filter((col) => col.visible !== false);

    // Selection configuration with defaults
    const selectionSettings = useMemo(
        () => ({
            enableRowSelection: selectionConfig?.enableRowSelection ?? false,
            selectionMode: selectionConfig?.selectionMode ?? ('multiple' as const),
            bulkActions: selectionConfig?.bulkActions ?? [],
            onSelectionChange: selectionConfig?.onSelectionChange,
        }),
        [selectionConfig],
    );

    // Export configuration with defaults (memoized to prevent re-renders)
    const exportSettings = useMemo(
        () => ({
            enableExport: exportConfig?.enableExport ?? false,
            exportFormats: exportConfig?.exportFormats ?? (['csv', 'excel'] as ('csv' | 'excel')[]),
            exportFileName: exportConfig?.exportFileName ?? 'data-export',
            exportAllData: exportConfig?.exportAllData ?? true,
            exportEndpoint: exportConfig?.exportEndpoint ?? '/api/datatable/export',
        }),
        [exportConfig],
    );

    // Responsive configuration with defaults
    const responsiveSettings = useMemo(
        () => ({
            enableResponsive: responsiveConfig?.enableResponsive ?? true,
            breakpoints: {
                mobile: responsiveConfig?.breakpoints?.mobile ?? 768,
                tablet: responsiveConfig?.breakpoints?.tablet ?? 1024,
                desktop: responsiveConfig?.breakpoints?.desktop ?? 1280,
            },
            mobileStackedView: responsiveConfig?.mobileStackedView ?? false,
            priorityColumns: responsiveConfig?.priorityColumns ?? [],
            hideColumnsOnMobile: responsiveConfig?.hideColumnsOnMobile ?? [],
            compactMode: responsiveConfig?.compactMode ?? true,
        }),
        [responsiveConfig],
    );

    // Layout configuration with defaults
    const layoutSettings = useMemo(
        () => ({
            toolbarLayout: layoutConfig?.toolbarLayout ?? ('default' as const),
            searchPosition: layoutConfig?.searchPosition ?? ('left' as const),
            actionsPosition: layoutConfig?.actionsPosition ?? ('right' as const),
            filtersLayout: layoutConfig?.filtersLayout ?? ('inline' as const),
            showLabels: layoutConfig?.showLabels ?? true,
            compactButtons: layoutConfig?.compactButtons ?? false,
            paginationPosition: layoutConfig?.paginationPosition ?? ('bottom' as const),
            showRecordInfo: layoutConfig?.showRecordInfo ?? true,
            paginationAlignment: layoutConfig?.paginationAlignment ?? ('between' as const),
        }),
        [layoutConfig],
    );

    // Use external filterValues if provided, otherwise internal state
    const activeFilterValues = externalFilterValues ?? filterValues;

    // Save column preferences to localStorage
    const saveColumnPreferences = useCallback(() => {
        if (storageKey && typeof window !== 'undefined') {
            const config = {
                columnVisibility: columns.reduce(
                    (acc, col) => {
                        acc[col.key as string] = col.visible !== false;
                        return acc;
                    },
                    {} as Record<string, boolean>,
                ),
                columnOrder: columns.map((col) => col.key as string),
            };
            localStorage.setItem(`datatable-${storageKey}`, JSON.stringify(config));
        }
    }, [columns, storageKey]);

    // Toggle column visibility
    const toggleColumnVisibility = useCallback((columnKey: string) => {
        setColumns((prev) => prev.map((col) => (col.key === columnKey ? { ...col, visible: !(col.visible !== false) } : col)));
    }, []);

    // Reorder columns
    const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
        setColumns((prev) => {
            const newColumns = [...prev];
            const [movedColumn] = newColumns.splice(fromIndex, 1);
            newColumns.splice(toIndex, 0, movedColumn);
            return newColumns;
        });
    }, []);

    // Row selection functions
    const handleRowSelect = useCallback(
        (row: T, isSelected: boolean) => {
            if (!selectionSettings.enableRowSelection) return;

            setSelectedRows((prev) => {
                let newSelection: T[];

                if (selectionSettings.selectionMode === 'single') {
                    newSelection = isSelected ? [row] : [];
                } else {
                    if (isSelected) {
                        newSelection = [...prev, row];
                    } else {
                        newSelection = prev.filter((r) => r.id !== row.id);
                    }
                }

                // Call onSelectionChange callback
                selectionSettings.onSelectionChange?.(newSelection);
                return newSelection;
            });
        },
        [selectionSettings],
    );

    const handleSelectAll = useCallback(
        (isSelected: boolean) => {
            if (!selectionSettings.enableRowSelection || selectionSettings.selectionMode === 'single') return;

            setSelectedRows(isSelected ? [...data] : []);
            setIsAllSelected(isSelected);

            // Call onSelectionChange callback
            selectionSettings.onSelectionChange?.(isSelected ? [...data] : []);
        },
        [selectionSettings, data],
    );

    const isRowSelected = useCallback(
        (row: T) => {
            return selectedRows.some((r) => r.id === row.id);
        },
        [selectedRows],
    );

    // Update isAllSelected when data or selectedRows change
    useEffect(() => {
        if (data.length > 0 && selectedRows.length === data.length) {
            setIsAllSelected(true);
        } else {
            setIsAllSelected(false);
        }
    }, [data, selectedRows]);

    // Clear selection when page changes
    useEffect(() => {
        setSelectedRows([]);
        setIsAllSelected(false);
    }, [page]);

    // Responsive screen size detection
    useEffect(() => {
        if (!responsiveSettings.enableResponsive || typeof window === 'undefined') return;

        const handleResize = () => {
            const width = window.innerWidth;

            if (width < responsiveSettings.breakpoints.mobile) {
                setScreenSize('mobile');
                setIsMobileView(true);
            } else if (width < responsiveSettings.breakpoints.tablet) {
                setScreenSize('tablet');
                setIsMobileView(false);
            } else {
                setScreenSize('desktop');
                setIsMobileView(false);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [responsiveSettings]);

    // Get responsive columns based on screen size and priority
    const responsiveColumns = useMemo(() => {
        if (!responsiveSettings.enableResponsive) {
            return visibleColumns;
        }

        if (screenSize === 'mobile') {
            // On mobile, show priority columns and hide specified columns
            return visibleColumns.filter((col) => {
                const columnKey = col.key as string;

                // Always show priority columns
                if (responsiveSettings.priorityColumns.includes(columnKey)) {
                    return true;
                }

                // Hide columns specified in hideColumnsOnMobile
                if (responsiveSettings.hideColumnsOnMobile.includes(columnKey)) {
                    return false;
                }

                // Show columns with priority 1-2, hide 4-5
                if (col.priority) {
                    return col.priority <= 2;
                }

                // Default: show column
                return true;
            });
        }

        if (screenSize === 'tablet') {
            // On tablet, show more columns but still respect priority
            return visibleColumns.filter((col) => {
                const columnKey = col.key as string;

                // Always show priority columns
                if (responsiveSettings.priorityColumns.includes(columnKey)) {
                    return true;
                }

                // Show columns with priority 1-3, hide 5
                if (col.priority) {
                    return col.priority <= 3;
                }

                // Default: show column
                return true;
            });
        }

        // Desktop: show all visible columns
        return visibleColumns;
    }, [visibleColumns, screenSize, responsiveSettings]);

    // Export function
    const handleExport = useCallback(
        async (format: 'csv' | 'excel') => {
            if (!exportSettings.enableExport || isExporting) return;

            setIsExporting(true);
            try {
                // Build export parameters
                const exportParams = new URLSearchParams({
                    format,
                    filename: exportSettings.exportFileName,
                    ...(exportSettings.exportAllData
                        ? {}
                        : {
                              page: page.toString(),
                              perPage: perPage.toString(),
                          }),
                    search,
                    orderBy,
                    orderDir,
                    ...Object.fromEntries(Object.entries(activeFilterValues).map(([key, value]) => [`filters[${key}]`, String(value || '')])),
                    // Include visible columns
                    columns: visibleColumns.map((col) => col.key as string).join(','),
                });

                // Make export request
                const response = await fetch(`${exportSettings.exportEndpoint}?${exportParams}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/octet-stream',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Export failed: ${response.statusText}`);
                }

                // Download file
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                // Get filename from response header or use default
                const contentDisposition = response.headers.get('Content-Disposition');
                const filename = contentDisposition
                    ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                    : `${exportSettings.exportFileName}.${format}`;

                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Export failed:', error);
                // You can add toast notification here
                alert('Export gagal. Silakan coba lagi.');
            } finally {
                setIsExporting(false);
            }
        },
        [exportSettings, isExporting, page, perPage, search, orderBy, orderDir, activeFilterValues, visibleColumns],
    );

    const fetchTableData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchData({
                page,
                perPage,
                search,
                orderBy,
                orderDir,
                filters: activeFilterValues,
            });
            setData(result.data);
            setTotal(result.total);
        } finally {
            setLoading(false);
        }
    }, [fetchData, page, perPage, search, orderBy, orderDir, activeFilterValues, refreshTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    // Save column preferences when columns change
    useEffect(() => {
        saveColumnPreferences();
    }, [saveColumnPreferences]);

    const totalPages = Math.ceil(total / perPage);

    const handleSort = (key: string) => {
        if (orderBy === key) {
            setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderBy(key);
            setOrderDir('asc');
        }
        setPage(1);
    };

    const handleFilterChange = (key: string, value: string | number) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    // Advanced Filter functions
    const addFilterRule = useCallback(() => {
        const newRule: DataTableFilterRule = {
            field: advancedFilters[0]?.key || '',
            operator: advancedFilters[0]?.defaultOperator || 'equals',
            value: '',
            condition: 'AND',
        };

        setActiveFilterGroup((prev) => ({
            ...prev,
            rules: [...prev.rules, newRule],
        }));
    }, [advancedFilters]);

    const updateFilterRule = useCallback((index: number, updates: Partial<DataTableFilterRule>) => {
        setActiveFilterGroup((prev) => ({
            ...prev,
            rules: prev.rules.map((rule, i) => (i === index ? { ...rule, ...updates } : rule)),
        }));
    }, []);

    const removeFilterRule = useCallback((index: number) => {
        setActiveFilterGroup((prev) => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index),
        }));
    }, []);

    const clearAllFilters = useCallback(() => {
        setActiveFilterGroup({
            rules: [],
            condition: 'AND',
            groups: [],
        });

        // Notify parent component about cleared filters
        if (onAdvancedFilter) {
            onAdvancedFilter({
                rules: [],
                condition: 'AND',
                groups: [],
            });
        }

        // Reset to first page and trigger refresh
        setPage(1);
        setRefreshTrigger((prev) => prev + 1);
    }, [onAdvancedFilter]);

    const applyAdvancedFilters = useCallback(() => {
        if (onAdvancedFilter) {
            onAdvancedFilter(activeFilterGroup);
        }
        setPage(1); // Reset to first page when filters change

        // Trigger refresh by incrementing refresh trigger
        setRefreshTrigger((prev) => prev + 1);
    }, [activeFilterGroup, onAdvancedFilter]);

    // Get operators for a field type
    const getOperatorsForField = useCallback(
        (fieldKey: string) => {
            const field = advancedFilters.find((f) => f.key === fieldKey);
            if (!field) return ['equals'];

            if (field.operators) return field.operators;

            // Default operators based on field type
            switch (field.type) {
                case 'text':
                    return ['equals', 'contains', 'startsWith', 'endsWith'];
                case 'number':
                    return ['equals', 'gt', 'gte', 'lt', 'lte', 'between'];
                case 'select':
                    return ['equals', 'in', 'notIn'];
                case 'multiselect':
                    return ['in', 'notIn'];
                case 'date':
                    return ['equals', 'gt', 'gte', 'lt', 'lte'];
                case 'daterange':
                    return ['between', 'gt', 'gte', 'lt', 'lte'];
                case 'boolean':
                    return ['equals'];
                default:
                    return ['equals'];
            }
        },
        [advancedFilters],
    );

    // Pagination component
    const PaginationComponent = useCallback(() => {
        if (totalPages <= 1) return null;
        const maxPage = screenSize === 'mobile' ? 3 : 5;
        return (
            <div
                className={classNames(
                    'flex gap-2',
                    layoutSettings.paginationAlignment === 'left'
                        ? 'justify-start'
                        : layoutSettings.paginationAlignment === 'center'
                          ? 'justify-center'
                          : layoutSettings.paginationAlignment === 'right'
                            ? 'justify-end'
                            : layoutSettings.paginationAlignment === 'between'
                              ? 'flex-col justify-between sm:flex-row sm:items-center'
                              : 'flex-col justify-between sm:flex-row sm:items-center',
                )}
            >
                {/* Record Info */}
                {layoutSettings.showRecordInfo && (
                    <div
                        className={classNames(
                            'text-sm text-gray-600',
                            layoutSettings.paginationAlignment === 'between' ? 'order-2 sm:order-1' : '',
                            responsiveSettings.compactMode && isMobileView && 'text-center text-xs sm:text-left',
                        )}
                    >
                        Menampilkan {data.length === 0 ? 0 : (page - 1) * perPage + 1}
                        {' - '}
                        {data.length === 0 ? 0 : (page - 1) * perPage + data.length}
                        {' dari '}
                        {total} data
                    </div>
                )}

                {/* Pagination Controls */}
                <div
                    className={classNames(
                        'flex justify-center',
                        layoutSettings.paginationAlignment === 'between'
                            ? 'order-1 w-full sm:order-2 sm:w-auto'
                            : layoutSettings.paginationAlignment === 'left'
                              ? 'w-full justify-start'
                              : layoutSettings.paginationAlignment === 'right'
                                ? 'w-full justify-end'
                                : 'w-full',
                    )}
                >
                    <Pagination>
                        <PaginationContent>
                            {/* first page */}
                            {page > 1 && (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(1);
                                        }}
                                        isActive={page === 1}
                                    >
                                        <ChevronsLeft className="size-4" />
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            {/* previous page */}
                            {page > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page > 1) setPage((prev) => prev - 1);
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
                                    pageNum = totalPages - maxPage + i;
                                } else {
                                    pageNum = page - Math.floor(maxPage / 2) + i;
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(pageNum);
                                            }}
                                            isActive={pageNum === page}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            {/* next page */}
                            {page < totalPages && (
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (page < totalPages) setPage((prev) => prev + 1);
                                        }}
                                        aria-disabled={page === totalPages}
                                        style={page === totalPages ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                    />
                                </PaginationItem>
                            )}
                            {/* last page */}
                            {page < totalPages && (
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(totalPages);
                                        }}
                                        isActive={page === totalPages}
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
    }, [totalPages, layoutSettings, responsiveSettings, isMobileView, data.length, page, perPage, total, screenSize]);

    return (
        <div className={classNames('space-y-4', className)}>
            {/* Toolbar dengan 2 baris layout */}
            <div className="space-y-3">
                {/* Baris 1: Filters + Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-2">
                        {filters.length > 0 && (
                            <>
                                {filters.map((filter) =>
                                    filter.customElement ? (
                                        <div key={filter.key}>{filter.customElement}</div>
                                    ) : (
                                        <Select
                                            key={filter.key}
                                            value={String(filterValues[filter.key] ?? '')}
                                            onValueChange={(value) => handleFilterChange(filter.key, value)}
                                        >
                                            <SelectTrigger
                                                className={classNames(
                                                    'w-40 min-w-0',
                                                    responsiveSettings.compactMode && isMobileView && 'h-8 w-32 text-xs',
                                                    layoutSettings.compactButtons && 'h-8',
                                                )}
                                                size={responsiveSettings.compactMode && isMobileView ? 'sm' : 'default'}
                                            >
                                                <SelectValue placeholder={filter.label} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">{filter.label}</SelectItem>
                                                {filter.options?.map((opt) => (
                                                    <SelectItem key={opt.value} value={String(opt.value)}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ),
                                )}
                            </>
                        )}
                    </div>

                    {/* Actions Section */}
                    <div className="flex flex-wrap items-center gap-2">
                        {selectionSettings.enableRowSelection && selectedRows.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span
                                    className={classNames(
                                        'text-muted-foreground text-sm whitespace-nowrap',
                                        responsiveSettings.compactMode && isMobileView && 'text-xs',
                                    )}
                                >
                                    {selectedRows.length} item dipilih
                                </span>
                                {selectionSettings.bulkActions.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size={responsiveSettings.compactMode && isMobileView ? 'sm' : 'sm'}
                                                className={classNames(responsiveSettings.compactMode && isMobileView && 'px-2 py-1 text-xs')}
                                            >
                                                {isMobileView ? 'Aksi' : 'Aksi Bulk'}
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>Pilih Aksi</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {selectionSettings.bulkActions.map((action, index) => (
                                                <DropdownMenuItem
                                                    key={index}
                                                    onClick={async () => {
                                                        if (action.requiresConfirmation) {
                                                            const confirmed = window.confirm(
                                                                action.confirmationMessage ||
                                                                    `Apakah Anda yakin ingin ${action.label.toLowerCase()} ${selectedRows.length} item?`,
                                                            );
                                                            if (!confirmed) return;
                                                        }

                                                        try {
                                                            await action.action(selectedRows);
                                                            // Clear selection after action
                                                            setSelectedRows([]);
                                                            setIsAllSelected(false);
                                                        } catch (error) {
                                                            console.error('Bulk action failed:', error);
                                                        }
                                                    }}
                                                    className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                                >
                                                    {action.icon && <span className="mr-2">{action.icon}</span>}
                                                    {action.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        )}

                        {enableAdvancedFilters && advancedFilters.length > 0 && (
                            <Button
                                variant={showAdvancedFilters ? 'default' : 'outline'}
                                size={responsiveSettings.compactMode && isMobileView ? 'sm' : 'sm'}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className={classNames(responsiveSettings.compactMode && isMobileView && 'px-2 py-1 text-xs')}
                            >
                                <Filter className={classNames('mr-2', responsiveSettings.compactMode && isMobileView ? 'h-3 w-3' : 'h-4 w-4')} />
                                {isMobileView ? 'Filter' : 'Advanced Filter'}
                                {activeFilterGroup.rules.length > 0 && (
                                    <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                                        {activeFilterGroup.rules.length}
                                    </span>
                                )}
                            </Button>
                        )}

                        {exportSettings.enableExport && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size={responsiveSettings.compactMode && isMobileView ? 'sm' : 'sm'}
                                        disabled={isExporting}
                                        className={classNames(responsiveSettings.compactMode && isMobileView && 'px-2 py-1 text-xs')}
                                    >
                                        {isExporting ? (
                                            <Loader2
                                                className={classNames(
                                                    'mr-2 animate-spin',
                                                    responsiveSettings.compactMode && isMobileView ? 'h-3 w-3' : 'h-4 w-4',
                                                )}
                                            />
                                        ) : (
                                            <Download
                                                className={classNames('mr-2', responsiveSettings.compactMode && isMobileView ? 'h-3 w-3' : 'h-4 w-4')}
                                            />
                                        )}
                                        Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Export Data</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {exportSettings.exportFormats.includes('csv') && (
                                        <DropdownMenuItem onClick={() => handleExport('csv')} disabled={isExporting}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export CSV
                                        </DropdownMenuItem>
                                    )}
                                    {exportSettings.exportFormats.includes('excel') && (
                                        <DropdownMenuItem onClick={() => handleExport('excel')} disabled={isExporting}>
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            Export Excel
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <div className="text-muted-foreground px-2 py-1 text-xs">
                                        {exportSettings.exportAllData
                                            ? `Export semua data (${total} records)`
                                            : `Export halaman ini (${data.length} records)`}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {enableColumnVisibility && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size={responsiveSettings.compactMode && isMobileView ? 'sm' : 'sm'}
                                        className={classNames(responsiveSettings.compactMode && isMobileView && 'px-2 py-1 text-xs')}
                                    >
                                        <Settings2
                                            className={classNames('mr-2', responsiveSettings.compactMode && isMobileView ? 'h-3 w-3' : 'h-4 w-4')}
                                        />
                                        {isMobileView ? 'Kolom' : 'Kolom'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {columns.map((column) => (
                                        <DropdownMenuItem
                                            key={column.key as string}
                                            className="flex items-center space-x-2"
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <Checkbox
                                                checked={column.visible !== false}
                                                onCheckedChange={() => toggleColumnVisibility(column.key as string)}
                                            />
                                            <span className="flex-1">{column.label}</span>
                                            {column.visible !== false ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
                                        }}
                                    >
                                        Tampilkan Semua
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setColumns((prev) => prev.map((col) => ({ ...col, visible: false })));
                                        }}
                                    >
                                        Sembunyikan Semua
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Baris 2: Search + Per Page */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search Input */}
                    <div className="max-w-md flex-1">
                        <Input
                            className={classNames('w-full', responsiveSettings.compactMode && isMobileView && 'text-sm')}
                            placeholder="Cari..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Per Page Select */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className={classNames('text-sm', responsiveSettings.compactMode && isMobileView && 'text-xs')}>
                            {isMobileView ? '' : 'Tampilkan'}
                        </span>
                        <Select
                            value={String(perPage)}
                            onValueChange={(value) => {
                                setPerPage(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger
                                className={classNames(
                                    'w-20 min-w-0',
                                    responsiveSettings.compactMode && isMobileView && 'h-7 w-16 text-xs',
                                    layoutSettings.compactButtons && 'h-7',
                                )}
                                size={responsiveSettings.compactMode && isMobileView ? 'sm' : 'default'}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {perPageOptions.map((opt) => (
                                    <SelectItem key={opt} value={String(opt)}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className={classNames('text-sm', responsiveSettings.compactMode && isMobileView && 'text-xs')}></span>
                    </div>
                </div>
            </div>

            {/* Advanced Filter Panel */}
            {enableAdvancedFilters && showAdvancedFilters && (
                <div className="bg-muted/30 rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium">Advanced Filters</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={addFilterRule} disabled={advancedFilters.length === 0}>
                                <Plus className="mr-1 h-4 w-4" />
                                Add Rule
                            </Button>
                            <Button variant="outline" size="sm" onClick={clearAllFilters} disabled={activeFilterGroup.rules.length === 0}>
                                Clear All
                            </Button>
                            <Button size="sm" onClick={applyAdvancedFilters} disabled={activeFilterGroup.rules.length === 0}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>

                    {activeFilterGroup.rules.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">
                            <Filter className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>No filter rules added yet</p>
                            <p className="text-xs">Click "Add Rule" to start filtering</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeFilterGroup.rules.map((rule, index) => (
                                <div key={index} className="bg-background flex items-center gap-2 rounded-lg border p-3">
                                    {index > 0 && (
                                        <Select
                                            value={rule.condition || 'AND'}
                                            onValueChange={(value: 'AND' | 'OR') => updateFilterRule(index, { condition: value })}
                                        >
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AND">AND</SelectItem>
                                                <SelectItem value="OR">OR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}

                                    {/* Field Selection */}
                                    <Select value={rule.field} onValueChange={(value) => updateFilterRule(index, { field: value })}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Select field" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {advancedFilters.map((field) => (
                                                <SelectItem key={field.key} value={field.key}>
                                                    {field.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Operator Selection */}
                                    <Select value={rule.operator} onValueChange={(value) => updateFilterRule(index, { operator: value })}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="Operator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getOperatorsForField(rule.field).map((op) => (
                                                <SelectItem key={op} value={op}>
                                                    {op === 'equals'
                                                        ? 'Equals'
                                                        : op === 'contains'
                                                          ? 'Contains'
                                                          : op === 'startsWith'
                                                            ? 'Starts with'
                                                            : op === 'endsWith'
                                                              ? 'Ends with'
                                                              : op === 'gt'
                                                                ? 'Greater than'
                                                                : op === 'gte'
                                                                  ? 'Greater or equal'
                                                                  : op === 'lt'
                                                                    ? 'Less than'
                                                                    : op === 'lte'
                                                                      ? 'Less or equal'
                                                                      : op === 'between'
                                                                        ? 'Between'
                                                                        : op === 'in'
                                                                          ? 'In'
                                                                          : op === 'notIn'
                                                                            ? 'Not in'
                                                                            : op}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Value Input */}
                                    <div className="flex-1">
                                        {(() => {
                                            const field = advancedFilters.find((f) => f.key === rule.field);
                                            if (!field)
                                                return (
                                                    <Input
                                                        placeholder="Value"
                                                        value={String(rule.value)}
                                                        onChange={(e) => updateFilterRule(index, { value: e.target.value })}
                                                    />
                                                );

                                            if (field.type === 'select' || field.type === 'multiselect') {
                                                // Use multiselect when operator is 'in' or 'notIn'
                                                const shouldUseMultiSelect = rule.operator === 'in' || rule.operator === 'notIn';

                                                if (shouldUseMultiSelect) {
                                                    // Convert field options to Select2 format
                                                    const select2Options =
                                                        field.options?.map((opt) => ({
                                                            id: String(opt.value),
                                                            label: opt.label,
                                                        })) || [];

                                                    // Parse current value (could be string or array)
                                                    let currentValue: Array<{ id: string; label: string }> = [];
                                                    if (rule.value) {
                                                        if (Array.isArray(rule.value)) {
                                                            currentValue = rule.value.map((v) => ({
                                                                id: String(v),
                                                                label: field.options?.find((opt) => opt.value === v)?.label || String(v),
                                                            }));
                                                        } else if (typeof rule.value === 'string' && rule.value.includes(',')) {
                                                            // Handle comma-separated values
                                                            const values = rule.value.split(',');
                                                            currentValue = values.map((v) => ({
                                                                id: v.trim(),
                                                                label: field.options?.find((opt) => opt.value === v.trim())?.label || v.trim(),
                                                            }));
                                                        } else {
                                                            currentValue = [
                                                                {
                                                                    id: String(rule.value),
                                                                    label:
                                                                        field.options?.find((opt) => opt.value === rule.value)?.label ||
                                                                        String(rule.value),
                                                                },
                                                            ];
                                                        }
                                                    }

                                                    return (
                                                        <Select2
                                                            value={currentValue}
                                                            onChange={(selected) => {
                                                                if (Array.isArray(selected)) {
                                                                    const values = selected.map((item) => item.id);
                                                                    updateFilterRule(index, { value: values });
                                                                } else {
                                                                    updateFilterRule(index, { value: selected ? [selected.id] : [] });
                                                                }
                                                            }}
                                                            fetchOptions={async ({ search }) => {
                                                                const filtered = select2Options.filter((opt) =>
                                                                    opt.label.toLowerCase().includes(search.toLowerCase()),
                                                                );
                                                                return { data: filtered, hasMore: false };
                                                            }}
                                                            isMulti={true}
                                                            placeholder="Select values"
                                                        />
                                                    );
                                                } else {
                                                    // Use single select for other operators
                                                    return (
                                                        <Select
                                                            value={String(rule.value)}
                                                            onValueChange={(value) => updateFilterRule(index, { value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select value" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {field.options?.map((option) => (
                                                                    <SelectItem key={option.value} value={String(option.value)}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    );
                                                }
                                            }

                                            if (field.type === 'boolean') {
                                                return (
                                                    <Select
                                                        value={String(rule.value)}
                                                        onValueChange={(value) => updateFilterRule(index, { value: value === 'true' })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">True</SelectItem>
                                                            <SelectItem value="false">False</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                );
                                            }

                                            if (field.type === 'date') {
                                                return (
                                                    <DatePicker
                                                        value={rule.value ? new Date(String(rule.value)) : undefined}
                                                        onChange={(date) =>
                                                            updateFilterRule(index, {
                                                                value: date ? date.toISOString().split('T')[0] : '',
                                                            })
                                                        }
                                                        placeholder="Select date"
                                                    />
                                                );
                                            }

                                            if (field.type === 'daterange') {
                                                // For daterange, we expect value to be "startDate,endDate" format
                                                const dateValues = String(rule.value).split(',');
                                                const startDate = dateValues[0] ? new Date(dateValues[0]) : undefined;
                                                const endDate = dateValues[1] ? new Date(dateValues[1]) : undefined;

                                                return (
                                                    <div className="flex gap-2">
                                                        <DatePicker
                                                            value={startDate}
                                                            onChange={(date) => {
                                                                const newStartDate = date ? date.toISOString().split('T')[0] : '';
                                                                const currentEndDate = dateValues[1] || '';
                                                                updateFilterRule(index, {
                                                                    value: `${newStartDate},${currentEndDate}`,
                                                                });
                                                            }}
                                                            placeholder="Start date"
                                                        />
                                                        <DatePicker
                                                            value={endDate}
                                                            onChange={(date) => {
                                                                const currentStartDate = dateValues[0] || '';
                                                                const newEndDate = date ? date.toISOString().split('T')[0] : '';
                                                                updateFilterRule(index, {
                                                                    value: `${currentStartDate},${newEndDate}`,
                                                                });
                                                            }}
                                                            placeholder="End date"
                                                        />
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Input
                                                    type={field.type === 'number' ? 'number' : 'text'}
                                                    placeholder={field.placeholder || 'Value'}
                                                    value={String(rule.value)}
                                                    onChange={(e) =>
                                                        updateFilterRule(index, {
                                                            value: field.type === 'number' ? Number(e.target.value) : e.target.value,
                                                        })
                                                    }
                                                />
                                            );
                                        })()}
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFilterRule(index)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Top Pagination */}
            {(layoutSettings.paginationPosition === 'top' || layoutSettings.paginationPosition === 'both') && (
                <div className="border-b pb-4">
                    <PaginationComponent />
                </div>
            )}

            <div className={classNames('relative', responsiveSettings.enableResponsive && isMobileView && 'overflow-x-auto')}>
                <Table
                    className={classNames(
                        'w-full',
                        responsiveSettings.compactMode && isMobileView && 'text-sm',
                        responsiveSettings.mobileStackedView && isMobileView && 'block md:table',
                    )}
                >
                    <TableHeader className={responsiveSettings.mobileStackedView && isMobileView ? 'hidden' : ''}>
                        <TableRow>
                            {selectionSettings.enableRowSelection && (
                                <TableCell className={classNames('w-12', responsiveSettings.compactMode && isMobileView && 'px-2 py-1')}>
                                    {selectionSettings.selectionMode === 'multiple' && (
                                        <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all rows" />
                                    )}
                                </TableCell>
                            )}
                            {responsiveColumns.map((col) => (
                                <TableCell
                                    key={col.key as string}
                                    className={classNames(
                                        col.sortable ? 'cursor-pointer select-none' : '',
                                        col.width ? col.width : '',
                                        enableColumnReordering ? 'group relative' : '',
                                    )}
                                    onClick={() => col.sortable && handleSort(col.key as string)}
                                    draggable={enableColumnReordering}
                                    onDragStart={(e) => {
                                        if (enableColumnReordering) {
                                            setDraggedColumn(col.key as string);
                                            e.dataTransfer.effectAllowed = 'move';
                                        }
                                    }}
                                    onDragOver={(e) => {
                                        if (enableColumnReordering && draggedColumn) {
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = 'move';
                                        }
                                    }}
                                    onDrop={(e) => {
                                        if (enableColumnReordering && draggedColumn) {
                                            e.preventDefault();
                                            const fromIndex = columns.findIndex((c) => c.key === draggedColumn);
                                            const toIndex = columns.findIndex((c) => c.key === col.key);
                                            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                                                reorderColumns(fromIndex, toIndex);
                                            }
                                            setDraggedColumn(null);
                                        }
                                    }}
                                    onDragEnd={() => setDraggedColumn(null)}
                                >
                                    <div className="flex items-center gap-1">
                                        {enableColumnReordering && (
                                            <GripVertical className="h-4 w-4 cursor-grab opacity-0 group-hover:opacity-50 active:cursor-grabbing" />
                                        )}
                                        {col.label}
                                        {col.sortable && orderBy !== col.key && (
                                            <ChevronsUpDown className={classNames('h-4 w-4 opacity-50 transition-transform')} />
                                        )}
                                        {col.sortable && orderBy === col.key && (
                                            <ChevronDown
                                                className={classNames('h-4 w-4 transition-transform', orderDir === 'desc' ? 'rotate-180' : '')}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            ))}
                            {actions && <TableCell>Aksi</TableCell>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={responsiveColumns.length + (actions ? 1 : 0) + (selectionSettings.enableRowSelection ? 1 : 0)}>
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Memuat data...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={responsiveColumns.length + (actions ? 1 : 0) + (selectionSettings.enableRowSelection ? 1 : 0)}>
                                    <div className="py-8 text-center text-gray-500">Tidak ada data</div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={classNames(
                                        isRowSelected(row) ? 'bg-muted/50' : '',
                                        responsiveSettings.mobileStackedView && isMobileView && 'block border-b md:table-row',
                                    )}
                                >
                                    {selectionSettings.enableRowSelection && (
                                        <TableCell
                                            className={classNames(
                                                'w-12',
                                                responsiveSettings.compactMode && isMobileView && 'px-2 py-1',
                                                responsiveSettings.mobileStackedView && isMobileView && 'block md:table-cell',
                                            )}
                                        >
                                            <Checkbox
                                                checked={isRowSelected(row)}
                                                onCheckedChange={(checked) => handleRowSelect(row, checked as boolean)}
                                                aria-label={`Select row ${row.id}`}
                                            />
                                        </TableCell>
                                    )}
                                    {responsiveColumns.map((col) => (
                                        <TableCell
                                            key={col.key as string}
                                            className={classNames(
                                                responsiveSettings.compactMode && isMobileView && 'px-2 py-1',
                                                responsiveSettings.mobileStackedView && isMobileView && 'block md:table-cell',
                                            )}
                                        >
                                            {responsiveSettings.mobileStackedView && isMobileView && (
                                                <span className="text-muted-foreground mr-2 font-medium md:hidden">
                                                    {col.mobileLabel || col.label}:
                                                </span>
                                            )}
                                            {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell
                                            className={classNames(
                                                responsiveSettings.compactMode && isMobileView && 'px-2 py-1',
                                                responsiveSettings.mobileStackedView && isMobileView && 'block md:table-cell',
                                            )}
                                        >
                                            {responsiveSettings.mobileStackedView && isMobileView && (
                                                <span className="text-muted-foreground mr-2 font-medium md:hidden">Aksi:</span>
                                            )}
                                            {actions(row)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Bottom Pagination */}
            {(layoutSettings.paginationPosition === 'bottom' || layoutSettings.paginationPosition === 'both') && (
                <div className="border-t pt-4">
                    <PaginationComponent />
                </div>
            )}
        </div>
    );
}

export default DataTable;
