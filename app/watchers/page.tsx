import Link from "next/link";
import { Plus, TrendingDown, Calendar, Clock, Pause, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

const mockWatchers = [
  {
    id: "1",
    type: "price" as const,
    title: "Nike Air Max — JD Sports",
    url: "https://jdsports.co.uk/product/...",
    status: "active" as const,
    lastRun: "2 min ago",
    nextRun: "In 13 min",
    result: "£89 (dropped from £120)",
    triggered: true,
    createdAt: "3 days ago",
  },
  {
    id: "2",
    type: "appointment" as const,
    title: "GP Surgery — NHS",
    url: "https://nhs.uk/service-search/...",
    status: "active" as const,
    lastRun: "10 min ago",
    nextRun: "In 5 min",
    result: "Slot available: Tue 14:30",
    triggered: true,
    createdAt: "1 week ago",
  },
  {
    id: "3",
    type: "price" as const,
    title: "Sony WH-1000XM5 — Amazon",
    url: "https://amazon.co.uk/dp/...",
    status: "active" as const,
    lastRun: "5 min ago",
    nextRun: "In 10 min",
    result: "£279 — no change",
    triggered: false,
    createdAt: "2 days ago",
  },
];

export default function WatchersPage() {
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
        {mockWatchers.map((w) => (
          <div
            key={w.id}
            className={`bg-[#111] border rounded-2xl p-5 ${w.triggered ? "border-brand-green/30 bg-[#0d1f10]" : "border-[#1a1a1a]"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${w.type === "price" ? "bg-green-900/30" : "bg-blue-900/30"}`}>
                  {w.type === "price" ? (
                    <TrendingDown className="w-5 h-5 text-green-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold">{w.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      w.type === "price"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-blue-900/30 text-blue-400"
                    }`}>
                      {w.type === "price" ? "Price drop" : "Appointment"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs truncate max-w-xs">{w.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {w.triggered ? (
                  <span className="flex items-center gap-1 text-brand-green text-xs bg-brand-green/10 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" /> Triggered
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <CheckCircle2 className="w-3 h-3" /> No change
                  </span>
                )}
                <button className="p-1.5 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-500 hover:text-white">
                  <Pause className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors text-gray-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 text-xs text-gray-500 border-t border-[#1a1a1a] pt-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Last run: {w.lastRun}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Next: {w.nextRun}
              </span>
              <span className={`ml-auto font-medium ${w.triggered ? "text-brand-green" : ""}`}>
                {w.result}
              </span>
            </div>
          </div>
        ))}

        <Link
          href="/watchers/new"
          className="flex items-center justify-center gap-2 border border-dashed border-[#2a2a2a] hover:border-brand-green text-gray-500 hover:text-brand-green rounded-2xl p-6 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add new watcher
        </Link>
      </div>
    </div>
  );
}
