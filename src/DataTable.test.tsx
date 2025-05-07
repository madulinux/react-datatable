import { render, screen } from '@testing-library/react';
import DataTable from './DataTable';

describe('DataTable', () => {
  it('renders table header', () => {
    render(
      <DataTable
        columns={[{ key: 'name', label: 'Nama' }]}
        fetchData={async () => ({ data: [], total: 0 })}
      />
    );
    expect(screen.getByText('Nama')).toBeInTheDocument();
  });

  it('shows loading when fetching', async () => {
    render(
      <DataTable
        columns={[{ key: 'name', label: 'Nama' }]}
        fetchData={async () => { return new Promise(res => setTimeout(() => res({ data: [], total: 0 }), 200)); }}
      />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
