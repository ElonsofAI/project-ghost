import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: clients } = await supabase.from('clients').select('id').eq('owner_id', user.id)
  const clientIds = (clients ?? []).map(c => c.id)

  if (clientIds.length === 0) return NextResponse.json([])

  const { data } = await supabaseAdmin
    .from('integrations')
    .select('id, client_id, platform, created_at')
    .in('client_id', clientIds)

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { client_id, platform, credentials } = await req.json()

  // Verify client ownership
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('id', client_id)
    .eq('owner_id', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  // Upsert integration (credentials stored as jsonb — encrypt in production)
  const { data, error } = await supabaseAdmin
    .from('integrations')
    .upsert({ client_id, platform, credentials }, { onConflict: 'client_id,platform' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
