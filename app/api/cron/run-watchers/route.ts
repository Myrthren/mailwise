import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runPriceWatcher, runAppointmentWatcher } from "@/lib/scraper";
import { sendAlertEmail } from "@/lib/mailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: watchers, error } = await supabase
    .from("watchers")
    .select("*, users(email, name)")
    .eq("status", "active");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = await Promise.allSettled(
    (watchers ?? []).map(async (watcher) => {
      try {
        let result: { triggered: boolean; message: string; data: Record<string, unknown> };

        if (watcher.type === "price") {
          result = await runPriceWatcher(watcher);
        } else {
          result = await runAppointmentWatcher(watcher);
        }

        await supabase.from("watcher_runs").insert({
          watcher_id: watcher.id,
          status: result.triggered ? "triggered" : "ok",
          result: result.message,
          ran_at: new Date().toISOString(),
        });

        if (result.triggered && watcher.users?.email) {
          await sendAlertEmail({
            to: watcher.users.email,
            watcherName: watcher.name,
            watcherType: watcher.type,
            message: result.message,
            url: watcher.url,
          });

          await supabase.from("alerts").insert({
            user_id: watcher.user_id,
            watcher_id: watcher.id,
            type: watcher.type,
            message: result.message,
            sent_at: new Date().toISOString(),
          });
        }

        return { id: watcher.id, triggered: result.triggered };
      } catch (err) {
        await supabase.from("watcher_runs").insert({
          watcher_id: watcher.id,
          status: "error",
          result: err instanceof Error ? err.message : "Unknown error",
          ran_at: new Date().toISOString(),
        });
        throw err;
      }
    })
  );

  const triggered = results.filter(
    (r) => r.status === "fulfilled" && r.value.triggered
  ).length;

  return NextResponse.json({
    processed: watchers?.length ?? 0,
    triggered,
    timestamp: new Date().toISOString(),
  });
}
