import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
  label?: string;
};

export function Loader({ className, label = "Đang tải" }: LoaderProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-sm text-slate-600", className)}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span>{label}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="grid gap-4">
      <SkeletonLine />
      <SkeletonLine className="w-2/3" />
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export function FullPageLoader({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950">
      <div className="grid justify-items-center gap-4 rounded-md border border-slate-200 bg-white px-8 py-7 shadow-sm">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
        <div className="text-sm font-medium text-slate-700">{label}</div>
      </div>
    </main>
  );
}

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 w-full animate-pulse rounded bg-slate-200", className)} />;
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-8 w-1/3 animate-pulse rounded bg-slate-200" />
    </div>
  );
}
