'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Client = {
  id: string
  name: string
  shop_domain: string
  api_key: string
  status: string
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients]   = useState<Client[]>([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [form, setForm]         = useState({ name: '', shop_domain: '' })
  const [copied, setCopied]     = useState<string | null>(null)

  async function loadClients() {
    const res = await fetch('/api/clients')
    const data = await res.json()
    setClients(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { loadClients() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: '', shop_domain: '' })
      setAdding(false)
      loadClients()
    }
  }

  function snippet(client: Client) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'
    return `<script>window.__GHOST_API_KEY="${client.api_key}";window.__GHOST_TELEMETRY_URL="${origin}";</script>\n<script src="${origin}/ghost-listener.js" defer></script>`
  }

  function copySnippet(client: Client) {
    navigator.clipboard.writeText(snippet(client))
    setCopied(client.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [CLIENT_NODES // ROSTER]
          </p>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}>
            Client Roster
          </h1>
        </div>
        <button onClick={() => setAdding(!adding)} className="stark-button-orange px-5 py-2">
          {adding ? 'CANCEL' : '+ ONBOARD'}
        </button>
      </div>

      {/* Add client form */}
      {adding && (
        <div className="light-pipe p-6 space-y-4">
          <p className="ghost-tag">NEW_CLIENT_INTAKE</p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.25em]">
                  Client Name
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Apex Roofing Co."
                  required
                  className="ghost-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.25em]">
                  Shopify Domain
                </label>
                <input
                  value={form.shop_domain}
                  onChange={e => setForm(f => ({ ...f, shop_domain: e.target.value }))}
                  placeholder="store.myshopify.com"
                  required
                  className="ghost-input"
                />
              </div>
            </div>
            <button type="submit" className="stark-button-execute px-8 py-2.5 text-[10px] light-pipe">
              INITIALIZE CLIENT
            </button>
          </form>
        </div>
      )}

      {/* Client list */}
      {loading ? (
        <p className="font-mono text-[10px] text-bone/25">[LOADING_CLIENTS<span className="cursor-blink">_</span>]</p>
      ) : clients.length === 0 ? (
        <div className="light-pipe p-10 text-center">
          <p className="font-mono text-[10px] text-bone/25 tracking-wider">
            [NO_CLIENTS_DETECTED] — Onboard your first client above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="light-pipe-elevated p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:light-pipe-glow"
            >
              <div className="flex items-center gap-6 min-w-0">
                {/* Status dot */}
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  client.status === 'active' ? 'bg-cyan pulse-orange' : 'bg-bone/20'
                }`}
                  style={client.status === 'active' ? { boxShadow: '0 0 6px rgba(0,255,255,0.6)' } : {}}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="font-bold uppercase tracking-wide text-sm text-bone truncate"
                      style={{ fontFamily: 'var(--font-display)' }}>
                      {client.name}
                    </span>
                    <span className={`font-mono text-[9px] tracking-widest px-1.5 py-0.5 border shrink-0 ${
                      client.status === 'active'
                        ? 'border-cyan/30 text-cyan'
                        : 'border-bone/15 text-bone/30'
                    }`}>
                      {client.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-bone/30">{client.shop_domain}</p>
                  <p className="font-mono text-[9px] text-bone/15 mt-0.5">
                    {client.api_key.slice(0, 8)}••••••••••••••••
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copySnippet(client)}
                  className={`stark-button-${copied === client.id ? 'cyan' : 'orange'} px-4 py-1.5 text-[9px]`}
                >
                  {copied === client.id ? 'COPIED ✓' : 'COPY SNIPPET'}
                </button>
                <Link
                  href={`/clients/${client.id}`}
                  className="stark-button-cyan px-4 py-1.5 text-[9px]"
                >
                  VIEW FUNNEL →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
