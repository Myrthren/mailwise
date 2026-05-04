import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPayPalWebhook } from "@/lib/paypal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_TIER_MAP: Record<string, string> = {
  "P-8L651216LM277770JNH36EPQ": "basic",
  "P-9S46940070315343BNH36FHY": "pro",
  "P-1T142263824632937NH36FZA": "elite",
  "P-6AV22358XK931851TNH36F7Y": "basic",
  "P-58T758988J9184355NH36GKI": "pro",
  "P-3JK8714219541574NNH36GXQ": "elite",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());

  const isValid = await verifyPayPalWebhook(body, headers);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType: string = event.event_type;

  if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
    const planId: string = event.resource?.plan_id;
    const subscriptionId: string = event.resource?.id;
    const subscriberEmail: string = event.resource?.subscriber?.email_address;

    const tier = PLAN_TIER_MAP[planId] ?? "free";

    await supabase
      .from("users")
      .update({
        tier,
        paypal_subscription_id: subscriptionId,
        subscription_status: "active",
      })
      .eq("email", subscriberEmail);
  }

  if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
    const subscriptionId: string = event.resource?.id;

    await supabase
      .from("users")
      .update({ tier: "free", subscription_status: "cancelled" })
      .eq("paypal_subscription_id", subscriptionId);
  }

  return NextResponse.json({ received: true });
}
