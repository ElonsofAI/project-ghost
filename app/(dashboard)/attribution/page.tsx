import { KPICard } from '@/components/KPICard'
import Link from 'next/link'

export default function AttributionPage() {
  const channels = [
    { name: 'Facebook Ads',  spend: '$5,106', revenue: '$14,756', roas: '2.89x', cpc: '$1.24', status: 'disconnected' },
    { name: 'Google Ads',    spend: '$1,978', revenue: '$6,931',  roas: '3.51x', cpc: '$0.87', status: 'disconnected' },
    { name: 'TikTok Ads',   spend: '—',      revenue: '—',       roas: '—',     cpc: '—',     status: 'disconnected' },
    { name: 'Organic',      spend: '—',      revenue: '$4,210',  roas: '∞',     cpc: '$0',    status: 'active'       },
    { name: 'Email (Klaviyo)', spend: '—',   revenue: '—',       roas: '—',     cpc: '—',     status: 'disconnected' },
    { name: 'SMS',          spend: '—',      revenue: '—',       roas: '—',     cpc: '—',     status: 'disconnected' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [PERFORMANCE // AD_ATTRIBUTION]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Ad Attribution
          </h1>
        </div>
        <Link href="/integrations" className="stark-button-orange px-4 py-1.5 text-[9px]">
          CONNECT PLATFORMS →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Total Ad Spend"   value="$7,084"  sub="sample · 7d"  accent="white"  />
        <KPICard label="Blended ROAS"     value="2.89x"   sub="net sales / spend" accent="orange" />
        <KPICard label="MER"              value="35%"     sub="ad spend / net sales" />
        <KPICard label="Total Ad Revenue" value="$21,687" sub="attributed"    accent="cyan"   />
      </div>

      <div className="light-pipe-elevated overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-bone/8">
              {['Channel', 'Spend', 'Revenue', 'ROAS', 'CPC', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channels.map((ch, i) => (
              <tr key={i} className="border-b border-bone/5 hover:bg-bone/3 transition-colors">
                <td className="px-5 py-3 text-bone font-medium">{ch.name}</td>
                <td className="px-5 py-3 text-bone/50">{ch.spend}</td>
                <td className="px-5 py-3 text-orange">{ch.revenue}</td>
                <td className="px-5 py-3 text-cyan">{ch.roas}</td>
                <td className="px-5 py-3 text-bone/50">{ch.cpc}</td>
                <td className="px-5 py-3">
                  <span className={`text-[9px] tracking-widest ${
                    ch.status === 'active' ? 'text-cyan' : 'text-bone/25'
                  }`}>
                    {ch.status === 'active' ? 'ACTIVE' : 'NOT CONNECTED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="light-pipe p-4 flex items-center justify-between">
        <p className="font-sans text-xs text-bone/40 font-light">
          Connect Meta, Google, and TikTok to pull live ROAS and spend data automatically.
        </p>
        <Link href="/integrations" className="stark-button-cyan px-4 py-1.5 text-[9px] shrink-0 ml-4">
          CONNECT →
        </Link>
      </div>
    </div>
  )
}
