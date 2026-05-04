import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { SupportForm } from "@/components/SupportForm";

export const metadata = {
  title: "Support · Mailwise",
};

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="Mailwise" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-lg">Mailwise</span>
          </Link>
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center">
            <LifeBuoy className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Support</h1>
            <p className="text-gray-500 text-sm">Report an issue or ask a question</p>
          </div>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
          <SupportForm
            defaultName={user?.name ?? ""}
            defaultEmail={user?.email ?? ""}
          />
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          We aim to reply within 24 hours on business days.
        </p>
      </div>
    </div>
  );
}
