'use client'

import { useEffect } from 'react'
import { ghostLog } from './ConsoleLog'
import type { TelemetryEvent } from '@/lib/telemetry-bus'

function mapEventToLog(event: TelemetryEvent): { tag: string; message: string } | null {
  const shop = event.shopDomain ? ` // ${event.shopDomain}` : ''

  switch (event.event) {
    case 'session_init':
      return {
        tag: 'INIT_PROTOCOL',
        message: `New session detected${shop}. Origin: ${(event.data.referrer as string) || 'direct'}`,
      }
    case 'cart_add':
      return {
        tag: 'DECRYPT_CONVERSION_PATH',
        message: `Cart addition event${shop}. User friction analysis initiated.`,
      }
    case 'checkout_init':
      return {
        tag: 'BYPASS_FRICTION_NODE',
        message: `Checkout initiated${shop}. AI-driven CTA sequence armed.`,
      }
    default:
      return null
  }
}

export function TelemetryFeed() {
  useEffect(() => {
    const es = new EventSource('/api/telemetry')

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as TelemetryEvent & { type?: string }
        if (payload.type === 'connected') return
        const log = mapEventToLog(payload)
        if (log) ghostLog(log.tag, log.message)
      } catch (_) {}
    }

    es.onerror = () => {
      // SSE auto-reconnects; no action needed
    }

    return () => es.close()
  }, [])

  return null
}
