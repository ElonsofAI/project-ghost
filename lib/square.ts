/**
 * Square Web Payments SDK — server-side helpers.
 * Client-side card tokenization is done via the Square Web Payments JS SDK
 * loaded in the checkout page. This module handles server-side payment processing.
 *
 * Square SDK docs: https://developer.squareup.com/docs/web-payments/overview
 *
 * Flow:
 *   1. Client: Square Web Payments SDK tokenizes card → sourceId
 *   2. POST /api/subscribe with { sourceId, email }
 *   3. Server: createSubscription() → Square Subscription created
 */

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN!
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!
const SQUARE_ENV = process.env.SQUARE_ENVIRONMENT ?? 'sandbox'
const SQUARE_BASE =
  SQUARE_ENV === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com'

// Ghost Protocol plan ID — create this once in Square Dashboard
const GHOST_PROTOCOL_PLAN_ID = process.env.SQUARE_GHOST_PLAN_ID!

async function squareFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${SQUARE_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(`Square error: ${JSON.stringify(data.errors)}`)
  }

  return res.json() as Promise<T>
}

/**
 * Create a Square Customer for a Ghost Protocol subscriber.
 */
export async function createSquareCustomer(params: {
  email: string
  firstName?: string
}): Promise<string> {
  const data = await squareFetch<{ customer: { id: string } }>(
    '/v2/customers',
    {
      email_address: params.email,
      given_name: params.firstName ?? 'Ghost',
      idempotency_key: `customer-${params.email}-${Date.now()}`,
    }
  )
  return data.customer.id
}

/**
 * Create a card-on-file for a Square customer using the sourceId
 * returned by the client-side Square Web Payments SDK tokenization.
 */
export async function createSquareCard(params: {
  customerId: string
  sourceId: string
}): Promise<string> {
  const data = await squareFetch<{ card: { id: string } }>('/v2/cards', {
    idempotency_key: `card-${params.customerId}-${Date.now()}`,
    source_id: params.sourceId,
    card: { customer_id: params.customerId },
  })
  return data.card.id
}

/**
 * Subscribe a customer to the $49/mo Ghost Protocol plan.
 * Returns the Square subscription ID.
 */
export async function createGhostSubscription(params: {
  customerId: string
  cardId: string
}): Promise<string> {
  const data = await squareFetch<{ subscription: { id: string } }>(
    '/v2/subscriptions',
    {
      idempotency_key: `sub-${params.customerId}-${Date.now()}`,
      location_id: SQUARE_LOCATION_ID,
      plan_variation_id: GHOST_PROTOCOL_PLAN_ID,
      customer_id: params.customerId,
      card_id: params.cardId,
    }
  )
  return data.subscription.id
}
