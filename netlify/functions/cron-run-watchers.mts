import type { Config } from "@netlify/functions";

export default async () => {
  const url = `${process.env.URL ?? "https://mailwise.space"}/api/cron/run-watchers`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  const body = await res.text();
  console.log("run-watchers cron:", res.status, body.slice(0, 500));
  return new Response(null, { status: 204 });
};

export const config: Config = {
  // Run every 15 minutes
  schedule: "*/15 * * * *",
};
