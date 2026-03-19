'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const router  = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="ghost-tag mb-4">
            00-AGENT // AUTHENTICATION
          </div>
          <h1
            className="text-2xl font-bold uppercase tracking-wide text-bone"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {mode === 'login' ? 'Access Terminal' : 'Enlist as Operator'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.25em]">
              Agent Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ghost-input"
              placeholder="agent@domain.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.25em]">
              Access Code
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ghost-input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] text-red-400/80">
              [ERROR] {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="stark-button-execute w-full py-3.5 text-[11px] light-pipe mt-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading
              ? '[AUTHENTICATING...]'
              : mode === 'login'
              ? 'AUTHORIZE GHOST_PROTOCOL'
              : 'INITIALIZE OPERATOR'}
          </button>
        </form>

        {/* Mode toggle */}
        <p className="mt-6 font-mono text-[10px] text-bone/25 text-center">
          {mode === 'login' ? 'No credentials? ' : 'Already enlisted? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-cyan hover:text-cyan/80 transition-colors"
          >
            {mode === 'login' ? 'Request Access' : 'Login'}
          </button>
        </p>
      </motion.div>
    </main>
  )
}
