import Link from "next/link";
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

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Your automation overview</p>
        </div>
        <Link
          href="/watchers/new"
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-dim text-black font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-glow-sm"
        >
          <Plus className="w-4 h-4" /> New watcher
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active watchers" value="3" icon={<Activity className="w-4 h-4" />} />
        <StatCard label="Alerts today" value="7" icon={<Bell className="w-4 h-4" />} />
        <StatCard label="Emails summarised" value="24" icon={<Mail className="w-4 h-4" />} />
        <StatCard label="Last summary" value="8:00 AM" icon={<Clock className="w-4 h-4" />} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Watchers */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Your watchers</h2>
            <Link href="/watchers" className="text-sm text-brand-green hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <WatcherCard
            type="price"
            title="Nike Air Max — JD Sports"
            url="https://jdsports.co.uk/..."
            status="active"
            lastRun="2 min ago"
            result="£89 (was £120)"
            triggered
          />
          <WatcherCard
            type="appointment"
            title="GP Surgery — NHS"
            url="https://nhs.uk/..."
            status="active"
            lastRun="10 min ago"
            result="Slot found: Tue 14:30"
            triggered
          />
          <WatcherCard
            type="price"
            title="Sony WH-1000XM5 — Amazon"
            url="https://amazon.co.uk/..."
            status="active"
            lastRun="5 min ago"
            result="£279 — no change"
          />

          <Link
            href="/watchers/new"
            className="flex items-center justify-center gap-2 border border-dashed border-[#2a2a2a] hover:border-brand-green text-gray-500 hover:text-brand-green rounded-2xl p-6 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add new watcher
          </Link>
        </div>

        {/* Alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent alerts</h2>
          </div>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4 space-y-3">
            <AlertItem
              icon="💰"
              message="Nike Air Max price dropped to £89"
              time="2 min ago"
            />
            <AlertItem
              icon="📅"
              message="GP appointment slot available"
              time="15 min ago"
            />
            <AlertItem
              icon="📊"
              message="Daily summary sent"
              time="8:00 AM"
            />
            <AlertItem
              icon="💰"
              message="Xbox Series X — no change"
              time="Yesterday"
            />
          </div>
        </div>
      </div>

      {/* Connect Gmail banner (shown if not connected) */}
      <div className="mt-8 bg-[#0d1f10] border border-brand-green/20 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <p className="font-semibold text-sm">Connect your Gmail to receive alerts</p>
            <p className="text-gray-500 text-xs">Mailwise will send alerts and summaries directly to your inbox.</p>
          </div>
        </div>
        <Link
          href="/settings/email"
          className="bg-brand-green hover:bg-brand-green-dim text-black font-semibold text-sm px-4 py-2 rounded-xl whitespace-nowrap transition-colors"
        >
          Connect Gmail
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4">
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function WatcherCard({
  type,
  title,
  url,
  status,
  lastRun,
  result,
  triggered,
}: {
  type: "price" | "appointment";
  title: string;
  url: string;
  status: "active" | "paused" | "error";
  lastRun: string;
  result: string;
  triggered?: boolean;
}) {
  return (
    <div className={`bg-[#111] border rounded-2xl p-4 ${triggered ? "border-brand-green/30 bg-[#0d1f10]" : "border-[#1a1a1a]"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${type === "price" ? "bg-green-900/30" : "bg-blue-900/30"}`}>
            {type === "price" ? (
              <TrendingDown className="w-4 h-4 text-green-400" />
            ) : (
              <Calendar className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-gray-600 text-xs truncate max-w-[200px]">{url}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {status === "active" && triggered && (
            <span className="flex items-center gap-1 text-brand-green text-xs">
              <AlertCircle className="w-3 h-3" /> Triggered
            </span>
          )}
          {status === "active" && !triggered && (
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <CheckCircle2 className="w-3 h-3" /> OK
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {lastRun}
        </span>
        <span className={triggered ? "text-brand-green font-medium" : ""}>{result}</span>
      </div>
    </div>
  );
}

function AlertItem({
  icon,
  message,
  time,
}: {
  icon: string;
  message: string;
  time: string;
}) {
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
