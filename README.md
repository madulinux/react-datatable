# @madulinux/react-datatable

[![npm version](https://img.shields.io/npm/v/@madulinux/react-datatable.svg)](https://www.npmjs.com/package/@madulinux/react-datatable)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-17%2B-61dafb.svg)](https://reactjs.org/)

Enterprise-grade React components for advanced data tables and select inputs with full TypeScript support, accessibility, and modern UI/UX.

---

## 📚 Quick Links

- 📖 [Complete Documentation](DOCUMENTATION.md)
- 🔽 [Select2 Documentation](SELECT2_DOCUMENTATION.md)
- 🌐 [npm Package](https://www.npmjs.com/package/@madulinux/react-datatable)
- 🐛 [Report Issues](https://github.com/madulinux/react-datatable/issues)

---

## ✨ Features

### DataTable Component
- ✅ **Sorting** - Multi-column with default sort support
- ✅ **Pagination** - Customizable with per-page options
- ✅ **Search** - Global search functionality
- ✅ **Filtering** - Simple & advanced filters with filter builder
- ✅ **Row Selection** - Single & multiple with bulk actions
- ✅ **Export** - CSV & Excel support
- ✅ **Column Management** - Visibility toggle & drag-to-reorder
- ✅ **Responsive** - Mobile, tablet, desktop optimized
- ✅ **Accessibility** - WCAG compliant, keyboard navigation
- ✅ **Error Handling** - Robust error management with retry
- ✅ **State Persistence** - Save preferences to localStorage
- ✅ **TypeScript** - Full type safety with generics

### Select2 Component
- ✅ **Async Data** - Load options from API with pagination
- ✅ **Search** - Real-time search with debouncing
- ✅ **Multi-Select** - Select multiple items with tags
- ✅ **Min Input** - Require minimum characters before fetch
- ✅ **Max Selections** - Limit number of selections
- ✅ **Select All / Clear All** - Bulk selection actions
- ✅ **Error Handling** - Robust error management
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Accessibility** - Screen reader support, ARIA attributes
- ✅ **Custom Rendering** - Customize options and selected display

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

---

## 🔥 Quick Start

### DataTable - Basic Example

```tsx
import DataTable from '@madulinux/react-datatable';

interface User {
  id: number;
  name: string;
  email: string;
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

const fetchData = async ({ page, perPage, search, orderBy, orderDir }) => {
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

### Select2 - Basic Example

```tsx
import { Select2 } from '@madulinux/react-datatable';

interface City {
  id: number;
  label: string;
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

---

## 📖 Documentation

### Complete Guides

- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Complete documentation for all components
- **[SELECT2_DOCUMENTATION.md](SELECT2_DOCUMENTATION.md)** - Detailed Select2 component guide

### Key Topics

1. **DataTable**
   - Column configuration
   - Sorting & pagination
   - Filtering (simple & advanced)
   - Row selection & bulk actions
   - Export functionality
   - Responsive design
   - State persistence

2. **Select2**
   - Async data fetching
   - Search & debouncing
   - Multi-select mode
   - Min input & max selections
   - Custom rendering
   - Error handling

3. **Advanced Features**
   - Advanced filter builder
   - Column visibility & reordering
   - Export to CSV/Excel
   - Responsive breakpoints
   - Accessibility features

---

## 🎯 Advanced Examples

### DataTable with All Features

```tsx
<DataTable
  columns={columns}
  fetchData={fetchUsers}
  filters={filters}
  actions={(user) => (
    <div className="flex gap-2">
      <button onClick={() => editUser(user)}>Edit</button>
      <button onClick={() => deleteUser(user)}>Delete</button>
    </div>
  )}
  selectionConfig={{
    enableRowSelection: true,
    selectionMode: 'multiple',
    bulkActions: [
      {
        label: 'Delete Selected',
        action: async (rows) => await deleteUsers(rows),
        variant: 'destructive',
        requiresConfirmation: true
      }
    ]
  }}
  exportConfig={{
    enableExport: true,
    exportFormats: ['csv', 'excel'],
    exportFileName: 'users-export'
  }}
  responsiveConfig={{
    enableResponsive: true,
    mobileStackedView: true,
    compactMode: true
  }}
  enableColumnVisibility
  enableColumnReordering
  enableAdvancedFilters
  storageKey="users-table"
/>
```

### Select2 Multi-Select with Max Limit

```tsx
<Select2
  isMulti
  maxSelections={5}
  minInput={2}
  value={selectedItems}
  onChange={setSelectedItems}
  fetchOptions={fetchItems}
  onMaxSelectionsReached={() => {
    toast.error('Maximum 5 items can be selected');
  }}
  placeholder="Search items (min 2 characters)..."
  renderOption={(item) => (
    <div className="flex items-center gap-2">
      <img src={item.image} className="w-8 h-8 rounded" />
      <span>{item.label}</span>
    </div>
  )}
/>
```

---

## 🎨 Styling

This package uses **Tailwind CSS** and **shadcn/ui** components. You can customize styling using:

1. **className props**
   ```tsx
   <DataTable className="bg-white rounded-lg shadow" />
   ```

2. **Tailwind configuration**
   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           primary: {...}
         }
       }
     }
   }
   ```

3. **CSS variables**
   ```css
   :root {
     --primary: ...;
     --muted: ...;
   }
   ```

---

## ♿ Accessibility

All components are built with accessibility in mind:

- ✅ **WCAG 2.1 AA** compliant
- ✅ **Keyboard navigation** - Full keyboard support
- ✅ **Screen readers** - ARIA attributes and live regions
- ✅ **Focus management** - Proper focus handling
- ✅ **Color contrast** - Meets contrast requirements

---

## 🧪 TypeScript Support

Full TypeScript support with generics:

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

// Type-safe columns
const columns: DataTableColumn<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
];

// Type-safe Select2
<Select2<User>
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
/>
```

---

## 📦 What's Included

- `DataTable` - Main data table component
- `Select2` - Advanced select component
- `DataTablePagination` - Standalone pagination
- `AdvancedFilterValueInput` - Filter input component
- `DataTableUtils` - Utility functions
- Type definitions for all components

---

## 🛠️ Troubleshooting

### Common Issues

**Data not loading?**
```tsx
// Ensure fetchData returns correct format
return { data: [...], total: 100 };
```

**TypeScript errors?**
```tsx
// Items must have id and label
interface Item {
  id: number;
  label: string;
}
```

**Infinite re-renders?**
```tsx
// Memoize fetchData
const fetchData = useCallback(async () => {...}, []);
```

See [DOCUMENTATION.md](DOCUMENTATION.md#troubleshooting) for more solutions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT © [madulinux](https://github.com/madulinux)

---

## 👤 Author

**madulinux**

- GitHub: [@madulinux](https://github.com/madulinux)
- npm: [~madulinux](https://www.npmjs.com/~madulinux)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by madulinux**
