# Header Configuration Guide

## Overview
Version 1.0.4 introduces comprehensive header customization and proper column width handling.

## New Interfaces

### DataTableHeaderConfig
Control table header appearance and behavior:

```typescript
interface DataTableHeaderConfig {
    showHeader?: boolean;        // Show/hide header (default: true)
    stickyHeader?: boolean;      // Sticky header on scroll (default: false)
    headerClassName?: string;    // Custom className for <thead>
    headerRowClassName?: string; // Custom className for header <tr>
    headerHeight?: string | number; // Custom header height
}
```

### Enhanced DataTableColumn
New properties for better column control:

```typescript
interface DataTableColumn<T> {
    // ... existing properties
    width?: string | number;      // '200px', '20%', or 200
    minWidth?: string | number;   // Minimum width
    maxWidth?: string | number;   // Maximum width
    headerClassName?: string;     // Custom className for header cell
    cellClassName?: string;       // Custom className for body cells
    align?: 'left' | 'center' | 'right'; // Text alignment
}
```

## Usage Examples

### 1. Basic Header Configuration

```tsx
<DataTable
  columns={columns}
  fetchData={fetchData}
  headerConfig={{
    stickyHeader: true,
    headerClassName: 'bg-gray-100 border-b-2'
  }}
/>
```

### 2. Column Width Configuration

```tsx
const columns = [
  {
    key: 'id',
    label: 'ID',
    width: 80,              // Number converts to '80px'
    align: 'center'
  },
  {
    key: 'name',
    label: 'Name',
    width: '30%',           // Percentage width
    minWidth: 150,          // Minimum 150px
    headerClassName: 'bg-blue-50',
    cellClassName: 'font-medium'
  },
  {
    key: 'email',
    label: 'Email',
    width: '200px',         // Explicit pixel width
    maxWidth: 300
  },
  {
    key: 'price',
    label: 'Price',
    width: '15%',
    align: 'right',         // Right-aligned numbers
    cellClassName: 'font-mono'
  },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    align: 'center'
  }
];

<DataTable columns={columns} fetchData={fetchData} />
```

### 3. Hide Header

```tsx
<DataTable
  columns={columns}
  fetchData={fetchData}
  headerConfig={{
    showHeader: false  // Useful for card-style layouts
  }}
/>
```

### 4. Custom Header Height

```tsx
<DataTable
  columns={columns}
  fetchData={fetchData}
  headerConfig={{
    headerHeight: 60,  // or '60px'
    headerClassName: 'text-lg'
  }}
/>
```

### 5. Advanced Styling

```tsx
const columns = [
  {
    key: 'product',
    label: 'Product',
    width: '40%',
    headerClassName: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    cellClassName: 'hover:bg-blue-50 transition-colors'
  },
  {
    key: 'quantity',
    label: 'Qty',
    width: 100,
    align: 'center',
    headerClassName: 'bg-green-100',
    cellClassName: 'text-center font-bold'
  },
  {
    key: 'total',
    label: 'Total',
    width: '20%',
    align: 'right',
    headerClassName: 'bg-yellow-100',
    cellClassName: 'text-right font-mono text-green-600'
  }
];

<DataTable
  columns={columns}
  fetchData={fetchData}
  headerConfig={{
    stickyHeader: true,
    headerHeight: 50,
    headerRowClassName: 'shadow-md'
  }}
/>
```

### 6. Responsive with Header Config

```tsx
<DataTable
  columns={columns}
  fetchData={fetchData}
  headerConfig={{
    stickyHeader: true,
    headerClassName: 'bg-white dark:bg-gray-800'
  }}
  responsiveConfig={{
    enableResponsive: true,
    compactMode: true,
    mobileStackedView: true
  }}
/>
```

## Migration from v1.0.3

### Before (v1.0.3)
```tsx
// ❌ This didn't work properly
const columns = [
  {
    key: 'name',
    label: 'Name',
    width: '200'  // Was broken - generated invalid 'w-200' class
  }
];
```

### After (v1.0.4)
```tsx
// ✅ Now works correctly with inline styles
const columns = [
  {
    key: 'name',
    label: 'Name',
    width: 200,        // or '200px' or '20%'
    minWidth: 150,     // NEW: minimum width
    align: 'left',     // NEW: alignment
    headerClassName: 'bg-blue-50',  // NEW: header styling
    cellClassName: 'font-medium'    // NEW: cell styling
  }
];
```

## Best Practices

### 1. Width Values
```tsx
// ✅ Good - Clear and explicit
width: 200          // Converts to '200px'
width: '200px'      // Explicit pixels
width: '20%'        // Percentage
width: '15rem'      // Rem units

// ❌ Avoid
width: 'w-200'      // Don't use Tailwind classes
width: '200'        // Ambiguous - use number or add unit
```

### 2. Alignment
```tsx
// ✅ Good - Semantic alignment
{ key: 'id', label: 'ID', align: 'center' }
{ key: 'price', label: 'Price', align: 'right' }
{ key: 'name', label: 'Name', align: 'left' }

// ❌ Avoid - Don't use className for alignment
cellClassName: 'text-right'  // Use align prop instead
```

### 3. Sticky Header
```tsx
// ✅ Good - With proper container
<div className="h-screen overflow-auto">
  <DataTable
    headerConfig={{ stickyHeader: true }}
    // ...
  />
</div>

// ❌ Avoid - Without scrollable container
<DataTable
  headerConfig={{ stickyHeader: true }}  // Won't work properly
  // ...
/>
```

### 4. Responsive Design
```tsx
// ✅ Good - Consider mobile
const columns = [
  {
    key: 'name',
    label: 'Name',
    width: '30%',
    minWidth: 150,  // Prevents too narrow on small screens
    priority: 1     // Always visible
  },
  {
    key: 'description',
    label: 'Description',
    width: '40%',
    priority: 3,    // Hide first on mobile
    mobileLabel: 'Desc'
  }
];
```

## TypeScript Support

All new interfaces are fully typed:

```typescript
import { 
  DataTableHeaderConfig,
  DataTableColumn 
} from '@madulinux/react-datatable';

const headerConfig: DataTableHeaderConfig = {
  stickyHeader: true,
  headerClassName: 'bg-gray-100'
};

const columns: DataTableColumn<User>[] = [
  {
    key: 'name',
    label: 'Name',
    width: 200,
    align: 'left',
    headerClassName: 'bg-blue-50'
  }
];
```

## Troubleshooting

### Width not applying?
- Make sure you're using v1.0.4+
- Check that width value is valid CSS (number, '200px', '20%')
- Verify table has proper container width

### Sticky header not working?
- Ensure parent container has defined height and overflow
- Check z-index conflicts with other elements
- Verify `stickyHeader: true` is set

### Alignment not working?
- Use `align` prop, not `className`
- Check for conflicting CSS classes
- Verify column has `align` property set

## Complete Example

```tsx
import DataTable, { 
  DataTableColumn,
  DataTableHeaderConfig 
} from '@madulinux/react-datatable';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

const columns: DataTableColumn<Product>[] = [
  {
    key: 'id',
    label: 'ID',
    width: 80,
    align: 'center',
    headerClassName: 'bg-gray-100',
    cellClassName: 'font-mono text-gray-600'
  },
  {
    key: 'name',
    label: 'Product Name',
    width: '40%',
    minWidth: 200,
    sortable: true,
    headerClassName: 'bg-blue-50',
    cellClassName: 'font-medium'
  },
  {
    key: 'price',
    label: 'Price',
    width: '15%',
    align: 'right',
    sortable: true,
    headerClassName: 'bg-green-50',
    cellClassName: 'font-mono text-green-600',
    render: (row) => `$${row.price.toFixed(2)}`
  },
  {
    key: 'stock',
    label: 'Stock',
    width: 100,
    align: 'center',
    headerClassName: 'bg-yellow-50',
    cellClassName: 'font-semibold'
  },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    align: 'center',
    render: (row) => (
      <span className={row.status === 'active' ? 'text-green-600' : 'text-gray-400'}>
        {row.status}
      </span>
    )
  }
];

const headerConfig: DataTableHeaderConfig = {
  stickyHeader: true,
  headerHeight: 56,
  headerClassName: 'bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300',
  headerRowClassName: 'shadow-sm'
};

function ProductTable() {
  const fetchData = async ({ page, perPage, search, orderBy, orderDir }) => {
    const response = await fetch(
      `/api/products?page=${page}&perPage=${perPage}&search=${search}&orderBy=${orderBy}&orderDir=${orderDir}`
    );
    return response.json();
  };

  return (
    <div className="h-screen p-4">
      <DataTable
        columns={columns}
        fetchData={fetchData}
        headerConfig={headerConfig}
        responsiveConfig={{
          enableResponsive: true,
          compactMode: true
        }}
        defaultPerPage={25}
        defaultOrderBy="name"
        defaultOrderDir="asc"
      />
    </div>
  );
}
```

---

**Version:** 1.0.4  
**Last Updated:** 2024-11-03
