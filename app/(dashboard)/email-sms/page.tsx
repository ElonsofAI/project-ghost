import { KPICard } from '@/components/KPICard'
import Link from 'next/link'

export default function EmailSMSPage() {
  const flows = [
    { name: 'Welcome Series',         type: 'Email', revenue: '$4,280', recipients: 1240, openRate: '42%', cvr: '3.2%', status: 'active' },
    { name: 'Abandoned Cart',         type: 'Email', revenue: '$8,940', recipients: 890,  openRate: '38%', cvr: '5.8%', status: 'active' },
    { name: 'Post-Purchase',          type: 'Email', revenue: '$2,110', recipients: 560,  openRate: '51%', cvr: '2.1%', status: 'active' },
    { name: 'Win-Back (90d)',         type: 'Email', revenue: '$1,240', recipients: 2100, openRate: '18%', cvr: '0.9%', status: 'active' },
    { name: 'Browse Abandonment',     type: 'SMS',   revenue: '—',      recipients: 0,    openRate: '—',   cvr: '—',    status: 'not_connected' },
    { name: 'Cart Recovery SMS',      type: 'SMS',   revenue: '—',      recipients: 0,    openRate: '—',   cvr: '—',    status: 'not_connected' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [CHANNELS // EMAIL_SMS]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Email & SMS
          </h1>
          <p className="font-sans text-xs text-bone/35 mt-1 font-light">Sample data · Connect Klaviyo to pull live flow performance</p>
        </div>
        <Link href="/integrations" className="stark-button-orange px-4 py-1.5 text-[9px]">
          CONNECT KLAVIYO →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard label="Email Revenue"     value="$16,570" sub="30d · sample"  accent="orange" />
        <KPICard label="Revenue / Recipient" value="$2.08" sub="avg all flows"               />
        <KPICard label="Avg Open Rate"     value="37.3%"   sub="industry: 21%" accent="cyan"  />
        <KPICard label="SMS Revenue"       value="—"       sub="not connected"                />
      </div>

      <div className="light-pipe-elevated overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-bone/8">
              {['Flow', 'Type', 'Revenue', 'Recipients', 'Open Rate', 'CVR', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flows.map((f, i) => (
              <tr key={i} className="border-b border-bone/5 hover:bg-bone/3 transition-colors">
                <td className="px-5 py-3 text-bone font-medium">{f.name}</td>
                <td className="px-5 py-3">
                  <span className={`text-[9px] tracking-widest ${f.type === 'SMS' ? 'text-cyan' : 'text-orange/70'}`}>
                    {f.type}
                  </span>
                </td>
                <td className="px-5 py-3 text-orange">{f.revenue}</td>
                <td className="px-5 py-3 text-bone/50">{f.recipients > 0 ? f.recipients.toLocaleString() : '—'}</td>
                <td className="px-5 py-3 text-bone/50">{f.openRate}</td>
                <td className="px-5 py-3 text-cyan">{f.cvr}</td>
                <td className="px-5 py-3">
                  <span className={`text-[9px] tracking-widest ${
                    f.status === 'active' ? 'text-cyan' : 'text-bone/25'
                  }`}>
                    {f.status === 'active' ? 'ACTIVE' : 'NOT CONNECTED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
