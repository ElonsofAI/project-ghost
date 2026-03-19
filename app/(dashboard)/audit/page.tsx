import { AuditCalculator } from '@/components/AuditCalculator'

export const metadata = { title: 'Revenue Diagnostics // GHOST' }

export default function AuditPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs text-[#fa7002] tracking-[0.3em] uppercase mb-2">
          [DIAGNOSTICS // REVENUE_LEAK_ANALYSIS]
        </p>
        <h1
          className="text-3xl font-bold uppercase tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Audit Engine
        </h1>
        <p className="mt-2 text-sm text-white/40 font-mono">
          Calculate the exact dollar amount your prospect loses every year without AI.
        </p>
      </div>

      <AuditCalculator />
    </div>
  )
}
