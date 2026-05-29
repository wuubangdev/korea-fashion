"use client";

import { ArrowUp, Phone } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type FloatingAction = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone: string;
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
    settings.messengerUrl
      ? { href: settings.messengerUrl, icon: MessengerIcon, label: "Messenger", tone: "bg-[#0084ff] hover:bg-[#0072dc]" }
      : null,
    settings.hotline
      ? { href: `tel:${settings.hotline.replace(/\s/g, "")}`, icon: Phone, label: settings.hotline, tone: "bg-rose-700 hover:bg-rose-800" }
      : null,
  ].filter(Boolean) as FloatingAction[];

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
      {actions.slice(0, 5).map((action, index) => {
        const Icon = action.icon;
        return (
          <a
            key={`${action.label}-${action.href}`}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel={action.href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex items-center gap-2"
            style={{ animationDelay: `${index * 60}ms` }}
            aria-label={action.label}
          >
            <span className="pointer-events-none translate-x-2 rounded-md bg-stone-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-sm transition duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              {action.label}
            </span>
            <span className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-white/20 transition duration-200 hover:-translate-y-0.5 ${action.tone}`}>
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
          className="h-11 w-11 rounded-full bg-white shadow-lg transition hover:-translate-y-0.5"
          onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2.8c-5.2 0-9.2 3.8-9.2 8.7 0 2.8 1.3 5.2 3.4 6.8v3.1l3.1-1.7c.9.2 1.8.4 2.7.4 5.2 0 9.2-3.8 9.2-8.7S17.2 2.8 12 2.8zm.9 11.7-2.3-2.4-4.5 2.4 5-5.3 2.4 2.4 4.4-2.4z" />
    </svg>
  );
}
