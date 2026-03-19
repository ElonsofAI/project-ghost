import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { clientId } = await req.json() as { clientId: string }

    // Verify client ownership
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('owner_id', user.id)
      .single()

    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    // Gather funnel data (last 30 days)
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: events } = await supabaseAdmin
      .from('events')
      .select('event')
      .eq('client_id', clientId)
      .gte('created_at', since)

    const counts: Record<string, number> = {}
    for (const e of events ?? []) counts[e.event] = (counts[e.event] ?? 0) + 1

    const sessions      = counts['session_init']   ?? 0
    const productViews  = counts['product_view']   ?? 0
    const cartAdds      = counts['cart_add']        ?? 0
    const checkouts     = counts['checkout_init']  ?? 0
    const purchases     = counts['purchase']        ?? 0

    const cvr           = sessions  ? ((purchases  / sessions)  * 100).toFixed(2) : '0'
    const cartRate      = sessions  ? ((cartAdds   / sessions)  * 100).toFixed(1) : '0'
    const checkoutRate  = cartAdds  ? ((checkouts  / cartAdds)  * 100).toFixed(1) : '0'
    const purchaseRate  = checkouts ? ((purchases  / checkouts) * 100).toFixed(1) : '0'

    // Fetch integrations for context
    const { data: integrations } = await supabaseAdmin
      .from('integrations')
      .select('platform')
      .eq('client_id', clientId)

    const connectedPlatforms = (integrations ?? []).map(i => i.platform)

    const prompt = `You are a senior CRO (Conversion Rate Optimization) analyst and performance marketing expert. Analyze this Shopify store's funnel data and identify revenue leaks ranked by impact.

STORE: ${client.name} (${client.shop_domain})
PERIOD: Last 30 days

FUNNEL DATA:
- Sessions: ${sessions}
- Product Views: ${productViews}
- Cart Additions: ${cartAdds} (Cart Rate: ${cartRate}%)
- Checkout Initiated: ${checkouts} (Checkout Rate from cart: ${checkoutRate}%)
- Purchases: ${purchases} (Purchase Rate from checkout: ${purchaseRate}%)
- Overall CVR: ${cvr}%

CONNECTED PLATFORMS: ${connectedPlatforms.length > 0 ? connectedPlatforms.join(', ') : 'None yet'}

Based on this data, identify the top 5 revenue leaks. For each finding, provide:
1. A specific, actionable title
2. The channel (Website, Email, Ads, SMS, etc.)
3. The category (Checkout, Cart, Landing Page, Ad Spend, Email, etc.)
4. Impact level: critical (>$10k/mo at risk), high ($5-10k), medium ($1-5k), low (<$1k)
5. Estimated revenue at risk per month (be specific with $ amounts based on typical Shopify benchmarks)
6. A clear description of the problem
7. 3-5 specific actions to fix it

Industry benchmarks for context:
- Average Shopify CVR: 1.5-3.5%
- Average cart abandonment: 70-75%
- Average checkout abandonment: 45-55%
- Average email revenue contribution: 25-30% of total revenue

Respond ONLY with valid JSON in this exact format:
{
  "findings": [
    {
      "rank": 1,
      "title": "...",
      "channel": "...",
      "category": "...",
      "impact": "critical|high|medium|low",
      "revenueAtRisk": "$X,XXX/mo",
      "description": "...",
      "actions": ["...", "...", "..."]
    }
  ]
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const parsed = JSON.parse(text)

    // Store audit results
    if (parsed.findings?.length > 0) {
      await supabaseAdmin.from('audit_findings').insert(
        parsed.findings.map((f: Record<string, unknown>) => ({
          client_id: clientId,
          rank: f.rank,
          title: f.title,
          channel: f.channel,
          category: f.category,
          impact: f.impact,
          revenue_at_risk: f.revenueAtRisk,
          description: f.description,
          actions: f.actions,
        }))
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[AUDIT ERROR]', err)
    return NextResponse.json({ error: 'Audit failed', findings: [] }, { status: 500 })
  }
}
