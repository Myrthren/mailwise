"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardNav() {
  return (
    <header className="h-14 border-b border-[#1a1a1a] bg-[#0d0d0d] flex items-center justify-end px-8 gap-3">
      <Link
        href="/alerts"
        className="relative p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors text-gray-500 hover:text-white"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-green" />
      </Link>
    </header>
  );
}
