export type TelemetryEvent = {
  event: 'session_init' | 'cart_add' | 'checkout_init' | 'purchase' | string
  data: Record<string, unknown>
  ts: number
  url: string
  shopDomain?: string
  sessionId?: string
  clientId?: string
  clientApiKey?: string
}

type Listener = (event: TelemetryEvent) => void

const subscribers = new Set<Listener>()

export function subscribe(fn: Listener): () => void {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export function publish(event: TelemetryEvent): void {
  subscribers.forEach((fn) => {
    try { fn(event) } catch (_) { subscribers.delete(fn) }
  })
}
