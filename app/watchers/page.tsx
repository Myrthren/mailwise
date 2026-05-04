import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus, TrendingDown, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { WatcherActions } from "@/components/WatcherActions";

export const dynamic = "force-dynamic";

export default async function WatchersPage() {
  const user = await requireUser();

  const { data: watchers } = await supabaseAdmin
    .from("watchers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Watchers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your automated monitors</p>
        </div>
        <Link
          href="/watchers/new"
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dim text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-glow-sm"
        >
          <Plus className="w-4 h-4" /> New watcher
        </Link>
      </div>

      <div className="space-y-4">
        {(watchers ?? []).length === 0 ? (
          <Link
            href="/watchers/new"
            className="flex items-center justify-center gap-2 border border-dashed border-[#2a2a2a] hover:border-brand-green text-gray-500 hover:text-brand-green rounded-2xl p-10 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Create your first watcher
          </Link>
        ) : (
          (watchers ?? []).map((w) => {
            const triggered = w.last_value && (w.type === "appointment" ? w.last_value === "available" : false);
            return (
              <div
                key={w.id}
                className={`bg-[#111] border rounded-2xl p-5 ${triggered ? "border-brand-green/30 bg-[#0d1f10]" : "border-[#1a1a1a]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${w.type === "price" ? "bg-green-900/30" : "bg-blue-900/30"}`}>
                      {w.type === "price" ? <TrendingDown className="w-5 h-5 text-green-400" /> : <Calendar className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold truncate">{w.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${w.type === "price" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}>
                          {w.type === "price" ? "Price drop" : "Appointment"}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate">{w.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {triggered ? (
                      <span className="flex items-center gap-1 text-brand-green text-xs bg-brand-green/10 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" /> Triggered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <CheckCircle2 className="w-3 h-3" /> {w.status}
                      </span>
                    )}
                    <WatcherActions id={w.id} status={w.status} />
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 text-xs text-gray-500 border-t border-[#1a1a1a] pt-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last run: {w.updated_at ? formatDistanceToNow(new Date(w.updated_at), { addSuffix: true }) : "never"}
                  </span>
                  <span className={`ml-auto font-medium ${triggered ? "text-brand-green" : "text-gray-300"}`}>
                    {w.last_value ?? "—"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
