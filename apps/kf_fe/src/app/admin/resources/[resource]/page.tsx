"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { DataToolbar } from "@/components/DataToolbar";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { useToast } from "@/components/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { findAdminResource } from "@/config/adminResources";
import { apiFetch, buildUrl } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";

type AdminRow = Record<string, unknown>;
type EditorMode = "create" | "edit";
type EditorState = {
  id?: string | number;
  mode: EditorMode;
  text: string;
};

const fallbackColumns = ["id", "name", "title", "code", "status", "active", "createdAt"];

export default function AdminResourcePage() {
  const params = useParams<{ resource: string }>();
  const resource = findAdminResource(params.resource);

  if (!resource) {
    return (
      <AppShell>
        <PageHeader title="Không tìm thấy resource" description="API này chưa được khai báo trong admin." />
      </AppShell>
    );
  }

  return <ResourceTable resource={resource} />;
}

function ResourceTable({
  resource,
}: {
  resource: NonNullable<ReturnType<typeof findAdminResource>>;
}) {
  const actions = {
    create: true,
    hardDelete: true,
    softDelete: true,
    update: true,
    ...(resource.actions ?? {}),
  };
  const data = usePaginatedResource<AdminRow>({
    path: resource.path,
    initialSize: 20,
  });
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const { notify } = useToast();

  const visibleIds = data.data.content
    .map(getId)
    .filter((id): id is string | number => id !== null);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length;
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  const columns = useMemo<Column<AdminRow>[]>(() => {
    const sampleKeys = data.data.content.flatMap((item) => Object.keys(item));
    const keys = unique([...(resource.preferredColumns ?? fallbackColumns), ...sampleKeys])
      .filter((key) => sampleKeys.includes(key) || resource.preferredColumns?.includes(key))
      .slice(0, 8);

    const dataColumns: Column<AdminRow>[] = keys.map((key) => ({
      key,
      header: humanize(key),
      render: (item: AdminRow) => renderValue(key, item[key]),
      className: key === "id" ? "w-20" : undefined,
    }));

    return [
      {
        key: "__select",
        header: (
          <input
            aria-label="Chọn tất cả trên trang"
            checked={allVisibleSelected}
            className="h-4 w-4 accent-slate-950"
            disabled={visibleIds.length === 0}
            type="checkbox"
            onChange={(event) => toggleAllVisible(event.target.checked, visibleIds, setSelectedIds)}
          />
        ),
        render: (item) => {
          const id = getId(item);

          return id === null ? null : (
            <input
              aria-label={`Chọn bản ghi ${id}`}
              checked={selectedIds.includes(id)}
              className="h-4 w-4 accent-slate-950"
              type="checkbox"
              onChange={(event) => toggleSelected(id, event.target.checked, setSelectedIds)}
            />
          );
        },
        className: "w-12",
      },
      ...dataColumns,
      {
        key: "__actions",
        header: "Thao tác",
        render: (item) => {
          const id = getId(item);

          return (
            <div className="flex flex-wrap justify-end gap-2">
              {actions.update && id !== null ? (
                <Button size="sm" variant="outline" onClick={() => openEdit(item, id)}>
                  Sửa
                </Button>
              ) : null}
              {actions.copy && id !== null ? (
                <Button size="sm" variant="outline" onClick={() => runCopy(id)}>
                  Sao chép
                </Button>
              ) : null}
              {actions.softDelete && id !== null ? (
                <Button size="sm" variant="outline" onClick={() => runDelete(id, "soft")}>
                  Xóa mềm
                </Button>
              ) : null}
              {actions.hardDelete && id !== null ? (
                <Button size="sm" variant="destructive" onClick={() => runDelete(id, "hard")}>
                  Xóa cứng
                </Button>
              ) : null}
            </div>
          );
        },
        className: "min-w-72 text-right",
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.copy, actions.hardDelete, actions.softDelete, actions.update, allVisibleSelected, data.data.content, resource.preferredColumns, selectedIds]);

  const apiUrl = buildUrl(resource.path, data.query);

  function openCreate() {
    setEditor({
      mode: "create",
      text: "{\n  \n}",
    });
    setActionError(null);
  }

  function openEdit(item: AdminRow, id: string | number) {
    setEditor({
      id,
      mode: "edit",
      text: JSON.stringify(stripReadOnlyFields(item), null, 2),
    });
    setActionError(null);
  }

  async function mutate({
    action,
    errorMessage,
    successMessage,
  }: {
    action: () => Promise<unknown>;
    errorMessage: string;
    successMessage: string;
  }) {
    setIsMutating(true);
    setActionError(null);

    try {
      await action();
      setEditor(null);
      setSelectedIds([]);
      data.refresh();
      notify({
        message: successMessage,
        title: "Thao tác thành công",
        type: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setActionError(message);
      notify({
        message,
        title: "Thao tác thất bại",
        type: "error",
      });
    } finally {
      setIsMutating(false);
    }
  }

  async function saveEditor() {
    if (!editor) {
      return;
    }

    let body: unknown;
    try {
      body = JSON.parse(editor.text);
    } catch {
      setActionError("JSON không hợp lệ");
      notify({
        message: "Vui lòng kiểm tra lại cú pháp JSON trước khi lưu.",
        title: "Dữ liệu không hợp lệ",
        type: "error",
      });
      return;
    }

    await mutate({
      action: () =>
        editor.mode === "create"
          ? apiFetch(resource.path, undefined, { body, method: "POST" })
          : apiFetch(`${resource.path}/${editor.id}`, undefined, { body, method: "PUT" }),
      errorMessage: "Không thể lưu dữ liệu",
      successMessage: editor.mode === "create" ? "Đã thêm mới bản ghi." : "Đã cập nhật bản ghi.",
    });
  }

  async function runDelete(id: string | number, mode: "soft" | "hard") {
    const label = mode === "hard" ? "xóa cứng" : "xóa mềm";
    if (!window.confirm(`Bạn chắc chắn muốn ${label} bản ghi ${id}?`)) {
      return;
    }

    await mutate({
      action: () => apiFetch(`${resource.path}/${id}${mode === "hard" ? "/hard" : ""}`, undefined, { method: "DELETE" }),
      errorMessage: "Không thể xóa dữ liệu",
      successMessage: mode === "hard" ? "Đã xóa cứng bản ghi." : "Đã xóa mềm bản ghi.",
    });
  }

  async function runBulkDelete(mode: "soft" | "hard") {
    const ids = selectedIds.filter((id) => typeof id === "number");
    const label = mode === "hard" ? "xóa cứng hàng loạt" : "xóa mềm hàng loạt";

    if (ids.length === 0) {
      setActionError("Chức năng xóa hàng loạt cần ID dạng số.");
      notify({
        message: "Chức năng xóa hàng loạt cần ID dạng số.",
        title: "Không thể xóa hàng loạt",
        type: "error",
      });
      return;
    }

    if (!window.confirm(`Bạn chắc chắn muốn ${label} ${ids.length} bản ghi?`)) {
      return;
    }

    const path = `${resource.path}/${mode === "hard" ? "hard/" : ""}bulk`;
    await mutate({
      action: () => apiFetch(path, undefined, { body: ids, method: "DELETE" }),
      errorMessage: "Không thể xóa hàng loạt",
      successMessage: mode === "hard" ? "Đã xóa cứng hàng loạt." : "Đã xóa mềm hàng loạt.",
    });
  }

  async function runCopy(id: string | number) {
    await mutate({
      action: () => apiFetch(`${resource.path}/${id}/copy`, undefined, { method: "POST" }),
      errorMessage: "Không thể sao chép dữ liệu",
      successMessage: "Đã sao chép bản ghi.",
    });
  }

  return (
    <AppShell>
      <PageHeader
        title={resource.label}
        description={`${resource.description} Đường dẫn API: ${resource.path}`}
        action={
          <div className="flex flex-wrap gap-2">
            {resource.slug === "products" ? (
              <Link href="/products">
                <Button variant="outline">Xem cửa hàng</Button>
              </Link>
            ) : null}
            {actions.create ? <Button onClick={openCreate}>Thêm mới</Button> : null}
            <a href={apiUrl} target="_blank" rel="noreferrer">
              <Button variant="outline">Mở API</Button>
            </a>
            <Button variant="outline" onClick={data.refresh}>Tải lại</Button>
          </div>
        }
      />

      <DataToolbar
        search={data.search}
        sort={data.sort}
        onSearchChange={data.setSearch}
        onSortChange={data.setSort}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
        <span className="text-sm text-slate-600">
          Đã chọn <span className="font-medium text-slate-950">{selectedIds.length}</span> bản ghi
        </span>
        {actions.bulkDelete ? (
          <Button disabled={selectedIds.length === 0 || isMutating} size="sm" variant="outline" onClick={() => runBulkDelete("soft")}>
            Xóa mềm hàng loạt
          </Button>
        ) : null}
        {actions.bulkHardDelete ? (
          <Button disabled={selectedIds.length === 0 || isMutating} size="sm" variant="destructive" onClick={() => runBulkDelete("hard")}>
            Xóa cứng hàng loạt
          </Button>
        ) : null}
        <Button disabled={selectedIds.length === 0} size="sm" variant="outline" onClick={() => setSelectedIds([])}>
          Bỏ chọn
        </Button>
      </div>

      {data.error || actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError ?? data.error}
        </div>
      ) : null}

      <DataTable
        columns={columns.length ? columns : emptyColumns}
        data={data.data.content}
        emptyText="Chưa có dữ liệu từ endpoint này"
        getRowKey={(item, index) => getRowKey(item, index)}
        isLoading={data.isLoading}
      />

      <Pagination
        page={data.data.page}
        size={data.data.size}
        totalElements={data.data.totalElements}
        totalPages={data.data.totalPages}
        onPageChange={data.setPage}
        onSizeChange={data.setSize}
      />

      {editor ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-base font-semibold text-slate-950">
                {editor.mode === "create" ? "Thêm mới" : `Sửa bản ghi ${editor.id}`}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Nhập JSON theo DTO của endpoint {resource.path}. Các trường id/createdAt/updatedAt nên bỏ qua khi lưu.
              </p>
            </div>
            <div className="p-4">
              <textarea
                className="h-[420px] w-full resize-y rounded-md border border-slate-300 bg-slate-950 p-3 font-mono text-sm leading-6 text-slate-50 outline-none focus:border-slate-500"
                spellCheck={false}
                value={editor.text}
                onChange={(event) => setEditor((current) => current ? { ...current, text: event.target.value } : current)}
              />
              {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <Button disabled={isMutating} variant="outline" onClick={() => setEditor(null)}>
                Hủy
              </Button>
              <Button disabled={isMutating} onClick={saveEditor}>
                {isMutating ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isMutating ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/20 p-4">
          <div className="rounded-md border border-slate-200 bg-white px-5 py-4 shadow-lg">
            <Loader label="Đang xử lý..." />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

const emptyColumns: Column<AdminRow>[] = [
  {
    key: "empty",
    header: "Dữ liệu",
    render: () => "-",
  },
];

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function humanize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getRowKey(item: AdminRow, index: number) {
  const id = getId(item) ?? item.uuid ?? item.code ?? item.slug;
  return typeof id === "string" || typeof id === "number" ? id : index;
}

function getId(item: AdminRow) {
  const id = item.id;
  return typeof id === "string" || typeof id === "number" ? id : null;
}

function toggleSelected(
  id: string | number,
  checked: boolean,
  setSelectedIds: (updater: (current: Array<string | number>) => Array<string | number>) => void,
) {
  setSelectedIds((current) => checked ? uniqueIds([...current, id]) : current.filter((item) => item !== id));
}

function toggleAllVisible(
  checked: boolean,
  visibleIds: Array<string | number>,
  setSelectedIds: (updater: (current: Array<string | number>) => Array<string | number>) => void,
) {
  setSelectedIds((current) =>
    checked ? uniqueIds([...current, ...visibleIds]) : current.filter((id) => !visibleIds.includes(id)),
  );
}

function uniqueIds(values: Array<string | number>) {
  return Array.from(new Set(values));
}

function stripReadOnlyFields(item: AdminRow) {
  const clone = { ...item };
  delete clone.id;
  delete clone.createdAt;
  delete clone.updatedAt;
  delete clone.deletedAt;
  return clone;
}

function renderValue(key: string, value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return <Badge variant={value ? "success" : "secondary"}>{value ? "Có" : "Không"}</Badge>;
  }

  if (Array.isArray(value)) {
    return value.length ? (
      <div className="flex max-w-72 flex-wrap gap-1">
        {value.slice(0, 4).map((item, index) => (
          <Badge key={`${key}-${index}`} variant="secondary">
            {compact(item)}
          </Badge>
        ))}
        {value.length > 4 ? <Badge variant="secondary">+{value.length - 4}</Badge> : null}
      </div>
    ) : (
      "-"
    );
  }

  if (typeof value === "object") {
    return <span className="block max-w-72 truncate text-slate-600">{compact(value)}</span>;
  }

  if (isStatusKey(key)) {
    return <Badge variant="secondary">{String(value)}</Badge>;
  }

  if (isMoneyKey(key)) {
    return formatMoney(String(value));
  }

  if (isDateKey(key)) {
    return formatDate(String(value));
  }

  const text = String(value);
  if (isUrl(text)) {
    return (
      <a className="text-slate-950 underline underline-offset-2" href={text} target="_blank" rel="noreferrer">
        Liên kết
      </a>
    );
  }

  return <span className="block max-w-72 truncate">{text}</span>;
}

function compact(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return String(record.name ?? record.title ?? record.code ?? record.id ?? JSON.stringify(value));
  }

  return String(value);
}

function isDateKey(key: string) {
  return /(date|at)$/i.test(key);
}

function isMoneyKey(key: string) {
  return /(price|total|amount|fee|cost|value)$/i.test(key);
}

function isStatusKey(key: string) {
  return /(status|state|type|role)$/i.test(key);
}

function isUrl(value: string) {
  return /^https?:\/\//i.test(value);
}
