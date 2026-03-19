import { KPICard } from '@/components/KPICard'
import Link from 'next/link'

// Sample cohort data matching client spreadsheet structure
const COHORTS = [
  { month: 'Jan 2025', customers: 28,  m0: '100%', m1: '39%', m2: '25%', m3: '18%', ltv: '$239' },
  { month: 'Feb 2025', customers: 5,   m0: '100%', m1: '40%', m2: '20%', m3: '—',   ltv: '$197' },
  { month: 'Mar 2025', customers: 90,  m0: '100%', m1: '38%', m2: '22%', m3: '—',   ltv: '$248' },
  { month: 'Apr 2025', customers: 5,   m0: '100%', m1: '20%', m2: '—',   m3: '—',   ltv: '$197' },
  { month: 'May 2025', customers: 90,  m0: '100%', m1: '31%', m2: '—',   m3: '—',   ltv: '$178' },
  { month: 'Jun 2025', customers: 116, m0: '100%', m1: '—',   m2: '—',   m3: '—',   ltv: '$134' },
]

function retentionColor(val: string) {
  if (val === '—') return 'text-bone/15'
  const n = parseInt(val)
  if (n >= 35) return 'text-cyan'
  if (n >= 20) return 'text-orange'
  return 'text-bone/40'
}

export default function CohortsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [PERFORMANCE // COHORT_ANALYSIS]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Customer Cohorts
          </h1>
          <p className="font-sans text-xs text-bone/35 mt-1 font-light">Sample data · Connect Shopify to pull real retention</p>
        </div>
        <Link href="/integrations" className="stark-button-orange px-4 py-1.5 text-[9px]">
          CONNECT SHOPIFY →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Avg M1 Retention"  value="33.6%" sub="industry: 20-25%" accent="cyan"   trend="up" trendValue="+8.6%" />
        <KPICard label="Avg M3 Retention"  value="21.5%" sub="customers who buy again"           accent="orange" />
        <KPICard label="Avg LTV (6mo)"     value="$199"  sub="per customer"                                       />
        <KPICard label="Total Cohorts"     value="6"     sub="tracked months"                    accent="white"  />
      </div>

      <div className="light-pipe-elevated overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-bone/8">
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">Cohort</th>
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">Customers</th>
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">Month 0</th>
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">Month 1</th>
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">Month 2</th>
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">Month 3</th>
              <th className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">6mo LTV</th>
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((c, i) => (
              <tr key={i} className="border-b border-bone/5 hover:bg-bone/3 transition-colors">
                <td className="px-5 py-3 text-bone font-medium">{c.month}</td>
                <td className="px-5 py-3 text-bone/50">{c.customers}</td>
                <td className="px-5 py-3 text-bone/40">{c.m0}</td>
                <td className={`px-5 py-3 font-medium ${retentionColor(c.m1)}`}>{c.m1}</td>
                <td className={`px-5 py-3 font-medium ${retentionColor(c.m2)}`}>{c.m2}</td>
                <td className={`px-5 py-3 font-medium ${retentionColor(c.m3)}`}>{c.m3}</td>
                <td className="px-5 py-3 text-orange font-medium">{c.ltv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="light-pipe p-4 flex items-center justify-between">
        <p className="font-sans text-xs text-bone/40 font-light">
          Connect Shopify Admin API to pull real cohort data and LTV calculations automatically.
        </p>
        <Link href="/integrations" className="stark-button-cyan px-4 py-1.5 text-[9px] shrink-0 ml-4">
          CONNECT →
        </Link>
      </div>
    </div>
  )
}
