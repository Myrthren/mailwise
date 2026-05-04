"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play, Trash2 } from "lucide-react";

export function WatcherActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setError(null);
    const next = status === "active" ? "paused" : "active";
    const res = await fetch(`/api/watchers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setError("Failed");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function remove() {
    if (!confirm("Delete this watcher? This cannot be undone.")) return;
    setError(null);
    const res = await fetch(`/api/watchers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-1" aria-busy={pending}>
      <button
        onClick={toggle}
        disabled={pending}
        title={status === "active" ? "Pause" : "Resume"}
        className="p-1.5 hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-500 hover:text-white disabled:opacity-50"
      >
        {status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <button
        onClick={remove}
        disabled={pending}
        title="Delete"
        className="p-1.5 hover:bg-red-900/20 rounded-lg transition-colors text-gray-500 hover:text-red-400 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      {error && <span className="text-red-400 text-xs ml-1">{error}</span>}
    </div>
  );
}
