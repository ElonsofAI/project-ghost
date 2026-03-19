'use client'

import { useState, useEffect } from 'react'

type Finding = {
  rank: number
  category: string
  title: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  revenueAtRisk: string
  description: string
  actions: string[]
  channel: string
}

const IMPACT_CONFIG = {
  critical: { color: 'text-red-400',     border: 'border-red-400/30',    bg: 'bg-red-400/5',    label: 'CRITICAL' },
  high:     { color: 'text-orange',      border: 'border-orange/30',     bg: 'bg-orange/5',     label: 'HIGH'     },
  medium:   { color: 'text-yellow-400',  border: 'border-yellow-400/30', bg: 'bg-yellow-400/5', label: 'MEDIUM'   },
  low:      { color: 'text-cyan',        border: 'border-cyan/30',       bg: 'bg-cyan/5',       label: 'LOW'      },
}

export default function AuditPage() {
  const [clients, setClients]         = useState<{ id: string; name: string }[]>([])
  const [selectedClient, setSelected] = useState<string>('')
  const [findings, setFindings]       = useState<Finding[]>([])
  const [loading, setLoading]         = useState(false)
  const [ran, setRan]                 = useState(false)
  const [expanded, setExpanded]       = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(data => {
      setClients(data)
      if (data.length > 0) setSelected(data[0].id)
    })
  }, [])

  async function runAudit() {
    if (!selectedClient) return
    setLoading(true)
    setFindings([])
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: selectedClient }),
    })
    const data = await res.json()
    setFindings(data.findings ?? [])
    setLoading(false)
    setRan(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [AI // CRO_AUDIT_ENGINE]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Revenue Leak Detector
          </h1>
          <p className="font-sans text-xs text-bone/35 mt-1 font-light">
            AI analyzes your full funnel and ranks leaks by revenue impact.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="light-pipe p-5 flex items-center gap-4">
        {clients.length > 0 ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <span className="font-mono text-[9px] text-bone/35 uppercase tracking-wider shrink-0">Client:</span>
              <select value={selectedClient} onChange={e => setSelected(e.target.value)}
                className="ghost-input w-auto py-1.5 px-3 text-xs">
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={runAudit} disabled={loading}
              className="stark-button-execute px-8 py-2.5 text-[10px] light-pipe disabled:opacity-30">
              {loading ? '[SCANNING_FUNNEL...]' : 'RUN AI AUDIT'}
            </button>
          </>
        ) : (
          <p className="font-mono text-[10px] text-bone/30">
            [NO_CLIENTS] — <a href="/clients" className="text-orange hover:underline">Onboard a client first</a>
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="light-pipe-elevated p-10 text-center space-y-3">
          <div className="w-2 h-2 rounded-full bg-orange pulse-orange mx-auto" />
          <p className="font-mono text-[10px] text-bone/40 tracking-widest">
            [ANALYZING_FUNNEL] Scanning sessions, cart events, checkout flow, and channel data...
          </p>
        </div>
      )}

      {/* No data */}
      {ran && !loading && findings.length === 0 && (
        <div className="light-pipe-elevated p-8 text-center">
          <p className="font-mono text-[10px] text-bone/30">
            [INSUFFICIENT_DATA] Connect more integrations for a complete audit.
          </p>
        </div>
      )}

      {/* Findings */}
      {findings.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-[9px] text-bone/30 tracking-[0.25em] uppercase">
            {findings.length} LEAKS DETECTED — RANKED BY REVENUE IMPACT
          </p>
          {findings.map((f, i) => {
            const cfg = IMPACT_CONFIG[f.impact]
            return (
              <div key={i} className={`light-pipe-elevated border-l-2 ${cfg.border}`}>
                <div className="p-5 flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className={`w-8 h-8 flex items-center justify-center shrink-0 border ${cfg.border} ${cfg.bg}`}>
                    <span className={`font-mono text-xs font-bold ${cfg.color}`}>#{f.rank}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className={`font-mono text-[9px] tracking-widest ${cfg.color}`}>[{cfg.label}]</span>
                      <span className="font-mono text-[9px] text-bone/25">{f.channel} · {f.category}</span>
                    </div>
                    <h3 className="font-bold text-sm text-bone uppercase tracking-wide"
                      style={{ fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                    <p className="font-sans text-xs text-bone/45 font-light mt-1">{f.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[9px] text-bone/25 mb-0.5">Revenue at risk</p>
                    <p className={`font-bold text-lg ${cfg.color}`}
                      style={{ fontFamily: 'var(--font-display)' }}>{f.revenueAtRisk}</p>
                    <span className="font-mono text-[9px] text-bone/25">
                      {expanded === i ? '▲' : '▼ ACTIONS'}
                    </span>
                  </div>
                </div>
                {expanded === i && (
                  <div className="px-5 pb-5 border-t border-bone/8 pt-4">
                    <p className="font-mono text-[9px] text-bone/30 tracking-[0.2em] uppercase mb-3">RECOMMENDED ACTIONS</p>
                    <ol className="space-y-2">
                      {f.actions.map((action, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="font-mono text-[9px] text-orange/60 shrink-0 mt-0.5">{j + 1}.</span>
                          <p className="font-sans text-xs text-bone/60 font-light">{action}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pre-run ghost cards */}
      {!ran && !loading && clients.length > 0 && (
        <div className="grid grid-cols-3 gap-3 opacity-30 pointer-events-none select-none">
          {['Checkout Abandonment', 'Ad Spend Efficiency', 'Email Revenue Gap', 'AOV Optimization', 'Cart Abandonment', 'Landing Page CRO'].map(label => (
            <div key={label} className="light-pipe-elevated p-4">
              <div className="w-6 h-1.5 bg-bone/10 rounded mb-3" />
              <div className="w-full h-1.5 bg-bone/5 rounded mb-1" />
              <div className="w-3/4 h-1.5 bg-bone/5 rounded" />
              <p className="font-mono text-[9px] text-bone/20 mt-3">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
