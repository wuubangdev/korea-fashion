"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { StorefrontFloatingActions } from "@/components/StorefrontFloatingActions";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type SocialName = "facebook" | "instagram" | "youtube";

const defaultFooterDescription =
  "Korea Fashion mang đến các lựa chọn thời trang Hàn Quốc tối giản, dễ phối và phù hợp cho lịch trình hằng ngày.";

export function StoreFooter() {
  const { settings } = useSiteSettings();
  const description = getVietnameseDescription(settings.footerAbout || settings.siteDescription);

  return (
    <>
      <footer className="bg-stone-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-normal">{settings.siteName}</div>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {settings.facebookUrl ? <SocialLink href={settings.facebookUrl} label="Facebook" name="facebook" /> : null}
              {settings.instagramUrl ? <SocialLink href={settings.instagramUrl} label="Instagram" name="instagram" /> : null}
              {settings.youtubeUrl ? <SocialLink href={settings.youtubeUrl} label="Youtube" name="youtube" /> : null}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase text-white/60">Liên kết</div>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <Link href="/products" className="link-hover w-fit hover:text-white">
                Sản phẩm
              </Link>
              <Link href="/cart" className="link-hover w-fit hover:text-white">
                Giỏ hàng
              </Link>
              <Link href="/profile" className="link-hover w-fit hover:text-white">
                Tài khoản
              </Link>
              <Link href="/policies" className="link-hover w-fit hover:text-white">
                Nội quy & chính sách
              </Link>
              <Link href="/contact" className="link-hover w-fit hover:text-white">
                Liên hệ
              </Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase text-white/60">Liên hệ</div>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {settings.hotline}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {settings.email}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {settings.address}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <StorefrontFloatingActions />
    </>
  );
}

function SocialLink({ href, label, name }: { href: string; label: string; name: SocialName }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="icon-hover flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/75 hover:bg-white hover:text-stone-950"
    >
      <SocialIcon name={name} className="h-4 w-4" />
    </a>
  );
}

function SocialIcon({ className, name }: { className?: string; name: SocialName }) {
  if (name === "facebook") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M14.2 8.3V6.9c0-.7.5-.9 1-.9h2.1V2.4L14.4 2c-3.2 0-4.9 1.9-4.9 5.3v1H6.4v4h3.1V22h4.1v-9.7h3.1l.5-4h-3z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.8h.01" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8zM10 15.3V8.7l5.7 3.3z" />
    </svg>
  );
}

function getVietnameseDescription(value?: string) {
  if (!value?.trim()) {
    return defaultFooterDescription;
  }

  return /[à-ỹÀ-ỸđĐ]/.test(value) ? value : defaultFooterDescription;
}
