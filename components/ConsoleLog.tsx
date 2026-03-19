'use client'

import { useEffect, useState } from 'react'

type LogEntry = { id: number; tag: string; message: string; ts: string }

const BOOT_SEQUENCE: Omit<LogEntry, 'id' | 'ts'>[] = [
  { tag: 'INIT_PROTOCOL',           message: 'Ghost Protocol initialized. Standing by.' },
  { tag: 'DECRYPT_INTEL',           message: 'Revenue leak data loaded. $280,000 baseline confirmed.' },
  { tag: 'BYPASS_FRICTION',         message: 'Authentication layer armed. Awaiting operator.' },
]

export function ConsoleLog() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [counter, setCounter] = useState(0)

  // Boot sequence
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        const entry = BOOT_SEQUENCE[i]
        setLogs((prev) => [
          ...prev,
          { id: Date.now() + i, tag: entry.tag, message: entry.message, ts: now() },
        ])
        i++
      } else {
        clearInterval(interval)
      }
    }, 900)
    return () => clearInterval(interval)
  }, [])

  // Live log events
  useEffect(() => {
    const handler = (e: CustomEvent<Omit<LogEntry, 'id' | 'ts'>>) => {
      setLogs((prev) => [
        ...prev.slice(-24),
        { id: Date.now() + counter, tag: e.detail.tag, message: e.detail.message, ts: now() },
      ])
      setCounter((c) => c + 1)
    }
    window.addEventListener('ghost:log', handler as EventListener)
    return () => window.removeEventListener('ghost:log', handler as EventListener)
  }, [counter])

  return (
    <div className="shrink-0 h-10 bg-obsidian border-t border-bone/8 flex items-center px-4 gap-2 overflow-hidden z-50">
      {/* Status dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange shrink-0" />
      <span className="font-mono text-[9px] text-orange/60 tracking-[0.25em] uppercase shrink-0 mr-2">
        GHOST_TERMINAL
      </span>
      <div className="flex gap-8 overflow-x-auto scrollbar-none whitespace-nowrap flex-1">
        {logs.length === 0 ? (
          <span className="font-mono text-[10px] text-bone/20">
            Awaiting protocol initialization<span className="cursor-blink">_</span>
          </span>
        ) : (
          logs.map((log) => (
            <span key={log.id} className="font-mono text-[10px] shrink-0">
              <span className="text-bone/20">{log.ts} </span>
              <span className="text-orange neon-orange">[{log.tag}]</span>
              <span className="text-bone/45"> {log.message}</span>
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export function ghostLog(tag: string, message: string) {
  window.dispatchEvent(new CustomEvent('ghost:log', { detail: { tag, message } }))
}

function now() {
  return new Date().toISOString().split('T')[1].split('.')[0]
}
