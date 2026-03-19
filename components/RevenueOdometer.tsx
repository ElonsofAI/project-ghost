'use client'

import { useEffect, useRef, useState } from 'react'

interface RevenueOdometerProps {
  target: number
  duration?: number
  prefix?: string
}

export function RevenueOdometer({ target, duration = 2200, prefix = '$' }: RevenueOdometerProps) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    function easeOutExpo(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }
    function animate(ts: number) {
      if (startRef.current === null) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      setDisplay(Math.floor(easeOutExpo(progress) * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      else setDisplay(target)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return (
    <div className="text-center">
      <p className="font-mono text-[9px] text-bone/35 uppercase tracking-[0.3em] mb-2">
        Annual Revenue Leak Detected
      </p>
      <div
        className="font-bold tabular-nums text-orange neon-orange"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix}{display.toLocaleString('en-US')}
        <span className="text-bone/25" style={{ fontSize: '40%' }}>/yr</span>
      </div>
    </div>
  )
}
