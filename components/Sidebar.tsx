'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const NAV = [
  {
    group: 'INTELLIGENCE',
    items: [
      { href: '/overview',      label: 'Overview',       icon: '◈' },
      { href: '/audit',         label: 'CRO Audit',      icon: '⬡', highlight: true },
      { href: '/experiments',   label: 'Experiments',    icon: '⟐' },
    ],
  },
  {
    group: 'PERFORMANCE',
    items: [
      { href: '/pnl',           label: 'P&L Tracker',    icon: '◎' },
      { href: '/attribution',   label: 'Ad Attribution', icon: '◉' },
      { href: '/funnel',        label: 'Shopify Funnel', icon: '▽' },
      { href: '/cohorts',       label: 'Cohorts',        icon: '◌' },
    ],
  },
  {
    group: 'CHANNELS',
    items: [
      { href: '/email-sms',     label: 'Email & SMS',    icon: '◷' },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { href: '/clients',       label: 'Clients',        icon: '◫' },
      { href: '/integrations',  label: 'Integrations',   icon: '⬡' },
      { href: '/dashboard',     label: 'Nodes',          icon: '◈' },
    ],
  },
]

// Bottom tab bar items for mobile (most important 5)
const TABS = [
  { href: '/overview',     label: 'Overview',  icon: '◈' },
  { href: '/pnl',          label: 'P&L',       icon: '◎' },
  { href: '/audit',        label: 'Audit',     icon: '⬡' },
  { href: '/clients',      label: 'Clients',   icon: '◫' },
  { href: '/integrations', label: 'Connect',   icon: '⊕' },
]

function NavLink({ href, label, icon, highlight, onClick }: {
  href: string; label: string; icon: string; highlight?: boolean; onClick?: () => void
}) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-2 py-2 transition-all duration-150 group ${
        active
          ? 'bg-orange/10 border-l-2 border-orange'
          : 'border-l-2 border-transparent hover:bg-bone/4'
      }`}
    >
      <span className={`text-[11px] shrink-0 ${
        active ? 'text-orange' : highlight ? 'text-cyan/70' : 'text-bone/30 group-hover:text-bone/50'
      }`}>{icon}</span>
      <span className={`font-mono text-[10px] tracking-wider ${
        active ? 'text-bone' : 'text-bone/40 group-hover:text-bone/70'
      }`}>{label}</span>
      {highlight && !active && (
        <span className="ml-auto font-mono text-[8px] text-cyan/60 tracking-widest">AI</span>
      )}
    </Link>
  )
}

function MobileTabBar() {
  const pathname = usePathname()
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian border-t border-bone/8 flex">
      {TABS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              active ? 'text-orange' : 'text-bone/30'
            }`}
          >
            <span className="text-sm">{icon}</span>
            <span className="font-mono text-[8px] tracking-wider">{label}</span>
          </Link>
        )
      })}
    </div>
  )
}

function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2.5 px-2 py-2 w-full border-l-2 border-transparent hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-150 group ${className}`}
    >
      <span className="text-[11px] text-bone/30 group-hover:text-red-400">⏻</span>
      <span className="font-mono text-[10px] tracking-wider text-bone/40 group-hover:text-red-400">Sign Out</span>
    </button>
  )
}

export function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
      <aside className="hidden lg:flex w-52 shrink-0 border-r border-bone/8 flex-col bg-obsidian/60 overflow-y-auto">
        <div className="h-14 flex items-center px-5 border-b border-bone/8 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange" />
            <span className="font-bold tracking-[0.25em] uppercase text-orange neon-orange text-sm"
              style={{ fontFamily: 'var(--font-display)' }}>GHOST</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-5">
          {NAV.map((section) => (
            <div key={section.group}>
              <p className="font-mono text-[8px] text-bone/25 tracking-[0.3em] uppercase px-2 mb-1.5">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-bone/8 shrink-0 space-y-2">
          <LogoutButton />
          <p className="font-mono text-[8px] text-bone/20 tracking-wider px-2">ELONS OF AI // v0.1</p>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ──────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-12 bg-obsidian border-b border-bone/8 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange" />
          <span className="font-bold tracking-[0.25em] uppercase text-orange neon-orange text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>GHOST</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col gap-1 p-2"
          aria-label="Open menu"
        >
          <span className="w-5 h-px bg-bone/60" />
          <span className="w-5 h-px bg-bone/60" />
          <span className="w-3 h-px bg-bone/60" />
        </button>
      </div>

      {/* ── MOBILE DRAWER ───────────────────────────────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative w-64 bg-obsidian border-r border-bone/8 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="h-12 flex items-center justify-between px-5 border-b border-bone/8 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange" />
                <span className="font-bold tracking-[0.25em] uppercase text-orange neon-orange text-sm"
                  style={{ fontFamily: 'var(--font-display)' }}>GHOST</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-bone/40 text-lg">✕</button>
            </div>
            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-5">
              {NAV.map((section) => (
                <div key={section.group}>
                  <p className="font-mono text-[8px] text-bone/25 tracking-[0.3em] uppercase px-2 mb-1.5">
                    {section.group}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map(item => (
                      <NavLink key={item.href} {...item} onClick={() => setDrawerOpen(false)} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="px-3 py-3 border-t border-bone/8 shrink-0 space-y-2">
              <LogoutButton />
              <p className="font-mono text-[8px] text-bone/20 tracking-wider px-2">ELONS OF AI // v0.1</p>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM TAB BAR ───────────────────────── */}
      <MobileTabBar />
    </>
  )
}
