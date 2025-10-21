import DataTable, { 
  DataTableProps, 
  DataTableColumn, 
  DataTableFilter,
  DataTableAdvancedFilter,
  DataTableFilterRule,
  DataTableFilterGroup,
  DataTableExportConfig,
  DataTableBulkAction,
  DataTableSelectionConfig,
  DataTableResponsiveConfig,
  DataTableLayoutConfig
} from './DataTable';
import { DataTablePagination } from './DataTablePagination';
import { AdvancedFilterValueInput } from './AdvancedFilterValueInput';
import * as DataTableUtils from './dataTableUtils';
import { 
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  getPaginationRange
} from './ui/pagination';

import {Select2, Select2Props} from './Select2';
import { cn } from './lib/utils';

// Export all types
export type { 
  DataTableProps, 
  DataTableColumn, 
  DataTableFilter,
  DataTableAdvancedFilter,
  DataTableFilterRule,
  DataTableFilterGroup,
  DataTableExportConfig,
  DataTableBulkAction,
  DataTableSelectionConfig,
  DataTableResponsiveConfig,
  DataTableLayoutConfig,
  Select2Props
};

// Export pagination components and utilities
export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  getPaginationRange
};

// Export utility functions
export { cn };

export { Select2 };
export { DataTablePagination };
export { AdvancedFilterValueInput };
export { DataTableUtils };

// Export main component as default
export default DataTable;
