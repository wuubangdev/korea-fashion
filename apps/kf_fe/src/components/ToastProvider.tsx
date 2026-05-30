"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  title?: string;
  type: ToastType;
};

type ToastInput = Omit<Toast, "id">;

type ToastContextValue = {
  notify: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const styles: Record<ToastType, string> = {
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-slate-200 bg-white text-slate-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const durations: Record<ToastType, number> = {
  error: 12000,
  info: 7000,
  success: 6000,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current.slice(-3), { ...toast, message: friendlyToastMessage(toast.message), id }]);
    window.setTimeout(() => remove(id), durations[toast.type]);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] grid w-[min(380px,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn("rounded-md border p-4 shadow-lg backdrop-blur", styles[toast.type])}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                {toast.title ? <div className="text-sm font-semibold">{toast.title}</div> : null}
                <div className={cn("text-sm leading-5", toast.title ? "mt-1" : "")}>{toast.message}</div>
              </div>
              <button
                aria-label="Đóng thông báo"
                className="rounded p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
                type="button"
                onClick={() => remove(toast.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function friendlyToastMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("could not commit jpa transaction")) {
    return "Không thể lưu thay đổi lúc này. Vui lòng kiểm tra thông tin và thử lại.";
  }

  if (normalized.includes("failed to fetch") || normalized.includes("networkerror")) {
    return "Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.";
  }

  if (normalized.includes("request failed (401)")) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (normalized.includes("request failed (403)")) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  if (normalized.includes("request failed (500)") || normalized.includes("internal server error")) {
    return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.";
  }

  return message;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
