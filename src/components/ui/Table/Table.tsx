import React from 'react';
import clsx from 'clsx';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey?: (row: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  rowKey = (r, i) => (r.id ? String(r.id) : String(i)),
  emptyMessage = 'No records found',
  loading,
  className,
}: TableProps<T>) {
  return (
    <div className={clsx('w-full overflow-x-auto rounded-md border border-neutral-200', className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            {columns.map((c) => (
              <th
                key={String(c.key)}
                style={{ width: c.width }}
                className={clsx('px-3 py-2 text-left font-medium', c.align === 'center' && 'text-center', c.align === 'right' && 'text-right')}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-neutral-500">
                Loading...
              </td>
            </tr>
          )}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            data.map((row, i) => (
              <tr key={rowKey(row, i)} className="border-t border-neutral-100 hover:bg-neutral-50">
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className={clsx('px-3 py-2 text-neutral-800', c.align === 'center' && 'text-center', c.align === 'right' && 'text-right')}
                  >
                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
