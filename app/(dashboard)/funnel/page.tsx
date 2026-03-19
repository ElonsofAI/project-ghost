import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { KPICard } from '@/components/KPICard'

export default async function FunnelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: clients } = await supabase.from('clients').select('id, name').eq('owner_id', user!.id)
  const clientIds = (clients ?? []).map(c => c.id)

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const counts: Record<string, number> = {}

  if (clientIds.length > 0) {
    const { data: events } = await supabaseAdmin
      .from('events').select('event').in('client_id', clientIds).gte('created_at', since)
    for (const e of events ?? []) counts[e.event] = (counts[e.event] ?? 0) + 1
  }

  const steps = [
    { label: 'Sessions',           event: 'session_init',  count: counts['session_init']  ?? 0 },
    { label: 'Product Views',      event: 'product_view',  count: counts['product_view']  ?? 0 },
    { label: 'Cart Additions',     event: 'cart_add',      count: counts['cart_add']       ?? 0 },
    { label: 'Checkout Initiated', event: 'checkout_init', count: counts['checkout_init'] ?? 0 },
    { label: 'Purchases',          event: 'purchase',      count: counts['purchase']       ?? 0 },
  ]
  const top = steps[0].count || 1

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">[PERFORMANCE // SHOPIFY_FUNNEL]</p>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-bone" style={{ fontFamily: 'var(--font-display)' }}>
          Shopify Funnel
        </h1>
        <p className="font-sans text-xs text-bone/35 mt-1 font-light">All clients · Last 30 days</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map(s => (
          <KPICard key={s.event} label={s.label} value={s.count.toLocaleString()} accent="orange" />
        ))}
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => {
          const prev = i === 0 ? step.count : steps[i - 1].count || 1
          const drop = i === 0 ? null : Math.round((1 - step.count / prev) * 100)
          const w    = Math.round((step.count / top) * 100)
          return (
            <div key={step.event} className="light-pipe-elevated p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-bone/25 w-4 text-right">{i + 1}</span>
                  <span className="font-mono text-[10px] text-bone/60 uppercase tracking-[0.2em]">{step.label}</span>
                </div>
                <div className="flex items-center gap-5">
                  {drop !== null && (
                    <span className={`font-mono text-[10px] ${drop > 60 ? 'text-red-400/80' : drop > 30 ? 'text-orange/80' : 'text-bone/25'}`}>
                      -{drop}% drop
                    </span>
                  )}
                  <span className="font-bold text-lg text-orange" style={{ fontFamily: 'var(--font-display)' }}>
                    {step.count.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-px bg-bone/5">
                <div className="h-full transition-all duration-700"
                  style={{ width: `${w}%`, background: 'linear-gradient(to right, #fa7002, #00FFFF44)' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
