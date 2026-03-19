import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Syncs Meta Ads spend into daily_metrics for one client
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

  // Get Meta credentials
  const { data: integration } = await supabaseAdmin
    .from('integrations')
    .select('credentials')
    .eq('client_id', client_id)
    .eq('platform', 'meta')
    .single()

  if (!integration) return NextResponse.json({ error: 'Meta not connected for this client' }, { status: 400 })

  const { access_token, account_id } = integration.credentials as Record<string, string>
  if (!access_token || !account_id) {
    return NextResponse.json({ error: 'Missing access_token or account_id' }, { status: 400 })
  }

  // Date range
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const until = new Date()
  const sinceStr = since.toISOString().slice(0, 10)
  const untilStr = until.toISOString().slice(0, 10)

  // Fetch daily insights from Meta Marketing API
  const cleanId = account_id.startsWith('act_') ? account_id : `act_${account_id}`
  const params = new URLSearchParams({
    access_token,
    fields: 'spend,purchase_roas,date_start,date_stop',
    time_range: JSON.stringify({ since: sinceStr, until: untilStr }),
    time_increment: '1',
    level: 'account',
    limit: '31',
  })

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${cleanId}/insights?${params}`
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Meta API error: ${res.status} ${text}` }, { status: 502 })
  }

  const { data: insights } = await res.json() as { data: MetaInsightRow[] }

  if (!insights || insights.length === 0) {
    return NextResponse.json({ synced: 0 })
  }

  // Build partial upserts — only fb_spend and total_ad_spend (merges with Shopify data)
  const rows = insights.map(row => {
    const spend = parseFloat(row.spend ?? '0')
    const roas = row.purchase_roas?.[0]?.value ? parseFloat(row.purchase_roas[0].value) : null

    return {
      client_id,
      date: row.date_start,
      fb_spend: spend,
      // total_ad_spend will be recomputed after all platforms sync
      // For now set it equal to fb_spend (Google/TikTok add their share separately)
      total_ad_spend: spend,
      roas: roas ?? undefined,
    }
  })

  // Upsert — merge with existing Shopify data by not overwriting Shopify fields
  for (const row of rows) {
    // Check if a row exists
    const { data: existing } = await supabaseAdmin
      .from('daily_metrics')
      .select('fb_spend, google_spend, tiktok_spend')
      .eq('client_id', client_id)
      .eq('date', row.date)
      .single()

    const googleSpend = existing?.google_spend ?? 0
    const tiktokSpend = existing?.tiktok_spend ?? 0
    const totalAdSpend = row.fb_spend + googleSpend + tiktokSpend

    await supabaseAdmin.from('daily_metrics').upsert(
      { ...row, total_ad_spend: totalAdSpend },
      { onConflict: 'client_id,date', ignoreDuplicates: false }
    )
  }

  return NextResponse.json({ synced: rows.length })
}

type MetaInsightRow = {
  spend: string
  date_start: string
  date_stop: string
  purchase_roas?: { action_type: string; value: string }[]
}
