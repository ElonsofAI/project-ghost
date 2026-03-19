'use client'

import { useState } from 'react'
import { KPICard } from '@/components/KPICard'

// Sample data structure matching client spreadsheets
// Will be replaced by real Shopify + Ad platform data once integrations connect
const SAMPLE_ROWS = [
  { date: '2025-01-01', netSales: 20504, fbSpend: 5106, googleSpend: 1978, totalAdSpend: 7084, roas: 2.89, mer: 0.35, cogs: 6971, cm3: 3096, dailyProfit: 1484 },
  { date: '2025-01-02', netSales: 19309, fbSpend: 4854, googleSpend: 1936, totalAdSpend: 6790, roas: 2.84, mer: 0.35, cogs: 6565, cm3: 2797, dailyProfit: 1185 },
  { date: '2025-01-03', netSales: 17078, fbSpend: 4612, googleSpend: 1837, totalAdSpend: 6449, roas: 2.65, mer: 0.38, cogs: 5806, cm3: 2030, dailyProfit: 418  },
  { date: '2025-01-04', netSales: 24532, fbSpend: 4639, googleSpend: 1961, totalAdSpend: 6600, roas: 3.72, mer: 0.27, cogs: 8341, cm3: 5580, dailyProfit: 3967 },
  { date: '2025-01-05', netSales: 25537, fbSpend: 5618, googleSpend: 2034, totalAdSpend: 7652, roas: 3.34, mer: 0.30, cogs: 8683, cm3: 5027, dailyProfit: 3414 },
  { date: '2025-01-06', netSales: 17209, fbSpend: 5197, googleSpend: 1931, totalAdSpend: 7128, roas: 2.41, mer: 0.41, cogs: 5851, cm3: 1416, dailyProfit: -197 },
  { date: '2025-01-07', netSales: 18186, fbSpend: 5102, googleSpend: 1898, totalAdSpend: 6999, roas: 2.60, mer: 0.38, cogs: 6183, cm3: 2030, dailyProfit: 417  },
]

export default function PnLPage() {
  const [view, setView] = useState<'table' | 'summary'>('table')

  const totals = SAMPLE_ROWS.reduce((acc, r) => ({
    netSales:    acc.netSales    + r.netSales,
    totalAdSpend: acc.totalAdSpend + r.totalAdSpend,
    cogs:        acc.cogs        + r.cogs,
    cm3:         acc.cm3         + r.cm3,
    dailyProfit: acc.dailyProfit + r.dailyProfit,
  }), { netSales: 0, totalAdSpend: 0, cogs: 0, cm3: 0, dailyProfit: 0 })

  const avgROAS = (totals.netSales / totals.totalAdSpend).toFixed(2)
  const avgMER  = (totals.totalAdSpend / totals.netSales * 100).toFixed(1)

  function fmt(n: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [PERFORMANCE // P&L_TRACKER]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Profit & Loss
          </h1>
          <p className="font-sans text-xs text-bone/35 mt-1 font-light">
            Sample data · Connect Shopify + Meta to pull live numbers
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('summary')}
            className={view === 'summary' ? 'stark-button-orange px-4 py-1.5 text-[9px]' : 'stark-button-cyan px-4 py-1.5 text-[9px]'}>
            SUMMARY
          </button>
          <button onClick={() => setView('table')}
            className={view === 'table' ? 'stark-button-orange px-4 py-1.5 text-[9px]' : 'stark-button-cyan px-4 py-1.5 text-[9px]'}>
            DAILY
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard label="Net Sales"    value={fmt(totals.netSales)}     accent="orange" />
        <KPICard label="Ad Spend"     value={fmt(totals.totalAdSpend)} accent="white"  />
        <KPICard label="Blended ROAS" value={`${avgROAS}x`}           accent="cyan"   />
        <KPICard label="MER"          value={`${avgMER}%`}            accent="white"  />
        <KPICard label="Net Profit"   value={fmt(totals.dailyProfit)}
          accent={totals.dailyProfit > 0 ? 'cyan' : 'orange'}
          trend={totals.dailyProfit > 0 ? 'up' : 'down'} />
      </div>

      {/* Daily table */}
      {view === 'table' && (
        <div className="light-pipe-elevated overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-bone/8">
                {['Date', 'Net Sales', 'FB Spend', 'Google', 'Total Spend', 'ROAS', 'MER', 'COGS', 'CM3', 'Profit'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] text-bone/30 uppercase tracking-[0.2em] font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-bone/5 hover:bg-bone/3 transition-colors">
                  <td className="px-4 py-3 text-bone/50">{row.date}</td>
                  <td className="px-4 py-3 text-orange font-medium">{fmt(row.netSales)}</td>
                  <td className="px-4 py-3 text-bone/50">{fmt(row.fbSpend)}</td>
                  <td className="px-4 py-3 text-bone/50">{fmt(row.googleSpend)}</td>
                  <td className="px-4 py-3 text-bone/60">{fmt(row.totalAdSpend)}</td>
                  <td className="px-4 py-3 text-cyan">{row.roas}x</td>
                  <td className="px-4 py-3 text-bone/50">{(row.mer * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 text-bone/50">{fmt(row.cogs)}</td>
                  <td className="px-4 py-3 text-bone/60">{fmt(row.cm3)}</td>
                  <td className={`px-4 py-3 font-semibold ${row.dailyProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fmt(row.dailyProfit)}
                  </td>
                </tr>
              ))}
              {/* Totals row */}
              <tr className="border-t border-bone/15 bg-bone/3">
                <td className="px-4 py-3 font-medium text-bone/60 text-[9px] tracking-widest">TOTAL</td>
                <td className="px-4 py-3 text-orange font-bold">{fmt(totals.netSales)}</td>
                <td className="px-4 py-3 text-bone/50">—</td>
                <td className="px-4 py-3 text-bone/50">—</td>
                <td className="px-4 py-3 text-bone/60 font-bold">{fmt(totals.totalAdSpend)}</td>
                <td className="px-4 py-3 text-cyan font-bold">{avgROAS}x</td>
                <td className="px-4 py-3 text-bone/50">{avgMER}%</td>
                <td className="px-4 py-3 text-bone/50">{fmt(totals.cogs)}</td>
                <td className="px-4 py-3 text-bone/60 font-bold">{fmt(totals.cm3)}</td>
                <td className={`px-4 py-3 font-bold ${totals.dailyProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fmt(totals.dailyProfit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Connect prompt */}
      <div className="light-pipe p-4 flex items-center gap-4">
        <span className="font-mono text-[9px] text-orange/60 tracking-widest">[DATA_SOURCE]</span>
        <p className="font-sans text-xs text-bone/40 font-light flex-1">
          This is sample data. Connect Shopify Admin API + Meta Ads to pull your real P&L automatically.
        </p>
        <a href="/integrations" className="stark-button-orange px-4 py-1.5 text-[9px] shrink-0">
          CONNECT →
        </a>
      </div>
    </div>
  )
}
