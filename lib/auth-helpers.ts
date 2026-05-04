import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "./supabase";

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  tier: "free" | "basic" | "pro" | "elite";
  subscription_status: string | null;
  paypal_subscription_id: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  const { data } = await supabaseAdmin
    .from("users")
    .select("id, email, name, tier, subscription_status, paypal_subscription_id")
    .eq("email", session.user.email)
    .single();

  return (data as CurrentUser) ?? null;
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");
  return user;
}
