import type { ReactNode } from "react";
import { Loader } from "@/components/ui/loader";
import { Table, TableCell, TableHead } from "@/components/ui/table";

export type Column<T> = {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  getRowKey: (item: T, index: number) => string | number;
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
    <div className="overflow-hidden rounded-md border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <Table>
          <thead className="bg-stone-50">
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
          <tbody className="divide-y divide-stone-100">
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
              ? data.map((item, index) => (
                  <tr key={getRowKey(item, index)} className="hover:bg-stone-50/70">
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
