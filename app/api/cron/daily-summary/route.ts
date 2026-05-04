import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getGmailSummary } from "@/lib/gmail";
import { generateSummary } from "@/lib/ai";
import { sendSummaryEmail } from "@/lib/mailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, name, google_access_token, google_refresh_token, summary_time")
    .eq("summary_enabled", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = await Promise.allSettled(
    (users ?? []).map(async (user) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Get alerts from the last 24h
      const { data: alerts } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .gte("sent_at", yesterday.toISOString());

      // Get watcher runs from last 24h
      const { data: runs } = await supabase
        .from("watcher_runs")
        .select("*, watchers(name, type)")
        .eq("watchers.user_id", user.id)
        .gte("ran_at", yesterday.toISOString());

      // Get Gmail summary if connected
      let emailSummary: string[] = [];
      if (user.google_access_token) {
        try {
          emailSummary = await getGmailSummary(
            user.google_access_token,
            user.google_refresh_token
          );
        } catch {
          // Gmail error — proceed without
        }
      }

      const summary = await generateSummary({
        userName: user.name,
        alerts: alerts ?? [],
        watcherRuns: runs ?? [],
        emailSummary,
      });

      await sendSummaryEmail({
        to: user.email,
        userName: user.name,
        summary,
        alerts: alerts ?? [],
        emailSummary,
      });

      return { userId: user.id };
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ sent, timestamp: new Date().toISOString() });
}
