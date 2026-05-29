"use client";

import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/useApiMutation";
import { saveAuthSession } from "@/lib/auth";
import type { AuthRequest, AuthResponse } from "@/types/api";

export type AuthMode = "login" | "register";

type AuthErrors = {
  email?: string;
  password?: string;
  username?: string;
};

type AuthFormProps = {
  initialMode?: AuthMode;
};

const authCopy = {
  login: {
    action: "Đăng nhập",
    description: "Dùng tài khoản Korea Fashion để tiếp tục mua sắm, theo dõi đơn hàng hoặc vào khu quản trị khi bạn có quyền.",
    loading: "Đang đăng nhập...",
    switchLabel: "Chưa có tài khoản?",
    switchText: "Tạo tài khoản",
    title: "Đăng nhập",
  },
  register: {
    action: "Tạo tài khoản",
    description: "Đăng ký tài khoản mới để lưu phiên đăng nhập, theo dõi đơn hàng và sử dụng các tính năng cần xác thực.",
    loading: "Đang tạo tài khoản...",
    switchLabel: "Đã có tài khoản?",
    switchText: "Đăng nhập",
    title: "Tạo tài khoản",
  },
};

const inputClassName =
  "h-12 border-stone-200 bg-white/90 pl-10 text-[15px] shadow-sm shadow-stone-950/5 focus:border-emerald-700 focus:bg-white focus:ring-emerald-100";
const inputErrorClassName = "border-red-300 focus:border-red-600 focus:ring-red-100";

export function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const router = useRouter();
  const auth = useApiMutation<AuthResponse, AuthRequest>();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const copy = authCopy[mode];
  const isRegister = mode === "register";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    auth.reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = isRegister
      ? validateRegister({ email, password, username })
      : validateLogin({ password, username });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const result = await auth.mutate({
        body: isRegister
          ? { email: email.trim() || undefined, username: username.trim(), password }
          : { username: username.trim(), password },
        path: isRegister ? "/api/auth/register" : "/api/auth/login",
      });

      saveAuthSession(result);
      router.push(isRegister ? getSafeNextPath() : getSafeNextPath(result));
    } catch {
      // Error state is handled by useApiMutation.
    }
  }

  return (
    <AuthShell
      title={copy.title}
      description={copy.description}
      footer={
        <p className="text-center text-sm text-stone-600">
          {copy.switchLabel}{" "}
          <button
            className="font-semibold text-stone-950 transition hover:text-emerald-800 hover:underline"
            type="button"
            onClick={() => switchMode(isRegister ? "login" : "register")}
          >
            {copy.switchText}
          </button>
        </p>
      }
    >
      <form className="min-h-[318px] space-y-5 transition-[min-height] duration-300 ease-out" noValidate onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-stone-800">
          Tên đăng nhập
          <div className="relative mt-2">
            <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              aria-describedby={errors.username ? `${mode}-username-error` : undefined}
              aria-invalid={Boolean(errors.username)}
              autoComplete="username"
              className={`${inputClassName} ${errors.username ? inputErrorClassName : ""}`}
              name="username"
              onChange={(event) => {
                setUsername(event.target.value);
                setErrors((current) => ({ ...current, username: undefined }));
              }}
              placeholder={isRegister ? "Tên tài khoản" : "superadmin"}
              value={username}
            />
          </div>
          {errors.username ? (
            <p id={`${mode}-username-error`} className="mt-1 text-xs font-medium text-red-600">
              {errors.username}
            </p>
          ) : null}
        </label>

        <div
          aria-hidden={!isRegister}
          className={`overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 ease-out ${
            isRegister ? "max-h-28 opacity-100" : "!mt-0 max-h-0 -translate-y-2 opacity-0"
          }`}
        >
          <label className="block text-sm font-semibold text-stone-800">
            Email
            <div className="relative mt-2">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                aria-describedby={errors.email ? "register-email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className={`${inputClassName} ${errors.email ? inputErrorClassName : ""}`}
                disabled={!isRegister}
                name="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: undefined }));
                }}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </div>
            {errors.email ? (
              <p id="register-email-error" className="mt-1 text-xs font-medium text-red-600">
                {errors.email}
              </p>
            ) : null}
          </label>
        </div>

        <label className="block text-sm font-semibold text-stone-800">
          Mật khẩu
          <div className="relative mt-2">
            <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              aria-describedby={errors.password ? `${mode}-password-error` : undefined}
              aria-invalid={Boolean(errors.password)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              className={`${inputClassName} ${errors.password ? inputErrorClassName : ""}`}
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder={isRegister ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"}
              type="password"
              value={password}
            />
          </div>
          {errors.password ? (
            <p id={`${mode}-password-error`} className="mt-1 text-xs font-medium text-red-600">
              {errors.password}
            </p>
          ) : null}
        </label>

        {auth.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700">
            {auth.error}
          </div>
        ) : null}

        <Button className="h-12 w-full bg-stone-950 text-[15px] hover:bg-stone-800" disabled={auth.isLoading} type="submit">
          {auth.isLoading ? copy.loading : copy.action}
        </Button>
      </form>
    </AuthShell>
  );
}

function validateLogin({ password, username }: Pick<AuthRequest, "password" | "username">) {
  const errors: AuthErrors = {};
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    errors.username = "Vui lòng nhập tên đăng nhập.";
  } else if (trimmedUsername.length < 3) {
    errors.username = "Tên đăng nhập cần tối thiểu 3 ký tự.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
  }

  return errors;
}

function validateRegister({ email, password, username }: AuthRequest) {
  const errors: AuthErrors = {};
  const trimmedEmail = email?.trim() ?? "";
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    errors.username = "Vui lòng nhập tên đăng nhập.";
  } else if (trimmedUsername.length < 3) {
    errors.username = "Tên đăng nhập cần tối thiểu 3 ký tự.";
  } else if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUsername)) {
    errors.username = "Tên đăng nhập chỉ dùng chữ, số, dấu chấm, gạch dưới hoặc gạch ngang.";
  }

  if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Email không đúng định dạng.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
  }

  return errors;
}

function getSafeNextPath(auth?: AuthResponse) {
  const nextPath = new URLSearchParams(window.location.search).get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return auth && hasAdminRole(auth.token) ? "/admin" : "/profile";
  }

  return nextPath;
}

function hasAdminRole(token: string) {
  const [, payload] = token.split(".");
  if (!payload) {
    return false;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const parsed = JSON.parse(window.atob(padded)) as { roles?: string[] };
    return parsed.roles?.some((role) => role === "ADMIN" || role === "ROLE_ADMIN") ?? false;
  } catch {
    return false;
  }
}
