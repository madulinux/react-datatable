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
| tableClassName   | string                                       | Styling <table> element                         |
| headerClassName  | string                                       | Styling all <th>                                |
| rowClassName     | string                                       | Styling all <tr>                                |
| cellClassName    | string                                       | Styling all <td>                                |

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
