"use client";

import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { apiFetch, mediaApi } from "@/lib/api";
import type { MediaAsset, SiteSetting } from "@/types/api";

type SiteSettingField = {
  key: keyof SiteSetting;
  label: string;
  multiline?: boolean;
  type?: string;
};

const fieldGroups: Array<{ fields: SiteSettingField[]; title: string }> = [
  {
    title: "Thong tin website",
    fields: [
      { key: "siteName", label: "Ten website" },
      { key: "siteDescription", label: "Mo ta ngan", multiline: true },
      { key: "mainLogoUrl", label: "Logo chinh" },
      { key: "footerLogoUrl", label: "Logo footer" },
    ],
  },
  {
    title: "SEO",
    fields: [
      { key: "seoTitle", label: "SEO title" },
      { key: "seoDescription", label: "SEO description", multiline: true },
      { key: "seoKeywords", label: "SEO keywords" },
      { key: "seoThumbnailUrl", label: "SEO thumbnail" },
      { key: "canonicalUrl", label: "Canonical URL" },
    ],
  },
  {
    title: "Mau sac",
    fields: [
      { key: "primaryColor", label: "Mau chinh", type: "color" },
      { key: "secondaryColor", label: "Mau phu", type: "color" },
      { key: "accentColor", label: "Mau nhan", type: "color" },
      { key: "backgroundColor", label: "Mau nen", type: "color" },
      { key: "textColor", label: "Mau chu", type: "color" },
    ],
  },
  {
    title: "Lien he va social",
    fields: [
      { key: "hotline", label: "Hotline" },
      { key: "email", label: "Email", type: "email" },
      { key: "address", label: "Dia chi", multiline: true },
      { key: "facebookUrl", label: "Facebook" },
      { key: "instagramUrl", label: "Instagram" },
      { key: "messengerUrl", label: "Messenger" },
      { key: "tiktokUrl", label: "TikTok" },
      { key: "youtubeUrl", label: "YouTube" },
      { key: "zaloUrl", label: "Zalo" },
      { key: "footerAbout", label: "Footer about", multiline: true },
    ],
  },
];

const emptySettings: SiteSetting = {
  id: "default",
  siteName: "",
};

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting>(emptySettings);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<keyof SiteSetting | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const { notify } = useToast();

  const previewTitle = useMemo(
    () => settings.seoTitle || settings.siteName || "Korea Fashion",
    [settings.seoTitle, settings.siteName],
  );

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    apiFetch<SiteSetting>("/api/site-settings/current", undefined, { method: "GET" })
      .then((result) => {
        if (!cancelled) {
          setSettings({ ...emptySettings, ...result, id: result.id || "default" });
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Khong the tai cau hinh website");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoadingMedia(true);
    mediaApi.list({ page: 0, size: 100, sort: "id,desc" })
      .then((result) => {
        if (!cancelled) {
          setMediaAssets(result.content.filter((item) => item.mediaType !== "VIDEO"));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMediaAssets([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingMedia(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveSettings() {
    setIsSaving(true);
    setError(null);

    try {
      const payload = { ...settings, id: settings.id || "default" };
      const result = await apiFetch<SiteSetting>(`/api/site-settings/${payload.id}`, undefined, {
        body: payload,
        method: "PUT",
      });
      setSettings({ ...emptySettings, ...result });
      notify({ title: "Da luu", message: "Cau hinh website da duoc cap nhat.", type: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Khong the luu cau hinh website";
      setError(message);
      notify({ title: "Luu that bai", message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(key: keyof SiteSetting, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function uploadImage(key: keyof SiteSetting, file: File | undefined) {
    if (!file) {
      return;
    }

    setUploadingField(key);
    try {
      const media = await mediaApi.upload(file, "settings", file.name);
      updateField(key, media.url);
      setMediaAssets((current) => [media, ...current.filter((item) => item.id !== media.id)]);
      notify({ title: "Da upload", message: "Anh da duoc chon cho cau hinh website.", type: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Khong the upload anh";
      notify({ title: "Upload that bai", message, type: "error" });
    } finally {
      setUploadingField(null);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Cau hinh website"
        description="Quan ly title, SEO, thumbnail, logo, mau sac va thong tin lien he cua shop."
        action={
          <Button disabled={isLoading || isSaving} onClick={saveSettings}>
            <Save className="h-4 w-4" />
            {isSaving ? "Dang luu..." : "Luu cau hinh"}
          </Button>
        }
      />

      {error ? <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      {isLoading ? (
        <div className="rounded-md border border-stone-200 bg-white p-6">
          <Loader label="Dang tai cau hinh..." />
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {fieldGroups.map((group) => (
              <section key={group.title} className="rounded-md border border-stone-200 bg-white p-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group.title}</h2>
                {group.title === "Mau sac" ? (
                  <ColorFieldRow fields={group.fields} settings={settings} onChange={updateField} />
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {group.fields.map((field) => (
                      <SettingFieldControl
                        key={field.key}
                        field={field}
                        isLoadingMedia={isLoadingMedia}
                        isUploading={uploadingField === field.key}
                        mediaAssets={mediaAssets}
                        settings={settings}
                        onChange={updateField}
                        onUpload={uploadImage}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <aside className="space-y-5">
            <section className="rounded-md border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Preview SEO</h2>
              <div className="mt-4 rounded-md border border-stone-200 p-3">
                {settings.seoThumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="SEO thumbnail" className="mb-3 aspect-video w-full rounded-md border border-stone-200 object-cover" src={settings.seoThumbnailUrl} />
                ) : null}
                <div className="text-base font-semibold text-slate-950">{previewTitle}</div>
                <div className="mt-1 break-all text-xs text-emerald-700">{settings.canonicalUrl || "https://example.com"}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{settings.seoDescription || settings.siteDescription || "Chua co mo ta SEO."}</p>
              </div>
            </section>

            <section className="rounded-md border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Logo</h2>
              {settings.mainLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="Main logo" className="mt-4 max-h-20 max-w-full rounded-md border border-stone-200 bg-stone-50 p-3" src={settings.mainLogoUrl} />
              ) : (
                <p className="mt-4 text-sm text-slate-500">Chua co logo chinh.</p>
              )}
            </section>
          </aside>
        </div>
      )}
    </AppShell>
  );
}

function SettingFieldControl({
  field,
  isLoadingMedia,
  isUploading,
  mediaAssets,
  onChange,
  onUpload,
  settings,
}: {
  field: SiteSettingField;
  isLoadingMedia: boolean;
  isUploading: boolean;
  mediaAssets: MediaAsset[];
  onChange: (key: keyof SiteSetting, value: string) => void;
  onUpload: (key: keyof SiteSetting, file: File | undefined) => void;
  settings: SiteSetting;
}) {
  const value = String(settings[field.key] ?? "");

  if (isImageSettingField(field.key)) {
    return (
      <div className="md:col-span-2">
        <span className="text-sm font-medium text-slate-700">{field.label}</span>
        <div className="mt-1 grid gap-2 md:grid-cols-[minmax(0,1fr)_220px_auto]">
          <Input value={value} onChange={(event) => onChange(field.key, event.target.value)} />
          <select
            className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            disabled={isLoadingMedia}
            value=""
            onChange={(event) => {
              if (event.target.value) {
                onChange(field.key, event.target.value);
              }
            }}
          >
            <option value="">{isLoadingMedia ? "Dang tai media..." : "Chon anh da upload"}</option>
            {mediaAssets.map((item) => (
              <option key={item.id} value={item.url}>
                {item.folder || "media"} / {item.name || item.originalFilename || item.url}
              </option>
            ))}
          </select>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-stone-50">
            {isUploading ? "Dang upload..." : "Upload"}
            <input
              accept="image/*"
              className="sr-only"
              disabled={isUploading}
              type="file"
              onChange={(event) => onUpload(field.key, event.target.files?.[0])}
            />
          </label>
        </div>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={field.label} className="mt-3 max-h-24 max-w-xs rounded-md border border-stone-200 bg-stone-50 object-contain p-2" src={value} />
        ) : null}
      </div>
    );
  }

  return (
    <label className={field.multiline ? "md:col-span-2" : undefined}>
      <span className="text-sm font-medium text-slate-700">{field.label}</span>
      {field.multiline ? (
        <textarea
          className="mt-1 min-h-24 w-full resize-y rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      ) : (
        <Input
          className="mt-1"
          type={field.type ?? "text"}
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      )}
    </label>
  );
}

function ColorFieldRow({
  fields,
  onChange,
  settings,
}: {
  fields: SiteSettingField[];
  onChange: (key: keyof SiteSetting, value: string) => void;
  settings: SiteSetting;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {fields.map((field) => {
        const value = String(settings[field.key] || "#000000");

        return (
          <label key={field.key} className="rounded-md border border-stone-200 bg-stone-50 p-3">
            <span className="block truncate text-xs font-medium text-slate-600">{field.label}</span>
            <input
              className="mt-2 h-10 w-full cursor-pointer rounded border border-stone-300 bg-white p-1"
              type="color"
              value={isValidHexColor(value) ? value : "#000000"}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
            <Input
              className="mt-2 h-8 px-2 text-xs"
              value={String(settings[field.key] ?? "")}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
          </label>
        );
      })}
    </div>
  );
}

function isImageSettingField(key: keyof SiteSetting) {
  return key === "mainLogoUrl" || key === "footerLogoUrl" || key === "seoThumbnailUrl";
}

function isValidHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}
