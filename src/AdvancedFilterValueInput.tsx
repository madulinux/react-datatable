import React from 'react';
import Select2 from './Select2';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { DataTableAdvancedFilter, DataTableFilterRule } from './DataTable';

interface AdvancedFilterValueInputProps {
    field: DataTableAdvancedFilter | undefined;
    rule: DataTableFilterRule;
    onUpdate: (value: string | number | boolean | string[] | number[] | [string | number, string | number]) => void;
}

/**
 * AdvancedFilterValueInput - Input component for advanced filter values
 * Renders appropriate input based on field type and operator
 */
export function AdvancedFilterValueInput({ field, rule, onUpdate }: AdvancedFilterValueInputProps) {
    // Default input if field not found
    if (!field) {
        return (
            <Input
                placeholder="Value"
                value={String(rule.value)}
                onChange={(e) => onUpdate(e.target.value)}
            />
        );
    }

    // Select or Multiselect field
    if (field.type === 'select' || field.type === 'multiselect') {
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
                            label: field.options?.find((opt) => opt.value === rule.value)?.label || String(rule.value),
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
                            onUpdate(values);
                        } else {
                            onUpdate(selected ? [selected.id] : []);
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
                <Select value={String(rule.value)} onValueChange={(value) => onUpdate(value)}>
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

    // Boolean field
    if (field.type === 'boolean') {
        return (
            <Select value={String(rule.value)} onValueChange={(value) => onUpdate(value === 'true')}>
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

    // Date field
    if (field.type === 'date') {
        return (
            <DatePicker
                value={rule.value ? new Date(String(rule.value)) : undefined}
                onChange={(date) => onUpdate(date ? date.toISOString().split('T')[0] : '')}
                placeholder="Select date"
            />
        );
    }

    // Date range field
    if (field.type === 'daterange') {
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
                        onUpdate(`${newStartDate},${currentEndDate}`);
                    }}
                    placeholder="Start date"
                />
                <DatePicker
                    value={endDate}
                    onChange={(date) => {
                        const currentStartDate = dateValues[0] || '';
                        const newEndDate = date ? date.toISOString().split('T')[0] : '';
                        onUpdate(`${currentStartDate},${newEndDate}`);
                    }}
                    placeholder="End date"
                />
            </div>
        );
    }

    // Default: text or number input
    return (
        <Input
            type={field.type === 'number' ? 'number' : 'text'}
            placeholder={field.placeholder || 'Value'}
            value={String(rule.value)}
            onChange={(e) => onUpdate(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        />
    );
}

export default AdvancedFilterValueInput;
