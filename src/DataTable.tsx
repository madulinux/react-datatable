// Standalone DataTable component for npm package
import React, { useState, useEffect } from 'react';

export type DataTableColumn<T = any> = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type DataTableProps<T = any> = {
  columns: DataTableColumn<T>[];
  fetchData: (params: {
    page: number;
    perPage: number;
    search?: string;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) => Promise<{ data: T[]; total: number }>;
  filterValues?: Record<string, any>;
  defaultPerPage?: number;
  actions?: (row: T) => React.ReactNode;
  /** Tambahan styling props */
  className?: string; // root container
  tableClassName?: string; // <table>
  headerClassName?: string; // <th>
  rowClassName?: string; // <tr>
  cellClassName?: string; // <td>
};

function DataTable<T = any>({ columns, fetchData, filterValues = {}, defaultPerPage = 10, actions, className = '', tableClassName = '', headerClassName = '', rowClassName = '', cellClassName = '' }: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setLoading(true);
    fetchData({ page, perPage, orderBy, orderDir, filters: filterValues })
      .then(res => {
        setData(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, perPage, orderBy, orderDir, filterValues, fetchData]);

  return (
    <div className={className}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} className={tableClassName}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => {
                  if (col.sortable) {
                    setOrderBy(col.key);
                    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
                  }
                }}
                style={{ cursor: col.sortable ? 'pointer' : 'default', borderBottom: '1px solid #eee', padding: 8 }}
                className={headerClassName}
              >
                {col.label}
                {col.sortable && orderBy === col.key && (orderDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            {actions && <th className={headerClassName}>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className={rowClassName}><td className={cellClassName} colSpan={columns.length + (actions ? 1 : 0)}>Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr className={rowClassName}><td className={cellClassName} colSpan={columns.length + (actions ? 1 : 0)}>Tidak ada data</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className={rowClassName} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map(col => (
                  <td key={col.key} className={cellClassName} style={{ padding: 8 }}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
                {actions && <td className={cellClassName}>{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Halaman {page} / {Math.ceil(total / perPage) || 1}</span>
        <button onClick={() => setPage(p => (p * perPage < total ? p + 1 : p))} disabled={page * perPage >= total}>Next</button>
        <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}>
          {[10, 20, 50, 100].map(opt => <option key={opt} value={opt}>{opt} / halaman</option>)}
        </select>
      </div>
    </div>
  );
}

export default DataTable;
