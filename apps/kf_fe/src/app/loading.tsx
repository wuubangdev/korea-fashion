import { AppShell } from "@/components/AppShell";
import { PageLoader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <AppShell>
      <PageLoader />
    </AppShell>
  );
}
