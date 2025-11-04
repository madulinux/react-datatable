import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { classNames } from './dataTableUtils';
import type { DataTableFilter } from './DataTable';

interface DataTableFilterInputProps {
    filter: DataTableFilter;
    value: string | number | boolean | undefined;
    onChange: (value: string | number | boolean | undefined) => void;
    compactMode?: boolean;
    isMobileView?: boolean;
}

export function DataTableFilterInput({
    filter,
    value,
    onChange,
    compactMode = false,
    isMobileView = false,
}: DataTableFilterInputProps) {
    // If custom element is provided, use it
    if (filter.customElement) {
        return <div>{filter.customElement}</div>;
    }

    const baseClassName = classNames(
        'min-w-0',
        compactMode && isMobileView && 'h-8 text-xs',
    );

    const getWidth = () => {
        if (filter.width) {
            if (typeof filter.width === 'number') return `${filter.width}px`;
            return filter.width;
        }
        // Default widths based on type
        switch (filter.type) {
            case 'boolean':
                return '120px';
            case 'number':
                return '120px';
            case 'date':
                return '180px';
            case 'daterange':
                return '280px';
            default:
                return '200px';
        }
    };

    const containerStyle = { width: getWidth() };

    // Determine filter type (default to 'select' if options provided)
    const filterType = filter.type || (filter.options ? 'select' : 'text');

    switch (filterType) {
        case 'select':
            return (
                <Select
                    value={value ? String(value) : '__all__'}
                    onValueChange={(val) => onChange(val === '__all__' ? undefined : val)}
                >
                    <SelectTrigger
                        className={classNames(baseClassName)}
                        style={containerStyle}
                        size={compactMode && isMobileView ? 'sm' : 'default'}
                    >
                        <SelectValue placeholder={filter.placeholder || filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">
                            {filter.placeholder || `Semua ${filter.label}`}
                        </SelectItem>
                        {filter.options?.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case 'multiselect':
            // For now, multiselect falls back to regular select
            // Full multiselect implementation would require additional state management
            return (
                <Select
                    value={value ? String(value) : '__all__'}
                    onValueChange={(val) => onChange(val === '__all__' ? undefined : val)}
                >
                    <SelectTrigger
                        className={classNames(baseClassName)}
                        style={containerStyle}
                        size={compactMode && isMobileView ? 'sm' : 'default'}
                    >
                        <SelectValue placeholder={filter.placeholder || filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">
                            {filter.placeholder || `Semua ${filter.label}`}
                        </SelectItem>
                        {filter.options?.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case 'search':
        case 'text':
            return (
                <Input
                    type="text"
                    placeholder={filter.placeholder || `Cari ${filter.label}...`}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value || undefined)}
                    className={classNames(baseClassName)}
                    style={containerStyle}
                />
            );

        case 'number':
            return (
                <Input
                    type="number"
                    placeholder={filter.placeholder || filter.label}
                    value={value !== undefined ? String(value) : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : Number(val));
                    }}
                    className={classNames(baseClassName)}
                    style={containerStyle}
                />
            );

        case 'date':
            // Date picker temporarily disabled due to React bundling issues
            // Use text input as fallback
            return (
                <Input
                    type="date"
                    placeholder={filter.placeholder || filter.label}
                    value={value ? String(value).split('T')[0] : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : new Date(val).toISOString());
                    }}
                    className={classNames(baseClassName)}
                    style={containerStyle}
                />
            );

        case 'daterange':
            // Date range temporarily uses single date input
            // Full implementation would require state management for from/to dates
            return (
                <Input
                    type="date"
                    placeholder={filter.placeholder || 'Pilih tanggal'}
                    value={value ? String(value).split('T')[0] : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : new Date(val).toISOString());
                    }}
                    className={classNames(baseClassName)}
                    style={containerStyle}
                />
            );

        case 'boolean':
            return (
                <div className="flex items-center gap-2" style={containerStyle}>
                    <Checkbox
                        id={`filter-${filter.key}`}
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => onChange(checked as boolean)}
                    />
                    <label
                        htmlFor={`filter-${filter.key}`}
                        className={classNames(
                            'text-sm cursor-pointer select-none',
                            compactMode && isMobileView && 'text-xs'
                        )}
                    >
                        {filter.label}
                    </label>
                </div>
            );

        default:
            return null;
    }
}
