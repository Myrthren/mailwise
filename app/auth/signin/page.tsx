"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Chrome } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/icon.png" alt="Mailwise" width={40} height={40} className="rounded-xl" />
            <span className="font-bold text-2xl">Mailwise</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500">
              <span className="bg-[#111] px-2">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-green transition-colors"
            />
            <button
              onClick={() => signIn("credentials", { callbackUrl: "/dashboard" })}
              className="w-full bg-brand-green hover:bg-brand-green-dim text-black font-semibold py-3 rounded-xl transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-brand-green hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
