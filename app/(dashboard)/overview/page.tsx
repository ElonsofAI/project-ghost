import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { KPICard } from '@/components/KPICard'
import Link from 'next/link'

export const metadata = { title: 'Overview // GHOST' }

export default async function OverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all clients for this user
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, shop_domain, status')
    .eq('owner_id', user!.id)

  const clientIds = (clients ?? []).map(c => c.id)
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const since7d  = new Date(Date.now() -  7 * 24 * 60 * 60 * 1000).toISOString()

  // Event counts across all clients
  let totalSessions = 0, totalCartAdds = 0, totalCheckouts = 0, totalPurchases = 0
  let sessions7d = 0

  if (clientIds.length > 0) {
    const { data: events30d } = await supabaseAdmin
      .from('events')
      .select('event')
      .in('client_id', clientIds)
      .gte('created_at', since30d)

    const { data: events7d } = await supabaseAdmin
      .from('events')
      .select('event')
      .in('client_id', clientIds)
      .gte('created_at', since7d)
      .eq('event', 'session_init')

    for (const e of events30d ?? []) {
      if (e.event === 'session_init')  totalSessions++
      if (e.event === 'cart_add')      totalCartAdds++
      if (e.event === 'checkout_init') totalCheckouts++
      if (e.event === 'purchase')      totalPurchases++
    }
    sessions7d = (events7d ?? []).length
  }

  const cvr     = totalSessions ? ((totalPurchases / totalSessions) * 100).toFixed(2) : '0.00'
  const cartRate = totalSessions ? ((totalCartAdds / totalSessions) * 100).toFixed(1) : '0.0'

  const activeClients  = (clients ?? []).filter(c => c.status === 'active').length
  const totalClients   = (clients ?? []).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
          [INTELLIGENCE // OVERVIEW]
        </p>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
          style={{ fontFamily: 'var(--font-display)' }}>
          Command Overview
        </h1>
        <p className="font-sans text-xs text-bone/35 mt-1 font-light">Last 30 days · {totalClients} client{totalClients !== 1 ? 's' : ''} tracked</p>
      </div>

      {/* No clients state */}
      {totalClients === 0 && (
        <div className="light-pipe p-8 text-center space-y-3">
          <p className="font-mono text-[10px] text-bone/30 tracking-wider">[NO_CLIENTS_DETECTED]</p>
          <p className="font-sans text-sm text-bone/40 font-light">Onboard your first client to start seeing data.</p>
          <Link href="/clients" className="stark-button-orange px-6 py-2 inline-block mt-2">
            ONBOARD CLIENT
          </Link>
        </div>
      )}

      {/* KPI Grid */}
      {totalClients > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Active Clients"   value={String(activeClients)}  sub={`${totalClients} total`}          accent="cyan" />
            <KPICard label="Sessions (30d)"   value={totalSessions.toLocaleString()} sub={`${sessions7d} last 7d`}  trend={sessions7d > 0 ? 'up' : 'neutral'} trendValue={`${sessions7d}`} />
            <KPICard label="Conversion Rate"  value={`${cvr}%`}              sub="sessions → purchase"              accent="orange" />
            <KPICard label="Cart Rate"        value={`${cartRate}%`}         sub="sessions → cart add" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Cart Additions"   value={totalCartAdds.toLocaleString()}   sub="30d" />
            <KPICard label="Checkout Inits"   value={totalCheckouts.toLocaleString()}  sub="30d" />
            <KPICard label="Purchases"        value={totalPurchases.toLocaleString()}  sub="30d" accent="orange" />
            <KPICard label="Checkout → Buy"   value={totalCheckouts ? `${((totalPurchases / totalCheckouts) * 100).toFixed(1)}%` : '—'} sub="conversion" accent="cyan" />
          </div>

          {/* Integration prompt */}
          <div className="light-pipe p-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] text-orange/70 tracking-widest uppercase mb-1">
                [REVENUE_DATA // NOT_CONNECTED]
              </p>
              <p className="font-sans text-sm text-bone/50 font-light">
                Connect Shopify, Meta, and Google to unlock revenue, ROAS, MER, P&L, and AOV data.
              </p>
            </div>
            <Link href="/integrations" className="stark-button-cyan px-5 py-2 shrink-0 ml-6">
              CONNECT →
            </Link>
          </div>

          {/* Client list */}
          <div>
            <p className="font-mono text-[9px] text-bone/30 tracking-[0.25em] uppercase mb-3">CLIENT NODES</p>
            <div className="space-y-2">
              {(clients ?? []).map(client => (
                <Link key={client.id} href={`/clients/${client.id}`}
                  className="light-pipe-elevated p-4 flex items-center justify-between hover:light-pipe-glow transition-all group block">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan"
                      style={{ boxShadow: '0 0 6px rgba(0,255,255,0.6)' }} />
                    <div>
                      <p className="font-bold text-sm text-bone uppercase tracking-wide"
                        style={{ fontFamily: 'var(--font-display)' }}>{client.name}</p>
                      <p className="font-mono text-[9px] text-bone/30">{client.shop_domain}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-bone/30 group-hover:text-orange transition-colors">
                    VIEW FUNNEL →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
