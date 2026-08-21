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
