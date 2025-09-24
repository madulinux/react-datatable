# @madulinux/react-datatable

[![npm version](https://img.shields.io/npm/v/@madulinux/react-datatable.svg)](https://www.npmjs.com/package/@madulinux/react-datatable)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Reusable DataTable React component with sorting, paging, filtering, async fetch, and custom styling. Perfect for dynamic tables, admin panels, and filter integration.

---
#### [Dokumentasi Indonesia](README.md)
---

## ✨ Features
- Column sorting (click header)
- Pagination & perPage
- Dynamic filtering (`filterValues` prop)
- Async data fetch (API ready)
- Custom cell/action rendering
- Full styling via className props
- TypeScript support

---

## 🚀 Installation
```bash
npm install @madulinux/react-datatable
```

---

## 🔥 Basic Usage
```tsx
import DataTable from '@madulinux/react-datatable';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', render: row => row.status ? 'Active' : 'Inactive' }
];

const fetchData = async ({ page, perPage, search }) => {
  const res = await fetch(`/api/users?page=${page}&perPage=${perPage}&search=${search}`);
  const data = await res.json();
  return { data: data.items, total: data.total };
};

<DataTable
  columns={columns}
  fetchData={fetchData}
  defaultPerPage={10}
/>
```

---

## 🧩 API & Props
| Prop             | Type                                         | Description                                    |
|------------------|----------------------------------------------|------------------------------------------------|
| columns          | Array<{ key, label, sortable?, render? }>    | Column definitions and cell rendering           |
| fetchData        | function(params) => Promise<{data,total}>    | Async data fetch (API, etc)                     |
| filterValues     | object                                       | Additional filters (optional)                   |
| defaultPerPage   | number                                       | Items per page (default: 10)                    |
| actions          | function(row) => ReactNode                    | Custom action rendering per row                 |
| className        | string                                       | Styling root container                          |
| tableClassName   | string                                       | Styling  element                         |
| headerClassName  | string                                       | Styling all                                 |
| rowClassName     | string                                       | Styling all                                 |
| cellClassName    | string                                       | Styling all                                |

---

## 🎨 Custom Styling
You can fully customize the appearance using className props:

```tsx
<DataTable
  columns={columns}
  fetchData={fetchData}
  className="rounded-lg shadow bg-white"
  tableClassName="border"
  headerClassName="bg-gray-100 text-gray-700"
  rowClassName="hover:bg-gray-50"
  cellClassName="px-4 py-2 border-b"
/>
```

- Use Tailwind, CSS modules, or global CSS as needed.
- For dark mode, just add the appropriate className.

---

## 🛠️ Troubleshooting & Integration Notes
- Make sure `fetchData` returns `{ data, total }`.
- Use className or custom styles for appearance.
- For custom actions, use the `actions` prop.
- For dynamic filtering, use the `filterValues` prop.

---

## 🤝 Contribution
Pull requests, suggestions, and issues are welcome! Fork the repo and submit a PR.

## 👤 Author
**madulinux**  
[GitHub](https://github.com/madulinux)  
[npmjs](https://www.npmjs.com/~madulinux)

## License
MIT

Export & Column Visibility
Lihat dokumentasi lengkap di repo atau [DOCUMENTATION_SELECT2_DATATABLE.md](../DOCUMENTATION_SELECT2_DATATABLE.md)

## Lisensi
MIT

## 🧩 API Reference

### DataTableProps<T> - Properti Utama

| Prop | Type | Default | Kegunaan & Contoh Penggunaan |
|------|------|---------|------------------------------|
| `columns` | `DataTableColumn<T>[]` | - | **Definisi kolom tabel** <br/> Menentukan kolom apa saja yang ditampilkan, bagaimana data dirender, dan fitur sorting. <br/> `const columns = [{ key: 'name', label: 'Nama', sortable: true }]` |
| `fetchData` | `function` | - | **Fungsi untuk mengambil data** <br/> Dipanggil setiap kali ada perubahan page, search, sort, atau filter. <br/> `const fetchData = async ({ page, perPage, search }) => { ... }` |
| `defaultOrderBy` | `string` | `""` | **Kolom default untuk sorting** <br/> Menentukan kolom mana yang akan diurutkan saat pertama kali tabel dimuat. <br/> `defaultOrderBy="created_at"` |
| `defaultOrderDir` | `"asc" \| "desc"` | `"asc"` | **Arah sorting default** <br/> Menentukan apakah data diurutkan naik (asc) atau turun (desc). <br/> `defaultOrderDir="desc"` |
| `filters` | `DataTableFilter[]` | `[]` | **Filter sederhana** <br/> Menambahkan dropdown filter di toolbar untuk filtering cepat. <br/> `filters={[{ key: 'status', label: 'Status', options: [...] }]}` |
| `actions` | `(row: T) => ReactNode` | - | **Kolom aksi untuk setiap baris** <br/> Menambahkan kolom terakhir berisi tombol aksi seperti Edit, Delete, View. <br/> `actions={(user) => <button>Edit</button>}` |
| `className` | `string` | `""` | **CSS class untuk container utama** <br/> Untuk styling custom pada wrapper tabel. <br/> `className="bg-white rounded-lg shadow-lg p-4"` |
| `tableClassName` | `string` | `""` | **CSS class untuk tabel** <br/> Untuk styling custom pada tabel. <br/> `tableClassName="border"` |
| `headerClassName` | `string` | `""` | **CSS class untuk header tabel** <br/> Untuk styling custom pada header tabel. <br/> `headerClassName="bg-gray-100 text-gray-700"` |
| `rowClassName` | `string` | `""` | **CSS class untuk setiap baris** <br/> Untuk styling custom pada setiap baris tabel. <br/> `rowClassName="hover:bg-gray-50"` |
| `cellClassName` | `string` | `""` | **CSS class untuk setiap cell** <br/> Untuk styling custom pada setiap cell tabel. <br/> `cellClassName="px-4 py-2 border-b"` |

### Advanced Configuration Props - Konfigurasi Lanjutan

| Prop | Type | Default | Kegunaan & Contoh Penggunaan |
|------|------|---------|------------------------------|
| `enableColumnVisibility` | `boolean` | `true` | **Toggle tampil/sembunyikan kolom** <br/> Menambahkan tombol untuk show/hide kolom. User bisa menyembunyikan kolom yang tidak diperlukan. <br/> `enableColumnVisibility={true}` |
| `enableColumnReordering` | `boolean` | `true` | **Drag & drop untuk mengubah urutan kolom** <br/> User bisa menggeser kolom untuk mengubah urutannya sesuai preferensi. <br/> `enableColumnReordering={true}` |
| `storageKey` | `string` | - | **Menyimpan preferensi user** <br/> Menyimpan pengaturan kolom (visibility, urutan) ke localStorage agar tetap tersimpan saat user kembali. <br/> `storageKey="users-table"` |
| `exportConfig` | `DataTableExportConfig` | - | **Konfigurasi export data** <br/> Menambahkan tombol export untuk download data dalam format CSV/Excel. <br/> `exportConfig={{ enableExport: true, exportFormats: ['csv', 'excel'] }}` |
| `selectionConfig` | `DataTableSelectionConfig<T>` | - | **Konfigurasi pemilihan baris** <br/> Menambahkan checkbox untuk memilih baris dan aksi bulk (hapus banyak, export yang dipilih, dll). <br/> `selectionConfig={{ enableRowSelection: true, selectionMode: 'multiple' }}` |
| `responsiveConfig` | `DataTableResponsiveConfig` | - | **Konfigurasi tampilan mobile** <br/> Mengatur bagaimana tabel ditampilkan di perangkat mobile/tablet. <br/> `responsiveConfig={{ enableResponsive: true, mobileStackedView: true }}` |
| `layoutConfig` | `DataTableLayoutConfig` | - | **Konfigurasi tata letak UI** <br/> Mengatur posisi dan tampilan elemen-elemen UI seperti search, filter, pagination. <br/> `layoutConfig={{ toolbarLayout: 'compact', searchPosition: 'left' }}` |
| `advancedFilters` | `DataTableAdvancedFilter[]` | `[]` | **Filter lanjutan dengan kondisi kompleks** <br/> Menambahkan filter builder untuk membuat kondisi filter yang kompleks (AND/OR, berbagai operator). <br/> `advancedFilters={[{ key: 'name', label: 'Nama', type: 'text', operators: ['contains', 'startsWith'] }]}` |
| `enableAdvancedFilters` | `boolean` | `false` | **Aktifkan tombol Advanced Filter** <br/> Menampilkan tombol untuk membuka panel advanced filter. <br/> `enableAdvancedFilters={true}` |
| `onAdvancedFilter` | `(filterGroup) => void` | - | **Callback saat advanced filter diterapkan** <br/> Dipanggil ketika user menerapkan advanced filter. Anda bisa menggunakan ini untuk custom logic. <br/> `onAdvancedFilter={(filterGroup) => console.log('Filter diterapkan:', filterGroup)}` |

### Contoh Penggunaan Dasar:

```tsx
const columns = [
  { key: 'name', label: 'Nama', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status' }
];

const fetchData = async ({ page, perPage, search, orderBy, orderDir, filters }) => {
  const response = await fetch(`/api/users?page=${page}&search=${search}`);
  const data = await response.json();
  return { data: data.users, total: data.total };
};

<DataTable
  columns={columns}
  fetchData={fetchData}
  defaultOrderBy="created_at"
  defaultOrderDir="desc"
  defaultPerPage={25}
/>
```

### Contoh dengan Fitur Lengkap:

```tsx
const filters = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Aktif' },
      { value: 'inactive', label: 'Tidak Aktif' }
    ]
  }
];

const selectionConfig = {
  enableRowSelection: true,
  selectionMode: 'multiple',
  bulkActions: [
    {
      label: 'Hapus Terpilih',
      action: async (selectedRows) => {
        await deleteMultipleUsers(selectedRows.map(r => r.id));
      },
      variant: 'destructive',
      requiresConfirmation: true
    }
  ]
};

const exportConfig = {
  enableExport: true,
  exportFormats: ['csv', 'excel'],
  exportFileName: 'data-users',
  exportAllData: true
};

<DataTable
  columns={columns}
  fetchData={fetchData}
  filters={filters}
  selectionConfig={selectionConfig}
  exportConfig={exportConfig}
  enableColumnVisibility={true}
  enableColumnReordering={true}
  storageKey="users-table"
  actions={(user) => (
    <div className="flex gap-2">
      <button onClick={() => editUser(user.id)}>Edit</button>
      <button onClick={() => deleteUser(user.id)}>Hapus</button>
    </div>
  )}
/>
```

---

## 📊 Column Configuration - Konfigurasi Kolom Detail

### DataTableColumn<T> Interface

```tsx
interface DataTableColumn<T> {
  key: keyof T | string;           // Key data atau identifier custom
  label: string;                   // Label header kolom
  sortable?: boolean;              // Apakah kolom bisa diurutkan
  render?: (row: T) => ReactNode;  // Custom renderer untuk cell
  width?: string;                  // Lebar kolom (CSS width)
  visible?: boolean;               // Visibility awal kolom
  priority?: number;               // Prioritas untuk mobile (1=tertinggi)
  mobileLabel?: string;            // Label khusus untuk mobile stacked view
}
```

### Penjelasan Detail Setiap Property:

| Property | Kegunaan | Contoh Penggunaan |
|----------|----------|-------------------|
| `key` | **Identifier kolom** <br/> Menentukan field mana dari data yang akan ditampilkan | `key: 'user_name'` atau `key: 'email'` |
| `label` | **Judul kolom di header** <br/> Text yang ditampilkan di header tabel | `label: 'Nama Lengkap'` |
| `sortable` | **Aktifkan sorting** <br/> Menambahkan icon sort dan fungsi klik untuk mengurutkan data | `sortable: true` |
| `render` | **Custom tampilan cell** <br/> Fungsi untuk mengubah cara data ditampilkan (format, styling, komponen) | ```tsx <br/> render: (user) => (<br/>  <div className="flex items-center"><br/>    <img src={user.avatar} className="w-8 h-8 rounded-full mr-2" /><br/>    <span>{user.name}</span><br/>  </div><br/>)<br/>``` |
| `width` | **Lebar kolom** <br/> Mengatur lebar kolom dengan CSS | `width: '200px'` atau `width: '20%'` |
| `visible` | **Visibility awal** <br/> Menentukan apakah kolom ditampilkan saat pertama kali dimuat | `visible: false` // Kolom tersembunyi secara default |
| `priority` | **Prioritas mobile** <br/> 1 = selalu tampil, 5 = pertama disembunyikan saat layar kecil | `priority: 1` // Kolom penting, selalu tampil |
| `mobileLabel` | **Label untuk mobile** <br/> Label khusus saat menggunakan stacked view di mobile | `mobileLabel: 'Email'` // Lebih pendek dari label desktop |

### Contoh Konfigurasi Kolom Lengkap:

```tsx
const columns: DataTableColumn<User>[] = [
  {
    key: 'avatar',
    label: 'Foto',
    width: '60px',
    priority: 1,
    render: (user) => (
      <img 
        src={user.avatar || '/default-avatar.png'} 
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    )
  },
  {
    key: 'name',
    label: 'Nama Lengkap',
    sortable: true,
    priority: 1, // Selalu tampil di mobile
    width: '200px',
    render: (user) => (
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.username}</div>
      </div>
    )
  },
  {
    key: 'email',
    label: 'Alamat Email',
    sortable: true,
    priority: 2,
    mobileLabel: 'Email',
    render: (user) => (
      <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
        {user.email}
      </a>
    )
  },
  {
    key: 'role',
    label: 'Peran',
    sortable: true,
    priority: 3,
    render: (user) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        user.role === 'admin' 
          ? 'bg-red-100 text-red-800' 
          : user.role === 'moderator'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-blue-100 text-blue-800'
      }`}>
        {user.role === 'admin' ? 'Administrator' : 
         user.role === 'moderator' ? 'Moderator' : 'User'}
      </span>
    )
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    priority: 4,
    render: (user) => (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
        }`} />
        <span className={user.status === 'active' ? 'text-green-700' : 'text-gray-500'}>
          {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </div>
    )
  },
  {
    key: 'created_at',
    label: 'Tanggal Bergabung',
    sortable: true,
    priority: 5, // Akan disembunyikan pertama di mobile
    mobileLabel: 'Bergabung',
    visible: true, // Tampil secara default
    render: (user) => (
      <div>
        <div>{new Date(user.created_at).toLocaleDateString('id-ID')}</div>
        <div className="text-xs text-gray-500">
          {new Date(user.created_at).toLocaleTimeString('id-ID')}
        </div>
      </div>
    )
  },
  {
    key: 'last_login',
    label: 'Login Terakhir',
    priority: 5,
    visible: false, // Tersembunyi secara default
    render: (user) => (
      user.last_login ? (
        <span className="text-sm">
          {new Date(user.last_login).toLocaleDateString('id-ID')}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">Belum pernah</span>
      )
    )
  }
];
```

---

## ✅ Row Selection & Bulk Actions - Pemilihan Baris & Aksi Massal

### Konfigurasi Dasar Row Selection

```tsx
interface DataTableSelectionConfig<T> {
  enableRowSelection?: boolean;        // Aktifkan pemilihan baris
  selectionMode?: 'single' | 'multiple'; // Mode pemilihan
  bulkActions?: DataTableBulkAction<T>[]; // Aksi untuk baris terpilih
  onSelectionChange?: (selectedRows: T[]) => void; // Callback saat selection berubah
}
```

### Contoh Implementasi Lengkap:

```tsx
const selectionConfig: DataTableSelectionConfig<User> = {
  enableRowSelection: true,
  selectionMode: 'multiple', // User bisa pilih beberapa baris sekaligus
  
  // Aksi yang bisa dilakukan pada baris terpilih
  bulkActions: [
    {
      label: 'Hapus Terpilih',
      icon: <TrashIcon className="w-4 h-4" />,
      action: async (selectedRows) => {
        // Ambil ID dari semua baris terpilih
        const userIds = selectedRows.map(user => user.id);
        
        // Panggil API untuk hapus multiple users
        await fetch('/api/users/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: userIds })
        });
        
        // Refresh data tabel
        window.location.reload(); // atau panggil fetchData lagi
      },
      variant: 'destructive', // Styling merah untuk aksi berbahaya
      requiresConfirmation: true, // Tampilkan konfirmasi sebelum eksekusi
      confirmationMessage: 'Apakah Anda yakin ingin menghapus user yang dipilih?'
    },
    {
      label: 'Export Data Terpilih',
      icon: <DownloadIcon className="w-4 h-4" />,
      action: async (selectedRows) => {
        // Export hanya data yang dipilih
        const csvData = convertToCSV(selectedRows);
        downloadFile(csvData, 'selected-users.csv');
      }
    },
    {
      label: 'Ubah Status ke Aktif',
      icon: <CheckIcon className="w-4 h-4" />,
      action: async (selectedRows) => {
        const userIds = selectedRows.map(user => user.id);
        await fetch('/api/users/bulk-update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ids: userIds, 
            status: 'active' 
          })
        });
      }
    },
    {
      label: 'Kirim Email ke Terpilih',
      icon: <MailIcon className="w-4 h-4" />,
      action: async (selectedRows) => {
        const emails = selectedRows.map(user => user.email);
        // Redirect ke halaman compose email dengan recipients
        window.location.href = `/admin/compose-email?recipients=${emails.join(',')}`;
      }
    }
  ],
  
  // Callback dipanggil setiap kali selection berubah
  onSelectionChange: (selectedRows) => {
    console.log(`${selectedRows.length} baris dipilih:`, selectedRows);
    
    // Contoh: Update state di parent component
    setSelectedUsers(selectedRows);
    
    // Contoh: Kirim ke analytics
    analytics.track('table_selection_changed', {
      count: selectedRows.length,
      table: 'users'
    });
  }
};

// Penggunaan di DataTable
<DataTable
  columns={columns}
  fetchData={fetchUsers}
  selectionConfig={selectionConfig}
/>
```

### Mode Selection:

| Mode | Kegunaan | Contoh Use Case |
|------|----------|-----------------|
| `single` | User hanya bisa pilih 1 baris | Pilih user untuk edit detail |
| `multiple` | User bisa pilih beberapa baris | Bulk delete, bulk email, bulk export |

### Bulk Action Properties:

| Property | Type | Kegunaan |
|----------|------|----------|
| `label` | `string` | Text yang ditampilkan di dropdown |
| `icon` | `ReactNode` | Icon untuk aksi (opsional) |
| `action` | `function` | Fungsi yang dijalankan saat aksi dipilih |
| `variant` | `'default' \| 'destructive'` | Styling (merah untuk aksi berbahaya) |
| `requiresConfirmation` | `boolean` | Tampilkan dialog konfirmasi |
| `confirmationMessage` | `string` | Pesan konfirmasi custom |

---

## 📤 Export Functionality - Fitur Export Data

### Konfigurasi Export

```tsx
interface DataTableExportConfig {
  enableExport?: boolean;           // Aktifkan fitur export
  exportFormats?: ('csv' | 'excel')[]; // Format yang tersedia
  exportFileName?: string;          // Nama file default
  exportAllData?: boolean;          // Export semua data atau hanya halaman ini
  exportEndpoint?: string;          // Endpoint API untuk export
}
```

### Contoh Implementasi:

```tsx
const exportConfig: DataTableExportConfig = {
  enableExport: true,
  exportFormats: ['csv', 'excel'], // Tersedia format CSV dan Excel
  exportFileName: 'data-users', // File akan bernama "data-users.csv" atau "data-users.xlsx"
  exportAllData: true, // Export semua data, bukan hanya 25 data di halaman ini
  exportEndpoint: '/api/users/export' // Endpoint backend untuk handle export
};

<DataTable
  columns={columns}
  fetchData={fetchUsers}
  exportConfig={exportConfig}
/>
```

### Backend Implementation (Express.js):

```javascript
// /api/users/export
app.get('/api/users/export', async (req, res) => {
  const { 
    format,           // 'csv' atau 'excel'
    filename,         // nama file
    search,           // parameter search
    orderBy,          // kolom sorting
    orderDir,         // arah sorting
    ...filters        // filter yang aktif
  } = req.query;
  
  try {
    // Ambil semua data dengan filter yang sama seperti di tabel
    const users = await User.findAll({
      where: buildWhereClause(filters),
      order: orderBy ? [[orderBy, orderDir]] : [['created_at', 'DESC']],
      // Jangan gunakan limit/offset untuk export semua data
    });
    
    if (format === 'csv') {
      // Generate CSV
      const csvData = users.map(user => ({
        'Nama': user.name,
        'Email': user.email,
        'Role': user.role,
        'Status': user.status,
        'Tanggal Bergabung': user.created_at.toLocaleDateString('id-ID')
      }));
      
      const csv = convertArrayToCSV(csvData);
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send('\uFEFF' + csv); // BOM untuk proper UTF-8 encoding
      
    } else if (format === 'excel') {
      // Generate Excel menggunakan library seperti exceljs
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');
      
      // Header
      worksheet.columns = [
        { header: 'Nama', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Tanggal Bergabung', key: 'created_at', width: 20 }
      ];
      
      // Data
      users.forEach(user => {
        worksheet.addRow({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          created_at: user.created_at.toLocaleDateString('id-ID')
        });
      });
      
      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      
      await workbook.xlsx.write(res);
      res.end();
    }
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});
```

### Export Options:

| Option | Kegunaan | Contoh |
|--------|----------|---------|
| `exportAllData: true` | Export semua data dengan filter yang aktif | Export 10,000 user yang sesuai filter |
| `exportAllData: false` | Export hanya data di halaman saat ini | Export 25 user di halaman 1 |

---

## 📱 Responsive Configuration - Konfigurasi Tampilan Mobile

### Interface ResponsiveConfig

```tsx
interface DataTableResponsiveConfig {
  enableResponsive?: boolean;       // Aktifkan mode responsive
  breakpoints?: {                   // Breakpoint untuk ukuran layar
    mobile: number;                 // Default: 768px
    tablet: number;                 // Default: 1024px  
    desktop: number;                // Default: 1280px
  };
  mobileStackedView?: boolean;      // Susun kolom vertikal di mobile
  priorityColumns?: string[];       // Kolom yang selalu tampil
  hideColumnsOnMobile?: string[];   // Kolom yang disembunyikan di mobile
  compactMode?: boolean;            // Kurangi padding dan font size
}
```

### Contoh Konfigurasi Lengkap:

```tsx
const responsiveConfig: DataTableResponsiveConfig = {
  enableResponsive: true,
  
  // Custom breakpoints
  breakpoints: {
    mobile: 640,   // sm: di bawah 640px = mobile
    tablet: 1024,  // md: 640px - 1024px = tablet  
    desktop: 1280  // lg: di atas 1024px = desktop
  },
  
  // Di mobile, susun kolom vertikal seperti card
  mobileStackedView: true,
  
  // Kolom yang SELALU tampil meskipun di mobile
  priorityColumns: ['name', 'email', 'status'],
  
  // Kolom yang DISEMBUNYIKAN di mobile untuk menghemat ruang
  hideColumnsOnMobile: ['created_at', 'last_login', 'updated_at'],
  
  // Mode compact: kurangi padding, font size, dll
  compactMode: true
};

<DataTable
  columns={columns}
  fetchData={fetchUsers}
  responsiveConfig={responsiveConfig}
/>
```

### Perilaku di Berbagai Ukuran Layar:

#### Desktop (> 1280px):
- Semua kolom tampil
- Padding normal
- Font size normal
- Toolbar layout horizontal

#### Tablet (1024px - 1280px):
- Kolom dengan priority 1-3 tampil
- Kolom priority 4-5 disembunyikan
- Padding sedikit dikurangi
- Beberapa tombol menjadi compact

#### Mobile (< 1024px):
- Hanya priority columns yang tampil
- Kolom di hideColumnsOnMobile disembunyikan
- Jika mobileStackedView = true: kolom disusun vertikal seperti card
- Compact mode: padding minimal, font kecil
- Toolbar menjadi stacked (vertikal)
- Pagination menjadi compact

### Contoh Mobile Stacked View:

```tsx
// Desktop: Tabel normal
| Avatar | Name      | Email           | Role  | Status |
|--------|-----------|-----------------|-------|--------|
| 👤     | John Doe  | john@email.com  | Admin | Active |

// Mobile Stacked: Card-like layout
┌─────────────────────────────────┐
│ 👤 John Doe                     │
│ Email: john@email.com           │
│ Role: Admin                     │
│ Status: ● Active                │
│ [Edit] [Delete]                 │
└─────────────────────────────────┘
```

---

## 🎨 Layout Customization - Kustomisasi Tata Letak

### Interface LayoutConfig

```tsx
interface DataTableLayoutConfig {
  toolbarLayout?: 'default' | 'compact' | 'stacked';
  searchPosition?: 'left' | 'right' | 'full';
  actionsPosition?: 'right' | 'left' | 'bottom';
  filtersLayout?: 'inline' | 'wrapped' | 'dropdown';
  paginationPosition?: 'top' | 'bottom' | 'both';
  showRecordInfo?: boolean;
  compactButtons?: boolean;
  paginationAlignment?: 'left' | 'center' | 'right' | 'between';
}
```

### Contoh Konfigurasi Layout:

```tsx
const layoutConfig: DataTableLayoutConfig = {
  // Layout toolbar
  toolbarLayout: 'default', // 'default' | 'compact' | 'stacked'
  
  // Posisi search box
  searchPosition: 'left', // 'left' | 'right' | 'full'
  
  // Posisi tombol aksi (export, column settings, dll)
  actionsPosition: 'right', // 'right' | 'left' | 'bottom'
  
  // Layout filter
  filtersLayout: 'inline', // 'inline' | 'wrapped' | 'dropdown'
  
  // Posisi pagination
  paginationPosition: 'bottom', // 'top' | 'bottom' | 'both'
  
  // Tampilkan info "Menampilkan 1-10 dari 100 data"
  showRecordInfo: true,
  
  // Gunakan tombol compact (lebih kecil)
  compactButtons: false,
  
  // Alignment pagination
  paginationAlignment: 'between' // 'left' | 'center' | 'right' | 'between'
};

<DataTable
  columns={columns}
  fetchData={fetchUsers}
  layoutConfig={layoutConfig}
/>
```

### Penjelasan Setiap Option:

#### toolbarLayout:
- `default`: Search di kiri, filter di tengah, aksi di kanan (horizontal)
- `compact`: Semua elemen dalam satu baris, lebih rapat
- `stacked`: Elemen disusun vertikal (cocok untuk mobile)

#### searchPosition:
- `left`: Search box di kiri toolbar
- `right`: Search box di kanan toolbar  
- `full`: Search box memenuhi lebar penuh

#### actionsPosition:
- `right`: Tombol aksi di kanan (default)
- `left`: Tombol aksi di kiri
- `bottom`: Tombol aksi di bawah search/filter

#### filtersLayout:
- `inline`: Filter sejajar dengan search
- `wrapped`: Filter wrap ke baris baru jika tidak muat
- `dropdown`: Filter disembunyikan dalam dropdown

#### paginationPosition:
- `top`: Pagination hanya di atas tabel
- `bottom`: Pagination hanya di bawah tabel (default)
- `both`: Pagination di atas dan bawah tabel

#### paginationAlignment:
- `left`: Pagination di kiri
- `center`: Pagination di tengah
- `right`: Pagination di kanan
- `between`: Record info di kiri, pagination di kanan

### Contoh Layout Variations:

```tsx
// Layout untuk Dashboard Admin (banyak fitur)
const adminLayout = {
  toolbarLayout: 'default',
  searchPosition: 'left',
  actionsPosition: 'right',
  filtersLayout: 'inline',
  paginationPosition: 'both',
  showRecordInfo: true,
  paginationAlignment: 'between'
};

// Layout untuk Mobile/Tablet (compact)
const mobileLayout = {
  toolbarLayout: 'stacked',
  searchPosition: 'full',
  actionsPosition: 'bottom',
  filtersLayout: 'wrapped',
  paginationPosition: 'bottom',
  showRecordInfo: true,
  compactButtons: true,
  paginationAlignment: 'center'
};

// Layout untuk Embedded Table (minimal)
const embeddedLayout = {
  toolbarLayout: 'compact',
  searchPosition: 'left',
  actionsPosition: 'right',
  filtersLayout: 'dropdown',
  paginationPosition: 'bottom',
  showRecordInfo: false,
  compactButtons: true,
  paginationAlignment: 'right'
};
```

---

## 💾 State Persistence - Penyimpanan Preferensi User

### Cara Kerja Storage

Dengan menggunakan `storageKey`, DataTable akan menyimpan preferensi user ke localStorage:

```tsx
<DataTable
  columns={columns}
  fetchData={fetchUsers}
  storageKey="users-management-table" // Key unik untuk tabel ini
  enableColumnVisibility={true}
  enableColumnReordering={true}
/>
```

### Data yang Disimpan:

```json
{
  "columnVisibility": {
    "name": true,
    "email": true,
    "role": true,
    "status": false,
    "created_at": true,
    "last_login": false
  },
  "columnOrder": [
    "name",
    "email", 
    "role",
    "status",
    "created_at"
  ]
}
```

### Kegunaan Storage:

1. **Column Visibility**: User menyembunyikan kolom "Last Login" → tersimpan
2. **Column Order**: User drag kolom "Status" ke posisi kedua → tersimpan  
3. **Persistent**: Saat user buka halaman lagi, preferensi tetap sama

### Best Practices:

```tsx
// Gunakan storageKey yang unik per tabel
const STORAGE_KEYS = {
  USERS_TABLE: 'admin-users-table',
  PRODUCTS_TABLE: 'admin-products-table',
  ORDERS_TABLE: 'admin-orders-table'
};

// Users table
<DataTable storageKey={STORAGE_KEYS.USERS_TABLE} />

// Products table  
<DataTable storageKey={STORAGE_KEYS.PRODUCTS_TABLE} />
```

### Reset Preferences:

```tsx
// Untuk reset preferensi user
const resetTablePreferences = () => {
  localStorage.removeItem('datatable-users-management-table');
  window.location.reload(); // Reload untuk apply default settings
};

<button onClick={resetTablePreferences}>
  Reset Table Settings
</button>
```
