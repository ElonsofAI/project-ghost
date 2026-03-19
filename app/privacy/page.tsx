export default function PrivacyPolicy() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-20">
      <p className="font-mono text-[9px] text-orange/70 tracking-[0.35em] uppercase mb-4">
        LEGAL // PRIVACY_POLICY
      </p>
      <h1 className="font-bold uppercase text-bone text-3xl mb-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        Privacy Policy
      </h1>
      <p className="font-mono text-[10px] text-bone/30 mb-10">Effective date: March 19, 2026</p>

      <div className="space-y-8 font-sans text-sm text-bone/60 leading-relaxed font-light">

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>1. Who We Are</h2>
          <p>Ghost Protocol is operated by Elons of AI Limited (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We provide Shopify analytics, CRO auditing, and revenue intelligence services to e-commerce businesses.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-bone/80">Account data:</strong> Email address and hashed password (via Supabase Auth)</li>
            <li><strong className="text-bone/80">Shopify store events:</strong> Page views, product views, cart additions, checkout events, and purchases — collected via the Ghost Listener script installed on your store</li>
            <li><strong className="text-bone/80">Integration credentials:</strong> API keys for Meta, Google, Klaviyo, TikTok — stored encrypted</li>
            <li><strong className="text-bone/80">Usage data:</strong> Dashboard interactions and audit logs for service improvement</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To deliver CRO audits and revenue intelligence reports</li>
            <li>To power your analytics dashboard</li>
            <li>To improve our AI models and audit accuracy (anonymised only)</li>
            <li>We do not sell your data to third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>4. Data Storage & Security</h2>
          <p>All data is stored in Supabase (PostgreSQL) with row-level security policies. Passwords are never stored in plain text — Supabase handles bcrypt hashing. API credentials are stored as environment variables, never in source code. All traffic is encrypted via TLS/HTTPS.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>5. Data Retention</h2>
          <p>We retain your data for as long as your account is active. You may request deletion at any time by emailing us. Upon account deletion, all store event data, audit findings, and credentials are permanently removed within 30 days.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>6. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:nate@elonsofai.com" className="text-orange hover:underline">nate@elonsofai.com</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>7. Third-Party Services</h2>
          <p>We use Supabase for database and authentication, Vercel for hosting, and Anthropic&apos;s Claude API for AI audit processing. Each service has its own privacy policy and data processing terms.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>8. Contact</h2>
          <p>For any privacy concerns: <a href="mailto:nate@elonsofai.com" className="text-orange hover:underline">nate@elonsofai.com</a></p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-bone/8">
        <a href="/" className="font-mono text-[10px] text-bone/30 hover:text-bone/60 transition-colors">← Back to home</a>
      </div>
    </main>
  )
}
