import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const createSchema = z.object({
  type: z.enum(["price", "appointment"]),
  name: z.string().min(1).max(100),
  url: z.string().url(),
  targetPrice: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("watchers")
    .select("*, watcher_runs(id, status, result, ran_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ watchers: data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, tier")
    .eq("email", session.user.email)
    .single();

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { count } = await supabase
    .from("watchers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  const maxWatchers = user.tier === "free" ? 1 : user.tier === "pro" ? 10 : 999;
  if ((count ?? 0) >= maxWatchers) {
    return NextResponse.json(
      { error: `Your plan allows a maximum of ${maxWatchers} active watcher(s). Please upgrade.` },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("watchers")
    .insert({
      user_id: user.id,
      type: parsed.data.type,
      name: parsed.data.name,
      url: parsed.data.url,
      target_price: parsed.data.targetPrice ? parseFloat(parsed.data.targetPrice) : null,
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ watcher: data }, { status: 201 });
}
