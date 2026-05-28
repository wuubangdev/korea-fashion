"use client";

import { LockKeyhole, Mail, UserRound } from "lucide-react";
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

type RegisterErrors = {
  email?: string;
  password?: string;
  username?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const auth = useApiMutation<AuthResponse, AuthRequest>();
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister({ email, password, username });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const result = await auth.mutate({
        body: {
          email: email.trim() || undefined,
          username: username.trim(),
          password,
        },
        path: "/api/auth/register",
      });

      saveAuthSession(result);
      router.push(getSafeNextPath());
    } catch {
      // Error state is handled by useApiMutation.
    }
  }

  return (
    <AuthShell
      title="Tạo tài khoản"
      description="Đăng ký tài khoản mới để lưu phiên đăng nhập, theo dõi đơn hàng và sử dụng các tính năng cần xác thực."
      footer={
        <p className="text-center text-sm text-stone-600">
          Đã có tài khoản?{" "}
          <Link className="font-medium text-stone-950 hover:underline" href="/login">
            Đăng nhập
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
              aria-describedby={errors.username ? "register-username-error" : undefined}
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
              placeholder="Tên tài khoản"
              value={username}
            />
          </div>
          {errors.username ? (
            <p id="register-username-error" className="mt-1 text-xs font-medium text-red-600">
              {errors.username}
            </p>
          ) : null}
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Email
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              aria-describedby={errors.email ? "register-email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className={`border-stone-300 pl-9 focus:border-stone-950 focus:ring-stone-200 ${
                errors.email ? "border-red-300 focus:border-red-600 focus:ring-red-100" : ""
              }`}
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

        <label className="block text-sm font-medium text-stone-700">
          Mật khẩu
          <div className="relative mt-1">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              aria-describedby={errors.password ? "register-password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              className={`border-stone-300 pl-9 focus:border-stone-950 focus:ring-stone-200 ${
                errors.password ? "border-red-300 focus:border-red-600 focus:ring-red-100" : ""
              }`}
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="Tối thiểu 6 ký tự"
              type="password"
              value={password}
            />
          </div>
          {errors.password ? (
            <p id="register-password-error" className="mt-1 text-xs font-medium text-red-600">
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
          {auth.isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </form>
    </AuthShell>
  );
}

function validateRegister({ email, password, username }: AuthRequest) {
  const errors: RegisterErrors = {};
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

function getSafeNextPath() {
  const nextPath = new URLSearchParams(window.location.search).get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/profile";
  }

  return nextPath;
}
