"use client";

import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StorefrontFloatingActions } from "@/components/StorefrontFloatingActions";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function StoreFooter() {
  const { settings } = useSiteSettings();

  return (
    <>
      <footer className="border-t border-stone-200 bg-stone-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              {settings.footerLogoUrl || settings.mainLogoUrl ? (
                <Image
                  unoptimized
                  className="h-11 w-11 rounded-md object-contain"
                  src={settings.footerLogoUrl || settings.mainLogoUrl}
                  alt={settings.siteName}
                  width={44}
                  height={44}
                />
              ) : null}
              <div className="text-lg font-semibold tracking-normal">{settings.siteName}</div>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
              {settings.footerAbout || settings.siteDescription}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {settings.facebookUrl ? <SocialLink href={settings.facebookUrl} label="Facebook" icon={Facebook} /> : null}
              {settings.instagramUrl ? <SocialLink href={settings.instagramUrl} label="Instagram" icon={Instagram} /> : null}
              {settings.youtubeUrl ? <SocialLink href={settings.youtubeUrl} label="Youtube" icon={Youtube} /> : null}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase text-white/60">Liên kết</div>
            <div className="mt-3 grid gap-2 text-sm text-white/75">
              <Link href="/products" className="hover:text-white">
                Sản phẩm
              </Link>
              <Link href="/cart" className="hover:text-white">
                Giỏ hàng
              </Link>
              <Link href="/profile" className="hover:text-white">
                Tài khoản
              </Link>
              <Link href="/policies" className="hover:text-white">
                Nội quy & chính sách
              </Link>
            <Link href="/contact" className="hover:text-white">
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
            {settings.seoThumbnailUrl ? (
              <Image
                unoptimized
                className="mt-5 h-20 w-20 rounded-md bg-white object-contain p-2"
                src={settings.seoThumbnailUrl}
                alt="Korea Fashion thumbnail"
                width={80}
                height={80}
              />
            ) : null}
          </div>
        </div>
      </footer>
      <StorefrontFloatingActions />
    </>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: typeof Facebook; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/75 transition hover:bg-white hover:text-stone-950"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
