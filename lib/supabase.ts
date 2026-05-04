import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Build-time stub: returns a no-op client. Runtime will have real envs.
    _supabase = createClient("https://placeholder.supabase.co", "placeholder-key");
    return _supabase;
  }
  _supabase = createClient(url, key);
  return _supabase;
}

function getAdminClient(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    _supabaseAdmin = createClient("https://placeholder.supabase.co", "placeholder-key");
    return _supabaseAdmin;
  }
  _supabaseAdmin = createClient(url, key);
  return _supabaseAdmin;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>;
    return client[prop];
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    const client = getAdminClient() as unknown as Record<string | symbol, unknown>;
    return client[prop];
  },
});
