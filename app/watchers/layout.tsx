import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default function WatchersLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
