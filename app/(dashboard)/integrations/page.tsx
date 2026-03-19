'use client'

import { useState, useEffect } from 'react'

type Integration = {
  id: string
  platform: string
  label: string
  description: string
  status: 'connected' | 'disconnected'
  icon: string
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[]
}

const PLATFORMS: Integration[] = [
  {
    id: 'shopify',
    platform: 'shopify',
    label: 'Shopify',
    description: 'Pull orders, revenue, AOV, refunds, and product data via Admin API.',
    status: 'disconnected',
    icon: '⬡',
    fields: [
      { key: 'shop_domain',    label: 'Shop Domain',    placeholder: 'your-store.myshopify.com' },
      { key: 'access_token',   label: 'Admin API Token', placeholder: 'shpat_xxxx', secret: true },
    ],
  },
  {
    id: 'meta',
    platform: 'meta',
    label: 'Meta Ads',
    description: 'Pull Facebook & Instagram ad spend, ROAS, impressions, and CPC.',
    status: 'disconnected',
    icon: '◉',
    fields: [
      { key: 'access_token',   label: 'Access Token',   placeholder: 'EAAxxxx', secret: true },
      { key: 'account_id',     label: 'Ad Account ID',  placeholder: 'act_xxxx' },
    ],
  },
  {
    id: 'google',
    platform: 'google',
    label: 'Google Ads',
    description: 'Pull Google Ads spend, ROAS, keywords, and campaign performance.',
    status: 'disconnected',
    icon: '◈',
    fields: [
      { key: 'customer_id',    label: 'Customer ID',    placeholder: '123-456-7890' },
      { key: 'developer_token', label: 'Developer Token', placeholder: 'xxxx', secret: true },
      { key: 'refresh_token',  label: 'Refresh Token',  placeholder: 'xxxx', secret: true },
    ],
  },
  {
    id: 'klaviyo',
    platform: 'klaviyo',
    label: 'Klaviyo',
    description: 'Pull email/SMS revenue attribution, flow performance, and list growth.',
    status: 'disconnected',
    icon: '◷',
    fields: [
      { key: 'api_key',        label: 'Private API Key', placeholder: 'pk_xxxx', secret: true },
    ],
  },
  {
    id: 'tiktok',
    platform: 'tiktok',
    label: 'TikTok Ads',
    description: 'Pull TikTok ad spend, ROAS, and creative performance data.',
    status: 'disconnected',
    icon: '▷',
    fields: [
      { key: 'access_token',   label: 'Access Token',   placeholder: 'xxxx', secret: true },
      { key: 'advertiser_id',  label: 'Advertiser ID',  placeholder: 'xxxx' },
    ],
  },
  {
    id: 'ghl',
    platform: 'ghl',
    label: 'GoHighLevel',
    description: 'Sync contacts, pipeline stages, and CRM data into Ghost.',
    status: 'disconnected',
    icon: '◫',
    fields: [
      { key: 'api_key',        label: 'Location API Key', placeholder: 'xxxx', secret: true },
      { key: 'location_id',    label: 'Location ID',      placeholder: 'xxxx' },
    ],
  },
]

export default function IntegrationsPage() {
  const [clients, setClients]         = useState<{ id: string; name: string }[]>([])
  const [selectedClient, setSelected] = useState<string>('')
  const [expanded, setExpanded]       = useState<string | null>(null)
  const [forms, setForms]             = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving]           = useState<string | null>(null)
  const [saved, setSaved]             = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/clients').then(r => r.json()).then(data => {
      setClients(data)
      if (data.length > 0) setSelected(data[0].id)
    })
  }, [])

  function setField(platform: string, key: string, value: string) {
    setForms(prev => ({
      ...prev,
      [platform]: { ...(prev[platform] ?? {}), [key]: value },
    }))
  }

  async function handleSave(integration: Integration) {
    setSaving(integration.id)
    await fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: selectedClient,
        platform: integration.platform,
        credentials: forms[integration.id] ?? {},
      }),
    })
    setSaving(null)
    setSaved(integration.id)
    setExpanded(null)
    setTimeout(() => setSaved(null), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
          [SYSTEM // INTEGRATIONS]
        </p>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-bone"
          style={{ fontFamily: 'var(--font-display)' }}>
          Data Sources
        </h1>
        <p className="font-sans text-xs text-bone/35 mt-1 font-light">
          Connect your platforms to unlock AI audit intelligence.
        </p>
      </div>

      {/* Client selector */}
      {clients.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-bone/35 uppercase tracking-wider">Client:</span>
          <select
            value={selectedClient}
            onChange={e => setSelected(e.target.value)}
            className="ghost-input w-auto py-1.5 px-3 text-xs"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Integration cards */}
      <div className="space-y-2">
        {PLATFORMS.map(integration => (
          <div key={integration.id} className="light-pipe-elevated">
            <div
              className="p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === integration.id ? null : integration.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-orange/60 text-base w-5 text-center shrink-0">
                  {integration.icon}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-bone uppercase tracking-wide"
                      style={{ fontFamily: 'var(--font-display)' }}>
                      {integration.label}
                    </span>
                    {saved === integration.id && (
                      <span className="font-mono text-[9px] text-cyan tracking-widest">CONNECTED ✓</span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-bone/35 font-light mt-0.5">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`font-mono text-[9px] px-2 py-0.5 border ${
                  saved === integration.id
                    ? 'border-cyan/30 text-cyan'
                    : 'border-bone/15 text-bone/30'
                }`}>
                  {saved === integration.id ? 'ACTIVE' : 'CONNECT'}
                </span>
                <span className="font-mono text-[9px] text-bone/25">
                  {expanded === integration.id ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {expanded === integration.id && (
              <div className="px-5 pb-5 border-t border-bone/8 pt-4 space-y-3">
                {integration.fields.map(field => (
                  <div key={field.key} className="space-y-1">
                    <label className="font-mono text-[9px] text-bone/40 uppercase tracking-[0.2em]">
                      {field.label}
                    </label>
                    <input
                      type={field.secret ? 'password' : 'text'}
                      placeholder={field.placeholder}
                      value={forms[integration.id]?.[field.key] ?? ''}
                      onChange={e => setField(integration.id, field.key, e.target.value)}
                      className="ghost-input"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleSave(integration)}
                  disabled={saving === integration.id || !selectedClient}
                  className="stark-button-execute px-6 py-2 text-[10px] light-pipe mt-2 disabled:opacity-30"
                >
                  {saving === integration.id ? 'CONNECTING...' : 'AUTHORIZE CONNECTION'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
