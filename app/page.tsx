import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Zap,
  Shield,
  TrendingDown,
  Calendar,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="Mailwise" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-xl tracking-tight">Mailwise</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-brand-green hover:bg-brand-green-dim text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#111] border border-[#1a1a1a] text-brand-green text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <Zap className="w-3 h-3" />
            Automation that runs 24/7 in the background
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Your inbox is just
            <br />
            <span className="text-brand-green glow-text">the interface.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Mailwise monitors prices, appointments, and events across the web — then sends real-time alerts and daily summaries straight to your email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dim text-black font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-glow hover:shadow-none"
            >
              Connect your Gmail <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-brand-green text-white px-8 py-4 rounded-xl text-lg transition-colors"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">Free plan available — no credit card required</p>
        </div>
      </section>

      {/* Alert preview */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 shadow-glow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-gray-500 font-mono">Your inbox</span>
            </div>
            <div className="space-y-3">
              <EmailPreview
                icon="🔔"
                from="Mailwise Alerts"
                subject="Price drop detected — Nike Air Max"
                preview="The product you&apos;re watching dropped from £120 to £89. Act fast →"
                time="2 min ago"
                isNew
              />
              <EmailPreview
                icon="📅"
                from="Mailwise Alerts"
                subject="Appointment slot available — GP Surgery"
                preview="A slot opened up for next Tuesday at 10:30am. Book now →"
                time="15 min ago"
                isNew
              />
              <EmailPreview
                icon="📊"
                from="Mailwise Daily"
                subject="Your daily summary — 3 things need attention"
                preview="2 price changes, 1 new appointment slot, 4 important emails..."
                time="8:00 AM"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything automated, nothing missed</h2>
            <p className="text-gray-400 text-lg">Set it up once. Mailwise watches everything so you don&apos;t have to.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<TrendingDown className="w-6 h-6 text-brand-green" />}
              title="Price Drop Watcher"
              description="Paste any product URL and get alerted the moment the price drops. Works with any website."
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6 text-brand-green" />}
              title="Appointment Availability"
              description="Monitor booking pages for your GP, dentist, or any service and get notified when a slot opens."
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 text-brand-green" />}
              title="Smart Email Summaries"
              description="A structured daily digest of what matters — important emails, watcher updates, and action items."
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6 text-brand-green" />}
              title="Real-time Alerts"
              description="Instant email notifications the moment a watcher detects a change. Never miss a window."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-brand-green" />}
              title="AI-Powered Processing"
              description="Emails are summarised intelligently so your digest is always concise and actionable."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-brand-green" />}
              title="Secure Gmail Integration"
              description="Connect via Google OAuth. We only read metadata — we never store your emails."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Up and running in 3 steps</h2>
          </div>
          <div className="space-y-6">
            <Step
              num="01"
              title="Connect your Gmail"
              desc="Securely link your Google account with one click. We use OAuth — no passwords stored."
            />
            <Step
              num="02"
              title="Create your first watcher"
              desc="Paste a product URL or booking page. Set the type and let Mailwise start monitoring."
            />
            <Step
              num="03"
              title="Receive alerts in your inbox"
              desc="Sit back. When something changes, you get an email with all the context to act immediately."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Stop checking. <span className="text-brand-green">Start being notified.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of users who let Mailwise handle the monitoring so they can focus on what matters.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dim text-black font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-glow hover:shadow-none"
          >
            Get started for free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Mailwise" width={20} height={20} className="rounded" />
            <span>© 2026 Mailwise. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmailPreview({
  icon,
  from,
  subject,
  preview,
  time,
  isNew,
}: {
  icon: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isNew?: boolean;
}) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl ${isNew ? "bg-[#0d1f10] border border-brand-green/20" : "bg-[#0d0d0d]"}`}>
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-300">{from}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {time}
          </div>
        </div>
        <p className="text-sm font-medium text-white truncate mt-0.5">{subject}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{preview}</p>
      </div>
      {isNew && <div className="w-2 h-2 rounded-full bg-brand-green mt-1 flex-shrink-0" />}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 hover:border-brand-green/30 transition-colors">
      <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
        <span className="text-brand-green font-mono font-bold text-sm">{num}</span>
      </div>
      <div>
        <h3 className="font-semibold text-xl mb-1">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
