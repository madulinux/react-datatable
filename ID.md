# @madulinux/react-datatable

[![npm version](https://img.shields.io/npm/v/@madulinux/react-datatable.svg)](https://www.npmjs.com/package/@madulinux/react-datatable)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Reusable DataTable React component with sorting, paging, filtering, async fetch, and custom styling. untuk kebutuhan tabel dinamis, admin panel, dan integrasi filter.

---

#### [English Documentation](README.md)

## Fitur Utama
- Sorting kolom (klik header)
- Paging & perPage
- Filtering dinamis (via filterValues)
- Async fetch data (API ready)
- Custom render cell/aksi
- Export className untuk styling fleksibel
- Dukungan TypeScript

---

## Instalasi
```bash
npm install @madulinux/react-datatable
```

---

## Penggunaan Sederhana
```tsx
import DataTable from '@madulinux/react-datatable';

const columns = [
  { key: 'name', label: 'Nama', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', render: row => row.status ? 'Aktif' : 'Nonaktif' }
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

## API & Props
| Prop             | Tipe                                         | Deskripsi                                      |
|------------------|----------------------------------------------|------------------------------------------------|
| columns          | Array<{ key, label, sortable?, render? }>    | Definisi kolom dan render cell                  |
| fetchData        | function(params) => Promise<{data,total}>    | Async fetch data (API, dsb)                     |
| filterValues     | object                                       | Filter tambahan (opsional)                      |
| defaultPerPage   | number                                       | Jumlah data per halaman (default: 10)           |
| actions          | function(row) => ReactNode                    | Render aksi custom per baris                    |
| className        | string                                       | Styling root container                          |
| tableClassName   | string                                       | Styling elemen <table>                          |
| headerClassName  | string                                       | Styling semua <th>                              |
| rowClassName     | string                                       | Styling semua <tr>                              |
| cellClassName    | string                                       | Styling semua <td>                              |

---

## Custom Styling
Anda bisa mengatur tampilan DataTable sesuai kebutuhan dengan prop styling berikut:

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

- Anda dapat menggunakan Tailwind, CSS module, atau global CSS sesuai kebutuhan project Anda.
- Untuk dark mode, cukup tambahkan className sesuai framework CSS Anda.

---

## Troubleshooting & Catatan Integrasi
- Pastikan fungsi `fetchData` mengembalikan `{ data, total }`.
- Untuk styling, gunakan className atau custom style sesuai kebutuhan.
- Untuk aksi custom, gunakan prop `actions`.
- Untuk filter dinamis, gunakan prop `filterValues`.

---

## Kontribusi
Pull request, saran, dan issue sangat diterima! Silakan fork repo dan buat PR.

## Author
**madulinux**  
[GitHub](https://github.com/madulinux)  
[npmjs](https://www.npmjs.com/~madulinux)

## Lisensi
MIT

---
