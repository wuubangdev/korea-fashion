"use client";

import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/products?origin=Korea", label: "Hàng Hàn Quốc" },
  { href: "/profile", label: "Tài khoản" },
];

export function StoreHeader() {
  const cart = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0">
          <div className="text-lg font-semibold tracking-normal text-stone-950">
            Korea Fashion
          </div>
          <div className="hidden text-xs font-medium uppercase text-rose-700 sm:block">
            Seoul daily wear
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
          {navItems.map((item) => (
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 hover:bg-stone-100"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 hover:bg-stone-100"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
