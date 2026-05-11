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

export type ExperiencesResponse = {
  items: Experience[]
  next: string
}

export async function fetchExperiences(): Promise<ExperiencesResponse> {
  const token = await getAccessToken()

  const res = await fetch(`${API_BASE}/v1/experiences`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': 'it',
    },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error(`API failed (${res.status}): ${await res.text()}`)
  }

  return res.json()
}
