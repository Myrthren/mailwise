import { supabaseAdmin } from "./supabase";

interface WatcherResult {
  triggered: boolean;
  message: string;
  data: Record<string, unknown>;
}

interface Watcher {
  id: string;
  url: string;
  name: string;
  target_price?: number | null;
  last_value?: string | null;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-GB,en;q=0.9",
    },
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return await res.text();
}

function extractPrice(html: string): number | null {
  // Try common structured-data patterns first
  const patterns: RegExp[] = [
    /<meta[^>]+itemprop=["']price["'][^>]+content=["']([\d.,]+)["']/i,
    /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([\d.,]+)["']/i,
    /"price"\s*:\s*"?([\d.,]+)"?/i,
    /"priceCurrency"\s*:\s*"[^"]+"\s*,\s*"price"\s*:\s*"?([\d.,]+)"?/i,
    /[£$€]\s?([\d]{1,3}(?:[,.][\d]{3})*(?:[.,]\d{1,2})?)/, // currency-prefixed number
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) {
      const n = parseFloat(m[1].replace(/,(?=\d{3}\b)/g, "").replace(",", "."));
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return null;
}

export async function runPriceWatcher(watcher: Watcher): Promise<WatcherResult> {
  const html = await fetchHtml(watcher.url);
  const currentPrice = extractPrice(html);

  if (currentPrice === null) {
    return {
      triggered: false,
      message: "Could not extract price from page",
      data: {},
    };
  }

  const previousPrice = watcher.last_value ? parseFloat(watcher.last_value) : null;

  await supabaseAdmin
    .from("watchers")
    .update({ last_value: String(currentPrice) })
    .eq("id", watcher.id);

  if (previousPrice === null) {
    return {
      triggered: false,
      message: `Initial price recorded: £${currentPrice.toFixed(2)}`,
      data: { currentPrice },
    };
  }

  const dropped = currentPrice < previousPrice;
  const belowTarget = watcher.target_price ? currentPrice <= watcher.target_price : false;
  const triggered = dropped || belowTarget;

  return {
    triggered,
    message: triggered
      ? `Price dropped from £${previousPrice.toFixed(2)} to £${currentPrice.toFixed(2)} for "${watcher.name}"`
      : `Price unchanged at £${currentPrice.toFixed(2)}`,
    data: { currentPrice, previousPrice, dropped, belowTarget },
  };
}

export async function runAppointmentWatcher(watcher: Watcher): Promise<WatcherResult> {
  const html = await fetchHtml(watcher.url);
  // Strip tags to get rough page text
  const pageText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const availabilityKeywords = [
    "available",
    "book now",
    "select a time",
    "appointments available",
    "choose a date",
    "next available",
    "slot available",
  ];
  const unavailableKeywords = [
    "no appointments",
    "no availability",
    "fully booked",
    "no slots",
    "unavailable",
    "please try again later",
  ];

  const hasAvailable = availabilityKeywords.some((kw) => pageText.includes(kw));
  const hasUnavailable = unavailableKeywords.some((kw) => pageText.includes(kw));

  const previousState = watcher.last_value;
  const currentState = hasAvailable && !hasUnavailable ? "available" : "unavailable";

  await supabaseAdmin
    .from("watchers")
    .update({ last_value: currentState })
    .eq("id", watcher.id);

  const triggered = currentState === "available" && previousState !== "available";

  return {
    triggered,
    message: triggered
      ? `Appointment slot detected for "${watcher.name}" — book now!`
      : currentState === "available"
      ? "Slots still available"
      : "No appointment slots available",
    data: { currentState, previousState },
  };
}
