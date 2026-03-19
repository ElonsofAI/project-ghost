'use client'

import { useState } from 'react'
import type { DailyRow } from '@/app/(dashboard)/pnl/page'

export function PnLTable({ rows }: { rows: DailyRow[] }) {
  const [view, setView] = useState<'table' | 'summary'>('table')

  const totals = rows.reduce((acc, r) => ({
    net_sales:      acc.net_sales      + (r.net_sales      ?? 0),
    total_ad_spend: acc.total_ad_spend + (r.total_ad_spend ?? 0),
    cogs:           acc.cogs           + (r.cogs           ?? 0),
    cm3:            acc.cm3            + (r.cm3            ?? 0),
    daily_profit:   acc.daily_profit   + (r.daily_profit   ?? 0),
  }), { net_sales: 0, total_ad_spend: 0, cogs: 0, cm3: 0, daily_profit: 0 })

  const avgROAS = totals.total_ad_spend > 0
    ? (totals.net_sales / totals.total_ad_spend).toFixed(2) : '—'
  const avgMER = totals.net_sales > 0
    ? (totals.total_ad_spend / totals.net_sales * 100).toFixed(1) : '—'

  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setView('summary')}
          className={view === 'summary' ? 'stark-button-orange px-4 py-1.5 text-[9px]' : 'stark-button-cyan px-4 py-1.5 text-[9px]'}>
          SUMMARY
        </button>
        <button
          onClick={() => setView('table')}
          className={view === 'table' ? 'stark-button-orange px-4 py-1.5 text-[9px]' : 'stark-button-cyan px-4 py-1.5 text-[9px]'}>
          DAILY
        </button>
      </div>

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
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-bone/5 hover:bg-bone/3 transition-colors">
                  <td className="px-4 py-3 text-bone/50">{row.date}</td>
                  <td className="px-4 py-3 text-orange font-medium">{fmt(row.net_sales ?? 0)}</td>
                  <td className="px-4 py-3 text-bone/50">{fmt(row.fb_spend ?? 0)}</td>
                  <td className="px-4 py-3 text-bone/50">{fmt(row.google_spend ?? 0)}</td>
                  <td className="px-4 py-3 text-bone/60">{fmt(row.total_ad_spend ?? 0)}</td>
                  <td className="px-4 py-3 text-cyan">{row.roas ? `${row.roas.toFixed(2)}x` : '—'}</td>
                  <td className="px-4 py-3 text-bone/50">{row.mer ? `${(row.mer * 100).toFixed(0)}%` : '—'}</td>
                  <td className="px-4 py-3 text-bone/50">{fmt(row.cogs ?? 0)}</td>
                  <td className="px-4 py-3 text-bone/60">{fmt(row.cm3 ?? 0)}</td>
                  <td className={`px-4 py-3 font-semibold ${(row.daily_profit ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {fmt(row.daily_profit ?? 0)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-bone/15 bg-bone/3">
                <td className="px-4 py-3 font-medium text-bone/60 text-[9px] tracking-widest">TOTAL</td>
                <td className="px-4 py-3 text-orange font-bold">{fmt(totals.net_sales)}</td>
                <td className="px-4 py-3 text-bone/50">—</td>
                <td className="px-4 py-3 text-bone/50">—</td>
                <td className="px-4 py-3 text-bone/60 font-bold">{fmt(totals.total_ad_spend)}</td>
                <td className="px-4 py-3 text-cyan font-bold">{avgROAS === '—' ? '—' : `${avgROAS}x`}</td>
                <td className="px-4 py-3 text-bone/50">{avgMER === '—' ? '—' : `${avgMER}%`}</td>
                <td className="px-4 py-3 text-bone/50">{fmt(totals.cogs)}</td>
                <td className="px-4 py-3 text-bone/60 font-bold">{fmt(totals.cm3)}</td>
                <td className={`px-4 py-3 font-bold ${totals.daily_profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fmt(totals.daily_profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {view === 'summary' && (
        <div className="light-pipe-elevated p-6 space-y-4">
          <p className="font-mono text-[9px] text-bone/30 tracking-widest uppercase">Period Summary</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Revenue',  value: fmt(totals.net_sales),      color: 'text-orange' },
              { label: 'Total Ad Spend', value: fmt(totals.total_ad_spend), color: 'text-bone/60' },
              { label: 'Blended ROAS',   value: avgROAS === '—' ? '—' : `${avgROAS}x`, color: 'text-cyan' },
              { label: 'MER',            value: avgMER  === '—' ? '—' : `${avgMER}%`,  color: 'text-bone/60' },
              { label: 'Total COGS',     value: fmt(totals.cogs),           color: 'text-bone/50' },
              { label: 'Net Profit',     value: fmt(totals.daily_profit),
                color: totals.daily_profit >= 0 ? 'text-emerald-400' : 'text-red-400' },
            ].map(item => (
              <div key={item.label} className="bg-bone/3 border border-bone/8 p-4">
                <p className="font-mono text-[9px] text-bone/30 uppercase tracking-widest mb-1">{item.label}</p>
                <p className={`font-bold text-xl ${item.color}`} style={{ fontFamily: 'var(--font-display)' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Profit margin bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[9px] text-bone/30 uppercase tracking-widest">Profit Margin</span>
              <span className="font-mono text-[9px] text-bone/50">
                {totals.net_sales > 0
                  ? `${(totals.daily_profit / totals.net_sales * 100).toFixed(1)}%`
                  : '—'}
              </span>
            </div>
            <div className="h-1 bg-bone/5">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, Math.max(0, totals.net_sales > 0
                    ? (totals.daily_profit / totals.net_sales * 100)
                    : 0))}%`,
                  background: totals.daily_profit >= 0
                    ? 'linear-gradient(to right, #34d399, #00FFFF44)'
                    : 'linear-gradient(to right, #f87171, #fa7002)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)
}
