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

export {Select2};
// Export main component as default
export default DataTable;
