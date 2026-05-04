import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

export async function runPriceWatcher(watcher: Watcher): Promise<WatcherResult> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(watcher.url, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Generic price extraction selectors — covers most retail sites
  const priceSelectors = [
    '[data-testid="price"]',
    ".a-price-whole",         // Amazon
    ".product-price",
    ".price__current",
    '[class*="price"]',
    '[itemprop="price"]',
    'meta[itemprop="price"]',
  ];

  let priceText = "";
  for (const sel of priceSelectors) {
    const el = page.locator(sel).first();
    if (await el.count() > 0) {
      const content = await el.getAttribute("content");
      priceText = content ?? (await el.innerText());
      if (priceText) break;
    }
  }

  await browser.close();

  const priceMatch = priceText.match(/[\d,]+\.?\d*/);
  if (!priceMatch) {
    return {
      triggered: false,
      message: "Could not extract price from page",
      data: { raw: priceText },
    };
  }

  const currentPrice = parseFloat(priceMatch[0].replace(",", ""));
  const previousPrice = watcher.last_value ? parseFloat(watcher.last_value) : null;

  // Store new price
  await supabase
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
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(watcher.url, { waitUntil: "domcontentloaded", timeout: 30000 });

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

  const pageText = (await page.innerText("body")).toLowerCase();
  await browser.close();

  const hasAvailable = availabilityKeywords.some((kw) => pageText.includes(kw));
  const hasUnavailable = unavailableKeywords.some((kw) => pageText.includes(kw));

  const previousState = watcher.last_value;
  const currentState = hasAvailable && !hasUnavailable ? "available" : "unavailable";

  await supabase
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
