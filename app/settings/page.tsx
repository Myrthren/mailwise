import { requireUser } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { SettingsForm } from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  const { data: full } = await supabaseAdmin
    .from("users")
    .select("name, summary_enabled, summary_time, tier, subscription_status, paypal_subscription_id")
    .eq("id", user.id)
    .single();

  return (
    <SettingsForm
      email={user.email}
      name={full?.name ?? ""}
      summaryEnabled={full?.summary_enabled ?? true}
      summaryTime={(full?.summary_time as string | null)?.slice(0, 5) ?? "08:00"}
      tier={full?.tier ?? "free"}
      subscriptionStatus={full?.subscription_status ?? "inactive"}
      hasSubscription={!!full?.paypal_subscription_id}
    />
  );
}
