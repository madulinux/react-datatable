import React, { useState, useEffect} from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './ui/command';
import { Loader2, Check, ChevronsUpDown, X as XIcon } from 'lucide-react';
import { cn } from './utils/utils';

export type Select2Props<T> = {
  value: T | null | T[];
  onChange: (val: T | null | T[]) => void;
  fetchOptions: (params: { search: string; page: number }) => Promise<{ data: T[]; hasMore: boolean }>;
  renderOption?: (item: T) => React.ReactNode;
  renderSelected?: (item: T | null | T[]) => React.ReactNode;
  placeholder?: string;
  isMulti?: boolean;
  noOptionsMessage?: string | ((search: string) => React.ReactNode);
  loadingMessage?: string | React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function Select2<T extends { id: string | number; label?: string }>({
  value,
  onChange,
  fetchOptions,
  renderOption,
  renderSelected,
  placeholder = 'Pilih...',
  isMulti = false,
  noOptionsMessage = 'Tidak ada data',
  loadingMessage = 'Memuat...',
  className = '',
  disabled = false,
}: Select2Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<T | T[] | null>(value);

  // Fetch options
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setOptions([]);
    setPage(1);
    fetchOptions({ search, page: 1 }).then(res => {
      setOptions(res.data);
      setHasMore(res.hasMore);
      setLoading(false);
    });
  }, [search, open, fetchOptions]);

  // Load more options
  const loadMore = () => {
    setLoadingMore(true);
    fetchOptions({ search, page: page + 1 }).then(res => {
      setOptions(prev => [...prev, ...res.data]);
      setHasMore(res.hasMore);
      setPage(prev => prev + 1);
      setLoadingMore(false);
    });
  };

  // Sync selected from parent
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Handle select
  const handleSelect = (item: T) => {
    if (isMulti) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      const idx = arr.findIndex((x) => x.id === item.id);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(item);
      setSelected(arr);
      onChange(arr);
    } else {
      setSelected(item);
      onChange(item);
      setOpen(false);
    }
  };

  // Render selected
  const renderSelectedValue = () => {
    if (renderSelected) return renderSelected(selected);
    if (isMulti) {
      const arr = Array.isArray(selected) ? selected : [];
      if (arr.length === 0) return <span className="text-muted-foreground">{placeholder}</span>;
      return arr.map((item: T) => (
        <span key={item.id} className="inline-block bg-muted rounded px-2 py-0.5 mr-1 text-xs">{item.label ?? item.id}</span>
      ));
    }
    if (!selected) return <span className="text-muted-foreground">{placeholder}</span>;
    return <span>{(selected as any).label ?? (selected as any).id}</span>;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full min-w-[200px] justify-between', className)}
            disabled={disabled}
          >
            <span className="truncate flex-1 text-left">{renderSelectedValue()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {selected && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-0.5 rounded hover:bg-muted/70 focus:outline-none"
            onClick={e => {
              e.stopPropagation();
              setSelected(null);
              onChange(null);
            }}
            aria-label="Clear selection"
          >
            <XIcon className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder || 'Cari...'}
            value={search}
            onValueChange={setSearch}
            className="h-9"
            autoFocus
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground text-sm">
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> {loadingMessage}
              </div>
            ) : null}
            <CommandEmpty>
              {typeof noOptionsMessage === 'function' ? noOptionsMessage(search) : noOptionsMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label ?? String(item.id)}
                  onSelect={() => handleSelect(item)}
                  className={cn(
                    isMulti
                      ? Array.isArray(selected) && selected.some((x) => x.id === item.id)
                        ? 'bg-muted font-semibold' : ''
                      : (selected as any)?.id === item.id
                        ? 'bg-muted font-semibold' : ''
                  )}
                >
                  {renderOption ? renderOption(item) : (item.label ?? item.id)}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      isMulti
                        ? Array.isArray(selected) && selected.some((x) => x.id === item.id)
                          ? 'opacity-100' : 'opacity-0'
                        : (selected as any)?.id === item.id
                          ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {hasMore && !loading && (
              <div className="flex items-center justify-center py-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
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
