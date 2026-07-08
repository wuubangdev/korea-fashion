"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveAuthSession } from "@/lib/auth";
import { getSafeAuthRedirectPath } from "@/lib/navigation";
import { useApiMutation } from "@/hooks/useApiMutation";
import type { AuthRequest, AuthResponse } from "@/types/api";
import type { FormEvent } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useApiMutation<AuthResponse, AuthRequest>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await auth.mutate({
        body: { email: email || undefined, username, password },
        path: "/api/auth/register",
      });

      saveAuthSession(result);
      router.push(getSafeAuthRedirectPath(window.location.search));
    } catch {
      // Error state is handled by useApiMutation.
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-10 text-slate-950 sm:place-items-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Dang ky</CardTitle>
          <CardDescription>
            Tao tai khoan moi va luu token de goi cac API can xac thuc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Ten dang nhap
              <Input
                className="mt-1"
                minLength={3}
                name="username"
                onChange={(event) => setUsername(event.target.value)}
                required
                value={username}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <Input
                className="mt-1"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mat khau
              <Input
                className="mt-1"
                minLength={6}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {auth.error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {auth.error}
              </div>
            ) : null}
            <Button className="w-full" disabled={auth.isLoading} type="submit">
              {auth.isLoading ? "Dang xu ly..." : "Dang ky"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Da co tai khoan?{" "}
            <Link className="font-medium text-slate-950 hover:underline" href="/login">
              Dang nhap
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
