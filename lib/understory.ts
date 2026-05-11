const AUTH_URL = 'https://api.auth.understory.io/oauth2/token'
const API_BASE = 'https://api.understory.io'

async function getAccessToken(): Promise<string> {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // URLSearchParams encodes ~ as %7E but Understory auth server requires the literal ~
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.UNDERSTORY_CLIENT_ID!,
      client_secret: process.env.UNDERSTORY_CLIENT_SECRET!,
      audience: API_BASE,
      scope: 'experience.read',
    }).toString().replace(/%7E/gi, '~'),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Auth failed (${res.status}): ${await res.text()}`)
  }

  const { access_token } = await res.json()
  return access_token as string
}

export type Experience = {
  id: string
  state: string
} & Record<string, unknown>

export type TicketVariant = {
  id: string
  name: string
  price: { currency: string; value: number; exponent: number }
}

export type ExperienceWithPrice = Experience & { priceFrom: string | null }

export function formatPrice(variant: TicketVariant): string {
  const amount = variant.price.value / Math.pow(10, variant.price.exponent)
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: variant.price.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

async function fetchVariants(
  experienceId: string,
  token: string,
): Promise<TicketVariant[]> {
  const res = await fetch(
    `${API_BASE}/v1/experiences/${experienceId}/ticket-variants`,
    {
      headers: { Authorization: `Bearer ${token}`, 'Accept-Language': 'it' },
      next: { revalidate: 60 },
    },
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.items ?? []
}

export async function fetchExperiences(): Promise<ExperienceWithPrice[]> {
  const token = await getAccessToken()

  const res = await fetch(`${API_BASE}/v1/experiences`, {
    headers: { Authorization: `Bearer ${token}`, 'Accept-Language': 'it' },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`API failed (${res.status}): ${await res.text()}`)
  }

  const { items }: { items: Experience[] } = await res.json()

  // Fetch all ticket variants in parallel with the same token
  const variantsList = await Promise.all(
    items.map((exp) => fetchVariants(exp.id, token)),
  )

  return items.map((exp, i) => {
    const cheapest = variantsList[i].sort(
      (a, b) => a.price.value - b.price.value,
    )[0]
    return {
      ...exp,
      priceFrom: cheapest ? formatPrice(cheapest) : null,
    }
  })
}
