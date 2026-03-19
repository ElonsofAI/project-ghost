import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Syncs Klaviyo email + SMS attributed revenue into daily_metrics
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { client_id, days = 30 } = await req.json()
  if (!client_id) return NextResponse.json({ error: 'client_id required' }, { status: 400 })

  const { data: client } = await supabase
    .from('clients').select('id').eq('id', client_id).eq('owner_id', user.id).single()
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const { data: integration } = await supabaseAdmin
    .from('integrations')
    .select('credentials')
    .eq('client_id', client_id)
    .eq('platform', 'klaviyo')
    .single()

  if (!integration) return NextResponse.json({ error: 'Klaviyo not connected' }, { status: 400 })

  const { api_key } = integration.credentials as Record<string, string>
  if (!api_key) return NextResponse.json({ error: 'Missing api_key' }, { status: 400 })

  // Fetch campaign metrics from Klaviyo v2024-10-15 API
  // Pull revenue from Campaigns (email) and Flows (automations)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const headers = {
    'Authorization': `Klaviyo-API-Key ${api_key}`,
    'revision': '2024-10-15',
    'Content-Type': 'application/json',
  }

  // Get campaign-level revenue using metrics query
  // Metric ID for "Placed Order" in Klaviyo is standard
  const metricsRes = await fetch(
    'https://a.klaviyo.com/api/metrics/?filter=equals(name,"Placed Order")',
    { headers }
  )

  if (!metricsRes.ok) {
    const text = await metricsRes.text()
    return NextResponse.json({ error: `Klaviyo API error: ${metricsRes.status} ${text}` }, { status: 502 })
  }

  const metricsData = await metricsRes.json()
  const metricId = metricsData.data?.[0]?.id

  if (!metricId) {
    return NextResponse.json({ synced: 0, message: 'No Placed Order metric found' })
  }

  // Query daily revenue attributed to email
  const queryBody = {
    data: {
      type: 'metric-aggregate',
      attributes: {
        metric_id: metricId,
        measurements: ['sum_value', 'count'],
        interval: 'day',
        page_size: 500,
        filter: [`greater-or-equal(datetime,${since})`],
        by: ['$attributed_message_channel'],
        timezone: 'UTC',
      },
    },
  }

  const aggRes = await fetch('https://a.klaviyo.com/api/metric-aggregates/', {
    method: 'POST',
    headers,
    body: JSON.stringify(queryBody),
  })

  if (!aggRes.ok) {
    const text = await aggRes.text()
    return NextResponse.json({ error: `Klaviyo aggregate error: ${aggRes.status} ${text}` }, { status: 502 })
  }

  const aggData = await aggRes.json()
  const results = aggData.data?.attributes?.results ?? []

  // Map results into {date → {email_revenue, sms_revenue}}
  const byDate: Record<string, { email: number; sms: number }> = {}

  for (const result of results) {
    const date = result.dimensions?.[0]?.slice(0, 10) // datetime → YYYY-MM-DD
    const channel = result.dimensions?.[1] ?? 'email'
    const revenue = parseFloat(result.measurements?.sum_value?.[0] ?? '0')

    if (!date) continue
    if (!byDate[date]) byDate[date] = { email: 0, sms: 0 }

    if (channel === 'sms') {
      byDate[date].sms += revenue
    } else {
      byDate[date].email += revenue
    }
  }

  // Upsert into daily_metrics (merge with existing Shopify/ad data)
  let synced = 0
  for (const [date, { email, sms }] of Object.entries(byDate)) {
    await supabaseAdmin.from('daily_metrics').upsert(
      { client_id, date, email_revenue: email, sms_revenue: sms },
      { onConflict: 'client_id,date', ignoreDuplicates: false }
    )
    synced++
  }

  return NextResponse.json({ synced })
}
