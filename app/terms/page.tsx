export default function TermsOfService() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-20">
      <p className="font-mono text-[9px] text-orange/70 tracking-[0.35em] uppercase mb-4">
        LEGAL // TERMS_OF_SERVICE
      </p>
      <h1 className="font-bold uppercase text-bone text-3xl mb-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        Terms of Service
      </h1>
      <p className="font-mono text-[10px] text-bone/30 mb-10">Effective date: March 19, 2026</p>

      <div className="space-y-8 font-sans text-sm text-bone/60 leading-relaxed font-light">

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>1. Service</h2>
          <p>Ghost Protocol is a Shopify CRO and revenue intelligence platform operated by Elons of AI Limited. Access is by invitation only and restricted to authorized personnel.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>2. Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may only use Ghost Protocol for lawful business purposes</li>
            <li>You may not attempt to reverse engineer, scrape, or exploit the platform</li>
            <li>You may not share your login credentials with unauthorized parties</li>
            <li>You are responsible for maintaining the security of your account</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>3. Client Data</h2>
          <p>You are responsible for ensuring you have the right to collect data from the Shopify stores you connect to Ghost Protocol. You must have explicit authorization from store owners before installing the Ghost Listener script.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>4. Intellectual Property</h2>
          <p>All software, AI models, audit algorithms, and design systems within Ghost Protocol are the intellectual property of Elons of AI Limited. No content may be reproduced or redistributed without written consent.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>5. Disclaimers</h2>
          <p>Ghost Protocol provides revenue intelligence and recommendations. Results are not guaranteed. Elons of AI Limited is not liable for business outcomes resulting from audit recommendations or A/B test results.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>6. Termination</h2>
          <p>We reserve the right to suspend or terminate access to Ghost Protocol at any time for violation of these terms or for any other reason at our discretion.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>7. Governing Law</h2>
          <p>These terms are governed by the laws of the jurisdiction in which Elons of AI Limited is registered. Any disputes shall be resolved through binding arbitration before pursuing litigation.</p>
        </section>

        <section>
          <h2 className="font-bold text-bone uppercase tracking-wide mb-2 text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>8. Contact</h2>
          <p><a href="mailto:nate@elonsofai.com" className="text-orange hover:underline">nate@elonsofai.com</a></p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-bone/8">
        <a href="/" className="font-mono text-[10px] text-bone/30 hover:text-bone/60 transition-colors">← Back to home</a>
      </div>
    </main>
  )
}
