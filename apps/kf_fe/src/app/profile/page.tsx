"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthSession } from "@/lib/auth";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setUsername(localStorage.getItem(AUTH_USER_KEY) ?? "");
      setHasToken(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <StoreHeader />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Thong tin ca nhan</CardTitle>
            <CardDescription>
              Quan ly phien dang nhap va thong tin tai khoan hien tai.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500">Ten dang nhap</div>
              <div className="mt-1 text-lg font-semibold">
                {username || "Chua dang nhap"}
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500">Trang thai token</div>
              <div className="mt-2">
                <Badge variant={hasToken ? "success" : "warning"}>
                  {hasToken ? "Da luu JWT" : "Chua co JWT"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button>Dang nhap</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  clearAuthSession();
                  setUsername("");
                  setHasToken(false);
                }}
              >
                Dang xuat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
