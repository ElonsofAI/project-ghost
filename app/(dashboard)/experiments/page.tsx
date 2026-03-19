'use client'

import { useState } from 'react'

const SAMPLE_EXPERIMENTS = [
  {
    id: 1, name: 'CTA Copy Test — Add to Cart vs Get Yours',
    status: 'active', metric: 'CVR', variants: ['Control', 'Variant A'],
    control: { visitors: 1240, conversions: 37, rate: '2.98%' },
    variant: { visitors: 1188, conversions: 43, rate: '3.62%' },
    lift: '+21.5%', confidence: '94%', daysRunning: 8,
  },
  {
    id: 2, name: 'Checkout Button Color — White vs Orange',
    status: 'complete', metric: 'Checkout Rate', variants: ['Control', 'Variant A'],
    control: { visitors: 890,  conversions: 312, rate: '35.1%' },
    variant: { visitors: 902,  conversions: 374, rate: '41.5%' },
    lift: '+18.2%', confidence: '98%', daysRunning: 14,
  },
  {
    id: 3, name: 'Product Page Social Proof Position',
    status: 'draft', metric: 'Add to Cart Rate', variants: ['Control', 'Variant A'],
    control: { visitors: 0, conversions: 0, rate: '—' },
    variant: { visitors: 0, conversions: 0, rate: '—' },
    lift: '—', confidence: '—', daysRunning: 0,
  },
]

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  active:   { color: 'text-cyan',    label: 'RUNNING'  },
  complete: { color: 'text-orange',  label: 'COMPLETE' },
  draft:    { color: 'text-bone/30', label: 'DRAFT'    },
}

export default function ExperimentsPage() {
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [INTELLIGENCE // EXPERIMENTS]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            A/B Experiments
          </h1>
          <p className="font-sans text-xs text-bone/35 mt-1 font-light">Run from audit recommendations or create manually.</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="stark-button-orange px-4 py-1.5 text-[9px]">
          + NEW EXPERIMENT
        </button>
      </div>

      {adding && (
        <div className="light-pipe p-6 space-y-4">
          <p className="ghost-tag">NEW_EXPERIMENT</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.2em]">Experiment Name</label>
              <input className="ghost-input" placeholder="e.g. Checkout CTA copy test" />
            </div>
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.2em]">Primary Metric</label>
              <select className="ghost-input">
                <option>Conversion Rate</option>
                <option>Add to Cart Rate</option>
                <option>Checkout Rate</option>
                <option>AOV</option>
                <option>Revenue per Session</option>
              </select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.2em]">Hypothesis</label>
              <input className="ghost-input" placeholder="Changing X will improve Y because Z..." />
            </div>
          </div>
          <button className="stark-button-execute px-6 py-2 text-[10px] light-pipe">
            CREATE EXPERIMENT
          </button>
        </div>
      )}

      <div className="space-y-3">
        {SAMPLE_EXPERIMENTS.map(exp => {
          const cfg = STATUS_CONFIG[exp.status]
          return (
            <div key={exp.id} className="light-pipe-elevated p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-mono text-[9px] tracking-widest ${cfg.color}`}>[{cfg.label}]</span>
                    <span className="font-mono text-[9px] text-bone/25">{exp.metric} · {exp.daysRunning}d running</span>
                  </div>
                  <h3 className="font-bold text-sm text-bone"
                    style={{ fontFamily: 'var(--font-display)' }}>{exp.name}</h3>
                </div>
                {exp.lift !== '—' && (
                  <div className="text-right shrink-0">
                    <p className="font-mono text-[9px] text-bone/25 mb-0.5">Lift</p>
                    <p className="font-bold text-lg text-cyan neon-cyan"
                      style={{ fontFamily: 'var(--font-display)' }}>{exp.lift}</p>
                    <p className="font-mono text-[9px] text-bone/25">{exp.confidence} confidence</p>
                  </div>
                )}
              </div>

              {exp.status !== 'draft' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Control', data: exp.control },
                    { label: 'Variant A', data: exp.variant },
                  ].map(({ label, data }) => (
                    <div key={label} className="bg-bone/3 border border-bone/8 p-3">
                      <p className="font-mono text-[9px] text-bone/30 mb-2 uppercase tracking-wider">{label}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-bone/50">{data.visitors.toLocaleString()} visitors</span>
                        <span className="font-bold text-sm text-orange"
                          style={{ fontFamily: 'var(--font-display)' }}>{data.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
