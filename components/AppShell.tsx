import Sidebar from "@/components/Sidebar";
import DashboardNav from "@/components/DashboardNav";
import { requireUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("alerts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("sent_at", since);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar
        userName={user.name ?? ""}
        userEmail={user.email}
        tier={user.tier}
        alertCount={count ?? 0}
      />
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <DashboardNav />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
