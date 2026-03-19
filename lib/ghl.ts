/**
 * GoHighLevel API V2 integration.
 * All requests use the Location-level Bearer token.
 *
 * Docs: https://highlevel.stoplight.io/docs/integrations/
 */

const GHL_BASE = process.env.GHL_BASE_URL ?? 'https://services.leadconnectorhq.com'
const GHL_API_KEY = process.env.GHL_API_KEY!
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID!

interface GHLContact {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  tags?: string[]
  locationId?: string
}

interface GHLContactResponse {
  contact: {
    id: string
    email: string
    tags: string[]
  }
}

async function ghlFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${GHL_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      Version: '2021-07-28',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GHL API error ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}

/**
 * Create a GHL contact for a new Ghost Protocol signup.
 * Tags the contact with 'GHOST_ARCHITECT'.
 */
export async function createGhostSubscriber(params: {
  email: string
  firstName?: string
  phone?: string
}): Promise<string> {
  const body: GHLContact = {
    locationId: GHL_LOCATION_ID,
    email: params.email,
    firstName: params.firstName,
    phone: params.phone,
    tags: ['GHOST_ARCHITECT'],
  }

  const data = await ghlFetch<GHLContactResponse>('/contacts/', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  return data.contact.id
}

/**
 * Add a tag to an existing contact by GHL contact ID.
 */
export async function addTagToContact(
  contactId: string,
  tags: string[]
): Promise<void> {
  await ghlFetch(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tags }),
  })
}

/**
 * Look up a GHL contact by email address.
 * Returns null if not found.
 */
export async function findContactByEmail(
  email: string
): Promise<{ id: string } | null> {
  const data = await ghlFetch<{ contacts: Array<{ id: string }> }>(
    `/contacts/?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`
  )
  return data.contacts[0] ?? null
}
