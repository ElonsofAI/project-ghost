import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Syncs the last N days of Shopify orders into daily_metrics for one client
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { client_id, days = 30 } = await req.json()
  if (!client_id) return NextResponse.json({ error: 'client_id required' }, { status: 400 })

  // Verify client belongs to this user
  const { data: client } = await supabase
    .from('clients').select('id').eq('id', client_id).eq('owner_id', user.id).single()
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  // Get Shopify credentials
  const { data: integration } = await supabaseAdmin
    .from('integrations')
    .select('credentials')
    .eq('client_id', client_id)
    .eq('platform', 'shopify')
    .single()

  if (!integration) return NextResponse.json({ error: 'Shopify not connected for this client' }, { status: 400 })

  const { shop_domain, access_token } = integration.credentials as Record<string, string>
  if (!shop_domain || !access_token) {
    return NextResponse.json({ error: 'Missing shop_domain or access_token' }, { status: 400 })
  }

  // Date range
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const sinceISO = since.toISOString()

  // Fetch all orders from Shopify (handle pagination)
  const allOrders: ShopifyOrder[] = []
  let pageUrl: string | null =
    `https://${shop_domain}/admin/api/2024-01/orders.json?status=any&created_at_min=${sinceISO}&limit=250&financial_status=paid`

  while (pageUrl) {
    // eslint-disable-next-line no-await-in-loop
    const shopRes: Response = await fetch(pageUrl, {
      headers: {
        'X-Shopify-Access-Token': access_token,
        'Content-Type': 'application/json',
      },
    })

    if (!shopRes.ok) {
      // eslint-disable-next-line no-await-in-loop
      const text = await shopRes.text()
      return NextResponse.json({ error: `Shopify API error: ${shopRes.status} ${text}` }, { status: 502 })
    }

    // eslint-disable-next-line no-await-in-loop
    const shopData = await shopRes.json() as { orders: ShopifyOrder[] }
    allOrders.push(...(shopData.orders ?? []))

    // Check Link header for next page
    const linkHeader: string | null = shopRes.headers.get('Link')
    const nextMatch: RegExpMatchArray | null = linkHeader?.match(/<([^>]+)>;\s*rel="next"/) ?? null
    pageUrl = nextMatch ? nextMatch[1] : null
  }

  // Aggregate orders by date
  const byDate: Record<string, DayAgg> = {}

  for (const order of allOrders) {
    const date = order.created_at.slice(0, 10) // YYYY-MM-DD
    if (!byDate[date]) {
      byDate[date] = {
        net_sales: 0, gross_sales: 0, total_orders: 0,
        refunds: 0, discounts: 0, shipping: 0, cogs: 0,
      }
    }
    const d = byDate[date]
    const gross = parseFloat(order.total_price ?? '0')
    const refund = parseFloat(order.total_refunds ?? '0')
    const disc = parseFloat(order.total_discounts ?? '0')
    const ship = parseFloat(order.shipping_lines?.reduce(
      (s: number, l: { price: string }) => s + parseFloat(l.price ?? '0'), 0
    ).toString() ?? '0')

    d.gross_sales  += gross
    d.net_sales    += gross - refund
    d.refunds      += refund
    d.discounts    += disc
    d.shipping     += ship
    d.total_orders += 1
  }

  // Upsert into daily_metrics
  const rows = Object.entries(byDate).map(([date, d]) => {
    const aov = d.total_orders > 0 ? d.net_sales / d.total_orders : 0
    return {
      client_id,
      date,
      net_sales:    Math.round(d.net_sales    * 100) / 100,
      gross_sales:  Math.round(d.gross_sales  * 100) / 100,
      total_orders: d.total_orders,
      aov:          Math.round(aov            * 100) / 100,
      refunds:      Math.round(d.refunds      * 100) / 100,
      discounts:    Math.round(d.discounts    * 100) / 100,
      shipping:     Math.round(d.shipping     * 100) / 100,
    }
  })

  if (rows.length > 0) {
    const { error } = await supabaseAdmin
      .from('daily_metrics')
      .upsert(rows, { onConflict: 'client_id,date', ignoreDuplicates: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ synced: rows.length, orders: allOrders.length })
}

type ShopifyOrder = {
  created_at: string
  total_price: string
  total_refunds: string
  total_discounts: string
  shipping_lines: { price: string }[]
}

type DayAgg = {
  net_sales: number
  gross_sales: number
  total_orders: number
  refunds: number
  discounts: number
  shipping: number
  cogs: number
}
