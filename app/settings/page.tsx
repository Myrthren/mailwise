"use client";

import { useState } from "react";
import { Mail, Bell, User, CreditCard, Shield, CheckCircle, Chrome, Clock } from "lucide-react";

const sections = [
  { id: "email", label: "Email & Gmail", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [active, setActive] = useState("email");
  const [summaryTime, setSummaryTime] = useState("08:00");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [summaryEnabled, setSummaryEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
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

        {/* Content */}
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
                      <p className="text-sm font-medium">user@gmail.com</p>
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

                <div>
                  <label className="block text-sm font-medium mb-2">Alert delivery email</label>
                  <input
                    type="email"
                    defaultValue="user@gmail.com"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Where we send watcher alerts and daily summaries.</p>
                </div>
              </div>
            </SettingsSection>
          )}

          {active === "notifications" && (
            <SettingsSection title="Notification Preferences">
              <div className="space-y-5">
                <Toggle
                  label="Email alerts"
                  description="Receive real-time emails when a watcher triggers"
                  value={emailAlerts}
                  onChange={setEmailAlerts}
                />
                <Toggle
                  label="Daily summary"
                  description="Receive a structured digest email each morning"
                  value={summaryEnabled}
                  onChange={setSummaryEnabled}
                />
                {summaryEnabled && (
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" /> Summary delivery time
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last name</label>
                    <input
                      type="text"
                      defaultValue="Smith"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="user@gmail.com"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
              </div>
            </SettingsSection>
          )}

          {active === "billing" && (
            <SettingsSection title="Billing & Subscription">
              <div className="space-y-4">
                <div className="bg-[#0d1f10] border border-brand-green/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Pro Plan</span>
                    <span className="text-brand-green text-sm font-medium">Active</span>
                  </div>
                  <p className="text-gray-400 text-sm">£12.99/month · Renews 15 Jun 2026</p>
                </div>
                <a
                  href="/pricing"
                  className="block w-full text-center border border-[#2a2a2a] hover:border-brand-green text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Change plan
                </a>
                <button className="w-full text-center text-red-400 hover:text-red-300 text-sm py-2 transition-colors">
                  Cancel subscription
                </button>
              </div>
            </SettingsSection>
          )}

          {active === "security" && (
            <SettingsSection title="Security">
              <div className="space-y-4">
                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-4">
                  <p className="text-sm font-medium mb-1">Change password</p>
                  <div className="space-y-3 mt-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                    />
                  </div>
                  <button className="mt-3 text-sm text-brand-green hover:underline">Update password</button>
                </div>

                <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-4">
                  <p className="text-sm font-medium text-red-400 mb-1">Danger zone</p>
                  <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all data.</p>
                  <button className="text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-4 py-2 rounded-xl transition-colors">
                    Delete account
                  </button>
                </div>
              </div>
            </SettingsSection>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-brand-green hover:bg-brand-green-dim text-black font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Save changes
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-brand-green text-sm">
                <CheckCircle className="w-4 h-4" /> Saved
              </span>
            )}
          </div>
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
