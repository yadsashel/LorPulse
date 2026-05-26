import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";

export default function Privacy() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">Legal</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </Reveal>
        <div className="prose-invert mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
          <Section title="1. Scope of This Policy"><p>LorPulse operates a specialized B2B lead acquisition pipeline. This Privacy Policy describes how we collect, process, store, and disclose business contact data — exclusively in the context of legitimate B2B outreach — for our customers and our own platform operations.</p></Section>
          <Section title="2. Data We Process"><p>We process publicly available business information including: corporate email addresses, role titles, company names, public LinkedIn profiles, firmographic data (headcount, funding stage, tech stack), and intent signals derived from publicly observable web events.</p><p>We do not knowingly collect consumer personal data, data from individuals under 18, or any data classified as "special category" under GDPR Art. 9.</p></Section>
          <Section title="3. Legal Basis (GDPR & CCPA)"><p>Processing is conducted under the legal basis of <em>legitimate interest</em> (GDPR Art. 6(1)(f)) for B2B prospecting. For California residents acting in a business capacity, processing falls under the B2B exemption of the CCPA/CPRA.</p></Section>
          <Section title="4. Sources"><p>Data is sourced from: (a) publicly indexed web pages, (b) licensed third-party enrichment providers, (c) public regulatory filings, (d) customer-submitted seed lists.</p></Section>
          <Section title="5. How Data Is Used"><p>Collected data is used to assemble niche-targeted, intent-scored datasets delivered to verified business customers under contract.</p></Section>
          <Section title="6. Retention"><p>Records are refreshed on rolling 90-day cycles. Stale or unverifiable contacts are purged.</p></Section>
          <Section title="7. Your Rights"><p>Data subjects may request access, correction, deletion, or restriction of processing by writing to <a href="mailto:privacy@lorpulse.com" className="underline">privacy@lorpulse.com</a>. Verified requests are honored within 30 days.</p></Section>
          <Section title="8. Security"><p>All datasets are encrypted in transit (TLS 1.3) and at rest (AES-256). Internal access is gated by SSO, MFA, and least-privilege role-based controls.</p></Section>
          <Section title="9. Third-Party Processors"><p>We use a limited set of sub-processors (cloud hosting, email delivery, payment processing). A current list is available on request.</p></Section>
          <Section title="10. Contact"><p>Questions? Reach our Data Protection contact at <a href="mailto:privacy@lorpulse.com" className="underline">privacy@lorpulse.com</a>.</p></Section>
        </div>
      </article>
    </SiteShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="glass halo rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <div className="mt-3 space-y-3 text-muted-foreground">{children}</div>
      </section>
    </Reveal>
  );
}
