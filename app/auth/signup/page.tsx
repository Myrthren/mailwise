"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Chrome, CheckCircle } from "lucide-react";

const perks = [
  "Free plan — no credit card needed",
  "1 watcher + daily email summaries",
  "Real-time alerts when things change",
  "Set up in under 2 minutes",
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Image src="/icon.png" alt="Mailwise" width={36} height={36} className="rounded-xl" />
            <span className="font-bold text-xl">Mailwise</span>
          </Link>
          <h1 className="text-3xl font-bold mb-4">
            Your inbox,{" "}
            <span className="text-brand-green">automated.</span>
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Connect your Gmail and let Mailwise monitor prices, appointments, and events — sending alerts when they matter.
          </p>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Create your free account</h2>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              Sign up with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2a2a]" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-500">
                <span className="bg-[#111] px-2">or sign up with email</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full name"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
              />
              <input
                type="password"
                placeholder="Create password"
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
              />
              <button className="w-full bg-brand-green hover:bg-brand-green-dim text-black font-semibold py-3 rounded-xl transition-colors">
                Create free account
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-brand-green hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-green hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-brand-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
