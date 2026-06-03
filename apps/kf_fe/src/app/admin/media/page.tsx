"use client";

import {
  Edit3,
  ExternalLink,
  Folder,
  FolderPlus,
  Link as LinkIcon,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SafeImage } from "@/components/SafeImage";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mediaApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { MediaAsset, PageResult } from "@/types/api";

const emptyPage: PageResult<MediaAsset> = {
  content: [],
  page: 0,
  size: 24,
  totalElements: 0,
  totalPages: 0,
};

type ModalName = "folder" | "upload" | "link" | "edit" | null;

export default function AdminMediaPage() {
  const [activeFolder, setActiveFolder] = useState("");
  const [folders, setFolders] = useState<string[]>([]);
  const [page, setPage] = useState(emptyPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [trashMode, setTrashMode] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [newFolder, setNewFolder] = useState("");
  const [uploadFolder, setUploadFolder] = useState("products");
  const [uploadNewFolder, setUploadNewFolder] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [linkForm, setLinkForm] = useState({ folder: "external", name: "", url: "" });
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({ folder: "", name: "", url: "" });
  const { notify } = useToast();

  const query = useMemo(
    () => ({
      folder: !trashMode && activeFolder ? activeFolder : undefined,
      page: 0,
      search: search.trim() || undefined,
      size: 24,
      sort: "id,desc",
    }),
    [activeFolder, search, trashMode],
  );

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const [mediaResult, folderResult] = await Promise.all([
        trashMode ? mediaApi.trash(query) : mediaApi.list(query),
        mediaApi.folders(),
      ]);
      setPage(mediaResult);
      setFolders(folderResult);
      if (!uploadFolder && folderResult[0]) {
        setUploadFolder(folderResult[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thư viện media.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const selectedFilePreviews = useMemo(
    () => selectedFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [selectedFiles],
  );

  useEffect(
    () => () => {
      selectedFilePreviews.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [selectedFilePreviews],
  );

  async function createFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newFolder.trim()) {
      return;
    }

    try {
      const folder = await mediaApi.createFolder(newFolder);
      setNewFolder("");
      setActiveFolder(folder);
      setUploadFolder(folder);
      setModal(null);
      notify({ title: "Đã tạo thư mục", message: `Thư mục ${folder} đã sẵn sàng để upload.`, type: "success" });
      await load();
    } catch (err) {
      notify({ title: "Không thể tạo thư mục", message: err instanceof Error ? err.message : "Tên thư mục chưa hợp lệ.", type: "error" });
    }
  }

  async function uploadFiles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFiles.length) {
      notify({ title: "Chưa chọn file", message: "Chọn ít nhất một file để upload.", type: "error" });
      return;
    }

    const folder = uploadNewFolder.trim() || uploadFolder || "general";
    setIsLoading(true);
    try {
      await Promise.all(selectedFiles.map((file) => mediaApi.upload(file, folder, file.name)));
      setSelectedFiles([]);
      setUploadNewFolder("");
      setUploadFolder(folder);
      setActiveFolder(folder);
      setModal(null);
      notify({ title: "Đã upload", message: `${selectedFiles.length} file đã được lưu vào thư mục ${folder}.`, type: "success" });
      await load();
    } catch (err) {
      notify({ title: "Upload thất bại", message: err instanceof Error ? err.message : "Không thể upload media.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await mediaApi.createLink(linkForm);
      setLinkForm((current) => ({ ...current, name: "", url: "" }));
      setActiveFolder(linkForm.folder);
      setModal(null);
      notify({ title: "Đã thêm link", message: "Link media ngoài đã được lưu.", type: "success" });
      await load();
    } catch (err) {
      notify({ title: "Không thể thêm link", message: err instanceof Error ? err.message : "Dữ liệu chưa hợp lệ.", type: "error" });
    }
  }

  function openEdit(item: MediaAsset) {
    setEditing(item);
    setEditForm({
      folder: item.folder || "general",
      name: item.name || item.originalFilename || "",
      url: item.url,
    });
    setModal("edit");
  }

  async function updateMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }

    try {
      await mediaApi.update(editing.id, editForm);
      setEditing(null);
      setModal(null);
      notify({ title: "Đã cập nhật", message: "Media đã được đổi tên/thư mục.", type: "success" });
      await load();
    } catch (err) {
      notify({ title: "Không thể cập nhật", message: err instanceof Error ? err.message : "Dữ liệu chưa hợp lệ.", type: "error" });
    }
  }

  async function softDelete(item: MediaAsset) {
    if (!window.confirm(`Chuyển "${displayName(item)}" vào thùng rác?`)) {
      return;
    }
    await mediaApi.delete(item.id);
    notify({ title: "Đã chuyển vào thùng rác", message: "Bạn có thể khôi phục hoặc xóa cứng sau.", type: "success" });
    await load();
  }

  async function hardDelete(item: MediaAsset) {
    if (!window.confirm(`Xóa cứng "${displayName(item)}"? File vật lý cũng sẽ bị xóa và không thể khôi phục.`)) {
      return;
    }
    await mediaApi.hardDelete(item.id);
    notify({ title: "Đã xóa cứng", message: "Media đã bị xóa khỏi hệ thống.", type: "success" });
    await load();
  }

  async function restore(item: MediaAsset) {
    await mediaApi.restore(item.id);
    notify({ title: "Đã khôi phục", message: "Media đã quay lại thư viện.", type: "success" });
    await load();
  }

  return (
    <AppShell>
      <PageHeader
        title="Quản lý media"
        description="Tạo thư mục, upload file, đổi thư mục và quản lý thùng rác cho ảnh/video."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant={trashMode ? "default" : "outline"} onClick={() => setTrashMode((value) => !value)}>
              <Trash2 className="h-4 w-4" />
              Thùng rác
            </Button>
            <Button variant="outline" onClick={load}>
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </Button>
          </div>
        }
      />

      <section className="rounded-md border border-stone-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Select className="w-56" value={activeFolder} disabled={trashMode} onChange={(event) => setActiveFolder(event.target.value)}>
              <option value="">Tất cả thư mục</option>
              {folders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <div className="relative min-w-56 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input className="pl-9" value={search} placeholder="Tìm theo tên hoặc thư mục" onChange={(event) => setSearch(event.target.value)} />
            </div>
            <span className="text-sm text-stone-500">{page.totalElements} media</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setModal("folder")}>
              <FolderPlus className="h-4 w-4" />
              Tạo thư mục
            </Button>
            <Button onClick={() => setModal("upload")}>
              <Upload className="h-4 w-4" />
              Upload file
            </Button>
            <Button variant="outline" onClick={() => setModal("link")}>
              <LinkIcon className="h-4 w-4" />
              Thêm link
            </Button>
          </div>
        </div>

        {error ? <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <FolderStrip folders={folders} activeFolder={activeFolder} disabled={trashMode} onSelect={setActiveFolder} />

        {isLoading && page.content.length === 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-md bg-stone-100" />
            ))}
          </div>
        ) : page.content.length ? (
          <div className="relative mt-4">
            {isLoading ? (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-emerald-50">
                <div className="h-full w-1/3 animate-loading-bar bg-emerald-600" />
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {page.content.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  trashMode={trashMode}
                  onEdit={() => openEdit(item)}
                  onHardDelete={() => hardDelete(item)}
                  onRestore={() => restore(item)}
                  onSoftDelete={() => softDelete(item)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid min-h-80 place-items-center rounded-md border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-600">
            {trashMode ? "Thùng rác đang trống." : "Chưa có media trong thư mục này."}
          </div>
        )}
      </section>

      <Modal open={modal === "folder"} title="Tạo thư mục mới" onClose={() => setModal(null)}>
        <form onSubmit={createFolder}>
          <label className="block text-sm font-medium text-stone-700">
            Tên thư mục
            <Input className="mt-1" value={newFolder} placeholder="products/summer-2026" onChange={(event) => setNewFolder(event.target.value)} />
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModal(null)}>
              Hủy
            </Button>
            <Button type="submit">Tạo thư mục</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === "upload"} title="Upload file vào thư mục" onClose={() => setModal(null)}>
        <form onSubmit={uploadFiles}>
          <label className="block text-sm font-medium text-stone-700">
            Chọn thư mục có sẵn
            <Select className="mt-1" value={uploadFolder} onChange={(event) => setUploadFolder(event.target.value)}>
              <option value="general">general</option>
              {folders.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </label>
          <label className="mt-3 block text-sm font-medium text-stone-700">
            Hoặc tạo thư mục mới khi upload
            <Input className="mt-1" value={uploadNewFolder} placeholder="lookbook/drop-1" onChange={(event) => setUploadNewFolder(event.target.value)} />
          </label>
          <label className="mt-3 block cursor-pointer rounded-md border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600 hover:bg-stone-100">
            {selectedFilePreviews.length ? (
              <div className="grid max-h-80 gap-3 overflow-y-auto sm:grid-cols-2">
                {selectedFilePreviews.map(({ file, url }) => (
                  <div key={`${file.name}-${file.size}-${file.lastModified}`} className="overflow-hidden rounded-md border border-stone-200 bg-white">
                    <div className="grid aspect-video place-items-center bg-stone-100">
                      {file.type.startsWith("video/") ? (
                        <video className="h-full w-full object-cover" src={url} muted controls />
                      ) : file.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="h-full w-full object-cover" src={url} alt={file.name} />
                      ) : (
                        <Upload className="h-6 w-6 text-stone-400" />
                      )}
                    </div>
                    <div className="p-2">
                      <div className="truncate text-xs font-medium text-stone-800">{file.name}</div>
                      <div className="mt-1 text-xs text-stone-500">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-32 flex-col items-center justify-center text-center">
                <Upload className="mb-2 h-5 w-5" />
            Chọn hoặc kéo thả file
              </div>
            )}
            <input
              className="sr-only"
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
            />
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModal(null)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              Upload
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === "link"} title="Thêm link media ngoài" onClose={() => setModal(null)}>
        <form onSubmit={createLink}>
          <MediaFields
            folders={folders}
            folder={linkForm.folder}
            name={linkForm.name}
            url={linkForm.url}
            onChange={(field, value) => setLinkForm((current) => ({ ...current, [field]: value }))}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModal(null)}>
              Hủy
            </Button>
            <Button type="submit">Lưu link</Button>
          </div>
        </form>
      </Modal>

      <Modal open={modal === "edit"} title="Đổi tên hoặc thư mục" onClose={() => setModal(null)}>
        <form onSubmit={updateMedia}>
          <MediaFields
            folders={folders}
            folder={editForm.folder}
            name={editForm.name}
            url={editForm.url}
            onChange={(field, value) => setEditForm((current) => ({ ...current, [field]: value }))}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModal(null)}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

function FolderStrip({
  activeFolder,
  disabled,
  folders,
  onSelect,
}: {
  activeFolder: string;
  disabled: boolean;
  folders: string[];
  onSelect: (folder: string) => void;
}) {
  if (!folders.length) {
    return null;
  }

  return (
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      {folders.map((folder) => (
        <button
          key={folder}
          className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm ${
            activeFolder === folder ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-stone-200 bg-white text-stone-700"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={disabled}
          type="button"
          onClick={() => onSelect(activeFolder === folder ? "" : folder)}
        >
          <Folder className="h-4 w-4" />
          {folder}
        </button>
      ))}
    </div>
  );
}

function MediaCard({
  item,
  onEdit,
  onHardDelete,
  onRestore,
  onSoftDelete,
  trashMode,
}: {
  item: MediaAsset;
  onEdit: () => void;
  onHardDelete: () => void;
  onRestore: () => void;
  onSoftDelete: () => void;
  trashMode: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-md border border-stone-200 bg-white">
      <div className="grid aspect-video place-items-center bg-stone-100">
        {item.mediaType === "VIDEO" ? (
          <video className="h-full w-full object-cover" src={item.url} controls />
        ) : item.mediaType === "IMAGE" ? (
          <SafeImage alt={displayName(item)} className="h-full w-full" sizes="360px" src={item.url} />
        ) : (
          <LinkIcon className="h-8 w-8 text-stone-400" />
        )}
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-semibold text-stone-950">{displayName(item)}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-stone-500">
          <Folder className="h-3.5 w-3.5" />
          {item.folder || "general"}
        </div>
        <div className="mt-1 text-xs text-stone-500">{trashMode ? `Xóa mềm: ${formatDate(item.deletedAt)}` : formatDate(item.createdAt)}</div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline" title="Mở file">
            <a href={item.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          {trashMode ? (
            <>
              <Button size="sm" variant="outline" onClick={onRestore}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={onHardDelete}>
                <Trash2 className="h-4 w-4" />
                Xóa cứng
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onSoftDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={onHardDelete}>
                Xóa cứng
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function MediaFields({
  folder,
  folders,
  name,
  onChange,
  url,
}: {
  folder: string;
  folders: string[];
  name: string;
  onChange: (field: "folder" | "name" | "url", value: string) => void;
  url: string;
}) {
  return (
    <>
      <label className="block text-sm font-medium text-stone-700">
        Thư mục
        <Input className="mt-1" list="media-folders" value={folder} onChange={(event) => onChange("folder", event.target.value)} />
      </label>
      <datalist id="media-folders">
        {folders.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
      <label className="mt-3 block text-sm font-medium text-stone-700">
        Tên hiển thị
        <Input className="mt-1" value={name} onChange={(event) => onChange("name", event.target.value)} />
      </label>
      <label className="mt-3 block text-sm font-medium text-stone-700">
        URL
        <Input className="mt-1" value={url} onChange={(event) => onChange("url", event.target.value)} />
      </label>
    </>
  );
}

function Modal({
  children,
  onClose,
  open,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-md bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-stone-950">{title}</h2>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Đóng popup">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function displayName(item: MediaAsset) {
  return item.name || item.originalFilename || item.url;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
