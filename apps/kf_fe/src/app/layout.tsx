import type { Metadata } from "next";
import { generateSeoMetadata } from "@/components/SeoMetadata";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeoMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
