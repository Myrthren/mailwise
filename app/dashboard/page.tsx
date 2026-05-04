import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Plus,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mail,
  Activity,
} from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const [{ data: watchers }, { data: alerts }, { count: alertsToday }] = await Promise.all([
    supabaseAdmin
      .from("watchers")
      .select("id, type, name, url, status, last_value, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3),
    supabaseAdmin
      .from("alerts")
      .select("id, type, message, sent_at")
      .eq("user_id", user.id)
      .order("sent_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("alerts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const { count: activeWatchers } = await supabaseAdmin
    .from("watchers")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {firstName}</h1>
          <p className="text-gray-500 text-sm mt-1">Your automation overview</p>
        </div>
        <Link
          href="/watchers/new"
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dim text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-glow-sm"
        >
          <Plus className="w-4 h-4" /> New watcher
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active watchers" value={String(activeWatchers ?? 0)} icon={<Activity className="w-4 h-4" />} />
        <StatCard label="Alerts (24h)" value={String(alertsToday ?? 0)} icon={<Bell className="w-4 h-4" />} />
        <StatCard label="Plan" value={user.tier.toUpperCase()} icon={<Mail className="w-4 h-4" />} />
        <StatCard label="Next summary" value="08:00" icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Your watchers</h2>
            <Link href="/watchers" className="text-sm text-brand-green hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {(watchers ?? []).length === 0 ? (
            <Link
              href="/watchers/new"
              className="flex items-center justify-center gap-2 border border-dashed border-[#2a2a2a] hover:border-brand-green text-gray-500 hover:text-brand-green rounded-2xl p-10 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Create your first watcher
            </Link>
          ) : (
            (watchers ?? []).map((w) => (
              <WatcherRow
                key={w.id}
                type={w.type as "price" | "appointment"}
                title={w.name}
                url={w.url}
                lastRun={w.updated_at ? formatDistanceToNow(new Date(w.updated_at), { addSuffix: true }) : "never"}
                result={w.last_value ?? "—"}
                status={w.status as "active" | "paused" | "error"}
              />
            ))
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4">Recent alerts</h2>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4 space-y-3">
            {(alerts ?? []).length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">No alerts yet</p>
            ) : (
              (alerts ?? []).map((a) => (
                <AlertRow
                  key={a.id}
                  icon={a.type === "price" ? "💰" : a.type === "appointment" ? "📅" : "📊"}
                  message={a.message}
                  time={formatDistanceToNow(new Date(a.sent_at), { addSuffix: true })}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
        {icon} {label}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function WatcherRow({
  type,
  title,
  url,
  lastRun,
  result,
  status,
}: {
  type: "price" | "appointment";
  title: string;
  url: string;
  lastRun: string;
  result: string;
  status: "active" | "paused" | "error";
}) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${type === "price" ? "bg-green-900/30" : "bg-blue-900/30"}`}>
          {type === "price" ? <TrendingDown className="w-5 h-5 text-green-400" /> : <Calendar className="w-5 h-5 text-blue-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold truncate">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status === "active" ? "bg-green-900/30 text-green-400" : status === "paused" ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-500 text-xs truncate">{url}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lastRun}
            </span>
            <span className="font-medium text-gray-300">{result}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ icon, message, time }: { icon: string; message: string; time: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-base">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-gray-200 text-xs leading-relaxed">{message}</p>
        <p className="text-gray-600 text-xs mt-0.5">{time}</p>
      </div>
    </div>
  );
}
