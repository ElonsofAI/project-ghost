'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    icon: '⬡',
    color: 'orange',
    title: 'INSTALL GHOST LISTENER',
    subtitle: 'One line of code. Zero friction.',
    description:
      'Paste a single script tag into your Shopify theme. Ghost Listener silently tracks every session, product view, cart action, and checkout event — in real time.',
    detail: 'Works on any Shopify store. No app install. No permissions. Just data.',
  },
  {
    number: '02',
    icon: '◈',
    color: 'cyan',
    title: 'AI RUNS YOUR CRO AUDIT',
    subtitle: 'Claude analyzes your entire funnel.',
    description:
      'Our AI cross-references your live event data with your ad spend, email revenue, and conversion rates — then surfaces every point where revenue is leaking.',
    detail: 'Ranked by impact. Critical issues first. Revenue at risk quantified.',
  },
  {
    number: '03',
    icon: '▽',
    color: 'orange',
    title: 'GET YOUR REVENUE ROADMAP',
    subtitle: 'A prioritized list of exactly what to fix.',
    description:
      'Every audit finding comes with a title, impact score, revenue at risk, and 3 specific actions to fix it. No guessing. No generic advice. Surgical precision.',
    detail: 'Findings ranked: Critical → High → Medium → Low.',
  },
  {
    number: '04',
    icon: '⟐',
    color: 'cyan',
    title: 'BUILD SPLIT TESTS',
    subtitle: 'Turn findings into experiments.',
    description:
      'Each audit recommendation becomes a ready-to-launch A/B test. Test headlines, CTAs, product page layouts, checkout flows — all tracked inside Ghost.',
    detail: 'Statistical confidence shown live. Stop tests when winners emerge.',
  },
  {
    number: '05',
    icon: '◎',
    color: 'orange',
    title: 'WATCH PROFIT COMPOUND',
    subtitle: 'P&L updates as winners roll out.',
    description:
      'Your daily P&L, blended ROAS, MER, and contribution margin update automatically as Shopify + ad data syncs. See exactly what each test is worth in dollars.',
    detail: 'Connect Shopify, Meta, Google, Klaviyo. One dashboard. Full picture.',
  },
]

function Step({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isOrange = step.color === 'orange'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex gap-6 md:gap-10"
    >
      {/* Left: number + connector line */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-10 h-10 flex items-center justify-center border text-sm font-bold shrink-0 ${
          isOrange
            ? 'border-orange/40 text-orange bg-orange/5'
            : 'border-cyan/40 text-cyan bg-cyan/5'
        }`} style={{ fontFamily: 'var(--font-display)' }}>
          {step.number}
        </div>
        {index < STEPS.length - 1 && (
          <div className="w-px flex-1 mt-2"
            style={{
              background: isOrange
                ? 'linear-gradient(to bottom, rgba(250,112,2,0.3), rgba(0,255,255,0.15))'
                : 'linear-gradient(to bottom, rgba(0,255,255,0.3), rgba(250,112,2,0.15))',
              minHeight: '3rem',
            }}
          />
        )}
      </div>

      {/* Right: content card */}
      <div className="flex-1 pb-10 md:pb-14">
        <div className="light-pipe-elevated p-5 md:p-7 group hover:border-bone/15 transition-all duration-300">
          {/* Icon + title row */}
          <div className="flex items-start gap-4 mb-4">
            <span className={`text-2xl shrink-0 mt-0.5 ${isOrange ? 'text-orange' : 'text-cyan'}`}>
              {step.icon}
            </span>
            <div>
              <h3 className={`font-bold text-lg uppercase tracking-tight mb-0.5 ${
                isOrange ? 'text-orange' : 'text-cyan'
              }`} style={{ fontFamily: 'var(--font-display)' }}>
                {step.title}
              </h3>
              <p className="font-mono text-[10px] text-bone/40 tracking-[0.2em] uppercase">
                {step.subtitle}
              </p>
            </div>
          </div>

          <p className="font-sans text-sm text-bone/60 leading-relaxed font-light mb-3">
            {step.description}
          </p>

          <div className={`border-l-2 pl-3 ${isOrange ? 'border-orange/30' : 'border-cyan/30'}`}>
            <p className="font-mono text-[10px] text-bone/35 tracking-wide">
              {step.detail}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24">
      {/* Section header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center"
      >
        <p className="font-mono text-[9px] text-orange/70 tracking-[0.35em] uppercase mb-3">
          [PROTOCOL // HOW_IT_WORKS]
        </p>
        <h2 className="font-bold uppercase tracking-tight text-bone mb-4"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
          From Zero Data<br />
          <span className="text-orange neon-orange">To Full Clarity</span>
        </h2>
        <p className="font-sans text-sm text-bone/40 font-light max-w-md mx-auto leading-relaxed">
          Ghost Protocol turns your Shopify store into an intelligence machine.
          Here&apos;s the exact sequence.
        </p>
      </motion.div>

      {/* Steps */}
      <div>
        {STEPS.map((step, i) => (
          <Step key={step.number} step={step} index={i} />
        ))}
      </div>

      {/* CTA at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mt-4"
      >
        <div className="light-pipe p-6 space-y-4">
          <p className="font-mono text-[9px] text-bone/30 tracking-[0.3em] uppercase">
            [READY_TO_DEPLOY]
          </p>
          <p className="font-bold text-xl text-bone uppercase tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Your First Audit is Free
          </p>
          <p className="font-sans text-xs text-bone/40 font-light">
            No credit card. No sales call. Just install, audit, and see the leaks.
          </p>
          <a href="/login"
            className="stark-button-execute px-8 py-3 text-[11px] light-pipe inline-block">
            START GHOST PROTOCOL →
          </a>
        </div>
      </motion.div>
    </section>
  )
}
