import { NextRequest } from 'next/server'
import { subscribe, publish, TelemetryEvent } from '@/lib/telemetry-bus'
import { supabaseAdmin } from '@/lib/supabase-admin'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

// GET — SSE stream for the dashboard
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))

      const unsubscribe = subscribe((event: TelemetryEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        } catch (_) {
          unsubscribe()
        }
      })

      req.signal.addEventListener('abort', () => {
        unsubscribe()
        try { controller.close() } catch (_) {}
      })
    },
  })

  return new Response(stream, {
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

// POST — ingest from ghost-listener.js
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TelemetryEvent & { clientApiKey?: string }

    if (!body.event) {
      return Response.json({ ok: false, error: 'missing event' }, { status: 400, headers: CORS_HEADERS })
    }

    // Resolve client by API key
    let clientId: string | null = null
    if (body.clientApiKey) {
      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('id')
        .eq('api_key', body.clientApiKey)
        .eq('status', 'active')
        .single()
      clientId = client?.id ?? null
    }

    // Persist event to Supabase
    if (clientId) {
      await supabaseAdmin.from('events').insert({
        client_id: clientId,
        session_id: body.sessionId ?? null,
        event: body.event,
        url: body.url ?? null,
        data: body.data ?? {},
        ts: body.ts ?? Date.now(),
      })

      // Upsert session
      if (body.sessionId) {
        await supabaseAdmin.from('sessions').upsert({
          id: body.sessionId,
          client_id: clientId,
          referrer: (body.data?.referrer as string) ?? null,
          landing_page: (body.data?.path as string) ?? body.url ?? null,
          last_seen_at: new Date().toISOString(),
          converted: body.event === 'purchase',
        }, { onConflict: 'id,client_id', ignoreDuplicates: false })
      }
    }

    // Broadcast to live dashboard
    publish({ ...body, clientId: clientId ?? undefined } as TelemetryEvent)

    return Response.json({ ok: true }, { headers: CORS_HEADERS })
  } catch (err) {
    console.error('[TELEMETRY ERROR]', err)
    return Response.json({ ok: false, error: 'invalid payload' }, { status: 400, headers: CORS_HEADERS })
  }
}
