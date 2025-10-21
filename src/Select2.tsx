import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./ui/command";
import { Loader2, Check, ChevronsUpDown, X as XIcon } from "lucide-react";
import { cn } from "./lib/utils";

/**
 * Props for the Select2 component
 * @template T - The type of items in the select, must have id and optional label
 */
export type Select2Props<T> = {
  /** Current selected value(s) */
  value: T | null | T[];
  /** Callback when selection changes */
  onChange: (val: T | null | T[]) => void;
  /** Function to fetch options with search and pagination */
  fetchOptions: (params: {
    search: string;
    page: number;
  }) => Promise<{ data: T[]; hasMore: boolean }>;
  /** Custom render function for each option */
  renderOption?: (item: T) => React.ReactNode;
  /** Custom render function for selected value(s) */
  renderSelected?: (item: T | null | T[]) => React.ReactNode;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Enable multi-select mode */
  isMulti?: boolean;
  /** Message when no options available */
  noOptionsMessage?: string | ((search: string) => React.ReactNode);
  /** Message during loading */
  loadingMessage?: string | React.ReactNode;
  /** Message when error occurs */
  errorMessage?: string | ((error: Error) => React.ReactNode);
  /** Additional CSS classes */
  className?: string;
  /** Disable the select */
  disabled?: boolean;
  /** Debounce delay in milliseconds for search input (default: 300) */
  debounceMs?: number;
  /** Minimum characters required before fetching options (default: 0) */
  minInput?: number;
  /** Maximum number of items that can be selected in multi-select mode */
  maxSelections?: number;
  /** Show Select All / Clear All buttons in multi-select mode */
  showSelectAll?: boolean;
  /** Callback when max selections reached */
  onMaxSelectionsReached?: () => void;
};

/**
 * Select2 - Advanced select component with async data fetching, search, and multi-select support
 * 
 * @template T - Type of items, must have `id` and optional `label` properties
 * 
 * @example
 * // Single select
 * <Select2
 *   value={selectedUser}
 *   onChange={setSelectedUser}
 *   fetchOptions={async ({ search, page }) => ({
 *     data: await fetchUsers(search, page),
 *     hasMore: true
 *   })}
 * />
 * 
 * @example
 * // Multi-select with max selections
 * <Select2
 *   isMulti
 *   maxSelections={5}
 *   value={selectedItems}
 *   onChange={setSelectedItems}
 *   fetchOptions={fetchItems}
 *   onMaxSelectionsReached={() => toast.error('Max 5 items')}
 * />
 * 
 * @example
 * // With minimum input length (for large datasets)
 * <Select2
 *   value={selectedCity}
 *   onChange={setSelectedCity}
 *   fetchOptions={fetchCities}
 *   minInput={2}
 *   placeholder="Ketik minimal 2 huruf..."
 * />
 * 
 * @param props - Select2Props<T>
 * @returns React component
 */
export function Select2<T extends { id: string | number; label?: string }>({
  value,
  onChange,
  fetchOptions,
  renderOption,
  renderSelected,
  placeholder = "Pilih...",
  isMulti = false,
  noOptionsMessage = "Tidak ada data",
  loadingMessage = "Memuat...",
  errorMessage = "Terjadi kesalahan saat memuat data",
  className = "",
  disabled = false,
  debounceMs = 300,
  minInput = 0,
  maxSelections,
  showSelectAll = true,
  onMaxSelectionsReached,
}: Select2Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selected, setSelected] = useState<T | T[] | null>(value);
  const [announcement, setAnnouncement] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorMessageId = useRef(`select2-error-${Math.random().toString(36).substr(2, 9)}`);
  const descriptionId = useRef(`select2-desc-${Math.random().toString(36).substr(2, 9)}`);

  // Debounce search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search, debounceMs]);

  // Fetch options with error handling and cleanup
  useEffect(() => {
    if (!open) return;

    // Check minimum input length
    if (minInput > 0 && debouncedSearch.length < minInput) {
      setOptions([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setOptions([]);
    setPage(1);

    fetchOptions({ search: debouncedSearch, page: 1 })
      .then((res) => {
        if (!controller.signal.aborted) {
          setOptions(res.data);
          setHasMore(res.hasMore);
          setLoading(false);
          // Announce results for screen readers
          const count = res.data.length;
          setAnnouncement(
            count === 0
              ? "Tidak ada hasil ditemukan"
              : `${count} hasil ditemukan`
          );
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
          setAnnouncement("Terjadi kesalahan saat memuat data");
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedSearch, open, fetchOptions, minInput]);

  // Load more options with error handling
  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setError(null);
    fetchOptions({ search: debouncedSearch, page: page + 1 })
      .then((res) => {
        setOptions((prev) => [...prev, ...res.data]);
        setHasMore(res.hasMore);
        setPage((prev) => prev + 1);
        setLoadingMore(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoadingMore(false);
      });
  }, [debouncedSearch, page, fetchOptions]);

  // Sync selected from parent
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Handle select with max selection check
  const handleSelect = useCallback((item: T) => {
    if (isMulti) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      const idx = arr.findIndex((x) => x.id === item.id);
      
      if (idx > -1) {
        // Remove item
        arr.splice(idx, 1);
        setSelected(arr);
        onChange(arr);
        setAnnouncement(`${item.label ?? item.id} dihapus dari pilihan`);
      } else {
        // Add item - check max selections
        if (maxSelections && arr.length >= maxSelections) {
          setAnnouncement(`Maksimal ${maxSelections} item dapat dipilih`);
          onMaxSelectionsReached?.();
          return;
        }
        arr.push(item);
        setSelected(arr);
        onChange(arr);
        setAnnouncement(`${item.label ?? item.id} ditambahkan ke pilihan`);
      }
    } else {
      setSelected(item);
      onChange(item);
      setOpen(false);
      setAnnouncement(`${item.label ?? item.id} dipilih`);
    }
  }, [isMulti, selected, onChange, maxSelections, onMaxSelectionsReached]);

  // Handle remove item from multi-select
  const handleRemoveItem = useCallback((item: T, e: React.MouseEvent) => {
    e.stopPropagation();
    const arr = Array.isArray(selected) ? [...selected] : [];
    const filtered = arr.filter((x) => x.id !== item.id);
    setSelected(filtered);
    onChange(filtered);
    setAnnouncement(`${item.label ?? item.id} dihapus`);
  }, [selected, onChange]);

  // Handle clear all
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(isMulti ? [] : null);
    onChange(isMulti ? [] : null);
    setAnnouncement("Semua pilihan dihapus");
  }, [isMulti, onChange]);

  // Handle select all for multi-select
  const handleSelectAll = useCallback(() => {
    if (!isMulti) return;
    
    const currentSelected = Array.isArray(selected) ? selected : [];
    const allOptions = options;
    
    // Check if applying max selections
    const itemsToAdd = maxSelections
      ? allOptions.slice(0, Math.max(0, maxSelections - currentSelected.length))
      : allOptions;
    
    // Merge with existing, avoiding duplicates
    const existingIds = new Set(currentSelected.map(item => item.id));
    const newItems = itemsToAdd.filter(item => !existingIds.has(item.id));
    const merged = [...currentSelected, ...newItems];
    
    setSelected(merged);
    onChange(merged);
    
    if (maxSelections && merged.length >= maxSelections) {
      setAnnouncement(`${merged.length} item dipilih (maksimal ${maxSelections})`);
    } else {
      setAnnouncement(`${merged.length} item dipilih`);
    }
  }, [isMulti, selected, options, onChange, maxSelections]);

  // Handle clear all selections in multi-select
  const handleClearAllSelections = useCallback(() => {
    if (!isMulti) return;
    setSelected([]);
    onChange([]);
    setAnnouncement("Semua pilihan dihapus");
  }, [isMulti, onChange]);

  // Keyboard handler for backspace to remove last item
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isMulti || !open) return;
    
    // Backspace to remove last selected item when search is empty
    if (e.key === "Backspace" && search === "") {
      const arr = Array.isArray(selected) ? selected : [];
      if (arr.length > 0) {
        const lastItem = arr[arr.length - 1];
        const filtered = arr.slice(0, -1);
        setSelected(filtered);
        onChange(filtered);
        setAnnouncement(`${lastItem.label ?? lastItem.id} dihapus`);
        e.preventDefault();
      }
    }
  }, [isMulti, open, search, selected, onChange]);

  // Check if item is selected
  const isItemSelected = useCallback((item: T): boolean => {
    if (isMulti) {
      return Array.isArray(selected) && selected.some((x) => x.id === item.id);
    }
    return selected !== null && (selected as T).id === item.id;
  }, [isMulti, selected]);

  // Get selected count for multi-select
  const selectedCount = isMulti && Array.isArray(selected) ? selected.length : 0;

  // Check if max selections reached
  const isMaxReached = maxSelections ? selectedCount >= maxSelections : false;

  // Render selected with proper typing
  const renderSelectedValue = () => {
    if (renderSelected) return renderSelected(selected);
    if (isMulti) {
      const arr = Array.isArray(selected) ? selected : [];
      if (arr.length === 0)
        return <span className="text-muted-foreground">{placeholder}</span>;
      return arr.map((item: T) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-1 bg-muted rounded px-2 py-0.5 mr-1 text-xs"
        >
          <span>{item.label ?? item.id}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => handleRemoveItem(item, e)}
              className="hover:bg-muted-foreground/20 rounded-full p-0.5"
              aria-label={`Remove ${item.label ?? item.id}`}
            >
              <XIcon className="h-3 w-3" />
            </button>
          )}
        </span>
      ));
    }
    if (!selected)
      return <span className="text-muted-foreground">{placeholder}</span>;
    const singleItem = selected as T;
    return <span>{singleItem.label ?? singleItem.id}</span>;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        {/* Screen reader announcements */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="select2-listbox"
            aria-describedby={error ? errorMessageId.current : descriptionId.current}
            className={cn("w-full min-w-[200px] justify-between", className)}
            disabled={disabled}
          >
            <span className="truncate flex-1 text-left">
              {renderSelectedValue()}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {selected && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-0.5 rounded hover:bg-muted/70 focus:outline-none"
            onClick={handleClear}
            aria-label="Clear selection"
          >
            <XIcon className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <PopoverContent className="w-[300px] p-0" id="select2-listbox">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder={placeholder || "Cari..."}
            value={search}
            onValueChange={setSearch}
            className="h-9"
            autoFocus
            aria-label="Cari opsi"
            aria-describedby={descriptionId.current}
          />
          <span id={descriptionId.current} className="sr-only">
            {isMulti
              ? `Mode multi-select. ${selectedCount} item dipilih${maxSelections ? `, maksimal ${maxSelections}` : ""}. Gunakan arrow keys untuk navigasi, Enter untuk memilih, Backspace untuk menghapus item terakhir.`
              : "Gunakan arrow keys untuk navigasi, Enter untuk memilih."}
            {minInput > 0 && ` Minimal ${minInput} karakter untuk mencari.`}
          </span>
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                {loadingMessage}
              </div>
            ) : null}
            {error && !loading ? (
              <div
                className="flex flex-col items-center justify-center py-6 text-destructive text-sm px-4"
                role="alert"
                aria-live="assertive"
                id={errorMessageId.current}
              >
                <p className="text-center">
                  {typeof errorMessage === "function"
                    ? errorMessage(error)
                    : errorMessage}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setDebouncedSearch(search);
                  }}
                  className="mt-2"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : null}
            <CommandEmpty>
              {minInput > 0 && search.length < minInput ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Ketik minimal {minInput} karakter untuk mencari
                </div>
              ) : (
                typeof noOptionsMessage === "function"
                  ? noOptionsMessage(search)
                  : noOptionsMessage
              )}
            </CommandEmpty>
            {isMulti && showSelectAll && options.length > 0 && !loading && !error && (
              <div className="flex items-center gap-2 px-2 py-1.5 border-b">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSelectAll}
                  disabled={isMaxReached}
                  className="flex-1 h-7 text-xs"
                  type="button"
                >
                  Pilih Semua{maxSelections ? ` (Max ${maxSelections})` : ""}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearAllSelections}
                  disabled={selectedCount === 0}
                  className="flex-1 h-7 text-xs"
                  type="button"
                >
                  Hapus Semua
                </Button>
              </div>
            )}
            <CommandGroup role="listbox">
              {options.map((item) => {
                const itemSelected = isItemSelected(item);
                const canSelect = !isMulti || !isMaxReached || itemSelected;
                
                return (
                  <CommandItem
                    key={item.id}
                    value={item.label ?? String(item.id)}
                    onSelect={() => canSelect && handleSelect(item)}
                    disabled={!canSelect}
                    className={cn(
                      itemSelected ? "bg-muted font-semibold" : "",
                      !canSelect && "opacity-50 cursor-not-allowed"
                    )}
                    role="option"
                    aria-selected={itemSelected}
                  >
                    {renderOption ? renderOption(item) : item.label ?? item.id}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        itemSelected ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {hasMore && !loading && (
              <div className="flex items-center justify-center py-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : null}
                  Muat lebih banyak
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Select2;
