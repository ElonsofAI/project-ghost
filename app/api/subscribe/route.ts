import { NextRequest, NextResponse } from 'next/server'
import { createGhostSubscription, createSquareCard, createSquareCustomer } from '@/lib/square'
import { createGhostSubscriber } from '@/lib/ghl'
import { createClient } from '@/lib/supabase-server'

/**
 * POST /api/subscribe
 *
 * Body: { sourceId: string }  (Square Web Payments tokenized card)
 *
 * Flow:
 *   1. Verify Supabase session
 *   2. Create Square Customer + Card + Subscription
 *   3. Create GHL Contact with GHOST_ARCHITECT tag
 *   4. Store subscription record in Supabase
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sourceId } = await req.json() as { sourceId: string }

    if (!sourceId) {
      return NextResponse.json({ error: 'sourceId required' }, { status: 400 })
    }

    // Square flow
    const customerId = await createSquareCustomer({ email: user.email })
    const cardId = await createSquareCard({ customerId, sourceId })
    const subscriptionId = await createGhostSubscription({ customerId, cardId })

    // GHL contact sync
    const ghlContactId = await createGhostSubscriber({ email: user.email })

    // Persist to Supabase
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      email: user.email,
      square_customer_id: customerId,
      square_subscription_id: subscriptionId,
      ghl_contact_id: ghlContactId,
      status: 'active',
    })

    return NextResponse.json({ ok: true, subscriptionId })
  } catch (err: unknown) {
    console.error('[SUBSCRIBE ERROR]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
