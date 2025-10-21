# @madulinux/react-datatable - Complete Documentation

[![npm version](https://img.shields.io/npm/v/@madulinux/react-datatable.svg)](https://www.npmjs.com/package/@madulinux/react-datatable)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Comprehensive React component library for advanced data tables and select inputs with TypeScript support.

---

## 📚 Table of Contents

1. [Installation](#installation)
2. [Components Overview](#components-overview)
3. [DataTable Component](#datatable-component)
4. [Select2 Component](#select2-component)
5. [Advanced Features](#advanced-features)
6. [API Reference](#api-reference)
7. [Examples](#examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Installation

```bash
npm install @madulinux/react-datatable
```

### Peer Dependencies

```json
{
  "react": ">=17.0.0",
  "react-dom": ">=17.0.0"
}
```

### Required Dependencies (Auto-installed)

- `@radix-ui/react-*` - UI primitives
- `lucide-react` - Icons
- `tailwind-merge` - CSS utilities
- `class-variance-authority` - Styling
- `cmdk` - Command menu
- `date-fns` - Date utilities

---

## 📦 Components Overview

### Main Components

| Component | Description | Use Case |
|-----------|-------------|----------|
| **DataTable** | Advanced data table with sorting, filtering, pagination | Display and manage tabular data |
| **Select2** | Async select with search and multi-select | Autocomplete, searchable dropdowns |
| **DataTablePagination** | Pagination component | Standalone pagination |
| **AdvancedFilterValueInput** | Filter input component | Custom filter implementations |

### Utility Exports

- `DataTableUtils` - Helper functions
- `cn` - Class name utility
- Pagination components

---

## 📊 DataTable Component

### Overview

Enterprise-grade data table with comprehensive features:

- ✅ **Sorting** - Multi-column with default sort
- ✅ **Pagination** - Customizable with per-page options
- ✅ **Search** - Global search functionality
- ✅ **Filtering** - Simple & advanced filters
- ✅ **Row Selection** - Single & multiple with bulk actions
- ✅ **Export** - CSV & Excel support
- ✅ **Column Management** - Visibility toggle & drag-to-reorder
- ✅ **Responsive** - Mobile, tablet, desktop optimized
- ✅ **Accessibility** - WCAG compliant
- ✅ **Error Handling** - Robust error management
- ✅ **TypeScript** - Full type safety

### Basic Usage

```tsx
import DataTable from '@madulinux/react-datatable';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { 
    key: 'status', 
    label: 'Status',
    render: (user) => (
      <span className={user.status === 'active' ? 'text-green-600' : 'text-gray-400'}>
        {user.status}
      </span>
    )
  }
];

const fetchData = async ({ page, perPage, search, orderBy, orderDir, filters }) => {
  const response = await fetch(
    `/api/users?page=${page}&perPage=${perPage}&search=${search}`
  );
  const data = await response.json();
  return {
    data: data.users,
    total: data.total
  };
};

function UsersTable() {
  return (
    <DataTable
      columns={columns}
      fetchData={fetchData}
      defaultPerPage={25}
      defaultOrderBy="name"
      defaultOrderDir="asc"
    />
  );
}
```

### Advanced Usage

```tsx
import DataTable from '@madulinux/react-datatable';

function AdvancedUsersTable() {
  // Filters
  const filters = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  // Selection config with bulk actions
  const selectionConfig = {
    enableRowSelection: true,
    selectionMode: 'multiple',
    bulkActions: [
      {
        label: 'Delete Selected',
        icon: <TrashIcon />,
        action: async (selectedRows) => {
          await deleteUsers(selectedRows.map(r => r.id));
        },
        variant: 'destructive',
        requiresConfirmation: true,
        confirmationMessage: 'Are you sure you want to delete selected users?'
      },
      {
        label: 'Export Selected',
        icon: <DownloadIcon />,
        action: async (selectedRows) => {
          exportToCSV(selectedRows);
        }
      }
    ],
    onSelectionChange: (selectedRows) => {
      console.log('Selected:', selectedRows);
    }
  };

  // Export config
  const exportConfig = {
    enableExport: true,
    exportFormats: ['csv', 'excel'],
    exportFileName: 'users-export',
    exportAllData: true,
    exportEndpoint: '/api/users/export'
  };

  // Responsive config
  const responsiveConfig = {
    enableResponsive: true,
    mobileStackedView: true,
    priorityColumns: ['name', 'email'],
    hideColumnsOnMobile: ['created_at', 'updated_at'],
    compactMode: true
  };

  // Actions per row
  const actions = (user) => (
    <div className="flex gap-2">
      <button onClick={() => editUser(user.id)}>Edit</button>
      <button onClick={() => deleteUser(user.id)}>Delete</button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      fetchData={fetchData}
      filters={filters}
      actions={actions}
      selectionConfig={selectionConfig}
      exportConfig={exportConfig}
      responsiveConfig={responsiveConfig}
      enableColumnVisibility
      enableColumnReordering
      storageKey="users-table"
    />
  );
}
```

### Column Configuration

```tsx
interface DataTableColumn<T> {
  key: keyof T | string;           // Column identifier
  label: string;                   // Header label
  sortable?: boolean;              // Enable sorting
  render?: (row: T) => ReactNode;  // Custom cell renderer
  width?: string;                  // Column width (CSS)
  visible?: boolean;               // Initial visibility
  priority?: number;               // Mobile priority (1=highest)
  mobileLabel?: string;            // Mobile-specific label
}
```

**Example:**

```tsx
const columns = [
  {
    key: 'avatar',
    label: 'Photo',
    width: '60px',
    priority: 1,
    render: (user) => (
      <img 
        src={user.avatar} 
        alt={user.name}
        className="w-10 h-10 rounded-full"
      />
    )
  },
  {
    key: 'name',
    label: 'Full Name',
    sortable: true,
    priority: 1,
    render: (user) => (
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.username}</div>
      </div>
    )
  },
  {
    key: 'email',
    label: 'Email Address',
    sortable: true,
    priority: 2,
    mobileLabel: 'Email'
  }
];
```

---

## 🔽 Select2 Component

### Overview

Advanced select component with async data fetching:

- ✅ **Async Data** - Load options from API
- ✅ **Search** - Real-time search with debouncing
- ✅ **Pagination** - Infinite scroll support
- ✅ **Multi-Select** - Select multiple items
- ✅ **Min Input** - Require minimum characters
- ✅ **Max Selections** - Limit selections
- ✅ **Error Handling** - Robust error management
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Accessibility** - Screen reader support
- ✅ **Custom Rendering** - Customize display

### Basic Usage

```tsx
import { Select2 } from '@madulinux/react-datatable';

interface City {
  id: number;
  label: string;
  country: string;
}

function CitySelector() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const fetchCities = async ({ search, page }) => {
    const response = await fetch(
      `/api/cities?search=${search}&page=${page}&perPage=20`
    );
    const data = await response.json();
    return {
      data: data.cities,
      hasMore: data.hasMore
    };
  };

  return (
    <Select2
      value={selectedCity}
      onChange={setSelectedCity}
      fetchOptions={fetchCities}
      placeholder="Select a city..."
    />
  );
}
```

### Multi-Select with Max Selections

```tsx
function MultiCitySelector() {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);

  return (
    <Select2
      isMulti
      maxSelections={5}
      value={selectedCities}
      onChange={setSelectedCities}
      fetchOptions={fetchCities}
      onMaxSelectionsReached={() => {
        toast.error('Maximum 5 cities can be selected');
      }}
      placeholder="Select up to 5 cities..."
    />
  );
}
```

### With Minimum Input Length

```tsx
function ProductSearch() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <Select2
      value={selectedProduct}
      onChange={setSelectedProduct}
      fetchOptions={fetchProducts}
      minInput={3}
      debounceMs={500}
      placeholder="Type at least 3 characters to search..."
      noOptionsMessage={(search) => 
        search.length < 3 
          ? "Type at least 3 characters" 
          : "No products found"
      }
    />
  );
}
```

### Custom Rendering

```tsx
function UserSelector() {
  return (
    <Select2
      value={selectedUser}
      onChange={setSelectedUser}
      fetchOptions={fetchUsers}
      renderOption={(user) => (
        <div className="flex items-center gap-2">
          <img 
            src={user.avatar} 
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium">{user.label}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      )}
      renderSelected={(user) => {
        if (!user) return <span>Select user...</span>;
        return (
          <div className="flex items-center gap-2">
            <img src={user.avatar} className="w-6 h-6 rounded-full" />
            <span>{user.label}</span>
          </div>
        );
      }}
    />
  );
}
```

---

## 🎯 Advanced Features

### Advanced Filters

```tsx
const advancedFilters = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith']
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    operators: ['equals', 'gt', 'gte', 'lt', 'lte']
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    key: 'created_at',
    label: 'Created Date',
    type: 'daterange'
  }
];

<DataTable
  columns={columns}
  fetchData={fetchData}
  advancedFilters={advancedFilters}
  enableAdvancedFilters
  onAdvancedFilter={(filterGroup) => {
    console.log('Applied filters:', filterGroup);
  }}
/>
```

### State Persistence

```tsx
// Save column preferences to localStorage
<DataTable
  columns={columns}
  fetchData={fetchData}
  storageKey="my-table-preferences"
  enableColumnVisibility
  enableColumnReordering
/>

// Reset preferences
const resetPreferences = () => {
  localStorage.removeItem('datatable-my-table-preferences');
  window.location.reload();
};
```

### Responsive Breakpoints

```tsx
const responsiveConfig = {
  enableResponsive: true,
  breakpoints: {
    mobile: 640,   // < 640px
    tablet: 1024,  // 640px - 1024px
    desktop: 1280  // > 1024px
  },
  mobileStackedView: true,
  priorityColumns: ['name', 'email'],
  hideColumnsOnMobile: ['created_at', 'updated_at'],
  compactMode: true
};
```

---

## 📖 API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataTableColumn<T>[]` | - | Column definitions |
| `fetchData` | `function` | - | Data fetching function |
| `defaultOrderBy` | `string` | `""` | Default sort column |
| `defaultOrderDir` | `"asc" \| "desc"` | `"asc"` | Default sort direction |
| `filters` | `DataTableFilter[]` | `[]` | Simple filters |
| `actions` | `(row: T) => ReactNode` | - | Row actions renderer |
| `perPageOptions` | `number[]` | `[10, 25, 50]` | Per-page options |
| `defaultPerPage` | `number` | `10` | Default items per page |
| `className` | `string` | `""` | Container CSS class |
| `enableColumnVisibility` | `boolean` | `true` | Enable column toggle |
| `enableColumnReordering` | `boolean` | `true` | Enable drag & drop |
| `storageKey` | `string` | - | localStorage key |
| `exportConfig` | `DataTableExportConfig` | - | Export configuration |
| `selectionConfig` | `DataTableSelectionConfig<T>` | - | Selection configuration |
| `responsiveConfig` | `DataTableResponsiveConfig` | - | Responsive configuration |
| `layoutConfig` | `DataTableLayoutConfig` | - | Layout configuration |
| `advancedFilters` | `DataTableAdvancedFilter[]` | `[]` | Advanced filters |
| `enableAdvancedFilters` | `boolean` | `false` | Enable advanced filters |
| `onAdvancedFilter` | `function` | - | Advanced filter callback |

### Select2 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T \| null \| T[]` | - | Selected value(s) |
| `onChange` | `function` | - | Change handler |
| `fetchOptions` | `function` | - | Options fetcher |
| `renderOption` | `function` | - | Custom option renderer |
| `renderSelected` | `function` | - | Custom selected renderer |
| `placeholder` | `string` | `"Pilih..."` | Placeholder text |
| `isMulti` | `boolean` | `false` | Multi-select mode |
| `noOptionsMessage` | `string \| function` | `"Tidak ada data"` | No options message |
| `loadingMessage` | `string \| ReactNode` | `"Memuat..."` | Loading message |
| `errorMessage` | `string \| function` | - | Error message |
| `className` | `string` | `""` | CSS class |
| `disabled` | `boolean` | `false` | Disabled state |
| `debounceMs` | `number` | `300` | Debounce delay (ms) |
| `minInput` | `number` | `0` | Min characters to search |
| `maxSelections` | `number` | - | Max selections (multi) |
| `showSelectAll` | `boolean` | `true` | Show select all button |
| `onMaxSelectionsReached` | `function` | - | Max reached callback |

---

## 💡 Examples

### Example 1: User Management Table

```tsx
import DataTable from '@madulinux/react-datatable';
import { Edit, Trash2 } from 'lucide-react';

function UserManagement() {
  const columns = [
    {
      key: 'avatar',
      label: '',
      width: '60px',
      render: (user) => (
        <img 
          src={user.avatar} 
          className="w-10 h-10 rounded-full"
        />
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (user) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => (
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
          {user.role}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (user) => (
        <span className={`px-2 py-1 rounded text-xs ${
          user.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.status}
        </span>
      )
    }
  ];

  const fetchUsers = async (params) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  };

  const actions = (user) => (
    <div className="flex gap-2">
      <button 
        onClick={() => editUser(user)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={() => deleteUser(user)}
        className="p-2 hover:bg-red-100 rounded text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      fetchData={fetchUsers}
      actions={actions}
      defaultPerPage={25}
      enableColumnVisibility
      storageKey="users-table"
    />
  );
}
```

### Example 2: E-commerce Product Selector

```tsx
import { Select2 } from '@madulinux/react-datatable';

function ProductSelector() {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fetchProducts = async ({ search, page }) => {
    const response = await fetch(
      `/api/products?search=${search}&page=${page}&perPage=20`
    );
    const data = await response.json();
    return {
      data: data.products.map(p => ({
        id: p.id,
        label: p.name,
        price: p.price,
        image: p.image,
        stock: p.stock
      })),
      hasMore: data.hasMore
    };
  };

  return (
    <Select2
      isMulti
      maxSelections={10}
      minInput={2}
      value={selectedProducts}
      onChange={setSelectedProducts}
      fetchOptions={fetchProducts}
      placeholder="Search products (min 2 characters)..."
      renderOption={(product) => (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <img 
              src={product.image} 
              className="w-10 h-10 rounded object-cover"
            />
            <div>
              <div className="font-medium">{product.label}</div>
              <div className="text-xs text-gray-500">
                Stock: {product.stock}
              </div>
            </div>
          </div>
          <div className="font-semibold text-green-600">
            ${product.price}
          </div>
        </div>
      )}
      onMaxSelectionsReached={() => {
        toast.error('Maximum 10 products can be selected');
      }}
    />
  );
}
```

---

## ✅ Best Practices

### Performance

1. **Memoize fetchData function**
   ```tsx
   const fetchData = useCallback(async (params) => {
     // ...
   }, []);
   ```

2. **Use minInput for large datasets**
   ```tsx
   <Select2 minInput={3} /> // For 10,000+ items
   ```

3. **Optimize column renders**
   ```tsx
   const columns = useMemo(() => [...], []);
   ```

### Accessibility

1. **Provide meaningful labels**
   ```tsx
   <Select2 placeholder="Select user..." />
   ```

2. **Use ARIA attributes**
   ```tsx
   <button aria-label="Delete user">...</button>
   ```

3. **Test with keyboard navigation**
   - Tab, Enter, Space, Arrow keys

### Error Handling

1. **Handle fetch errors**
   ```tsx
   const fetchData = async (params) => {
     try {
       const response = await fetch('/api/data');
       if (!response.ok) throw new Error('Failed to fetch');
       return response.json();
     } catch (error) {
       console.error('Fetch error:', error);
       throw error;
     }
   };
   ```

2. **Provide error messages**
   ```tsx
   <Select2
     errorMessage={(error) => (
       <div>
         <p>Failed to load options</p>
         <p className="text-sm">{error.message}</p>
       </div>
     )}
   />
   ```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Data not loading**
```tsx
// ❌ Wrong
const fetchData = async () => { ... }

// ✅ Correct
const fetchData = async ({ page, perPage, search }) => {
  return { data: [...], total: 100 };
}
```

**Issue: Infinite re-renders**
```tsx
// ❌ Wrong - fetchData recreated every render
<DataTable fetchData={async () => { ... }} />

// ✅ Correct - memoized
const fetchData = useCallback(async () => { ... }, []);
<DataTable fetchData={fetchData} />
```

**Issue: Select2 not showing options**
```tsx
// ❌ Wrong - missing hasMore
return { data: [...] }

// ✅ Correct
return { data: [...], hasMore: false }
```

**Issue: TypeScript errors**
```tsx
// ❌ Wrong - missing id/label
interface Item {
  name: string;
}

// ✅ Correct
interface Item {
  id: number;
  label: string;
  name: string;
}
```

---

## 📝 License

MIT © [madulinux](https://github.com/madulinux)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

- GitHub Issues: [Report a bug](https://github.com/madulinux/react-datatable/issues)
- npm: [@madulinux/react-datatable](https://www.npmjs.com/package/@madulinux/react-datatable)

---

**Made with ❤️ by madulinux**
