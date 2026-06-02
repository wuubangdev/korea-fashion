"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Copy, CreditCard, Edit3, ExternalLink, MoreHorizontal, PackageCheck, Plus, RefreshCw, RotateCcw, Trash2, Truck, Undo2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { DataToolbar } from "@/components/DataToolbar";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { SafeImage } from "@/components/SafeImage";
import { useToast } from "@/components/ToastProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Select } from "@/components/ui/select";
import { findAdminResource } from "@/config/adminResources";
import { getAdminResourceLabel } from "@/config/adminResourceDisplay";
import { apiFetch, buildUrl, mediaApi } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { useApiResource } from "@/hooks/useApiResource";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import type { Category, MediaAsset, PageResult } from "@/types/api";

type AdminRow = Record<string, unknown>;
type EditorMode = "create" | "edit";
type EditorFieldScope = "basic" | "full";
type FieldKind = "array" | "boolean" | "date" | "json" | "number" | "text";
type EditorField = {
  key: string;
  kind: FieldKind;
  value: string;
};
type EditorState = {
  basicKeys: string[];
  currentStep: number;
  fieldKinds: Record<string, FieldKind>;
  fieldScope: EditorFieldScope;
  fields: EditorField[];
  fullKeys: string[];
  id?: string | number;
  initialValues: Record<string, string>;
  mode: EditorMode;
  resourceSlug: string;
};

const fallbackColumns = ["id", "name", "title", "code", "status", "active", "createdAt"];
const fieldsPerStep = 6;
const readonlyFields = new Set(["id", "createdAt", "updatedAt", "deletedAt"]);
const createFieldHints: Record<string, string[]> = {
  admins: ["username", "email", "password", "active"],
  banners: ["title", "imageUrl", "targetUrl", "placement", "displayOrder", "active"],
  brands: ["name", "code", "active"],
  categories: ["code", "name", "slug", "parentId", "description", "active"],
  colors: ["name", "code", "hexCode"],
  "contact-messages": ["fullName", "phone", "email", "subject", "message", "status", "adminNote"],
  coupons: ["code", "discountType", "discountValue", "active", "expiresAt"],
  faqs: ["question", "answer", "displayOrder", "active"],
  members: ["userId", "name", "phone", "tier"],
  menus: ["name", "code", "active"],
  orders: ["userId", "status", "shippingStatus", "total", "shipperId"],
  "payment-methods": ["name", "code", "active"],
  products: ["name", "sku", "brand", "origin", "price", "stockQuantity", "status", "description", "imageUrl"],
  promotions: ["name", "type", "active", "startsAt", "endsAt"],
  shippers: ["name", "phone", "active"],
  sizes: ["name", "code", "displayOrder"],
  "site-settings": ["siteName", "hotline", "email", "canonicalUrl"],
  suppliers: ["name", "phone", "email", "active"],
  users: ["username", "email", "password", "fullName", "phone", "address", "city", "district", "ward", "avatarUrl", "roles"],
  variants: ["productId", "sku", "sizeId", "colorId", "price", "stockQuantity"],
};

const editFieldHints: Record<string, string[]> = {
  ...createFieldHints,
  "contact-messages": ["status", "adminNote"],
  orders: ["paymentStatus", "shipperId", "shippingStatus", "status"],
  payments: ["status", "method", "paidAt"],
  products: ["name", "sku", "brand", "categoryId", "price", "stockQuantity", "status", "description", "imageUrl"],
  reviews: ["status", "adminReply"],
  users: ["username", "email", "fullName", "phone", "address", "city", "district", "ward", "avatarUrl", "roles"],
};

const paymentFlowOptions = ["UNPAID", "PENDING", "PAID", "FAILED", "CANCELLED"];
const returnPaymentOptions = ["REFUNDED"];

export default function AdminResourcePage() {
  const params = useParams<{ resource: string }>();
  const resource = findAdminResource(params.resource);

  if (!resource) {
    return (
      <AppShell>
        <PageHeader title="Không tìm thấy chức năng" description="API này chưa được khai báo trong admin." />
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
  const [isTrashMode, setIsTrashMode] = useState(false);
  const data = usePaginatedResource<AdminRow>({
    path: isTrashMode ? `${resource.path}/trash` : resource.path,
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
  const apiUrl = buildUrl(resource.path, data.query);
  const resourceLabel = getAdminResourceLabel(resource.slug, resource.label);
  const editorAtFinalStep = editor ? isEditorFinalStep(editor) : false;

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
            className="h-4 w-4 accent-emerald-700"
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
              className="h-4 w-4 accent-emerald-700"
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
            <div className="flex items-center justify-end gap-2">
              {isTrashMode && id !== null ? (
                <>
                  <Button size="sm" variant="outline" onClick={() => runRestore(id)}>
                    <RotateCcw className="h-4 w-4" />
                    Khôi phục
                  </Button>
                  {actions.hardDelete ? (
                    <Button size="sm" variant="destructive" onClick={() => runDelete(id, "hard")}>
                      <Trash2 className="h-4 w-4" />
                      Xóa cứng
                    </Button>
                  ) : null}
                </>
              ) : null}
              {!isTrashMode && actions.update && id !== null ? (
                <Button size="sm" variant="outline" onClick={() => openEdit(item, id)}>
                  <Edit3 className="h-4 w-4" />
                  Sửa
                </Button>
              ) : null}
              {!isTrashMode && (actions.copy || actions.softDelete || actions.hardDelete) && id !== null ? (
                <details className="group relative">
                  <summary className="inline-flex h-9 list-none items-center justify-center rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-stone-50">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Thao tác khác</span>
                  </summary>
                  <div className="details-dropdown dropdown-panel absolute right-0 z-20 mt-2 w-44 rounded-md border border-stone-200 bg-white p-1 shadow-lg">
                    {actions.copy ? (
                      <button
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-stone-50"
                        type="button"
                        onClick={() => runCopy(id)}
                      >
                        <Copy className="h-4 w-4" />
                        Sao chép
                      </button>
                    ) : null}
                    {actions.softDelete ? (
                      <button
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-stone-50"
                        type="button"
                        onClick={() => runDelete(id, "soft")}
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa mềm
                      </button>
                    ) : null}
                    {actions.hardDelete ? (
                      <button
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                        type="button"
                        onClick={() => runDelete(id, "hard")}
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa cứng
                      </button>
                    ) : null}
                  </div>
                </details>
              ) : null}
            </div>
          );
        },
        className: "min-w-36 text-right",
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.copy, actions.hardDelete, actions.softDelete, actions.update, allVisibleSelected, data.data.content, isTrashMode, resource.preferredColumns, selectedIds]);

  function openCreate() {
    const sampleKeys = data.data.content.flatMap((item) => Object.keys(item));
    const basicKeys = getCreateFields(resource.slug, resource.preferredColumns, sampleKeys);
    const fullKeys = getFullCreateFields(resource.slug, resource.preferredColumns, sampleKeys);
    const fieldKinds = getFieldKinds(fullKeys);

    setEditor({
      basicKeys,
      currentStep: 0,
      fieldKinds,
      fieldScope: "basic",
      fields: buildEditorFields(basicKeys, {}, {}, fieldKinds),
      fullKeys,
      initialValues: {},
      mode: "create",
      resourceSlug: resource.slug,
    });
    setActionError(null);
  }

  function openEdit(item: AdminRow, id: string | number) {
    const editable = stripReadOnlyFields(item);
    const basicKeys = getEditFields(resource.slug, editable);
    const fullKeys = getFullEditFields(editable);
    const initialValues = stringifyFieldValues(editable);
    const fieldKinds = getFieldKinds(fullKeys, editable);

    setEditor({
      basicKeys,
      currentStep: 0,
      fieldKinds,
      fieldScope: "basic",
      fields: buildEditorFields(basicKeys, {}, initialValues, fieldKinds),
      fullKeys,
      id,
      initialValues,
      mode: "edit",
      resourceSlug: resource.slug,
    });
    setActionError(null);
  }

  function switchEditorFieldScope(scope: EditorFieldScope) {
    setEditor((current) => {
      if (!current || current.fieldScope === scope) {
        return current;
      }

      const currentValues = Object.fromEntries(current.fields.map((field) => [field.key, field.value])) as Record<string, string>;
      const keys = scope === "basic" ? current.basicKeys : current.fullKeys;

      return {
        ...current,
        currentStep: 0,
        fieldScope: scope,
        fields: buildEditorFields(keys, currentValues, current.initialValues, current.fieldKinds),
      };
    });
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
        title: "Thành công",
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

    let body: Record<string, unknown>;
    try {
      validateEditor(editor);
      body = buildRequestBody(editor);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Dữ liệu không hợp lệ";
      setActionError(message);
      notify({
        message,
        title: "Dữ liệu không hợp lệ",
        type: "error",
      });
      return;
    }

    if (editor.resourceSlug === "orders" && editor.mode === "edit" && editor.id !== undefined) {
      await mutate({
        action: () => saveOrderStatusFlow(editor, body),
        errorMessage: "KhÃ´ng thá»ƒ cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng",
        successMessage: "ÄÃ£ cáº­p nháº­t flow tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng.",
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

  async function runRestore(id: string | number) {
    await mutate({
      action: () => apiFetch(`${resource.path}/${id}/restore`, undefined, { method: "POST" }),
      errorMessage: "Không thể khôi phục dữ liệu",
      successMessage: "Đã khôi phục bản ghi.",
    });
  }

  async function runBulkRestore() {
    const ids = selectedIds.filter((id) => typeof id === "number");

    if (ids.length === 0) {
      setActionError("Chức năng khôi phục hàng loạt cần ID dạng số.");
      notify({
        message: "Chức năng khôi phục hàng loạt cần ID dạng số.",
        title: "Không thể khôi phục hàng loạt",
        type: "error",
      });
      return;
    }

    await mutate({
      action: () => apiFetch(`${resource.path}/trash/restore/bulk`, undefined, { body: ids, method: "POST" }),
      errorMessage: "Không thể khôi phục hàng loạt",
      successMessage: "Đã khôi phục các bản ghi đã chọn.",
    });
  }

  return (
    <AppShell>
      <PageHeader
        title={resourceLabel}
        description={`${resourceLabel} - API: ${resource.path}`}
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {actions.create ? (
              <Button disabled={isTrashMode} onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Thêm mới
              </Button>
            ) : null}
            <Button
              variant={isTrashMode ? "secondary" : "outline"}
              onClick={() => {
                setSelectedIds([]);
                setIsTrashMode((current) => !current);
              }}
            >
              <Trash2 className="h-4 w-4" />
              {isTrashMode ? "Đang xem thùng rác" : "Thùng rác"}
            </Button>
            <Button variant="outline" onClick={data.refresh}>
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </Button>
            <details className="group relative">
              <summary className="inline-flex h-10 list-none items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-stone-50">
                <MoreHorizontal className="h-4 w-4" />
                Khác
              </summary>
              <div className="details-dropdown dropdown-panel absolute right-0 z-20 mt-2 w-48 rounded-md border border-stone-200 bg-white p-1 shadow-lg">
                {resource.slug === "products" ? (
                  <Link
                    href="/products"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-stone-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Xem cửa hàng
                  </Link>
                ) : null}
                <a
                  href={apiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-stone-50"
                >
                  <ExternalLink className="h-4 w-4" />
                  Mở API
                </a>
              </div>
            </details>
          </div>
        }
      />

      <DataToolbar
        search={data.search}
        sort={data.sort}
        onSearchChange={data.setSearch}
        onSortChange={data.setSort}
      />

      {selectedIds.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
          <span className="text-sm text-emerald-900">
            Đã chọn <span className="font-semibold">{selectedIds.length}</span> bản ghi
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {actions.bulkDelete ? (
              !isTrashMode ? (
              <Button disabled={isMutating} size="sm" variant="outline" onClick={() => runBulkDelete("soft")}>
                Xóa mềm
              </Button>
              ) : null
            ) : null}
            {isTrashMode ? (
              <Button disabled={isMutating} size="sm" variant="outline" onClick={runBulkRestore}>
                <RotateCcw className="h-4 w-4" />
                Khôi phục
              </Button>
            ) : null}
            {actions.bulkHardDelete ? (
              <Button disabled={isMutating} size="sm" variant="destructive" onClick={() => runBulkDelete("hard")}>
                Xóa cứng
              </Button>
            ) : null}
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      ) : null}

      {data.error || actionError ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError ?? data.error}
        </div>
      ) : null}

      {resource.slug === "orders" && !isTrashMode ? (
        <OrderStageBoard
          isLoading={data.isLoading}
          orders={data.data.content}
          onEdit={(item) => {
            const id = getId(item);
            if (id !== null) {
              openEdit(item, id);
            }
          }}
        />
      ) : (
        <DataTable
          columns={columns.length ? columns : emptyColumns}
          data={data.data.content}
          emptyText={isTrashMode ? "Thùng rác đang trống" : "Chưa có dữ liệu từ endpoint này"}
          getRowKey={(item, index) => getRowKey(item, index)}
          isLoading={data.isLoading}
        />
      )}

      <Pagination
        page={data.data.page}
        size={data.data.size}
        totalElements={data.data.totalElements}
        totalPages={data.data.totalPages}
        onPageChange={data.setPage}
        onSizeChange={data.setSize}
      />

      {editor ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-md border border-stone-200 bg-white shadow-xl">
            <div className="border-b border-stone-200 px-4 py-3">
              <h2 className="text-base font-semibold text-slate-950">
                {editor.mode === "create" ? "Thêm mới" : `Sửa bản ghi ${editor.id}`}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Điền thông tin theo bảng bên dưới. Các trường phức tạp vẫn có thể nhập bằng JSON.
              </p>
              <div className="mt-3 inline-flex rounded-md border border-stone-300 bg-stone-50 p-1">
                <button
                  className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                    editor.fieldScope === "basic" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                  }`}
                  type="button"
                  onClick={() => switchEditorFieldScope("basic")}
                >
                  Basic
                </button>
                <button
                  className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                    editor.fieldScope === "full" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
                  }`}
                  type="button"
                  onClick={() => switchEditorFieldScope("full")}
                >
                  Full
                </button>
              </div>
            </div>
            <div className="max-h-[calc(92vh-130px)] overflow-y-auto p-4">
              <EditorForm editor={editor} onChange={setEditor} />
              {actionError ? <p className="mt-3 text-sm text-red-600">{actionError}</p> : null}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 px-4 py-3">
              <EditorStepControls editor={editor} onChange={setEditor} />
              <div className="flex flex-wrap justify-end gap-2">
              <Button disabled={isMutating} variant="outline" onClick={() => setEditor(null)}>
                Hủy
              </Button>
              <Button disabled={isMutating || !editorAtFinalStep} onClick={saveEditor}>
                {isMutating ? "Đang lưu..." : "Lưu"}
              </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isMutating ? (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/20 p-4">
          <div className="rounded-md border border-stone-200 bg-white px-5 py-4 shadow-lg">
            <Loader label="Đang xử lý..." />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

type OrderStageKey = "payment" | "shipping" | "refund" | "complete" | "other";
type BadgeVariant = "default" | "secondary" | "success" | "warning" | "danger";

const orderStageDefinitions: Array<{
  key: OrderStageKey;
  title: string;
  description: string;
  icon: ReactNode;
}> = [
  {
    key: "payment",
    title: "Bảng thanh toán",
    description: "Đơn mới, đang chờ thanh toán hoặc thanh toán lỗi.",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    key: "shipping",
    title: "Bảng vận chuyển",
    description: "Chỉ chứa đơn đã thanh toán và đang cần giao hàng.",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    key: "refund",
    title: "Bảng hoàn/trả",
    description: "Đơn đã mở nhánh trả hàng hoặc hoàn tiền.",
    icon: <Undo2 className="h-4 w-4" />,
  },
  {
    key: "complete",
    title: "Bảng hoàn tất",
    description: "Đơn đã giao thành công và không có yêu cầu hoàn/trả.",
    icon: <PackageCheck className="h-4 w-4" />,
  },
  {
    key: "other",
    title: "Bảng khác / hủy",
    description: "Đơn hủy, thất bại hoặc dữ liệu chưa đủ để xếp bước.",
    icon: <MoreHorizontal className="h-4 w-4" />,
  },
];

function OrderStageBoard({
  isLoading,
  onEdit,
  orders,
}: {
  isLoading: boolean;
  onEdit: (item: AdminRow) => void;
  orders: AdminRow[];
}) {
  const grouped = orderStageDefinitions.reduce<Record<OrderStageKey, AdminRow[]>>(
    (accumulator, stage) => ({ ...accumulator, [stage.key]: [] }),
    { payment: [], shipping: [], refund: [], complete: [], other: [] },
  );

  orders.forEach((order) => {
    grouped[getOrderStage(order)].push(order);
  });

  if (isLoading) {
    return (
      <div className="rounded-md border border-stone-200 bg-white p-6">
        <Loader label="Đang tải đơn hàng..." />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-md border border-stone-200 bg-white p-6 text-center text-sm text-slate-500">
        Chưa có đơn hàng trong trang này.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orderStageDefinitions.map((stage) => (
        <OrderStageSection
          key={stage.key}
          description={stage.description}
          icon={stage.icon}
          orders={grouped[stage.key]}
          title={stage.title}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function OrderStageSection({
  description,
  icon,
  onEdit,
  orders,
  title,
}: {
  description: string;
  icon: ReactNode;
  onEdit: (item: AdminRow) => void;
  orders: AdminRow[];
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-md border border-stone-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md border border-stone-200 bg-white text-slate-700">
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-950">{title}</h2>
              <Badge variant="secondary">{orders.length}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>

      {orders.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-white text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Đơn</th>
                <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
                <th className="px-4 py-3 text-left font-semibold">Tổng tiền</th>
                <th className="px-4 py-3 text-left font-semibold">Thanh toán</th>
                <th className="px-4 py-3 text-left font-semibold">Vận chuyển</th>
                <th className="px-4 py-3 text-left font-semibold">Đơn hàng</th>
                <th className="px-4 py-3 text-left font-semibold">Cập nhật</th>
                <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order, index) => (
                <OrderStageRow key={getRowKey(order, index)} order={order} onEdit={onEdit} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-4 py-6 text-sm text-slate-500">Không có đơn ở bước này.</div>
      )}
    </section>
  );
}

function OrderStageRow({ onEdit, order }: { onEdit: (item: AdminRow) => void; order: AdminRow }) {
  const paymentStatus = orderText(order, ["paymentStatus"]) || "UNPAID";
  const shippingStatus = orderText(order, ["shippingStatus"]) || "PENDING";
  const status = orderText(order, ["status"]) || "NEW";
  const total = orderValue(order, ["total", "totalAmount", "grandTotal", "amount", "subtotal"]);
  const updatedAt = orderText(order, ["updatedAt", "createdAt"]);

  return (
    <tr className="align-top hover:bg-stone-50">
      <td className="px-4 py-3">
        <div className="font-medium text-slate-950">{orderCode(order)}</div>
        <div className="mt-1 text-xs text-slate-500">ID: {String(getId(order) ?? "-")}</div>
      </td>
      <td className="px-4 py-3 text-slate-700">{orderCustomer(order)}</td>
      <td className="px-4 py-3 font-medium text-slate-900">
        {total === undefined || total === null || total === "" ? "-" : formatMoney(String(total))}
      </td>
      <td className="px-4 py-3">
        <Badge variant={orderStatusVariant(paymentStatus)}>{paymentStatus}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={orderStatusVariant(shippingStatus)}>{shippingStatus}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={orderStatusVariant(status)}>{status}</Badge>
      </td>
      <td className="px-4 py-3 text-slate-600">{updatedAt ? formatDate(updatedAt) : "-"}</td>
      <td className="px-4 py-3 text-right">
        <Button size="sm" variant="outline" onClick={() => onEdit(order)}>
          <Edit3 className="h-4 w-4" />
          Xử lý
        </Button>
      </td>
    </tr>
  );
}

async function saveOrderStatusFlow(editor: EditorState, body: Record<string, unknown>) {
  const orderId = Number(editor.id);
  if (!Number.isFinite(orderId)) {
    throw new Error("ID Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡.");
  }

  const initial = editor.initialValues;
  const paymentStatus = stringValue(body.paymentStatus);
  const shipperId = stringValue(body.shipperId);
  const shippingStatus = stringValue(body.shippingStatus);
  const requestedOrderStatus = stringValue(body.status);
  const effectivePaymentStatus = paymentStatus || initial.paymentStatus;
  const effectiveShipperId = shipperId || initial.shipperId;
  const initialShippingStatus = initial.shippingStatus || "PENDING";
  const effectiveShippingStatus = shippingStatus || initialShippingStatus;
  const orderStatus = deriveOrderStatus({
    effectivePaymentStatus,
    effectiveShippingStatus,
    initialStatus: initial.status || "NEW",
    requestedOrderStatus,
  });

  validateOrderStatusFlow({
    effectivePaymentStatus,
    effectiveShipperId,
    initialShippingStatus,
    orderStatus,
    shippingStatus,
  });

  if (paymentStatus && paymentStatus !== initial.paymentStatus) {
    await apiFetch(`/api/orders/${orderId}/payment-status`, undefined, {
      body: { paymentStatus },
      method: "PUT",
    });
  }

  if (shipperId && shipperId !== initial.shipperId) {
    await apiFetch(`/api/orders/${orderId}/shipper`, undefined, {
      body: { shipperId },
      method: "PUT",
    });
  }

  if (shippingStatus && shippingStatus !== initial.shippingStatus) {
    await apiFetch(`/api/orders/${orderId}/shipping-status`, undefined, {
      body: { shippingStatus },
      method: "PUT",
    });
  }

  if (orderStatus && orderStatus !== initial.status) {
    await apiFetch(`/api/orders/${orderId}/status`, { status: orderStatus }, {
      method: "PUT",
    });
  }
}

function deriveOrderStatus({
  effectivePaymentStatus,
  effectiveShippingStatus,
  initialStatus,
  requestedOrderStatus,
}: {
  effectivePaymentStatus: string;
  effectiveShippingStatus: string;
  initialStatus: string;
  requestedOrderStatus: string;
}) {
  if (effectivePaymentStatus === "REFUNDED" || requestedOrderStatus === "RETURNED") {
    return "RETURNED";
  }

  if (effectivePaymentStatus === "FAILED" || effectiveShippingStatus === "FAILED") {
    return "FAILED";
  }

  if (effectivePaymentStatus === "CANCELLED" || effectiveShippingStatus === "CANCELLED") {
    return "CANCELLED";
  }

  if (effectiveShippingStatus === "DELIVERED") {
    return "COMPLETED";
  }

  if (effectiveShippingStatus === "SHIPPING") {
    return "SHIPPING";
  }

  if (effectivePaymentStatus === "PAID" && ["NEW", "PENDING", "UNPAID"].includes(initialStatus)) {
    return "PROCESSING";
  }

  return requestedOrderStatus || initialStatus;
}

function validateOrderStatusFlow({
  effectivePaymentStatus,
  effectiveShipperId,
  initialShippingStatus,
  orderStatus,
  shippingStatus,
}: {
  effectivePaymentStatus: string;
  effectiveShipperId: string;
  initialShippingStatus: string;
  orderStatus: string;
  shippingStatus: string;
}) {
  if (shippingStatus && shippingStatus !== initialShippingStatus) {
    if (effectivePaymentStatus !== "PAID" && effectivePaymentStatus !== "REFUNDED") {
      throw new Error("Phải hoàn tất bước thanh toán trước khi cập nhật vận chuyển.");
    }

    if (shippingStatus !== "PENDING" && !effectiveShipperId) {
      throw new Error("Phải nhập Shipper ID trước khi chuyển trạng thái vận chuyển.");
    }

    const allowed = nextShippingStatuses(initialShippingStatus);
    if (!allowed.includes(shippingStatus)) {
      throw new Error(`Trạng thái vận chuyển kế tiếp hợp lệ: ${allowed.map(humanize).join(", ")}.`);
    }
  }

  if (effectivePaymentStatus === "REFUNDED" || orderStatus === "RETURNED") {
    if (initialShippingStatus !== "DELIVERED" && shippingStatus !== "DELIVERED") {
      throw new Error("Chỉ mở bước trả hàng sau khi đơn đã giao xong.");
    }
  }
}

function EditorForm({
  editor,
  onChange,
}: {
  editor: EditorState;
  onChange: (updater: (current: EditorState | null) => EditorState | null) => void;
}) {
  const updateField = (key: string, value: string) =>
    onChange((current) =>
      current
        ? {
            ...current,
            fields: current.fields.map((item) =>
              item.key === key ? { ...item, value } : item,
            ),
          }
        : current,
    );

  if (editor.resourceSlug === "orders" && editor.mode === "edit" && editor.fieldScope === "basic") {
    return <OrderStatusFlowEditor editor={editor} onFieldChange={updateField} />;
  }

  const steps = chunk(editor.fields, fieldsPerStep);
  const currentFields = steps[editor.currentStep] ?? [];

  if (editor.fields.length === 0) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Chưa xác định được trường dữ liệu cho form này.
      </div>
    );
  }

  return (
    <div>
      {steps.length > 1 ? (
        <div className="mb-4 grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <button
              key={index}
              className={`rounded-md border px-3 py-2 text-left text-sm font-medium transition ${
                index === editor.currentStep
                  ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-white text-slate-600 hover:bg-stone-50"
              }`}
              type="button"
              onClick={() => onChange((current) => current ? { ...current, currentStep: index } : current)}
            >
              Bước {index + 1}
              <span className="ml-1 text-xs text-slate-500">({step.length})</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-md border border-stone-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="w-56 px-4 py-3 font-medium">Trường</th>
              <th className="px-4 py-3 font-medium">Giá trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {currentFields.map((field) => (
              <tr key={field.key}>
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-slate-900">{humanize(field.key)}</div>
                  <div className="mt-1 text-xs text-slate-500">{field.key}</div>
                </td>
                <td className="px-4 py-3">
                  <FieldControl
                    field={field}
                    resourceSlug={editor.resourceSlug}
                    onChange={(value) =>
                      onChange((current) =>
                        current
                          ? {
                              ...current,
                              fields: current.fields.map((item) =>
                                item.key === field.key ? { ...item, value } : item,
                              ),
                            }
                          : current,
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderStatusFlowEditor({
  editor,
  onFieldChange,
}: {
  editor: EditorState;
  onFieldChange: (key: string, value: string) => void;
}) {
  const paymentStatus = getEditorFieldValue(editor, "paymentStatus") || "UNPAID";
  const shippingStatus = getEditorFieldValue(editor, "shippingStatus") || "PENDING";
  const shipperId = getEditorFieldValue(editor, "shipperId");
  const orderStatus = getEditorFieldValue(editor, "status") || "NEW";
  const initialShippingStatus = editor.initialValues.shippingStatus || "PENDING";
  const initialReturnOpen = paymentStatus === "REFUNDED" || orderStatus === "RETURNED";
  const [returnOpen, setReturnOpen] = useState(initialReturnOpen);
  const paymentDone = paymentStatus === "PAID";
  const shippingDone = shippingStatus === "DELIVERED";
  const canEditShipping = paymentDone;
  const showReturnStep = returnOpen || paymentStatus === "REFUNDED" || orderStatus === "RETURNED";
  const shippingOptions = nextShippingStatuses(initialShippingStatus);
  const requiresShipper = shippingStatus !== "PENDING";

  function openReturnStep() {
    setReturnOpen(true);
    onFieldChange("paymentStatus", "REFUNDED");
    onFieldChange("status", "RETURNED");
  }

  return (
    <div className="grid gap-3">
      <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
        <div className="flex flex-wrap gap-2">
          <StatusBadgeLike label="Đơn" value={orderStatus} />
          <StatusBadgeLike label="Thanh toán" value={paymentStatus} />
          <StatusBadgeLike label="Vận chuyển" value={shippingStatus} />
          {shipperId ? <StatusBadgeLike label="Shipper" value={shipperId} /> : null}
        </div>
      </div>

      <OrderFlowStep
        icon={<CreditCard className="h-4 w-4" />}
        index={1}
        title="Thanh toán"
        state={paymentDone || paymentStatus === "REFUNDED" ? "done" : "active"}
        summary={paymentDone ? "Đã thanh toán, có thể xử lý vận chuyển." : "Chọn kết quả thanh toán trước khi chuyển bước giao hàng."}
      >
        <label className="block text-sm font-medium text-slate-700">
          Trạng thái thanh toán
          <Select className="mt-2" value={paymentStatus} onChange={(event) => onFieldChange("paymentStatus", event.target.value)}>
            {options(paymentStatus === "REFUNDED" ? returnPaymentOptions : paymentFlowOptions).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </OrderFlowStep>

      <OrderFlowStep
        icon={<Truck className="h-4 w-4" />}
        index={2}
        title="Vận chuyển"
        state={!canEditShipping ? "locked" : shippingDone ? "done" : "active"}
        summary={!canEditShipping ? "Bước này chỉ mở sau khi thanh toán là PAID." : shippingDone ? "Đơn đã giao xong." : `Trạng thái kế tiếp hợp lệ: ${shippingOptions.map(humanize).join(", ")}.`}
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
          <label className="block text-sm font-medium text-slate-700">
            Shipper ID
            <Input
              className="mt-2"
              disabled={!canEditShipping}
              value={shipperId}
              onChange={(event) => onFieldChange("shipperId", event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Trạng thái vận chuyển
            <Select
              className="mt-2"
              disabled={!canEditShipping || shippingOptions.length === 1 && shippingOptions[0] === shippingStatus}
              value={shippingStatus}
              onChange={(event) => onFieldChange("shippingStatus", event.target.value)}
            >
              {options(shippingOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>
        {requiresShipper && !shipperId ? (
          <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Nhập Shipper ID trước khi lưu bước vận chuyển.
          </p>
        ) : null}
      </OrderFlowStep>

      {showReturnStep ? (
        <OrderFlowStep
          icon={<Undo2 className="h-4 w-4" />}
          index={3}
          title="Trả hàng"
          state={paymentStatus === "REFUNDED" || orderStatus === "RETURNED" ? "active" : "locked"}
          summary="Nhánh này chỉ dùng khi đơn đã giao xong và phát sinh hoàn/trả."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Thanh toán</p>
              <p className="mt-1 font-medium text-slate-950">REFUNDED</p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Đơn hàng</p>
              <p className="mt-1 font-medium text-slate-950">RETURNED</p>
            </div>
          </div>
        </OrderFlowStep>
      ) : (
        <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-white text-slate-500">
                <PackageCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium text-slate-900">Bước 3: Trả hàng</div>
                <p className="mt-1 text-sm text-slate-500">Ẩn mặc định. Chỉ mở khi đơn có yêu cầu trả hàng hoặc hoàn tiền.</p>
              </div>
            </div>
            <Button disabled={!shippingDone} size="sm" variant="outline" onClick={openReturnStep}>
              Mở trả hàng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderFlowStep({
  children,
  icon,
  index,
  state,
  summary,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  index: number;
  state: "active" | "done" | "locked";
  summary: string;
  title: string;
}) {
  const badgeVariant = state === "done" ? "success" : state === "locked" ? "secondary" : "default";

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-stone-100 text-slate-700">{icon}</div>
          <div>
            <h3 className="font-semibold text-slate-950">Bước {index}: {title}</h3>
            <p className="mt-1 text-sm text-slate-500">{summary}</p>
          </div>
        </div>
        <Badge variant={badgeVariant}>{state === "done" ? "Done" : state === "locked" ? "Locked" : "Active"}</Badge>
      </div>
      {children}
    </section>
  );
}

function StatusBadgeLike({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white px-3 py-2">
      <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
      <span className="ml-2 text-sm font-medium text-slate-950">{value || "-"}</span>
    </div>
  );
}

function FieldControl({
  field,
  resourceSlug,
  onChange,
}: {
  field: EditorField;
  resourceSlug: string;
  onChange: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const enumOptions = getEnumOptions(field.key, resourceSlug);
  const categoryResource = useApiResource<PageResult<Category>>({
    enabled: isCategoryReferenceField(field.key),
    path: "/api/categories",
    query: { page: 0, size: 100, sort: "displayOrder,asc" },
  });

  useEffect(() => {
    if (!isMediaField(field.key)) {
      return;
    }

    let cancelled = false;
    queueMicrotask(() => {
      setIsLoadingMedia(true);
      mediaApi.list({ page: 0, size: 80, sort: "id,desc" })
        .then((result) => {
          if (!cancelled) {
            setMediaAssets(result.content);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoadingMedia(false);
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [field.key]);

  async function uploadMedia(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const folder = mediaFolderForField(field.key);
      const media = await mediaApi.upload(file, folder);
      onChange(media.url);
    } finally {
      setIsUploading(false);
    }
  }

  if (field.kind === "boolean") {
    return (
      <Select value={field.value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Chưa chọn</option>
        <option value="true">Có</option>
        <option value="false">Không</option>
      </Select>
    );
  }

  if (enumOptions.length > 0 && field.kind === "array") {
    const selectedValues = parseEnumArrayValue(field.value);

    return (
      <div className="flex flex-wrap gap-2">
        {enumOptions.map((option) => {
          const checked = selectedValues.includes(option.value);

          return (
            <label
              key={option.value}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                checked
                  ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                  : "border-stone-300 bg-white text-slate-700 hover:bg-stone-50"
              }`}
            >
              <input
                checked={checked}
                className="h-4 w-4 accent-emerald-700"
                type="checkbox"
                onChange={(event) => {
                  const nextValues = event.target.checked
                    ? unique([...selectedValues, option.value])
                    : selectedValues.filter((value) => value !== option.value);
                  onChange(JSON.stringify(nextValues));
                }}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    );
  }

  if (enumOptions.length > 0) {
    return (
      <Select value={field.value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Chua chon</option>
        {enumOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (isCategoryReferenceField(field.key)) {
    const categories = categoryResource.data?.content ?? [];

    return (
      <Select value={field.value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{categoryResource.isLoading ? "Dang tai danh muc..." : "Chon danh muc"}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    );
  }

  if (field.kind === "array" || field.kind === "json") {
    return (
      <textarea
        className="min-h-24 w-full resize-y rounded-md border border-stone-300 bg-stone-50 p-3 font-mono text-sm leading-6 text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        placeholder={field.kind === "array" ? "[]" : "{}"}
        spellCheck={false}
        value={field.value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (false && enumOptions.length > 0) {
    return (
      <Select value={field.value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Chưa chọn</option>
        {enumOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  const input = (
    <Input
      type={field.kind === "number" ? "number" : field.kind === "date" ? "datetime-local" : "text"}
      value={field.value}
      onChange={(event) => onChange(event.target.value)}
    />
  );

  if (!isMediaField(field.key)) {
    return input;
  }

  return (
    <div className="grid gap-2">
      {input}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          className="h-9 w-60"
          value=""
          disabled={isLoadingMedia}
          onChange={(event) => {
            if (event.target.value) {
              onChange(event.target.value);
            }
          }}
        >
          <option value="">{isLoadingMedia ? "Đang tải media..." : "Chọn media đã upload"}</option>
          {mediaAssets.map((item) => (
            <option key={item.id} value={item.url}>
              {item.folder || "general"} / {item.name || item.originalFilename || item.url}
            </option>
          ))}
        </Select>
        <label className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-stone-50">
          {isUploading ? "Đang upload..." : "Upload ảnh/video"}
          <input
            className="sr-only"
            type="file"
            accept="image/*,video/*"
            disabled={isUploading}
            onChange={(event) => uploadMedia(event.target.files?.[0])}
          />
        </label>
        <span className="text-xs text-slate-500">Hoặc dán link media đã upload ở nơi khác.</span>
      </div>
      {field.value ? (
        isVideoUrl(field.value) ? (
          <video className="mt-1 max-h-40 rounded-md border border-stone-200 bg-black" src={field.value} controls />
        ) : (
          <SafeImage alt="Media preview" className="mt-1 h-40 max-w-xs rounded-md border border-stone-200" imgClassName="object-contain" sizes="320px" src={field.value} />
        )
      ) : null}
    </div>
  );
}

function EditorStepControls({
  editor,
  onChange,
}: {
  editor: EditorState;
  onChange: (updater: (current: EditorState | null) => EditorState | null) => void;
}) {
  const totalSteps = Math.max(1, Math.ceil(editor.fields.length / fieldsPerStep));

  if (totalSteps === 1) {
    return <div className="text-sm text-slate-500">{editor.fields.length} trường</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={editor.currentStep === 0}
        size="sm"
        variant="outline"
        onClick={() => onChange((current) =>
          current ? { ...current, currentStep: Math.max(0, current.currentStep - 1) } : current,
        )}
      >
        Trước
      </Button>
      <span className="text-sm text-slate-600">
        Bước {editor.currentStep + 1}/{totalSteps}
      </span>
      <Button
        disabled={editor.currentStep + 1 >= totalSteps}
        size="sm"
        variant="outline"
        onClick={() => onChange((current) =>
          current ? { ...current, currentStep: Math.min(totalSteps - 1, current.currentStep + 1) } : current,
        )}
      >
        Sau
      </Button>
    </div>
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

function parseEnumArrayValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function chunk<T>(values: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function getCreateFields(slug: string, preferredColumns: string[] | undefined, sampleKeys: string[]) {
  const hintedFields = createFieldHints[slug];
  const fields = unique(hintedFields ?? preferredColumns ?? sampleKeys).filter((key) => !readonlyFields.has(key));

  return fields.length ? fields : ["name", "code", "active"];
}

function getFullCreateFields(slug: string, preferredColumns: string[] | undefined, sampleKeys: string[]) {
  return unique([
    ...(createFieldHints[slug] ?? []),
    ...(preferredColumns ?? []),
    ...sampleKeys,
  ]).filter((key) => !readonlyFields.has(key));
}

function getEditFields(slug: string, editable: AdminRow) {
  const keys = Object.keys(editable);
  const hintedFields = editFieldHints[slug] ?? createFieldHints[slug];

  if (!hintedFields) {
    return keys.filter((key) => !readonlyFields.has(key)).slice(0, fieldsPerStep);
  }

  return hintedFields.filter((key) => key in editable && !readonlyFields.has(key));
}

function getFullEditFields(editable: AdminRow) {
  return Object.keys(editable).filter((key) => !readonlyFields.has(key));
}

function getFieldKinds(keys: string[], values?: AdminRow) {
  return keys.reduce<Record<string, FieldKind>>((result, key) => {
    result[key] = inferFieldKind(key, values?.[key]);
    return result;
  }, {});
}

function stringifyFieldValues(values: AdminRow) {
  return Object.entries(values).reduce<Record<string, string>>((result, [key, value]) => {
    result[key] = stringifyFieldValue(value);
    return result;
  }, {});
}

function buildEditorFields(
  keys: string[],
  currentValues: Record<string, string>,
  initialValues: Record<string, string>,
  fieldKinds: Record<string, FieldKind>,
) {
  return keys.map((key) => ({
    key,
    kind: fieldKinds[key] ?? inferFieldKind(key),
    value: currentValues[key] ?? initialValues[key] ?? "",
  }));
}

function buildRequestBody(editor: EditorState) {
  return editor.fields.reduce<Record<string, unknown>>((body, field) => {
    if (editor.mode === "create" && field.value.trim() === "") {
      return body;
    }

    body[field.key] = parseFieldValue(field, editor.resourceSlug);
    return body;
  }, {});
}

function getEditorFieldValue(editor: EditorState, key: string) {
  return editor.fields.find((field) => field.key === key)?.value ?? "";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nextShippingStatuses(currentStatus: string) {
  const current = currentStatus || "PENDING";

  switch (current) {
    case "PENDING":
      return ["PENDING", "ASSIGNED", "CANCELLED"];
    case "ASSIGNED":
      return ["ASSIGNED", "SHIPPING", "FAILED", "CANCELLED"];
    case "SHIPPING":
      return ["SHIPPING", "DELIVERED", "FAILED", "CANCELLED"];
    case "DELIVERED":
    case "FAILED":
    case "CANCELLED":
      return [current];
    default:
      return ["PENDING"];
  }
}

function validateEditor(editor: EditorState) {
  const firstError = editor.fields
    .map((field) => validateField(field, editor.resourceSlug))
    .find((error): error is string => Boolean(error));

  if (firstError) {
    throw new Error(firstError);
  }
}

function validateField(field: EditorField, resourceSlug: string) {
  const value = field.value.trim();
  if (isRequiredField(field) && value === "") {
    return `${humanize(field.key)} là trường bắt buộc.`;
  }

  if (value === "") {
    return null;
  }

  if (field.kind === "number" && Number.isNaN(Number(value))) {
    return `${humanize(field.key)} phải là số.`;
  }

  if (field.kind === "array" && getEnumOptions(field.key, resourceSlug).length > 0) {
    return null;
  }

  if (field.kind === "array" || field.kind === "json") {
    try {
      JSON.parse(value);
    } catch {
      return `${humanize(field.key)} phải là JSON hợp lệ.`;
    }
  }

  if (/email/i.test(field.key) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `${humanize(field.key)} chưa đúng định dạng email.`;
  }

  if (/(url|imageUrl|logoUrl)$/i.test(field.key) && !/^https?:\/\/|^\//i.test(value)) {
    return `${humanize(field.key)} phải là URL hợp lệ.`;
  }

  return null;
}

function isRequiredField(field: EditorField) {
  return /^(name|title|code|username|email|password|productId|price|sku|siteName)$/i.test(field.key);
}

function isEditorFinalStep(editor: EditorState) {
  const totalSteps = Math.max(1, Math.ceil(editor.fields.length / fieldsPerStep));
  return editor.currentStep + 1 >= totalSteps;
}

function parseFieldValue(field: EditorField, resourceSlug: string) {
  const value = field.value.trim();

  if (value === "") {
    return "";
  }

  if (field.kind === "boolean") {
    return value === "true";
  }

  if (field.kind === "number") {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      throw new Error(`${humanize(field.key)} phải là số.`);
    }
    return numberValue;
  }

  if (field.kind === "array" && getEnumOptions(field.key, resourceSlug).length > 0) {
    return parseEnumArrayValue(value);
  }

  if (field.kind === "array" || field.kind === "json") {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${humanize(field.key)} phải là JSON hợp lệ.`);
    }
  }

  return field.value;
}

function inferFieldKind(key: string, value?: unknown): FieldKind {
  if (Array.isArray(value)) {
    return "array";
  }

  if (typeof value === "boolean" || /^(active|enabled|primary|default|deleted)$/i.test(key)) {
    return "boolean";
  }

  if (typeof value === "number" || /(id|price|total|amount|fee|cost|value|quantity|stock|order|count)$/i.test(key)) {
    return "number";
  }

  if (typeof value === "object" && value !== null) {
    return "json";
  }

  if (isDateKey(key)) {
    return "date";
  }

  return "text";
}

function stringifyFieldValue(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 16);
  }

  return String(value);
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

function getOrderStage(order: AdminRow): OrderStageKey {
  const paymentStatus = orderText(order, ["paymentStatus"]).toUpperCase();
  const shippingStatus = orderText(order, ["shippingStatus"]).toUpperCase();
  const status = orderText(order, ["status"]).toUpperCase();

  if (paymentStatus === "REFUNDED" || status === "RETURNED") {
    return "refund";
  }

  if (status === "COMPLETED" || shippingStatus === "DELIVERED") {
    return "complete";
  }

  if (["CANCELLED", "FAILED"].includes(status) || ["CANCELLED", "FAILED"].includes(paymentStatus)) {
    return "other";
  }

  if (paymentStatus === "PAID") {
    return "shipping";
  }

  if (!paymentStatus || ["UNPAID", "PENDING", "NEW"].includes(paymentStatus)) {
    return "payment";
  }

  return "other";
}

function orderCode(order: AdminRow) {
  const code = orderText(order, ["code", "orderCode", "orderNo", "trackingCode"]);
  return code || `#${String(getId(order) ?? "-")}`;
}

function orderCustomer(order: AdminRow) {
  const direct = orderText(order, ["customerName", "fullName", "username", "email", "phone"]);
  if (direct) {
    return direct;
  }

  const user = order.user ?? order.customer;
  if (user && typeof user === "object") {
    const record = user as AdminRow;
    return orderText(record, ["fullName", "name", "username", "email", "phone"]) || compact(record);
  }

  return "-";
}

function orderText(order: AdminRow, keys: string[]) {
  const value = orderValue(order, keys);
  if (value === undefined || value === null) {
    return "";
  }

  return typeof value === "string" ? value.trim() : String(value);
}

function orderValue(order: AdminRow, keys: string[]) {
  for (const key of keys) {
    if (order[key] !== undefined && order[key] !== null && order[key] !== "") {
      return order[key];
    }
  }

  return undefined;
}

function orderStatusVariant(value: string): BadgeVariant {
  const normalized = value.toUpperCase();

  if (["PAID", "DELIVERED", "COMPLETED"].includes(normalized)) {
    return "success";
  }

  if (["PENDING", "UNPAID", "NEW", "PROCESSING", "ASSIGNED", "SHIPPING"].includes(normalized)) {
    return "warning";
  }

  if (["FAILED", "CANCELLED", "RETURNED", "REFUNDED"].includes(normalized)) {
    return "danger";
  }

  return "secondary";
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
      <a className="text-emerald-700 underline underline-offset-2" href={text} target="_blank" rel="noreferrer">
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

function isCategoryReferenceField(key: string) {
  return /^(categoryId|parentId)$/i.test(key);
}

function getEnumOptions(key: string, resourceSlug?: string) {
  const normalized = key.toLowerCase();

  if (normalized === "paymentstatus") {
    return options(["UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"]);
  }

  if (normalized === "fulfillmentstatus") {
    return options(["UNFULFILLED", "PROCESSING", "FULFILLED", "SHIPPING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]);
  }

  if (normalized === "shippingstatus") {
    return options(["PENDING", "ASSIGNED", "SHIPPING", "DELIVERED", "FAILED", "CANCELLED"]);
  }

  if (normalized === "status") {
    return getStatusOptionsForResource(resourceSlug);
  }

  if (normalized.endsWith("status")) {
    return options(["ACTIVE", "INACTIVE"]);
  }

  if (normalized === "mediatype") {
    return options(["IMAGE", "VIDEO", "OTHER"]);
  }

  if (normalized === "discounttype") {
    return options(["PERCENT", "FIXED"]);
  }

  if (normalized === "relationtype") {
    return options(["RELATED", "UPSELL", "CROSS_SELL"]);
  }

  if (normalized === "referencetype") {
    return options(["ORDER", "RETURN", "PURCHASE_RECEIPT", "MANUAL"]);
  }

  if (normalized === "method") {
    return options(["COD", "BANK_TRANSFER", "MOMO", "VNPAY", "ZALOPAY", "CASH", "CARD"]);
  }

  if (normalized === "type" || normalized.endsWith("type")) {
    return options(["PERCENT", "FIXED", "PUBLIC", "PRIVATE", "NORMAL", "FEATURED", "SALE", "RELATED", "UPSELL", "CROSS_SELL", "RETURN", "SHIPPING", "PAYMENT", "ORDER"]);
  }

  if (normalized === "gender") {
    return options(["UNISEX", "WOMEN", "MEN", "KIDS"]);
  }

  if (normalized === "season") {
    return options(["SPRING", "SUMMER", "AUTUMN", "WINTER", "ALL_SEASON"]);
  }

  if (normalized === "placement") {
    return options(["HOME_HERO", "HOME_TOP", "HOME_MIDDLE", "HOME_BOTTOM", "PRODUCT_LIST", "PRODUCT_DETAIL"]);
  }

  if (normalized === "tier") {
    return options(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]);
  }

  if (normalized === "role" || normalized === "roles") {
    return options(["ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_STAFF", "ROLE_SHIPPER"]);
  }

  if (normalized === "origin") {
    return options(["Korea", "Vietnam", "China", "Japan", "Thailand"]);
  }

  return [];
}

function getStatusOptionsForResource(resourceSlug?: string) {
  switch (resourceSlug) {
    case "products":
      return options(["DRAFT", "ACTIVE", "INACTIVE", "PUBLISHED"]);
    case "orders":
      return options(["NEW", "PENDING", "PROCESSING", "SHIPPING", "COMPLETED", "CANCELLED", "FAILED", "RETURNED"]);
    case "payments":
    case "payment-transactions":
      return options(["UNPAID", "PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"]);
    case "shipments":
    case "shipment-events":
      return options(["PENDING", "ASSIGNED", "SHIPPING", "DELIVERED", "FAILED", "CANCELLED"]);
    case "contact-messages":
      return options(["NEW", "IN_PROGRESS", "RESOLVED", "SPAM"]);
    case "blog-posts":
    case "pages":
      return options(["DRAFT", "ACTIVE", "INACTIVE", "PUBLISHED", "ARCHIVED"]);
    case "reviews":
      return options(["PENDING", "APPROVED", "REJECTED", "SPAM"]);
    case "carts":
      return options(["ACTIVE", "COMPLETED", "CANCELLED"]);
    case "purchase-receipts":
    case "return-requests":
    case "exchange-orders":
    case "refunds":
      return options(["PENDING", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED", "CANCELLED"]);
    default:
      return options(["ACTIVE", "INACTIVE", "DRAFT", "PUBLISHED", "ARCHIVED"]);
  }
}

function options(values: string[]) {
  return values.map((value) => ({ label: humanize(value), value }));
}

function isMediaField(key: string) {
  return /(image|video|media|logo|thumbnail|avatar).*url$/i.test(key) || /(imageUrl|videoUrl|logoUrl|thumbnailUrl|avatarUrl)$/i.test(key);
}

function mediaFolderForField(key: string) {
  if (/video/i.test(key)) {
    return "videos";
  }
  if (/logo/i.test(key)) {
    return "logos";
  }
  if (/banner/i.test(key)) {
    return "banners";
  }
  if (/avatar/i.test(key)) {
    return "avatars";
  }
  return "images";
}

function isVideoUrl(value: string) {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(value);
}
