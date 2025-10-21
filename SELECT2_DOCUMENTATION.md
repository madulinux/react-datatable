# Select2 Component Documentation

## 📋 Overview

`Select2` adalah komponen select advanced dengan fitur async data fetching, search, pagination, dan multi-select support. Komponen ini dibangun dengan fokus pada accessibility, performance, dan user experience.

## ✨ Features

- ✅ **Async Data Fetching** - Load data dari API dengan pagination
- ✅ **Search & Debouncing** - Search dengan debounce untuk mengurangi API calls
- ✅ **Minimum Input Length** - Require minimum characters sebelum fetch (untuk large datasets)
- ✅ **Single & Multi-Select** - Support untuk single dan multiple selection
- ✅ **Infinite Scroll** - Load more untuk pagination
- ✅ **Error Handling** - Robust error handling dengan retry button
- ✅ **Keyboard Navigation** - Full keyboard support (Arrow keys, Enter, Backspace, Escape)
- ✅ **Accessibility (A11y)** - ARIA attributes, screen reader support
- ✅ **Max Selections** - Limit jumlah item yang bisa dipilih
- ✅ **Select All / Clear All** - Bulk actions untuk multi-select
- ✅ **Custom Rendering** - Custom render untuk options dan selected values
- ✅ **TypeScript Support** - Fully typed dengan generics
- ✅ **Memory Leak Prevention** - Proper cleanup dengan AbortController
- ✅ **Request Cancellation** - Cancel pending requests untuk prevent race conditions

## 🚀 Installation

```bash
npm install @madulinux/react-datatable
```

## 📖 Basic Usage

### Single Select

```tsx
import { Select2 } from '@madulinux/react-datatable';

interface User {
  id: number;
  label: string;
  email: string;
}

function MyComponent() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async ({ search, page }) => {
    const response = await fetch(
      `/api/users?search=${search}&page=${page}&perPage=20`
    );
    const data = await response.json();
    
    return {
      data: data.users,
      hasMore: data.hasMore
    };
  };

  return (
    <Select2
      value={selectedUser}
      onChange={setSelectedUser}
      fetchOptions={fetchUsers}
      placeholder="Pilih user..."
    />
  );
}
```

### Multi-Select

```tsx
function MyComponent() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <Select2
      isMulti
      value={selectedUsers}
      onChange={setSelectedUsers}
      fetchOptions={fetchUsers}
      placeholder="Pilih beberapa user..."
    />
  );
}
```

### Multi-Select with Max Selections

```tsx
function MyComponent() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <Select2
      isMulti
      maxSelections={5}
      value={selectedUsers}
      onChange={setSelectedUsers}
      fetchOptions={fetchUsers}
      onMaxSelectionsReached={() => {
        toast.error('Maksimal 5 user dapat dipilih');
      }}
      placeholder="Pilih maksimal 5 user..."
    />
  );
}
```

## 🎯 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T \| null \| T[]` | - | Current selected value(s) |
| `onChange` | `(val: T \| null \| T[]) => void` | - | Callback when selection changes |
| `fetchOptions` | `(params: { search: string; page: number }) => Promise<{ data: T[]; hasMore: boolean }>` | - | Function to fetch options with search and pagination |
| `renderOption` | `(item: T) => ReactNode` | - | Custom render function for each option |
| `renderSelected` | `(item: T \| null \| T[]) => ReactNode` | - | Custom render function for selected value(s) |
| `placeholder` | `string` | `"Pilih..."` | Placeholder text when no selection |
| `isMulti` | `boolean` | `false` | Enable multi-select mode |
| `noOptionsMessage` | `string \| ((search: string) => ReactNode)` | `"Tidak ada data"` | Message when no options available |
| `loadingMessage` | `string \| ReactNode` | `"Memuat..."` | Message during loading |
| `errorMessage` | `string \| ((error: Error) => ReactNode)` | `"Terjadi kesalahan..."` | Message when error occurs |
| `className` | `string` | `""` | Additional CSS classes for the button |
| `disabled` | `boolean` | `false` | Disable the select |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds for search input |
| `minInput` | `number` | `0` | Minimum characters required before fetching options |
| `maxSelections` | `number` | - | Maximum number of items that can be selected in multi-select mode |
| `showSelectAll` | `boolean` | `true` | Show Select All / Clear All buttons in multi-select mode |
| `onMaxSelectionsReached` | `() => void` | - | Callback when max selections reached |

### Type Constraint

```tsx
T extends { id: string | number; label?: string }
```

Items must have an `id` property and optionally a `label` property.

## 🎨 Custom Rendering

### Custom Option Rendering

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  renderOption={(user) => (
    <div className="flex items-center gap-2">
      <img 
        src={user.avatar} 
        alt={user.label}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <div className="font-medium">{user.label}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
    </div>
  )}
/>
```

### Custom Selected Value Rendering

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  renderSelected={(user) => {
    if (!user) return <span>Pilih user...</span>;
    return (
      <div className="flex items-center gap-2">
        <img 
          src={user.avatar} 
          className="w-6 h-6 rounded-full"
        />
        <span>{user.label}</span>
      </div>
    );
  }}
/>
```

## ⌨️ Keyboard Navigation

| Key | Action | Mode |
|-----|--------|------|
| `Arrow Up/Down` | Navigate through options | All |
| `Enter` | Select highlighted option | All |
| `Escape` | Close dropdown | All |
| `Backspace` | Remove last selected item (when search is empty) | Multi-select |
| `Tab` | Close dropdown and move focus | All |

## ♿ Accessibility Features

- ✅ **ARIA Attributes**: Proper `role`, `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-describedby`, `aria-selected`
- ✅ **Screen Reader Support**: Live regions for announcements (`aria-live="polite"`)
- ✅ **Keyboard Navigation**: Full keyboard support
- ✅ **Focus Management**: Proper focus handling
- ✅ **Error Announcements**: Errors announced to screen readers with `aria-live="assertive"`
- ✅ **Descriptive Labels**: Hidden descriptions for screen readers

### Screen Reader Announcements

- When options loaded: "X hasil ditemukan"
- When item selected: "[Item name] dipilih"
- When item removed: "[Item name] dihapus"
- When max reached: "Maksimal X item dapat dipilih"
- When error occurs: Error message announced

## 🔧 Advanced Examples

### With Custom Error Handling

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  errorMessage={(error) => (
    <div>
      <p className="font-semibold">Oops! Terjadi kesalahan</p>
      <p className="text-sm">{error.message}</p>
    </div>
  )}
/>
```

### With Custom Debounce

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  debounceMs={500} // Wait 500ms before searching
/>
```

### With Minimum Input Length

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  minInput={3} // Require at least 3 characters before fetching
  placeholder="Ketik minimal 3 karakter..."
/>
```

**Use Case**: Berguna untuk dataset besar dimana search tanpa filter akan return terlalu banyak hasil. Misalnya:
- Search produk dari 100,000+ items
- Search user dari database besar
- Autocomplete alamat/kota

```tsx
// Example: City autocomplete
<Select2
  value={selectedCity}
  onChange={setSelectedCity}
  fetchOptions={fetchCities}
  minInput={2} // Minimal 2 huruf untuk search kota
  placeholder="Ketik nama kota (min 2 huruf)..."
  noOptionsMessage={(search) => 
    search.length < 2 
      ? "Ketik minimal 2 huruf" 
      : "Kota tidak ditemukan"
  }
/>
```

### With No Options Message Function

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  noOptionsMessage={(search) => (
    <div className="text-center py-4">
      <p>Tidak ada hasil untuk "{search}"</p>
      <button className="text-blue-600 text-sm mt-2">
        Tambah user baru
      </button>
    </div>
  )}
/>
```

### Multi-Select with Bulk Actions

```tsx
function UserSelector() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  return (
    <div>
      <Select2
        isMulti
        maxSelections={10}
        showSelectAll={true}
        value={selectedUsers}
        onChange={setSelectedUsers}
        fetchOptions={fetchUsers}
        onMaxSelectionsReached={() => {
          toast.error('Maksimal 10 user');
        }}
      />
      
      {selectedUsers.length > 0 && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => sendEmailToUsers(selectedUsers)}>
            Kirim Email ke {selectedUsers.length} user
          </button>
          <button onClick={() => setSelectedUsers([])}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
```

## 🏗️ Backend Implementation

### Express.js Example

```javascript
app.get('/api/users', async (req, res) => {
  const { search = '', page = 1, perPage = 20 } = req.query;
  
  try {
    const offset = (page - 1) * perPage;
    
    // Query with search and pagination
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      },
      limit: parseInt(perPage),
      offset: offset,
      order: [['name', 'ASC']]
    });
    
    // Check if there are more results
    const total = await User.count({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      }
    });
    
    const hasMore = offset + users.length < total;
    
    res.json({
      users: users.map(u => ({
        id: u.id,
        label: u.name,
        email: u.email,
        avatar: u.avatar
      })),
      hasMore
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
```

### Laravel Example

```php
Route::get('/api/users', function (Request $request) {
    $search = $request->input('search', '');
    $page = $request->input('page', 1);
    $perPage = $request->input('perPage', 20);
    
    $query = User::query();
    
    if ($search) {
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
    
    $total = $query->count();
    $users = $query->skip(($page - 1) * $perPage)
                   ->take($perPage)
                   ->orderBy('name')
                   ->get();
    
    $hasMore = (($page - 1) * $perPage) + $users->count() < $total;
    
    return response()->json([
        'users' => $users->map(fn($u) => [
            'id' => $u->id,
            'label' => $u->name,
            'email' => $u->email,
            'avatar' => $u->avatar
        ]),
        'hasMore' => $hasMore
    ]);
});
```

## 🎭 Styling

Select2 menggunakan Tailwind CSS dan shadcn/ui components. Anda dapat customize styling dengan:

### Custom Button Style

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  className="bg-blue-50 border-blue-300 hover:bg-blue-100"
/>
```

### Dark Mode Support

```tsx
<Select2
  value={selectedUser}
  onChange={setSelectedUser}
  fetchOptions={fetchUsers}
  className="dark:bg-gray-800 dark:border-gray-700"
/>
```

## 🐛 Troubleshooting

### Issue: Options not loading

**Solution**: Pastikan `fetchOptions` mengembalikan object dengan format yang benar:

```tsx
{
  data: T[],      // Array of items
  hasMore: boolean // Whether there are more pages
}
```

### Issue: Search tidak bekerja

**Solution**: Pastikan backend menghandle parameter `search`:

```javascript
const { search } = req.query;
// Use search in your query
```

### Issue: Memory leak warning

**Solution**: Komponen sudah handle cleanup dengan AbortController. Pastikan Anda tidak memanggil `onChange` setelah component unmount.

### Issue: Max selections tidak bekerja

**Solution**: Pastikan `isMulti={true}` dan `maxSelections` di-set:

```tsx
<Select2
  isMulti={true}
  maxSelections={5}
  // ...
/>
```

## 📊 Performance Tips

1. **Optimize fetchOptions**: Cache results jika memungkinkan
2. **Adjust debounceMs**: Increase untuk mengurangi API calls
3. **Use minInput**: Set minimum characters untuk large datasets
4. **Use pagination**: Jangan load semua data sekaligus
5. **Memoize callbacks**: Gunakan `useCallback` untuk `onChange`

### When to Use `minInput`

| Dataset Size | Recommended `minInput` | Reason |
|--------------|------------------------|--------|
| < 100 items | `0` (no minimum) | Small dataset, fetch all is fine |
| 100 - 1,000 items | `1-2` characters | Moderate dataset, some filtering needed |
| 1,000 - 10,000 items | `2-3` characters | Large dataset, require meaningful search |
| > 10,000 items | `3+` characters | Very large dataset, must have specific search |

**Example Scenarios**:

```tsx
// Small company (< 100 employees) - No minimum
<Select2
  fetchOptions={fetchEmployees}
  minInput={0}
/>

// Medium company (1,000 employees) - 2 chars minimum
<Select2
  fetchOptions={fetchEmployees}
  minInput={2}
  placeholder="Ketik minimal 2 huruf..."
/>

// E-commerce with 100,000+ products - 3 chars minimum
<Select2
  fetchOptions={fetchProducts}
  minInput={3}
  placeholder="Ketik minimal 3 huruf untuk mencari produk..."
/>

// City/Address autocomplete - 2 chars minimum
<Select2
  fetchOptions={fetchCities}
  minInput={2}
  placeholder="Ketik nama kota (min 2 huruf)..."
/>
```

```tsx
const handleChange = useCallback((value) => {
  setSelectedUser(value);
}, []);

<Select2
  value={selectedUser}
  onChange={handleChange}
  fetchOptions={fetchUsers}
/>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 👤 Author

**madulinux**  
- GitHub: [@madulinux](https://github.com/madulinux)
- npm: [~madulinux](https://www.npmjs.com/~madulinux)
