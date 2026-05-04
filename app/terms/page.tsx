import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Terms of Service · Mailwise",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="4 May 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Mailwise
        (the &quot;Service&quot;), operated from the United Kingdom. By creating an account or
        otherwise using the Service, you agree to these Terms. If you do not agree, please
        do not use the Service.
      </p>

      <Section title="1. The Service">
        <p>
          Mailwise is an automation layer for email and the web. It connects to a user&apos;s
          email account (with their permission), monitors third-party web pages for events
          such as price drops and appointment availability, and sends alerts and summary
          emails based on those events. Mailwise does not replace your inbox.
        </p>
      </Section>

      <Section title="2. Eligibility and accounts">
        <p>
          You must be at least 16 years old to use Mailwise. You are responsible for the
          activity that happens under your account, for keeping your credentials secure,
          and for the accuracy of the information you provide. We may suspend or terminate
          accounts that violate these Terms or that are used to abuse the Service.
        </p>
      </Section>

      <Section title="3. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Service in violation of any applicable law or regulation.</li>
          <li>
            Configure watchers that target content protected by login walls or paywalls
            you are not authorised to access, or otherwise circumvent technical access
            controls.
          </li>
          <li>
            Use the Service to scrape personal data, send spam, harass others, or
            distribute malicious content.
          </li>
          <li>
            Reverse-engineer, resell, or attempt to extract source code from the Service
            except where permitted by law.
          </li>
          <li>
            Submit a volume of watchers, requests, or alerts that disrupts the Service for
            other users or the third parties whose pages are monitored.
          </li>
        </ul>
        <p>
          We may block, throttle, or remove watchers that conflict with these rules or that
          we reasonably believe place undue load on a target site.
        </p>
      </Section>

      <Section title="4. Plans, billing, and refunds">
        <p>
          The Service is offered on a free tier and on paid Basic, Pro, and Elite plans
          billed monthly or yearly through PayPal. By subscribing you authorise PayPal to
          charge the recurring amount for the plan you select until you cancel. You may
          cancel your subscription at any time from the Settings page; cancellation takes
          effect at the end of the current billing period and you will retain access until
          then.
        </p>
        <p>
          Prices are listed in the currency shown at checkout and may change. We will give
          notice before any price change affects your existing subscription. Except where
          required by law, paid amounts are non-refundable once the billing period has
          started.
        </p>
      </Section>

      <Section title="5. Third-party services">
        <p>
          Mailwise relies on third-party providers — including Google (Gmail OAuth),
          Supabase (database), Resend (email delivery), OpenAI (AI summaries), PayPal
          (subscriptions), and Netlify (hosting). Their availability and terms can affect
          the Service. Mailwise is not responsible for outages, errors, or policy changes
          at these providers, although we will use reasonable efforts to mitigate impact.
        </p>
        <p>
          You are responsible for complying with the terms of any third-party site you
          monitor with a watcher. Mailwise does not endorse, audit, or take responsibility
          for the content of monitored pages.
        </p>
      </Section>

      <Section title="6. No guarantee of detection">
        <p>
          Mailwise watchers attempt to detect price changes, appointment availability, and
          similar events using automated checks. We do not guarantee that any specific
          change will be detected, that detected information is current, or that an alert
          will arrive in time to act on it. You are responsible for verifying any
          opportunity before making a purchase or booking.
        </p>
      </Section>

      <Section title="7. Intellectual property">
        <p>
          Mailwise, its logos, code, and content are owned by us or our licensors. Subject
          to your compliance with these Terms, you receive a limited, non-exclusive,
          non-transferable licence to use the Service for personal or internal business
          purposes. You retain ownership of content you submit to the Service (such as
          watcher names and URLs).
        </p>
      </Section>

      <Section title="8. Disclaimers">
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;. To the maximum
          extent permitted by law, we disclaim all warranties, express or implied, including
          warranties of merchantability, fitness for a particular purpose, non-infringement,
          and uninterrupted or error-free operation.
        </p>
      </Section>

      <Section title="9. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Mailwise will not be liable for any
          indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, revenue, data, or goodwill, arising out of or in connection with the
          Service. Our aggregate liability for any claim relating to the Service will not
          exceed the greater of (a) the amount you paid us in the twelve months before the
          event giving rise to the claim, or (b) GBP 50.
        </p>
        <p>
          Nothing in these Terms limits liability that cannot be limited under applicable
          law, including liability for fraud or for death or personal injury caused by
          negligence.
        </p>
      </Section>

      <Section title="10. Termination">
        <p>
          You may stop using the Service and delete your account at any time. We may
          suspend or terminate access if you breach these Terms, if continued operation
          would expose us or others to legal risk, or if we discontinue the Service.
          Sections that by their nature should survive termination (such as disclaimers,
          limitations of liability, and intellectual property terms) will survive.
        </p>
      </Section>

      <Section title="11. Changes to these Terms">
        <p>
          We may update these Terms from time to time. If a change is material, we will
          notify you by email or through the Service before it takes effect. Your continued
          use of the Service after the effective date of the updated Terms means you accept
          them.
        </p>
      </Section>

      <Section title="12. Governing law and disputes">
        <p>
          These Terms are governed by the laws of England and Wales. Any dispute arising
          from these Terms or the Service will be resolved in the courts of England and
          Wales, except where mandatory consumer-protection law gives you the right to
          bring proceedings in your country of residence.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Questions about these Terms? Reach us via the{" "}
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
