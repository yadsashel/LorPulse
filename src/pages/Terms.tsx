import { SiteShell } from "@/components/SiteShell";
import { Reveal } from "@/components/Reveal";

export default function Terms() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[oklch(0.78_0.18_300)]">Legal</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </Reveal>
        <div className="mt-10 space-y-6">
          <Section title="1. Acceptance"><p>By accessing or using LorPulse ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p></Section>
          <Section title="2. Service Description"><p>LorPulse provides AI-enriched B2B lead datasets and recurring data extraction pipelines on a one-time or subscription basis.</p></Section>
          <Section title="3. Accounts & Beta Access"><p>Onboarding currently operates through a private beta list. Customers must provide accurate contact and billing information.</p></Section>
          <Section title="4. Acceptable Use"><p>You agree to use LorPulse data exclusively for lawful B2B outreach. You may not: (a) resell or redistribute raw datasets, (b) use data for unsolicited consumer marketing, (c) violate any anti-spam or data protection law including CAN-SPAM, GDPR, CASL, and CCPA/CPRA.</p></Section>
          <Section title="5. Subscriptions & Billing"><p>Pulse Core is a one-time purchase ($14). Pulse Horizon is a recurring monthly subscription ($24/month) that auto-renews until cancelled.</p></Section>
          <Section title="6. Refunds"><p>Due to the digital, instantly-delivered nature of our datasets, all sales are final. Customers experiencing material defects may request review within 7 days of delivery.</p></Section>
          <Section title="7. Intellectual Property"><p>The LorPulse platform, brand, scrapers, enrichment models, and AI personalization loop remain the exclusive property of LorPulse.</p></Section>
          <Section title="8. Warranties & Disclaimers"><p>The Service is provided "as is." While we maintain a 98.4% deliverability standard, we do not warrant uninterrupted availability.</p></Section>
          <Section title="9. Limitation of Liability"><p>To the maximum extent permitted by law, LorPulse's aggregate liability under these Terms shall not exceed the fees paid by the customer in the twelve (12) months preceding the claim.</p></Section>
          <Section title="10. Termination"><p>We may suspend or terminate access for breach of these Terms, abuse of the Service, or unlawful use of delivered data.</p></Section>
          <Section title="11. Governing Law"><p>These Terms are governed by the laws of the State of Delaware, USA.</p></Section>
          <Section title="12. Contact"><p>Questions? <a href="mailto:lorpulse.official@gmail.com" className="underline">lorpulse.official@gmail.com</a></p></Section>
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
        <div className="mt-3 space-y-3 text-muted-foreground text-[15px] leading-relaxed">{children}</div>
      </section>
    </Reveal>
  );
}
