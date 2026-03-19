import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type FunnelStep = { label: string; event: string; count: number }

export default async function ClientFunnelPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()

  if (!client || client.owner_id !== user?.id) notFound()

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: eventRows } = await supabaseAdmin
    .from('events')
    .select('event')
    .eq('client_id', clientId)
    .gte('created_at', since)

  const counts: Record<string, number> = {}
  for (const row of eventRows ?? []) counts[row.event] = (counts[row.event] ?? 0) + 1

  const funnel: FunnelStep[] = [
    { label: 'Sessions',           event: 'session_init',  count: counts['session_init']  ?? 0 },
    { label: 'Product Views',      event: 'product_view',  count: counts['product_view']  ?? 0 },
    { label: 'Cart Additions',     event: 'cart_add',      count: counts['cart_add']       ?? 0 },
    { label: 'Checkout Initiated', event: 'checkout_init', count: counts['checkout_init'] ?? 0 },
    { label: 'Purchases',          event: 'purchase',      count: counts['purchase']       ?? 0 },
  ]

  const topCount = funnel[0].count || 1

  function convRate(a: number, b: number) {
    return a ? `${Math.round((b / a) * 100)}%` : '—'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/clients" className="font-mono text-[9px] text-bone/30 hover:text-bone/60 tracking-wider mb-3 inline-block transition-colors">
            ← BACK TO ROSTER
          </Link>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [FUNNEL_ANALYSIS // 30D]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            {client.name}
          </h1>
          <p className="font-mono text-[10px] text-bone/30 mt-1">{client.shop_domain}</p>
        </div>
        <div className="ghost-tag mt-8">
          {client.status.toUpperCase()}
        </div>
      </div>

      {/* Funnel */}
      <div className="space-y-2">
        {funnel.map((step, i) => {
          const prevCount = i === 0 ? step.count : funnel[i - 1].count || 1
          const dropOff   = i === 0 ? null : Math.round((1 - step.count / prevCount) * 100)
          const barWidth  = Math.round((step.count / topCount) * 100)

          return (
            <div key={step.event} className="light-pipe-elevated p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-bone/25 w-4 text-right shrink-0">{i + 1}</span>
                  <span className="font-mono text-[10px] text-bone/60 uppercase tracking-[0.2em]">
                    {step.label}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  {dropOff !== null && (
                    <span className={`font-mono text-[10px] ${
                      dropOff > 60 ? 'text-red-400/80' : dropOff > 30 ? 'text-orange/80' : 'text-bone/25'
                    }`}>
                      -{dropOff}% drop
                    </span>
                  )}
                  <span className="font-mono text-xl font-bold text-orange neon-orange tabular-nums">
                    {step.count.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-px bg-bone/5 overflow-hidden">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(to right, #fa7002, #00FFFF${Math.round(barWidth * 2.55).toString(16).padStart(2, '0')})`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Conversion summary */}
      <div className="light-pipe p-5 grid grid-cols-3 gap-6">
        {[
          { label: 'Visit → Cart',            a: funnel[0].count, b: funnel[2].count },
          { label: 'Cart → Checkout',          a: funnel[2].count, b: funnel[3].count },
          { label: 'Checkout → Purchase',      a: funnel[3].count, b: funnel[4].count },
        ].map((m) => (
          <div key={m.label}>
            <p className="font-mono text-[9px] text-bone/30 uppercase tracking-[0.2em] mb-1.5">{m.label}</p>
            <p className="font-bold text-2xl text-orange neon-orange"
              style={{ fontFamily: 'var(--font-display)' }}>
              {convRate(m.a, m.b)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
