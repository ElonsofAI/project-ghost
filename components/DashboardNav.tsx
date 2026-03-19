'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { href: '/dashboard', label: 'NODES' },
  { href: '/clients',   label: 'CLIENTS' },
  { href: '/audit',     label: 'DIAGNOSTICS' },
]

export function DashboardNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="shrink-0 h-14 border-b border-bone/8 px-6 flex items-center justify-between bg-obsidian/80 backdrop-blur-sm z-40">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange pulse-orange" />
          <span className="font-chakra text-sm font-bold tracking-[0.25em] uppercase text-orange neon-orange"
            style={{ fontFamily: 'var(--font-display)' }}>
            GHOST
          </span>
        </Link>

        <div className="flex gap-5">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
                  active
                    ? 'text-bone'
                    : 'text-bone/30 hover:text-bone/60'
                }`}
              >
                {active && <span className="text-orange mr-1">/</span>}
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <span className="font-mono text-[10px] text-bone/25 hidden sm:block tracking-wider">
          {userEmail}
        </span>
        <button
          onClick={signOut}
          className="stark-button-orange px-4 py-1.5 text-[9px]"
        >
          EXIT
        </button>
      </div>
    </nav>
  )
}
