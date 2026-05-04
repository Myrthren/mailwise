import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { cancelSubscription } from "@/lib/paypal";

export async function POST() {
  const user = await requireUser();
  if (!user.paypal_subscription_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  try {
    await cancelSubscription(user.paypal_subscription_id, "User-requested cancellation");
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cancel failed" },
      { status: 502 }
    );
  }

  await supabaseAdmin
    .from("users")
    .update({ subscription_status: "cancelled" })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
