"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Zap } from "lucide-react";

const PAYPAL_CLIENT_ID =
  "Ad69aCRO915AbyIBrcdwElMCyPEnbzRbByPb5vr2tD6RlOG8JNC8S34-8GCgNHG4PaDm2FVdWbFnx_m8";

const plans = {
  monthly: [
    {
      name: "Basic",
      price: "£4.99",
      planId: "P-8L651216LM277770JNH36EPQ",
      containerId: "paypal-basic-monthly",
      features: ["1 email account", "1 watcher", "Daily summary", "Up to 5 alerts/day"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "£12.99",
      planId: "P-9S46940070315343BNH36FHY",
      containerId: "paypal-pro-monthly",
      features: [
        "Unlimited email accounts",
        "Up to 10 watchers",
        "Real-time alerts",
        "Faster refresh (5 min)",
        "Priority processing",
        "AI summaries",
      ],
      highlight: true,
    },
    {
      name: "Elite",
      price: "£24.99",
      planId: "P-1T142263824632937NH36FZA",
      containerId: "paypal-elite-monthly",
      features: [
        "Everything in Pro",
        "Unlimited watchers",
        "Automation rules (coming soon)",
        "Auto-actions (coming soon)",
        "WhatsApp alerts (coming soon)",
        "API access",
      ],
      highlight: false,
    },
  ],
  yearly: [
    {
      name: "Basic",
      price: "£47.99",
      planId: "P-6AV22358XK931851TNH36F7Y",
      containerId: "paypal-basic-yearly",
      features: ["1 email account", "1 watcher", "Daily summary", "Up to 5 alerts/day"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "£119.99",
      planId: "P-58T758988J9184355NH36GKI",
      containerId: "paypal-pro-yearly",
      features: [
        "Unlimited email accounts",
        "Up to 10 watchers",
        "Real-time alerts",
        "Faster refresh (5 min)",
        "Priority processing",
        "AI summaries",
      ],
      highlight: true,
    },
    {
      name: "Elite",
      price: "£239.99",
      planId: "P-3JK8714219541574NNH36GXQ",
      containerId: "paypal-elite-yearly",
      features: [
        "Everything in Pro",
        "Unlimited watchers",
        "Automation rules (coming soon)",
        "Auto-actions (coming soon)",
        "WhatsApp alerts (coming soon)",
        "API access",
      ],
      highlight: false,
    },
  ],
};

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="Mailwise" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-lg">Mailwise</span>
          </Link>
          <Link href="/auth/signup" className="bg-brand-green hover:bg-brand-green-dim text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            Get started free
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-lg mb-8">Start free, upgrade when you need more</p>

          {/* Toggle */}
          <div className="inline-flex bg-[#111] border border-[#1a1a1a] rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-brand-green text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                billing === "yearly" ? "bg-brand-green text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="bg-brand-green/20 text-brand-green text-xs px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Free */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="font-bold text-xl mb-1">Free</h3>
              <div className="text-3xl font-bold mb-1">£0</div>
              <p className="text-gray-500 text-sm">Forever free</p>
            </div>
            <ul className="space-y-3 mb-6 text-sm">
              {["1 email account", "1 watcher", "Daily summary only", "Limited alerts"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full text-center border border-[#2a2a2a] hover:border-brand-green text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Get started free
            </Link>
          </div>

          {plans[billing].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 relative ${
                plan.highlight
                  ? "bg-[#0d1f10] border border-brand-green/40 shadow-glow"
                  : "bg-[#111] border border-[#1a1a1a]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <div className="text-3xl font-bold mb-1">
                  {plan.price}
                  <span className="text-base font-normal text-gray-400">
                    /{billing === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <PayPalSubscribeButton
                planId={plan.planId}
                containerId={plan.containerId}
                clientId={PAYPAL_CLIENT_ID}
                highlight={plan.highlight}
              />
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

function PayPalSubscribeButton({
  planId,
  containerId,
  clientId,
  highlight,
}: {
  planId: string;
  containerId: string;
  clientId: string;
  highlight: boolean;
}) {
  return (
    <div>
      <div id={containerId} className="min-h-[45px]" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (window.__ppLoaded_${containerId}) return;
              window.__ppLoaded_${containerId} = true;
              var s = document.createElement('script');
              s.src = 'https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription';
              s.setAttribute('data-sdk-integration-source', 'button-factory');
              s.onload = function() {
                paypal.Buttons({
                  style: {
                    shape: 'rect',
                    color: '${highlight ? "gold" : "black"}',
                    layout: 'vertical',
                    label: 'subscribe'
                  },
                  createSubscription: function(data, actions) {
                    return actions.subscription.create({ plan_id: '${planId}' });
                  },
                  onApprove: function(data) {
                    window.location.href = '/dashboard?subscribed=' + data.subscriptionID;
                  }
                }).render('#${containerId}');
              };
              document.head.appendChild(s);
            })();
          `,
        }}
      />
    </div>
  );
}
