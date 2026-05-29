"use client";

import { useApiResource } from "@/hooks/useApiResource";
import type { SiteSetting } from "@/types/api";

export const fallbackSiteSettings: SiteSetting = {
  id: "fallback",
  siteName: "Korea Fashion",
  siteDescription: "Cửa hàng thời trang phong cách Hàn Quốc với các item dễ phối cho đi học, đi làm và xuống phố hằng ngày.",
  mainLogoUrl: "/korea-fashion-logo.svg",
  footerLogoUrl: "/korea-fashion-logo.svg",
  seoThumbnailUrl: "/korea-fashion-logo.svg",
  facebookUrl: "https://facebook.com/koreafashion",
  instagramUrl: "https://instagram.com/koreafashion",
  tiktokUrl: "https://tiktok.com/@koreafashion",
  youtubeUrl: "https://youtube.com/@koreafashion",
  messengerUrl: "https://m.me/koreafashion",
  zaloUrl: "https://zalo.me/0900000000",
  hotline: "0900 000 000",
  email: "hello@koreafashion.vn",
  address: "Cần Thơ, Việt Nam",
  footerAbout: "Korea Fashion tập trung vào các sản phẩm dễ phối, chất liệu tốt và phong cách Hàn Quốc ứng dụng.",
};

export function useSiteSettings() {
  const settings = useApiResource<SiteSetting>({
    path: "/api/storefront/site-settings",
  });

  return {
    ...settings,
    settings: { ...fallbackSiteSettings, ...(settings.data ?? {}) },
  };
}
