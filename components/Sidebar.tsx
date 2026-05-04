"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Eye,
  Bell,
  Settings,
  CreditCard,
  LifeBuoy,
  LogOut,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchers", label: "Watchers", icon: Eye },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/pricing", label: "Upgrade", icon: CreditCard },
  { href: "/support", label: "Support", icon: LifeBuoy },
];

export default function Sidebar({
  userName,
  userEmail,
  tier,
  alertCount,
}: {
  userName: string;
  userEmail: string;
  tier: string;
  alertCount: number;
}) {
  const pathname = usePathname();
  const initial = (userName || userEmail || "U").trim().charAt(0).toUpperCase();
  const displayName = userName || userEmail.split("@")[0] || "Account";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col z-40">
      <div className="p-5 border-b border-[#1a1a1a]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/icon.png" alt="Mailwise" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-lg">Mailwise</span>
        </Link>
      </div>

      <div className="p-4">
        <Link
          href="/watchers/new"
          className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dim text-black font-semibold text-sm py-2.5 rounded-xl transition-colors w-full shadow-glow-sm"
        >
          <Plus className="w-4 h-4" /> New watcher
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                  : "text-gray-500 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {href === "/alerts" && alertCount > 0 && (
                <span className="ml-auto bg-brand-green text-black text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                  {alertCount > 99 ? "99+" : alertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green text-sm font-bold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-gray-500 capitalize">{tier} plan</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-xs transition-colors w-full"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
