/**
 * Utility functions for DataTable component
 */

import React from 'react';

/**
 * Combines multiple class names, filtering out falsy values
 */
export function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Convert width value to CSS string
 * Accepts: '200px', '20%', 200 (converts to '200px')
 */
export function getCSSWidth(width?: string | number): string | undefined {
    if (!width) return undefined;
    if (typeof width === 'number') return `${width}px`;
    return width;
}

/**
 * Get column style object with width, minWidth, maxWidth
 */
export function getColumnStyle(column: {
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
}): React.CSSProperties {
    const style: React.CSSProperties = {};
    
    if (column.width) style.width = getCSSWidth(column.width);
    if (column.minWidth) style.minWidth = getCSSWidth(column.minWidth);
    if (column.maxWidth) style.maxWidth = getCSSWidth(column.maxWidth);
    
    return style;
}

/**
 * Get text alignment class
 */
export function getAlignmentClass(align?: 'left' | 'center' | 'right'): string {
    if (!align || align === 'left') return 'text-left';
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
}

/**
 * Constants for DataTable styling
 */
export const DATATABLE_CONSTANTS = {
    CHECKBOX_WIDTH: 'w-12',
    RESPONSIVE_CLASSES: {
        compactCell: 'px-2 py-1',
        compactText: 'text-xs',
        compactButton: 'px-2 py-1 text-xs',
    },
    PAGINATION: {
        maxPagesMobile: 3,
        maxPagesDesktop: 5,
    },
} as const;

/**
 * Get responsive classes based on settings
 */
export function getResponsiveClasses(
    base: string = '',
    compactMode: boolean = false,
    isMobileView: boolean = false,
): string {
    return classNames(
        base,
        compactMode && isMobileView && DATATABLE_CONSTANTS.RESPONSIVE_CLASSES.compactCell,
    );
}

/**
 * Get responsive text classes
 */
export function getResponsiveTextClasses(
    base: string = '',
    compactMode: boolean = false,
    isMobileView: boolean = false,
): string {
    return classNames(
        base,
        compactMode && isMobileView && DATATABLE_CONSTANTS.RESPONSIVE_CLASSES.compactText,
    );
}

/**
 * Get responsive button classes
 */
export function getResponsiveButtonClasses(
    base: string = '',
    compactMode: boolean = false,
    isMobileView: boolean = false,
): string {
    return classNames(
        base,
        compactMode && isMobileView && DATATABLE_CONSTANTS.RESPONSIVE_CLASSES.compactButton,
    );
}

/**
 * Format operator label for display
 */
export function formatOperatorLabel(operator: string): string {
    const operatorLabels: Record<string, string> = {
        equals: 'Equals',
        contains: 'Contains',
        startsWith: 'Starts with',
        endsWith: 'Ends with',
        gt: 'Greater than',
        gte: 'Greater or equal',
        lt: 'Less than',
        lte: 'Less or equal',
        between: 'Between',
        in: 'In',
        notIn: 'Not in',
    };

    return operatorLabels[operator] || operator;
}

/**
 * Get default operators for a field type
 */
export function getDefaultOperators(fieldType: string): string[] {
    switch (fieldType) {
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
}

/**
 * Safe error conversion
 */
export function toError(err: unknown): Error {
    return err instanceof Error ? err : new Error(String(err));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
