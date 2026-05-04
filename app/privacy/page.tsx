import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy · Mailwise",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="4 May 2026">
      <p>
        This Privacy Policy explains what information Mailwise (&quot;we&quot;,
        &quot;us&quot;) collects when you use the Service, why we collect it, and how we
        protect it. We aim to collect only what we need to run the Service and never sell
        your personal data.
      </p>

      <Section title="1. Information we collect">
        <p>We collect three categories of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium text-white">Account information.</span> Your
            email address, name, and profile picture from Google when you sign in. We do
            not store passwords for Google accounts.
          </li>
          <li>
            <span className="font-medium text-white">Service data.</span> The watchers you
            configure (URLs, names, target prices), the results of those watchers, the
            alerts we send you, and your notification preferences.
          </li>
          <li>
            <span className="font-medium text-white">Email metadata.</span> If you grant
            Gmail access, we read message metadata (sender, subject, snippet, date) to
            generate your daily summary. We do not store full message bodies and we do
            not access attachments.
          </li>
          <li>
            <span className="font-medium text-white">Billing information.</span> When you
            subscribe, PayPal handles your payment details. We receive a subscription
            identifier and status from PayPal — we never receive or store your card
            number.
          </li>
          <li>
            <span className="font-medium text-white">Technical information.</span> Limited
            request metadata (IP address, user agent, timestamps) for security, abuse
            prevention, and debugging. The support form also captures this when you
            contact us.
          </li>
        </ul>
      </Section>

      <Section title="2. How we use information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Authenticate you and operate your account.</li>
          <li>Run your watchers, deliver alerts, and produce daily summary emails.</li>
          <li>Process subscriptions and prevent fraud.</li>
          <li>Reply to support requests.</li>
          <li>Maintain the security and reliability of the Service.</li>
          <li>Comply with our legal obligations.</li>
        </ul>
        <p>
          We do not sell personal data, and we do not use your email content for
          advertising or to train AI models.
        </p>
      </Section>

      <Section title="3. Sub-processors">
        <p>
          To run the Service, we share limited information with the following providers,
          each of which is contractually obliged to handle the data in line with this
          policy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium text-white">Google</span> — sign-in and Gmail
            metadata access.
          </li>
          <li>
            <span className="font-medium text-white">Supabase</span> — primary database
            and authentication storage.
          </li>
          <li>
            <span className="font-medium text-white">Resend</span> — delivery of alert,
            summary, and support emails.
          </li>
          <li>
            <span className="font-medium text-white">OpenAI</span> — generating short
            natural-language summaries from your alerts and email metadata.
          </li>
          <li>
            <span className="font-medium text-white">PayPal</span> — processing
            subscription payments.
          </li>
          <li>
            <span className="font-medium text-white">Netlify</span> — hosting and
            request-level logging.
          </li>
        </ul>
      </Section>

      <Section title="4. International transfers">
        <p>
          Our infrastructure is primarily located in the European Union. Some
          sub-processors may process data in the United States or other regions. Where
          required, transfers rely on Standard Contractual Clauses or equivalent
          safeguards.
        </p>
      </Section>

      <Section title="5. Retention">
        <p>
          We retain account data for as long as your account is active. Watcher run
          history and alerts are kept for up to 12 months unless you delete them sooner.
          When you delete your account, we delete or anonymise your personal data within
          30 days, except where law requires us to retain it (for example, billing
          records).
        </p>
      </Section>

      <Section title="6. Your rights">
        <p>
          Depending on where you live, you may have rights under data-protection laws
          (such as the UK GDPR or EU GDPR), including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access — get a copy of the personal data we hold about you.</li>
          <li>Correction — ask us to fix inaccurate information.</li>
          <li>Deletion — ask us to erase your data.</li>
          <li>Portability — receive your data in a structured, machine-readable format.</li>
          <li>Objection / restriction — limit certain processing.</li>
          <li>Withdraw consent — for processing based on consent (such as Gmail access).</li>
          <li>Lodge a complaint — with your local data-protection authority.</li>
        </ul>
        <p>
          To exercise these rights, contact us via the{" "}
          <Link href="/support" className="text-brand-green hover:underline">
            support page
          </Link>
          . You can revoke Gmail access at any time from your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-green hover:underline"
          >
            Google account permissions
          </a>
          .
        </p>
      </Section>

      <Section title="7. Cookies and storage">
        <p>
          Mailwise uses a small number of cookies and similar storage to keep you signed
          in (a session cookie set by NextAuth) and to remember your preferences. We do
          not use third-party advertising cookies. PayPal and Google may set their own
          cookies on the pages they serve during sign-in or checkout, governed by their
          privacy policies.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We use HTTPS, encrypted database connections, and least-privilege service
          credentials. We restrict access to production data to a small number of people.
          No system can be perfectly secure, so we encourage you to use a strong, unique
          Google account and to enable two-factor authentication.
        </p>
      </Section>

      <Section title="9. Children">
        <p>
          Mailwise is not directed at children under 16, and we do not knowingly collect
          personal data from anyone under 16. If you believe a child has used the
          Service, contact us so we can delete the account.
        </p>
      </Section>

      <Section title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy as the Service evolves. Material changes will
          be communicated via email or in-app notice before they take effect. The
          &quot;Last updated&quot; date at the top of this page reflects the most recent
          revision.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For questions about this policy or to make a privacy request, contact us via
          the{" "}
          <Link href="/support" className="text-brand-green hover:underline">
            support page
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
