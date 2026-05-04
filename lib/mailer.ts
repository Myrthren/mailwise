import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mailwise <alerts@mailwise.app>";

interface AlertEmailParams {
  to: string;
  watcherName: string;
  watcherType: "price" | "appointment";
  message: string;
  url: string;
}

export async function sendAlertEmail(params: AlertEmailParams) {
  const { to, watcherName, watcherType, message, url } = params;
  const emoji = watcherType === "price" ? "💰" : "📅";
  const subject = watcherType === "price"
    ? `${emoji} Price drop detected — ${watcherName}`
    : `${emoji} Appointment slot available — ${watcherName}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <div style="max-width:580px;margin:40px auto;padding:20px;">
    <div style="background:#111;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
        <span style="font-size:28px;">${emoji}</span>
        <span style="font-weight:700;font-size:20px;color:#fff;">Mailwise Alert</span>
      </div>

      <div style="background:#0d1f10;border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#22c55e;font-weight:600;font-size:16px;margin:0 0 8px;">${message}</p>
        <p style="color:#6b7280;font-size:13px;margin:0;">Watcher: ${watcherName}</p>
      </div>

      <a href="${url}" style="display:block;background:#22c55e;color:#000;font-weight:700;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-size:15px;margin-bottom:24px;">
        ${watcherType === "price" ? "Buy now →" : "Book now →"}
      </a>

      <p style="color:#4b5563;font-size:12px;margin:0;">
        You're receiving this because you set up a watcher on Mailwise.
        <a href="${process.env.NEXTAUTH_URL}/settings" style="color:#22c55e;">Manage watchers</a>
      </p>
    </div>
    <p style="text-align:center;color:#374151;font-size:12px;margin-top:16px;">
      © 2026 Mailwise · <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color:#6b7280;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>
    `.trim(),
  });
}

interface SummaryEmailParams {
  to: string;
  userName: string;
  summary: string;
  alerts: Array<{ type: string; message: string }>;
  emailSummary: string[];
}

export async function sendSummaryEmail(params: SummaryEmailParams) {
  const { to, userName, summary, alerts, emailSummary } = params;
  const firstName = userName?.split(" ")[0] ?? "there";

  await resend.emails.send({
    from: FROM,
    to,
    subject: `📊 Your Mailwise daily summary — ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <div style="max-width:580px;margin:40px auto;padding:20px;">
    <div style="background:#111;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">
      <p style="color:#22c55e;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Daily Summary</p>
      <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 24px;">Good morning, ${firstName} 👋</h1>

      ${summary ? `
      <div style="background:#0a0a0a;border-radius:10px;padding:16px;margin-bottom:24px;">
        <p style="color:#d1d5db;font-size:14px;line-height:1.6;margin:0;">${summary}</p>
      </div>
      ` : ""}

      ${alerts.length > 0 ? `
      <div style="margin-bottom:24px;">
        <p style="color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Watcher alerts (${alerts.length})</p>
        ${alerts.map((a) => `
          <div style="background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:12px;margin-bottom:8px;">
            <p style="color:#f3f4f6;font-size:13px;margin:0;">${a.type === "price" ? "💰" : "📅"} ${a.message}</p>
          </div>
        `).join("")}
      </div>
      ` : ""}

      ${emailSummary.length > 0 ? `
      <div style="margin-bottom:24px;">
        <p style="color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Email highlights (${emailSummary.length})</p>
        ${emailSummary.slice(0, 5).map((e) => `
          <div style="border-left:2px solid #22c55e;padding:8px 12px;margin-bottom:6px;">
            <p style="color:#d1d5db;font-size:12px;margin:0;">${e}</p>
          </div>
        `).join("")}
      </div>
      ` : ""}

      <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display:block;background:#22c55e;color:#000;font-weight:700;text-align:center;padding:12px;border-radius:10px;text-decoration:none;font-size:14px;">
        Open dashboard →
      </a>
    </div>
    <p style="text-align:center;color:#374151;font-size:12px;margin-top:16px;">
      © 2026 Mailwise · <a href="${process.env.NEXTAUTH_URL}/settings" style="color:#6b7280;">Manage notifications</a>
    </p>
  </div>
</body>
</html>
    `.trim(),
  });
}
