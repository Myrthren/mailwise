import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="Mailwise" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-lg">Mailwise</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </header>

        <div className="prose-mailwise space-y-6 text-gray-300 leading-relaxed text-sm">
          {children}
        </div>
      </article>
    </div>
  );
}
