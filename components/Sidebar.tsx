'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 shrink-0 border-r border-bone/8 flex flex-col bg-obsidian/60 overflow-y-auto">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-bone/8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange" />
          <span className="font-bold tracking-[0.25em] uppercase text-orange neon-orange text-sm"
            style={{ fontFamily: 'var(--font-display)' }}>
            GHOST
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="font-mono text-[8px] text-bone/25 tracking-[0.3em] uppercase px-2 mb-1.5">
              {section.group}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon, highlight }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-2 py-1.5 transition-all duration-150 group ${
                      active
                        ? 'bg-orange/10 border-l-2 border-orange'
                        : 'border-l-2 border-transparent hover:bg-bone/4'
                    }`}
                  >
                    <span className={`text-[11px] shrink-0 ${
                      active ? 'text-orange' : highlight ? 'text-cyan/70' : 'text-bone/30 group-hover:text-bone/50'
                    }`}>
                      {icon}
                    </span>
                    <span className={`font-mono text-[10px] tracking-wider ${
                      active ? 'text-bone' : 'text-bone/40 group-hover:text-bone/70'
                    }`}>
                      {label}
                    </span>
                    {highlight && !active && (
                      <span className="ml-auto font-mono text-[8px] text-cyan/60 tracking-widest">AI</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-bone/8 shrink-0">
        <p className="font-mono text-[8px] text-bone/20 tracking-wider">ELONS OF AI // v0.1</p>
      </div>
    </aside>
  )
}
