import { google } from "googleapis";

function getOAuthClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/api/auth/callback/google"
  );
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  return oauth2Client;
}

export async function getGmailSummary(
  accessToken: string,
  refreshToken?: string
): Promise<string[]> {
  const auth = getOAuthClient(accessToken, refreshToken);
  const gmail = google.gmail({ version: "v1", auth });

  const yesterday = Math.floor((Date.now() - 86400000) / 1000);

  const { data } = await gmail.users.messages.list({
    userId: "me",
    q: `after:${yesterday} -category:promotions -category:social`,
    maxResults: 20,
  });

  if (!data.messages?.length) return [];

  const summaries = await Promise.all(
    data.messages.map(async (msg) => {
      const { data: detail } = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });

      const headers = detail.payload?.headers ?? [];
      const subject = headers.find((h) => h.name === "Subject")?.value ?? "(No subject)";
      const from = headers.find((h) => h.name === "From")?.value ?? "Unknown";

      return `From: ${from} | Subject: ${subject}`;
    })
  );

  return summaries.filter(Boolean);
}
