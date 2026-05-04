import { format } from "date-fns";
import { Bell, TrendingDown, Calendar, Clock } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const user = await requireUser();

  const { data: alerts } = await supabaseAdmin
    .from("alerts")
    .select("id, type, message, sent_at, watchers(name, url)")
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5 text-brand-green" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-gray-500 text-sm">All triggered watcher notifications</p>
        </div>
      </div>

      {(alerts ?? []).length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No alerts yet</p>
          <p className="text-sm mt-1">Create a watcher and we&apos;ll notify you when something changes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(alerts ?? []).map((a) => {
            const watcher = (a as unknown as { watchers?: { name: string; url: string } }).watchers;
            return (
              <div
                key={a.id}
                className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.type === "price" ? "bg-green-900/30" : "bg-blue-900/30"}`}>
                    {a.type === "price" ? <TrendingDown className="w-5 h-5 text-green-400" /> : <Calendar className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{a.message}</p>
                      <div className="flex items-center gap-1 text-gray-500 text-xs whitespace-nowrap flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {format(new Date(a.sent_at), "d MMM, HH:mm")}
                      </div>
                    </div>
                    {watcher && <p className="text-gray-500 text-xs mt-1">Watcher: {watcher.name}</p>}
                    {watcher?.url && (
                      <a
                        href={watcher.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-brand-green hover:underline text-sm font-medium"
                      >
                        {a.type === "price" ? "View deal →" : "Book now →"}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
