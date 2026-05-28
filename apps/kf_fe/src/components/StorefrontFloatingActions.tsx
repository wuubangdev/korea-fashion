"use client";

import { ArrowUp, Facebook, Instagram, MessageCircle, Phone, Send, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type FloatingAction = {
  href: string;
  icon: typeof MessageCircle;
  label: string;
};

export function StorefrontFloatingActions() {
  const { settings } = useSiteSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 420);
    };

    queueMicrotask(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const actions: FloatingAction[] = [
    settings.messengerUrl ? { href: settings.messengerUrl, icon: MessageCircle, label: "Messenger" } : null,
    settings.zaloUrl ? { href: settings.zaloUrl, icon: Send, label: "Zalo" } : null,
    settings.facebookUrl ? { href: settings.facebookUrl, icon: Facebook, label: "Facebook" } : null,
    settings.instagramUrl ? { href: settings.instagramUrl, icon: Instagram, label: "Instagram" } : null,
    settings.youtubeUrl ? { href: settings.youtubeUrl, icon: Youtube, label: "Youtube" } : null,
    settings.hotline ? { href: `tel:${settings.hotline.replace(/\s/g, "")}`, icon: Phone, label: settings.hotline } : null,
  ].filter(Boolean) as FloatingAction[];

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
      {actions.slice(0, 5).map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={`${action.label}-${action.href}`}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel={action.href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex items-center gap-2"
            aria-label={action.label}
          >
            <span className="pointer-events-none translate-x-2 rounded-md bg-stone-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition group-hover:translate-x-0 group-hover:opacity-100">
              {action.label}
            </span>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg ring-1 ring-white/20 transition hover:bg-rose-700">
              <Icon className="h-5 w-5" />
            </span>
          </a>
        );
      })}

      {showScrollTop ? (
        <Button
          size="icon"
          variant="outline"
          aria-label="Lên đầu trang"
          className="h-11 w-11 rounded-full bg-white shadow-lg"
          onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
