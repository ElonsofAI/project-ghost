'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RevenueOdometer } from '@/components/RevenueOdometer'

export default function HeroPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Scan line animation */}
      <div className="scan-line absolute inset-x-0 top-0 pointer-events-none" aria-hidden />

      {/* System tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="ghost-tag mb-10"
      >
        <span className="cursor-blink">▮</span>
        PROTOCOL.EXE // INITIALIZED
      </motion.div>

      {/* Headline */}
      <div className="text-center max-w-5xl space-y-3 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-bold uppercase leading-none tracking-tight text-bone"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
        >
          Learn How to Make{' '}
          <span className="text-orange neon-orange">$100K+</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-bold uppercase leading-none tracking-tight text-bone/70"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 4rem)' }}
        >
          Building AI Voice Agents
        </motion.h2>
      </div>

      {/* Odometer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mb-8"
      >
        <RevenueOdometer target={280000} />
      </motion.div>

      {/* Sub copy */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="font-sans text-sm text-bone/40 text-center max-w-lg mb-10 leading-relaxed font-light"
      >
        Your prospects are hemorrhaging{' '}
        <span className="text-orange font-medium">$280,000/yr</span> in missed calls and
        broken follow-up. You are the fix. Ghost Protocol shows you how.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 items-center"
      >
        <Link href="/login">
          <button className="stark-button-execute px-10 py-4 text-[11px] light-pipe">
            AUTHORIZE GHOST_PROTOCOL
          </button>
        </Link>
        <Link href="/audit">
          <button className="stark-button-cyan px-10 py-4 text-[11px]">
            RUN DIAGNOSTICS
          </button>
        </Link>
      </motion.div>

      {/* Bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
        className="absolute bottom-14 left-0 right-0 h-px opacity-20"
        style={{ background: 'linear-gradient(to right, transparent, #fa7002, #00FFFF, transparent)' }}
      />
    </main>
  )
}
