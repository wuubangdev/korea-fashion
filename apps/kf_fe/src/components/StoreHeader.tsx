"use client";

import { ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { Category, PageResult, Product } from "@/types/api";

type Collection<T> = PageResult<T> | T[] | null;

const staticNavItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/profile", label: "Tài khoản" },
  { href: "/policies", label: "Nội quy & chính sách" },
  { href: "/contact", label: "Liên hệ" },
];

function getItems<T>(data: Collection<T>) {
  if (!data) {
    return [];
  }

  return Array.isArray(data) ? data : data.content ?? [];
}

function getCategoryHref(category: Category) {
  return `/products?categoryId=${encodeURIComponent(String(category.id))}`;
}

function getBrandHref(brand: string) {
  return `/products?brand=${encodeURIComponent(brand)}`;
}

export function StoreHeader() {
  const cart = useCart();
  const { settings } = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);

  const categoriesResource = useApiResource<Collection<Category>>({
    path: "/api/storefront/categories",
  });
  const productsResource = useApiResource<Collection<Product>>({
    path: "/api/products",
    query: { page: 0, size: 100, sort: "brand,asc" },
  });

  const categories = useMemo(
    () => getItems(categoriesResource.data).filter((item) => item.active !== false).slice(0, 10),
    [categoriesResource.data],
  );
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          getItems(productsResource.data)
            .map((item) => item.brand?.trim())
            .filter((brand): brand is string => Boolean(brand)),
        ),
      ).slice(0, 10),
    [productsResource.data],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
          {settings.mainLogoUrl ? (
            <Image
              unoptimized
              className="h-10 w-10 rounded-md object-contain"
              src={settings.mainLogoUrl}
              alt={settings.siteName}
              width={40}
              height={40}
            />
          ) : null}
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-normal text-stone-950">{settings.siteName}</span>
            <span className="hidden truncate text-xs font-medium uppercase text-rose-700 sm:block">Thời trang Seoul hằng ngày</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-stone-600 md:flex">
          <div className="group relative">
            <Link href="/products" className="inline-flex items-center gap-1 py-2 hover:text-stone-950">
              Sản phẩm
              <ChevronDown className="h-4 w-4" />
            </Link>
            <div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-md border border-stone-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link href="/products" className="block rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950">
                Tất cả sản phẩm
              </Link>
              {categories.length ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={getCategoryHref(category)}
                    className="block rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <span className="block px-3 py-2 text-stone-400">Chưa có danh mục</span>
              )}
            </div>
          </div>

          <div className="group relative">
            <Link href="/products" className="inline-flex items-center gap-1 py-2 hover:text-stone-950">
              Thương hiệu
              <ChevronDown className="h-4 w-4" />
            </Link>
            <div className="invisible absolute left-0 top-full w-60 translate-y-2 rounded-md border border-stone-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {brands.length ? (
                brands.map((brand) => (
                  <Link
                    key={brand}
                    href={getBrandHref(brand)}
                    className="block rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  >
                    {brand}
                  </Link>
                ))
              ) : (
                <span className="block px-3 py-2 text-stone-400">Chưa có thương hiệu</span>
              )}
            </div>
          </div>

          {staticNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-stone-950">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="hover:text-stone-950">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/products" className="hidden sm:block">
            <Button variant="ghost" size="icon" aria-label="Tìm sản phẩm">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon" aria-label="Tài khoản">
              <UserRound className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm" aria-label="Giỏ hàng">
              <ShoppingBag className="h-4 w-4" />
              <span>{cart.count}</span>
            </Button>
          </Link>
          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            aria-label="Mở menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 text-sm font-medium text-stone-700">
            <Link href="/products" className="rounded-md px-3 py-2 hover:bg-stone-100" onClick={() => setIsOpen(false)}>
              Tất cả sản phẩm
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={getCategoryHref(category)}
                className="rounded-md px-6 py-2 text-stone-600 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            {brands.map((brand) => (
              <Link
                key={brand}
                href={getBrandHref(brand)}
                className="rounded-md px-3 py-2 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                Thương hiệu: {brand}
              </Link>
            ))}
            {staticNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-stone-100" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
