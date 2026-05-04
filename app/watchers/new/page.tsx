"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingDown, Calendar, ArrowLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";

const watcherTypes = [
  {
    id: "price",
    icon: <TrendingDown className="w-6 h-6" />,
    title: "Price Drop Watcher",
    description: "Get alerted when a product drops below your target price on any website.",
    placeholder: "https://amazon.co.uk/product/...",
    hint: "Works with Amazon, eBay, JD Sports, Nike, ASOS, and most retail sites.",
  },
  {
    id: "appointment",
    icon: <Calendar className="w-6 h-6" />,
    title: "Appointment Availability",
    description: "Monitor booking pages for GP, dentist, DMV, or any service.",
    placeholder: "https://nhs.uk/service-search/...",
    hint: "Works with NHS booking pages, local council portals, and most appointment systems.",
  },
];

export default function NewWatcherPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "details" | "confirm">("type");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = watcherTypes.find((t) => t.id === selectedType);

  async function handleCreate() {
    if (!url || !name) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/watchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          name,
          url,
          targetPrice: selectedType === "price" ? targetPrice : undefined,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      router.push("/watchers?created=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/watchers" className="p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors text-gray-500 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New watcher</h1>
          <p className="text-gray-500 text-sm">Set up automated monitoring in seconds</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {["Type", "Details", "Confirm"].map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-colors ${
              i < (step === "type" ? 1 : step === "details" ? 2 : 3)
                ? "bg-brand-green"
                : "bg-[#2a2a2a]"
            }`} />
            <p className={`text-xs mt-2 ${
              i < (step === "type" ? 1 : step === "details" ? 2 : 3)
                ? "text-brand-green"
                : "text-gray-600"
            }`}>{s}</p>
          </div>
        ))}
      </div>

      {/* Step 1: Type */}
      {step === "type" && (
        <div>
          <h2 className="font-semibold text-lg mb-4">What do you want to monitor?</h2>
          <div className="space-y-3">
            {watcherTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`w-full text-left bg-[#111] border rounded-2xl p-5 transition-all ${
                  selectedType === t.id
                    ? "border-brand-green bg-[#0d1f10] shadow-glow-sm"
                    : "border-[#1a1a1a] hover:border-[#2a2a2a]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    selectedType === t.id ? "bg-brand-green/20 text-brand-green" : "bg-[#1a1a1a] text-gray-500"
                  }`}>
                    {t.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => selectedType && setStep("details")}
            disabled={!selectedType}
            className="w-full mt-6 bg-brand-green hover:bg-brand-green-dim disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === "details" && selected && (
        <div>
          <h2 className="font-semibold text-lg mb-4">Configure your {selected.title}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Watcher name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nike Air Max deal"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Page URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={selected.placeholder}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
              />
              <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {selected.hint}
              </div>
            </div>

            {selectedType === "price" && (
              <div>
                <label className="block text-sm font-medium mb-2">Target price (optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">£</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 89.99"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave blank to alert on any price drop.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep("type")}
              className="flex-1 border border-[#2a2a2a] hover:border-[#3a3a3a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => url && name && setStep("confirm")}
              disabled={!url || !name}
              className="flex-1 bg-brand-green hover:bg-brand-green-dim disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === "confirm" && selected && (
        <div>
          <h2 className="font-semibold text-lg mb-4">Review and launch</h2>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 mb-6 space-y-4">
            <Row label="Type" value={selected.title} />
            <Row label="Name" value={name} />
            <Row label="URL" value={url} truncate />
            {targetPrice && <Row label="Target price" value={`£${targetPrice}`} />}
            <Row label="Check frequency" value="Every 15 minutes" />
            <Row label="Alert method" value="Email" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep("details")}
              className="flex-1 border border-[#2a2a2a] hover:border-[#3a3a3a] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 bg-brand-green hover:bg-brand-green-dim disabled:opacity-60 text-black font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Launch watcher"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-right ${truncate ? "truncate max-w-[250px]" : ""}`}>{value}</span>
    </div>
  );
}
