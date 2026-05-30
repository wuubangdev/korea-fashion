import type { Metadata } from "next";
import { storefrontApi } from "@/lib/api/domains/storefront";
import type { SiteSetting } from "@/types/api";

const fallbackSeoSettings: SiteSetting = {
  id: "fallback",
  siteName: "Korea Fashion",
  siteDescription: "Cửa hàng thời trang phong cách Hàn Quốc với các item dễ phối cho đi học, đi làm và xuống phố hằng ngày.",
  mainLogoUrl: "/korea-fashion-logo.svg",
  seoTitle: "Korea Fashion",
  seoDescription: "Cửa hàng thời trang phong cách Hàn Quốc với các item dễ phối cho đi học, đi làm và xuống phố hằng ngày.",
  seoThumbnailUrl: "/korea-fashion-logo.svg",
};

export type SeoMetadataInput = {
  canonicalPath?: string;
  description?: string;
  imageAlt?: string;
  imageUrl?: string;
  keywords?: string | string[];
  title?: string;
  type?: "website" | "article";
};

export function getPublicSiteUrl(settings?: SiteSetting) {
  const rawUrl =
    settings?.canonicalUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  try {
    return new URL(withProtocol);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function toAbsoluteUrl(value: string | undefined, baseUrl: URL) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function parseKeywords(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value?.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function getSeoSettings() {
  try {
    const settings = await storefrontApi.siteSettings({
      next: { revalidate: 300, tags: ["site-settings"] },
    });

    return { ...fallbackSeoSettings, ...settings };
  } catch {
    return fallbackSeoSettings;
  }
}

export async function generateSeoMetadata(input: SeoMetadataInput = {}): Promise<Metadata> {
  const settings = await getSeoSettings();
  const baseUrl = getPublicSiteUrl(settings);
  const title = input.title || settings.seoTitle || settings.siteName || fallbackSeoSettings.siteName;
  const description =
    input.description ||
    settings.seoDescription ||
    settings.siteDescription ||
    fallbackSeoSettings.seoDescription ||
    "";
  const thumbnailUrl =
    toAbsoluteUrl(input.imageUrl, baseUrl) ||
    toAbsoluteUrl(settings.seoThumbnailUrl, baseUrl) ||
    toAbsoluteUrl(settings.mainLogoUrl, baseUrl);
  const canonicalUrl =
    toAbsoluteUrl(input.canonicalPath, baseUrl) ||
    toAbsoluteUrl(settings.canonicalUrl, baseUrl) ||
    baseUrl.toString();
  const image = thumbnailUrl
    ? [{ url: thumbnailUrl, width: 1200, height: 630, alt: input.imageAlt || title }]
    : undefined;

  return {
    applicationName: settings.siteName,
    alternates: {
      canonical: canonicalUrl,
    },
    description,
    keywords: parseKeywords(input.keywords ?? settings.seoKeywords),
    metadataBase: baseUrl,
    openGraph: {
      description,
      images: image,
      locale: "vi_VN",
      siteName: settings.siteName,
      title,
      type: input.type ?? "website",
      url: canonicalUrl,
    },
    robots: {
      follow: true,
      index: true,
    },
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: thumbnailUrl ? [thumbnailUrl] : undefined,
      title,
    },
  };
}
