import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata({
    canonicalPath: "/login",
    description: "Dang nhap tai khoan Korea Fashion de theo doi don hang va quan ly thong tin mua sam.",
    title: "Dang nhap",
  });
}

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
