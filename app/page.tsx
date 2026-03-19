'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RevenueOdometer } from '@/components/RevenueOdometer'
import { HowItWorks } from '@/components/HowItWorks'

export default function HeroPage() {
  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden">

      {/* ── TOP NAV ──────────────────────────────────────── */}
      <nav className="w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-12 bg-obsidian/80 backdrop-blur-sm border-b border-bone/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange" />
          <span className="font-bold tracking-[0.25em] uppercase text-orange neon-orange text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>GHOST</span>
        </div>
        <Link href="/login">
          <button className="font-mono text-[10px] tracking-widest text-bone/40 hover:text-bone transition-colors border border-bone/10 hover:border-bone/30 px-4 py-1.5">
            TEAM LOGIN →
          </button>
        </Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="w-full flex flex-col items-center justify-center px-6 min-h-screen relative pt-12">
        {/* Scan line */}
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
            Stop Leaking Revenue<br />
            <span className="text-orange neon-orange">On Your Shopify Store</span>
          </motion.h1>
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
          Ghost Protocol installs in 60 seconds, runs an AI audit of your entire funnel,
          and gives you a{' '}
          <span className="text-orange font-medium">ranked list of every revenue leak</span>{' '}
          — with exactly how to fix each one.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 items-center mb-16"
        >
          <a
            href="mailto:nate@elonsofai.com?subject=Audit Request&body=Store URL:%0ABusiness type:%0AMonthly revenue (approx):%0AMain challenge:"
            className="stark-button-execute px-10 py-4 text-[11px] light-pipe"
          >
            REQUEST AN AUDIT →
          </a>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="stark-button-cyan px-10 py-4 text-[11px]"
          >
            SEE HOW IT WORKS ↓
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="font-mono text-[8px] text-bone/20 tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-bone/20 text-xs"
          >↓</motion.div>
        </motion.div>

        {/* Bottom gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
          className="absolute bottom-14 left-0 right-0 h-px opacity-20"
          style={{ background: 'linear-gradient(to right, transparent, #fa7002, #00FFFF, transparent)' }}
        />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <div id="how-it-works" className="w-full border-t border-bone/5">
        <HowItWorks />
      </div>

    </main>
  )
}
