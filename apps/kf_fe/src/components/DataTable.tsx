import type { ReactNode } from "react";
import { Loader } from "@/components/ui/loader";
import { Table, TableCell, TableHead } from "@/components/ui/table";

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  getRowKey: (item: T) => string | number;
  isLoading?: boolean;
};

export function DataTable<T>({
  columns,
  data,
  emptyText = "Chưa có dữ liệu",
  getRowKey,
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <Table>
          <thead className="bg-slate-100">
            <tr>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                >
                  {column.header}
                </TableHead>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  <Loader label="Đang tải dữ liệu..." className="justify-center" />
                </td>
              </tr>
            ) : null}
            {!isLoading && data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : null}
            {!isLoading
              ? data.map((item) => (
                  <tr key={getRowKey(item)} className="hover:bg-slate-50">
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={column.className}
                      >
                        {column.render(item)}
                      </TableCell>
                    ))}
                  </tr>
                ))
              : null}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
