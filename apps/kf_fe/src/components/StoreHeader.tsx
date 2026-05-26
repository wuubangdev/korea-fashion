"use client";

import { ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Trang chu" },
  { href: "/products", label: "San pham" },
  { href: "/profile", label: "Tai khoan" },
];

export function StoreHeader() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Korea Fashion
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="hover:text-slate-950">
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="icon" aria-label="Tai khoan">
              <UserRound className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" size="sm" aria-label="Gio hang">
              <ShoppingBag className="h-4 w-4" />
              <span>{cart.count}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
