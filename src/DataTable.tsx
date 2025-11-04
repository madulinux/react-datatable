import Select2 from './Select2';
import { DataTablePagination } from './DataTablePagination';
import { AdvancedFilterValueInput } from './AdvancedFilterValueInput';
import { DataTableFilterInput } from './DataTableFilterInput';
import {
    classNames,
    DATATABLE_CONSTANTS,
    getResponsiveClasses,
    getResponsiveTextClasses,
    getResponsiveButtonClasses,
    formatOperatorLabel,
    getDefaultOperators,
    toError,
    getColumnStyle,
    getAlignmentClass,
} from './dataTableUtils';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export interface DataTableColumn<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    width?: string | number; // CSS width value (e.g., '200px', '20%', 200)
    minWidth?: string | number; // CSS min-width value
    maxWidth?: string | number; // CSS max-width value
    visible?: boolean;
    pinned?: boolean; // For future: pin columns left/right
    priority?: number; // 1 = highest priority (always show), 5 = lowest (hide first on mobile)
    mobileLabel?: string; // Custom label for mobile view
    headerClassName?: string; // Custom className for header cell
    cellClassName?: string; // Custom className for body cells
    align?: 'left' | 'center' | 'right'; // Text alignment
}

export interface DataTableFilter {
    key: string;
    label: string;
    options?: { value: string | number; label: string }[];
    customElement?: React.ReactNode;
    type?: 'select' | 'multiselect' | 'daterange' | 'date' | 'search' | 'number' | 'boolean' | 'text';
    placeholder?: string;
    searchable?: boolean; // For multiselect with search
    width?: string | number; // Custom width for filter input
    // For async select/multiselect
    fetchOptions?: (params: { search: string; page: number }) => Promise<{
        data: { id: number | string; label: string }[];
        hasMore: boolean;
    }>;
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

export interface DataTableHeaderConfig {
    showHeader?: boolean; // Show/hide table header (default: true)
    stickyHeader?: boolean; // Make header sticky on scroll (default: false)
    headerClassName?: string; // Custom className for entire header
    headerRowClassName?: string; // Custom className for header row
    headerHeight?: string | number; // Custom header height
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
    headerConfig?: DataTableHeaderConfig; // New: Header customization
    layoutConfig?: DataTableLayoutConfig;
    advancedFilters?: DataTableAdvancedFilter[];
    enableAdvancedFilters?: boolean;
    onAdvancedFilter?: (filterGroup: DataTableFilterGroup) => void;
}

// Constants imported from dataTableUtils

/**
 * DataTable - Advanced data table component with sorting, filtering, pagination, and more
 * 
 * @template T - Type of data items, must have id property
 * 
 * @example
 * // Basic usage
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'email', label: 'Email' }
 *   ]}
 *   fetchData={async ({ page, perPage, search }) => {
 *     const res = await fetch(`/api/users?page=${page}`);
 *     return res.json();
 *   }}
 * />
 * 
 * @example
 * // With all features
 * <DataTable
 *   columns={columns}
 *   fetchData={fetchUsers}
 *   filters={filters}
 *   selectionConfig={{ enableRowSelection: true }}
 *   exportConfig={{ enableExport: true }}
 *   enableColumnVisibility
 *   enableAdvancedFilters
 * />
 */
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
    headerConfig,
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
    const [filterValues, setFilterValues] = useState<Record<string, string | number | boolean | undefined>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

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
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    // Get visible columns (memoized)
    const visibleColumns = useMemo(
        () => columns.filter((col) => col.visible !== false),
        [columns],
    );

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
    // If externalFilterValues is provided, it's controlled mode
    // Otherwise use internal filterValues state
    const activeFilterValues = useMemo(() => {
        const values = externalFilterValues !== undefined ? externalFilterValues : filterValues;
        console.log('activeFilterValues updated:', values, 'from', externalFilterValues !== undefined ? 'external' : 'internal');
        return values;
    }, [externalFilterValues, filterValues]);

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
            } catch (err) {
                const error = toError(err);
                console.error('Export failed:', error);
                setError(error);
            } finally {
                setIsExporting(false);
            }
        },
        [exportSettings, isExporting, page, perPage, search, orderBy, orderDir, activeFilterValues, visibleColumns],
    );

    const fetchTableData = useCallback(async () => {
        console.log('Fetching data with filters:', activeFilterValues);
        setLoading(true);
        setError(null);
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
        } catch (err) {
            const error = toError(err);
            setError(error);
            setData([]);
            setTotal(0);
            console.error('Failed to fetch table data:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchData, page, perPage, search, orderBy, orderDir, activeFilterValues]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData, refreshTrigger]);

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

    const handleFilterChange = (key: string, value: string | number | boolean | undefined) => {
        console.log('Filter changed:', key, value);
        
        // If using controlled mode (externalFilterValues provided), warn user
        if (externalFilterValues !== undefined) {
            console.warn(
                '⚠️ DataTable is in CONTROLLED mode (filterValues prop provided).\n' +
                'Filter changes will NOT trigger fetch unless you update the filterValues prop.\n' +
                'Either:\n' +
                '1. Remove filterValues prop to use UNCONTROLLED mode (recommended), or\n' +
                '2. Handle filter changes and update filterValues prop yourself.'
            );
        }
        
        setFilterValues((prev) => {
            const newFilters = { ...prev, [key]: value };
            console.log('New filter values (internal):', newFilters);
            return newFilters;
        });
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
            return field.operators || getDefaultOperators(field.type);
        },
        [advancedFilters],
    );

    // Pagination handler
    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    return (
        <div className={classNames('space-y-4', className)}>
            {/* Toolbar dengan 2 baris layout */}
            <div className="space-y-3">
                {/* Baris 1: Filters + Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-2">
                        {filters.length > 0 && filters.map((filter) => 
                            React.createElement(DataTableFilterInput, {
                                key: filter.key,
                                filter: filter,
                                value: filterValues[filter.key],
                                onChange: (value: string | number | boolean | undefined) => handleFilterChange(filter.key, value),
                                compactMode: responsiveSettings.compactMode,
                                isMobileView: isMobileView,
                            })
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
                                                    {formatOperatorLabel(op)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Value Input */}
                                    <div className="flex-1">
                                        <AdvancedFilterValueInput
                                            field={advancedFilters.find((f) => f.key === rule.field)}
                                            rule={rule}
                                            onUpdate={(value) => updateFilterRule(index, { value })}
                                        />
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

            {/* Error Display */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800">Terjadi Kesalahan</h3>
                            <p className="mt-1 text-sm text-red-700">{error.message}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setError(null);
                                fetchTableData();
                            }}
                            className="border-red-300 text-red-700 hover:bg-red-100"
                        >
                            Coba Lagi
                        </Button>
                    </div>
                </div>
            )}

            {/* Top Pagination */}
            {(layoutSettings.paginationPosition === 'top' || layoutSettings.paginationPosition === 'both') && (
                <div className="border-b pb-4">
                    <DataTablePagination
                        page={page}
                        totalPages={totalPages}
                        perPage={perPage}
                        total={total}
                        dataLength={data.length}
                        screenSize={screenSize}
                        showRecordInfo={layoutSettings.showRecordInfo}
                        paginationAlignment={layoutSettings.paginationAlignment}
                        compactMode={responsiveSettings.compactMode}
                        isMobileView={isMobileView}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            <div className={classNames('overflow-hidden rounded-md border', responsiveSettings.enableResponsive && isMobileView && 'overflow-x-auto')}>
                <Table
                    className={classNames(
                        'w-full',
                        responsiveSettings.compactMode && isMobileView && 'text-sm',
                        responsiveSettings.mobileStackedView && isMobileView && 'block md:table',
                    )}
                >
                    {(headerConfig?.showHeader !== false) && (
                        <TableHeader 
                            className={classNames(
                                responsiveSettings.mobileStackedView && isMobileView && 'hidden',
                                headerConfig?.stickyHeader && 'sticky top-0 z-10 bg-background',
                                headerConfig?.headerClassName
                            )}
                            style={headerConfig?.headerHeight ? { height: typeof headerConfig.headerHeight === 'number' ? `${headerConfig.headerHeight}px` : headerConfig.headerHeight } : undefined}
                        >
                        <TableRow>
                            {selectionSettings.enableRowSelection && (
                                <TableHead className={getResponsiveClasses(DATATABLE_CONSTANTS.CHECKBOX_WIDTH, responsiveSettings.compactMode, isMobileView)}>
                                    {selectionSettings.selectionMode === 'multiple' && (
                                        <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all rows" />
                                    )}
                                </TableHead>
                            )}
                            {responsiveColumns.map((col) => (
                                <TableHead
                                    key={col.key as string}
                                    className={classNames(
                                        col.sortable ? 'cursor-pointer select-none' : '',
                                        enableColumnReordering ? 'group relative' : '',
                                        draggedColumn === col.key && 'opacity-50',
                                        dragOverColumn === col.key && 'bg-blue-50 border-l-2 border-blue-500',
                                        getAlignmentClass(col.align),
                                        col.headerClassName
                                    )}
                                    style={getColumnStyle(col)}
                                    role={col.sortable ? 'button' : undefined}
                                    tabIndex={col.sortable ? 0 : undefined}
                                    onClick={() => col.sortable && handleSort(col.key as string)}
                                    onKeyDown={(e) => {
                                        if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault();
                                            handleSort(col.key as string);
                                        }
                                    }}
                                    aria-sort={
                                        col.sortable && orderBy === col.key
                                            ? (orderDir === 'asc' ? 'ascending' : 'descending')
                                            : undefined
                                    }
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
                                            setDragOverColumn(col.key as string);
                                        }
                                    }}
                                    onDragLeave={() => {
                                        if (enableColumnReordering) {
                                            setDragOverColumn(null);
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
                                    onDragEnd={() => {
                                        setDraggedColumn(null);
                                        setDragOverColumn(null);
                                    }}
                                >
                                    <div className="flex items-center gap-1">
                                        {enableColumnReordering && (
                                            <GripVertical 
                                                className={classNames(
                                                    'h-4 w-4 cursor-grab opacity-0 group-hover:opacity-50 active:cursor-grabbing',
                                                    draggedColumn === col.key && 'opacity-100'
                                                )} 
                                            />
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
                                </TableHead>
                            ))}
                            {actions && <TableHead className="font-semibold px-2 py-2">Aksi</TableHead>}
                        </TableRow>
                        </TableHeader>
                    )}
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
                                                getResponsiveClasses(DATATABLE_CONSTANTS.CHECKBOX_WIDTH, responsiveSettings.compactMode, isMobileView),
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
                                                getResponsiveClasses('', responsiveSettings.compactMode, isMobileView),
                                                responsiveSettings.mobileStackedView && isMobileView && 'block md:table-cell',
                                                getAlignmentClass(col.align),
                                                col.cellClassName
                                            )}
                                            style={getColumnStyle(col)}
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
                                                getResponsiveClasses('', responsiveSettings.compactMode, isMobileView),
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
                    <DataTablePagination
                        page={page}
                        totalPages={totalPages}
                        perPage={perPage}
                        total={total}
                        dataLength={data.length}
                        screenSize={screenSize}
                        showRecordInfo={layoutSettings.showRecordInfo}
                        paginationAlignment={layoutSettings.paginationAlignment}
                        compactMode={responsiveSettings.compactMode}
                        isMobileView={isMobileView}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}

export default DataTable;
