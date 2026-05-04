import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getServerSession } from "next-auth";

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email(),
  category: z.enum(["bug", "billing", "feature", "other"]),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

const SUPPORT_INBOX = "keneamaechina@gmail.com";
const SUPPORT_FROM = "Mailwise Support <onboarding@resend.dev>";

const labels = {
  bug: "Bug report",
  billing: "Billing issue",
  feature: "Feature request",
  other: "Other",
} as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Mail service unavailable" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, category, subject, message } = parsed.data;
  const session = await getServerSession();
  const sessionEmail = session?.user?.email ?? null;
  const ua = req.headers.get("user-agent") ?? "—";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "—";

  const resend = new Resend(apiKey);

  const html = `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;max-width:640px;margin:24px auto;padding:0 16px;color:#111;">
  <h2 style="margin:0 0 8px;">${escapeHtml(labels[category])} — ${escapeHtml(subject)}</h2>
  <p style="color:#555;font-size:13px;margin:0 0 16px;">New support request from Mailwise.</p>

  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
    <tr><td style="padding:6px 0;color:#666;width:120px;">Name</td><td>${escapeHtml(name ?? "—")}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Reply-to email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding:6px 0;color:#666;">Logged in as</td><td>${escapeHtml(sessionEmail ?? "(not signed in)")}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Category</td><td>${escapeHtml(labels[category])}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">User agent</td><td style="font-size:11px;color:#888;">${escapeHtml(ua)}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">IP</td><td style="font-size:11px;color:#888;">${escapeHtml(ip)}</td></tr>
  </table>

  <div style="border-left:3px solid #22c55e;padding:8px 16px;background:#f6f6f6;border-radius:4px;">
    <pre style="white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:14px;margin:0;">${escapeHtml(message)}</pre>
  </div>
</body></html>`.trim();

  try {
    const { error } = await resend.emails.send({
      from: SUPPORT_FROM,
      to: SUPPORT_INBOX,
      replyTo: email,
      subject: `[Mailwise ${labels[category]}] ${subject}`,
      html,
    });
    if (error) {
      console.error("Resend support send error:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 502 });
    }
  } catch (err) {
    console.error("Support send threw:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
