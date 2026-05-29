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
  const showInitialLoading = isLoading && data.length === 0;

  return (
    <div className="scroll-reveal relative overflow-hidden rounded-md border border-stone-200 bg-white">
      {isLoading && data.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-emerald-50">
          <div className="h-full w-1/3 animate-loading-bar bg-emerald-600" />
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <Table>
          <thead className="bg-stone-50">
            <tr>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {showInitialLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-[460px] px-4 py-10 text-center text-sm text-slate-500">
                  <Loader label="Đang tải dữ liệu..." className="justify-center" />
                </td>
              </tr>
            ) : null}
            {!showInitialLoading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-[280px] px-4 py-10 text-center text-sm text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : null}
            {!showInitialLoading
              ? data.map((item, index) => (
                  <tr key={getRowKey(item, index)} className="transition hover:bg-stone-50/70">
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
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
