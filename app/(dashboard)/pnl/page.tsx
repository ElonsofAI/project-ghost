import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { KPICard } from '@/components/KPICard'
import { PnLTable } from '@/components/PnLTable'

export const dynamic = 'force-dynamic'

export default async function PnLPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; days?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: clients } = await supabase
    .from('clients').select('id, name').eq('owner_id', user!.id)

  const clientList = clients ?? []
  const selectedId = params.client ?? clientList[0]?.id ?? null
  const days = parseInt(params.days ?? '30', 10)

  let rows: DailyRow[] = []
  let isLive = false

  if (selectedId) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString().slice(0, 10)

    const { data } = await supabaseAdmin
      .from('daily_metrics')
      .select('*')
      .eq('client_id', selectedId)
      .gte('date', since)
      .order('date', { ascending: false })

    if (data && data.length > 0) {
      rows = data
      isLive = true
    }
  }

  // Fall back to sample data so the page is never empty
  if (rows.length === 0) {
    rows = SAMPLE_ROWS
  }

  const totals = rows.reduce((acc, r) => ({
    net_sales:      acc.net_sales     + (r.net_sales     ?? 0),
    total_ad_spend: acc.total_ad_spend + (r.total_ad_spend ?? 0),
    cogs:           acc.cogs          + (r.cogs           ?? 0),
    cm3:            acc.cm3           + (r.cm3            ?? 0),
    daily_profit:   acc.daily_profit  + (r.daily_profit   ?? 0),
    total_orders:   acc.total_orders  + (r.total_orders   ?? 0),
  }), { net_sales: 0, total_ad_spend: 0, cogs: 0, cm3: 0, daily_profit: 0, total_orders: 0 })

  const avgROAS = totals.total_ad_spend > 0
    ? (totals.net_sales / totals.total_ad_spend).toFixed(2) : '—'
  const avgMER = totals.net_sales > 0
    ? (totals.total_ad_spend / totals.net_sales * 100).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [PERFORMANCE // P&L_TRACKER]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Profit & Loss
          </h1>
          <p className="font-sans text-xs text-bone/35 mt-1 font-light">
            {isLive ? 'Live data from Shopify + ad platforms' : 'Sample data · Connect Shopify + Meta to pull live numbers'}
          </p>
        </div>

        {/* Client + day selector (GET params → server reload) */}
        <form method="GET" className="flex items-center gap-2 flex-wrap">
          {clientList.length > 0 && (
            <select name="client" defaultValue={selectedId ?? ''} className="ghost-input w-auto py-1.5 px-3 text-xs">
              {clientList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <select name="days" defaultValue={String(days)} className="ghost-input w-auto py-1.5 px-3 text-xs">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button type="submit" className="stark-button-cyan px-4 py-1.5 text-[9px]">VIEW</button>
        </form>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard label="Net Sales"    value={fmt(totals.net_sales)}     accent="orange" />
        <KPICard label="Ad Spend"     value={fmt(totals.total_ad_spend)} accent="white"  />
        <KPICard label="Blended ROAS" value={avgROAS === '—' ? '—' : `${avgROAS}x`} accent="cyan" />
        <KPICard label="MER"          value={avgMER === '—' ? '—' : `${avgMER}%`}   accent="white" />
        <KPICard label="Net Profit"   value={fmt(totals.daily_profit)}
          accent={totals.daily_profit >= 0 ? 'cyan' : 'orange'}
          trend={totals.daily_profit >= 0 ? 'up' : 'down'} />
      </div>

      {/* Client data table — interactive (view toggle) */}
      <PnLTable rows={rows} />

      {/* Connect or sync prompt */}
      <div className="light-pipe p-4 flex items-center gap-4">
        <span className="font-mono text-[9px] text-orange/60 tracking-widest">[DATA_SOURCE]</span>
        {isLive && selectedId ? (
          <SyncButtons clientId={selectedId} />
        ) : (
          <>
            <p className="font-sans text-xs text-bone/40 font-light flex-1">
              Connect Shopify Admin API + Meta Ads to pull your real P&L automatically.
            </p>
            <a href="/integrations" className="stark-button-orange px-4 py-1.5 text-[9px] shrink-0">
              CONNECT →
            </a>
          </>
        )}
      </div>
    </div>
  )
}

// Inline sync button component (server-rendered shell, client interactions in PnLTable)
function SyncButtons({ clientId }: { clientId: string }) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <p className="font-sans text-xs text-cyan/60 font-light">Live data connected.</p>
      <form action={`/api/sync/shopify`} method="post" className="contents">
        <input type="hidden" name="client_id" value={clientId} />
      </form>
      <a href={`/pnl?client=${clientId}`} className="stark-button-cyan px-4 py-1.5 text-[9px] shrink-0 ml-auto">
        REFRESH →
      </a>
      <a href="/integrations" className="stark-button-orange px-4 py-1.5 text-[9px] shrink-0">
        MANAGE SOURCES →
      </a>
    </div>
  )
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)
}

export type DailyRow = {
  date: string
  net_sales?: number
  gross_sales?: number
  total_orders?: number
  fb_spend?: number
  google_spend?: number
  tiktok_spend?: number
  total_ad_spend?: number
  roas?: number
  mer?: number
  cogs?: number
  cm3?: number
  daily_profit?: number
}

const SAMPLE_ROWS: DailyRow[] = [
  { date: '2025-01-07', net_sales: 18186, fb_spend: 5102, google_spend: 1898, total_ad_spend: 6999, roas: 2.60, mer: 0.38, cogs: 6183, cm3: 2030, daily_profit: 417  },
  { date: '2025-01-06', net_sales: 17209, fb_spend: 5197, google_spend: 1931, total_ad_spend: 7128, roas: 2.41, mer: 0.41, cogs: 5851, cm3: 1416, daily_profit: -197 },
  { date: '2025-01-05', net_sales: 25537, fb_spend: 5618, google_spend: 2034, total_ad_spend: 7652, roas: 3.34, mer: 0.30, cogs: 8683, cm3: 5027, daily_profit: 3414 },
  { date: '2025-01-04', net_sales: 24532, fb_spend: 4639, google_spend: 1961, total_ad_spend: 6600, roas: 3.72, mer: 0.27, cogs: 8341, cm3: 5580, daily_profit: 3967 },
  { date: '2025-01-03', net_sales: 17078, fb_spend: 4612, google_spend: 1837, total_ad_spend: 6449, roas: 2.65, mer: 0.38, cogs: 5806, cm3: 2030, daily_profit: 418  },
  { date: '2025-01-02', net_sales: 19309, fb_spend: 4854, google_spend: 1936, total_ad_spend: 6790, roas: 2.84, mer: 0.35, cogs: 6565, cm3: 2797, daily_profit: 1185 },
  { date: '2025-01-01', net_sales: 20504, fb_spend: 5106, google_spend: 1978, total_ad_spend: 7084, roas: 2.89, mer: 0.35, cogs: 6971, cm3: 3096, daily_profit: 1484 },
]
