import DataTable, { DataTableProps, DataTableColumn, DataTableFilter } from './DataTable';
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

// Export types
export type { DataTableProps, DataTableColumn, DataTableFilter };

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

// Export main component as default
export default DataTable;
