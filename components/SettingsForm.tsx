"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Bell, User, CreditCard, CheckCircle, Chrome, Clock } from "lucide-react";

const sections = [
  { id: "email", label: "Email & Gmail", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function SettingsForm({
  email,
  name,
  summaryEnabled: initSummaryEnabled,
  summaryTime: initSummaryTime,
  tier,
  subscriptionStatus,
  hasSubscription,
}: {
  email: string;
  name: string;
  summaryEnabled: boolean;
  summaryTime: string;
  tier: string;
  subscriptionStatus: string;
  hasSubscription: boolean;
}) {
  const router = useRouter();
  const [active, setActive] = useState<SectionId>("email");
  const [nameVal, setNameVal] = useState(name);
  const [summaryTime, setSummaryTime] = useState(initSummaryTime);
  const [summaryEnabled, setSummaryEnabled] = useState(initSummaryEnabled);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameVal,
        summary_enabled: summaryEnabled,
        summary_time: summaryTime,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the end of the period.")) return;
    setCancelMsg(null);
    const res = await fetch("/api/subscription/cancel", { method: "POST" });
    if (res.ok) {
      setCancelMsg("Subscription cancelled.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setCancelMsg(data.error ?? "Cancel failed");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active === s.id
                    ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                    : "text-gray-500 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {active === "email" && (
            <SettingsSection title="Email & Gmail Integration">
              <div className="space-y-4">
                <div className="bg-[#0d1f10] border border-brand-green/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-green/10 rounded-lg flex items-center justify-center">
                      <Chrome className="w-4 h-4 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{email}</p>
                      <p className="text-xs text-gray-500">Connected via Google OAuth</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-brand-green text-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4">
                  <p className="text-sm font-medium mb-1">Gmail permissions</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Mailwise only reads email metadata (subject, sender, date) to power the daily summary. We never access email content or store your messages.
                  </p>
                </div>
              </div>
            </SettingsSection>
          )}

          {active === "notifications" && (
            <SettingsSection title="Notification Preferences">
              <div className="space-y-5">
                <Toggle
                  label="Daily summary"
                  description="Receive a structured digest email each morning"
                  value={summaryEnabled}
                  onChange={setSummaryEnabled}
                />
                {summaryEnabled && (
                  <div>
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" /> Summary delivery time (UTC)
                    </label>
                    <input
                      type="time"
                      value={summaryTime}
                      onChange={(e) => setSummaryTime(e.target.value)}
                      className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
                    />
                  </div>
                )}
              </div>
            </SettingsSection>
          )}

          {active === "account" && (
            <SettingsSection title="Account Details">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display name</label>
                  <input
                    type="text"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Linked to your Google account.</p>
                </div>
              </div>
            </SettingsSection>
          )}

          {active === "billing" && (
            <SettingsSection title="Billing & Subscription">
              <div className="space-y-4">
                <div className={`rounded-2xl p-4 border ${tier !== "free" ? "bg-[#0d1f10] border-brand-green/20" : "bg-[#111] border-[#1a1a1a]"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold capitalize">{tier} plan</span>
                    <span className={`text-sm font-medium ${subscriptionStatus === "active" ? "text-brand-green" : "text-gray-400"}`}>
                      {subscriptionStatus === "active" ? "Active" : subscriptionStatus}
                    </span>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="block w-full text-center border border-[#2a2a2a] hover:border-brand-green text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {tier === "free" ? "Upgrade plan" : "Change plan"}
                </Link>
                {hasSubscription && subscriptionStatus === "active" && (
                  <button
                    onClick={handleCancel}
                    className="w-full text-center text-red-400 hover:text-red-300 text-sm py-2 transition-colors"
                  >
                    Cancel subscription
                  </button>
                )}
                {cancelMsg && <p className="text-xs text-gray-400 text-center">{cancelMsg}</p>}
              </div>
            </SettingsSection>
          )}

          {active !== "billing" && active !== "email" && (
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-brand-green hover:bg-brand-green-dim text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              {saved && (
                <span className="flex items-center gap-1 text-brand-green text-sm">
                  <CheckCircle className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
      <h2 className="font-semibold text-lg mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-brand-green" : "bg-[#2a2a2a]"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}
