'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ghostLog } from './ConsoleLog'

interface AuditInputs {
  callsPerDay: number
  avgJobValue: number
  missedCallRate: number      // %
  followUpFailRate: number    // %
  daysPerYear: number
}

interface AuditResult {
  missedCallLeak: number
  followUpLeak: number
  totalLeak: number
  sops: string[]
}

function calculateLeak(inputs: AuditInputs): AuditResult {
  const annualCalls = inputs.callsPerDay * inputs.daysPerYear
  const missedCalls = annualCalls * (inputs.missedCallRate / 100)
  const missedCallLeak = missedCalls * inputs.avgJobValue * 0.3 // 30% close rate on answered calls

  const followUpOpps = annualCalls * (1 - inputs.missedCallRate / 100)
  const followUpLeak =
    followUpOpps * (inputs.followUpFailRate / 100) * inputs.avgJobValue * 0.2

  const totalLeak = missedCallLeak + followUpLeak

  const sops: string[] = [
    `Deploy AI voice agent on primary inbound line — recover ${Math.round(missedCalls)} annual missed calls`,
    `Automate follow-up sequence: SMS + email within 5 min of call end`,
    `Integrate GHL pipeline: every inbound call creates a contact + opportunity`,
    `Set up Retell post-call webhook → n8n → GHL opportunity stage update`,
    `Morning briefing: daily digest of previous day's calls, outcomes, and follow-ups due`,
  ]

  return { missedCallLeak, followUpLeak, totalLeak, sops }
}

const DEFAULTS: AuditInputs = {
  callsPerDay: 20,
  avgJobValue: 4500,
  missedCallRate: 35,
  followUpFailRate: 60,
  daysPerYear: 250,
}

export function AuditCalculator() {
  const [inputs, setInputs] = useState<AuditInputs>(DEFAULTS)
  const [result, setResult] = useState<AuditResult | null>(null)

  function handleChange(key: keyof AuditInputs, value: string) {
    setInputs((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  function runAudit() {
    ghostLog('DECRYPT_INTEL', 'Running revenue leak analysis...')
    const r = calculateLeak(inputs)
    setResult(r)
    ghostLog(
      'BYPASS_FRICTION',
      `Total annual leak: $${r.totalLeak.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    )
  }

  const fields: { key: keyof AuditInputs; label: string; suffix?: string }[] = [
    { key: 'callsPerDay', label: 'Inbound Calls / Day' },
    { key: 'avgJobValue', label: 'Avg Job Value', suffix: '$' },
    { key: 'missedCallRate', label: 'Missed Call Rate', suffix: '%' },
    { key: 'followUpFailRate', label: 'Failed Follow-Up Rate', suffix: '%' },
    { key: 'daysPerYear', label: 'Operating Days / Year' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input panel */}
      <div className="bg-[#0d0d0d] border border-white/10 p-6 space-y-5">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
          Business Variables
        </p>

        {fields.map(({ key, label, suffix }) => (
          <div key={key} className="space-y-1">
            <label className="font-mono text-xs text-white/50 uppercase tracking-wider">
              {label}
            </label>
            <div className="flex items-center gap-2">
              {suffix && (
                <span className="font-mono text-sm text-[#fa7002]">{suffix}</span>
              )}
              <input
                type="number"
                value={inputs[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="flex-1 bg-[#010101] border border-white/10 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#fa7002] transition-colors"
              />
            </div>
          </div>
        ))}

        <button
          onClick={runAudit}
          className="btn-ghost-primary border-lightpipe w-full py-3 text-xs tracking-[0.2em] mt-2"
        >
          CALCULATE REVENUE LEAK
        </button>
      </div>

      {/* Result panel */}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#0d0d0d] border border-white/10 p-6 space-y-6"
          >
            <p className="font-mono text-xs text-[#fa7002] uppercase tracking-widest">
              [LEAK ANALYSIS COMPLETE]
            </p>

            {/* Breakdown */}
            <div className="space-y-3">
              {[
                { label: 'Missed Call Leak', value: result.missedCallLeak },
                { label: 'Follow-Up Failure Leak', value: result.followUpLeak },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-xs text-white/50">{label}</span>
                  <span className="font-mono text-sm text-white">
                    ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-1">
                <span className="font-mono text-xs text-white/70 uppercase tracking-wider">Total Annual Leak</span>
                <span
                  className="font-display text-2xl font-bold text-[#fa7002] glow-orange"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ${result.totalLeak.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Tactical SOP */}
            <div className="space-y-2">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
                Tactical SOP
              </p>
              <ul className="space-y-2">
                {result.sops.map((sop, i) => (
                  <li key={i} className="flex gap-3 font-mono text-xs text-white/60 leading-relaxed">
                    <span className="text-[#fa7002] shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                    {sop}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="bg-[#0d0d0d] border border-dashed border-white/10 p-6 flex items-center justify-center"
          >
            <p className="font-mono text-xs text-white/25 text-center">
              [AWAITING AUDIT PARAMETERS]<br />
              Configure inputs and run diagnostics.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
