import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "./ui/table";
import { Input } from "./ui/input";
import { ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  getPaginationRange,
} from "./ui/pagination";

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  options?: { value: string | number; label: string }[];
  customElement?: React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  fetchData: (params: {
    page: number;
    perPage: number;
    search: string;
    orderBy: string;
    orderDir: "asc" | "desc";
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
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function DataTable<T extends { id: number | string }>({
  columns,
  fetchData,
  filters = [],
  actions,
  perPageOptions = [10, 25, 50],
  defaultPerPage = 10,
  className = "",
  filterValues: externalFilterValues,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<string>("");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");
  const [filterValues, setFilterValues] = useState<
    Record<string, string | number | undefined>
  >({});
  const [loading, setLoading] = useState(false);

  // Use external filterValues if provided, otherwise internal state
  const activeFilterValues = externalFilterValues ?? filterValues;

  const fetchTableData = async () => {
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
  };

  useEffect(() => {
    fetchTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    perPage,
    search,
    orderBy,
    orderDir,
    JSON.stringify(activeFilterValues),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const handleSort = (key: string) => {
    if (orderBy === key) {
      setOrderDir(orderDir === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(key);
      setOrderDir("asc");
    }
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className={classNames("space-y-4", className)}>
      <div className="flex flex-wrap items-end gap-2 justify-between">
        <Input
          className="w-64"
          placeholder="Cari..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {filters.length > 0 && (
          <div className="flex gap-2">
            {filters.map((filter) =>
              filter.customElement ? (
                <div key={filter.key}>{filter.customElement}</div>
              ) : (
                <select
                  key={filter.key}
                  className="border rounded px-2 py-1 text-sm"
                  value={filterValues[filter.key] ?? ""}
                  onChange={(e) =>
                    handleFilterChange(filter.key, e.target.value)
                  }
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )
            )}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm">Tampilkan</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-sm">/ halaman</span>
        </div>
      </div>
      <div className="relative">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key as string}
                  className={classNames(
                    col.sortable ? "cursor-pointer select-none" : "",
                    col.width ? col.width : ""
                  )}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && orderBy !== col.key && (
                      <ChevronsUpDown
                        className={classNames(
                          "w-4 h-4 transition-transform opacity-50"
                        )}
                      />
                    )}
                    {col.sortable && orderBy === col.key && (
                      <ChevronDown
                        className={classNames(
                          "w-4 h-4 transition-transform",
                          orderDir === "desc" ? "rotate-180" : ""
                        )}
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
                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" /> Memuat
                    data...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)}>
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada data
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key as string}>
                      {col.render
                        ? col.render(row)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-gray-600">
          Menampilkan {data.length === 0 ? 0 : (page - 1) * perPage + 1}
          {" - "}
          {data.length === 0 ? 0 : (page - 1) * perPage + data.length}
          {" dari "}
          {total} data
        </div>
        {/* Custom Pagination */}
        <div className="w-full flex justify-end">
          {/* Import komponen custom */}
          {/* Pagination navigation */}
          {/* Hanya tampil jika totalPages > 1 */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage((prev) => prev - 1);
                    }}
                    aria-disabled={page === 1}
                    style={
                      page === 1 ? { pointerEvents: "none", opacity: 0.5 } : {}
                    }
                  />
                </PaginationItem>
                {/* Render page numbers (simple) */}
                {getPaginationRange(page, totalPages, 1).map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={page === p}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(p as number);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage((prev) => prev + 1);
                    }}
                    aria-disabled={page === totalPages}
                    style={
                      page === totalPages
                        ? { pointerEvents: "none", opacity: 0.5 }
                        : {}
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataTable;
