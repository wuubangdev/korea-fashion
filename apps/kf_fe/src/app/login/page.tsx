"use client";

import { LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiMutation } from "@/hooks/useApiMutation";
import { saveAuthSession } from "@/lib/auth";
import type { AuthRequest, AuthResponse } from "@/types/api";
import type { FormEvent } from "react";

type LoginErrors = {
  password?: string;
  username?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const auth = useApiMutation<AuthResponse, AuthRequest>();
  const [errors, setErrors] = useState<LoginErrors>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin({ password, username });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const result = await auth.mutate({
        body: { username: username.trim(), password },
        path: "/api/auth/login",
      });

      saveAuthSession(result);
      router.push(getSafeNextPath(result));
    } catch {
      // Error state is handled by useApiMutation.
    }
  }

  return (
    <AuthShell
      title="Đăng nhập"
      description="Dùng tài khoản Korea Fashion để tiếp tục mua sắm, theo dõi đơn hàng hoặc vào khu quản trị khi bạn có quyền."
      footer={
        <p className="text-center text-sm text-stone-600">
          Chưa có tài khoản?{" "}
          <Link className="font-medium text-stone-950 hover:underline" href="/register">
            Đăng ký ngay
          </Link>
        </p>
      }
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-stone-700">
          Tên đăng nhập
          <div className="relative mt-1">
            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              aria-describedby={errors.username ? "login-username-error" : undefined}
              aria-invalid={Boolean(errors.username)}
              autoComplete="username"
              className={`border-stone-300 pl-9 focus:border-stone-950 focus:ring-stone-200 ${
                errors.username ? "border-red-300 focus:border-red-600 focus:ring-red-100" : ""
              }`}
              name="username"
              onChange={(event) => {
                setUsername(event.target.value);
                setErrors((current) => ({ ...current, username: undefined }));
              }}
              placeholder="superadmin"
              value={username}
            />
          </div>
          {errors.username ? (
            <p id="login-username-error" className="mt-1 text-xs font-medium text-red-600">
              {errors.username}
            </p>
          ) : null}
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Mật khẩu
          <div className="relative mt-1">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              aria-describedby={errors.password ? "login-password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              className={`border-stone-300 pl-9 focus:border-stone-950 focus:ring-stone-200 ${
                errors.password ? "border-red-300 focus:border-red-600 focus:ring-red-100" : ""
              }`}
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="Nhập mật khẩu"
              type="password"
              value={password}
            />
          </div>
          {errors.password ? (
            <p id="login-password-error" className="mt-1 text-xs font-medium text-red-600">
              {errors.password}
            </p>
          ) : null}
        </label>

        {auth.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {auth.error}
          </div>
        ) : null}

        <Button className="w-full bg-stone-950 hover:bg-stone-800" disabled={auth.isLoading} type="submit">
          {auth.isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </AuthShell>
  );
}

function validateLogin({ password, username }: Pick<AuthRequest, "password" | "username">) {
  const errors: LoginErrors = {};
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

function getSafeNextPath(auth: AuthResponse) {
  const nextPath = new URLSearchParams(window.location.search).get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return hasAdminRole(auth.token) ? "/admin" : "/profile";
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
