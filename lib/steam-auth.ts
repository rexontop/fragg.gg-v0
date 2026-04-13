export function initiateSteamLogin(returnTo?: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const redirectUrl = returnTo || `${baseUrl}/auth/callback?provider=steam`

  const params = new URLSearchParams()
  params.append("openid.ns", "http://specs.openid.net/auth/2.0")
  params.append("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select")
  params.append("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select")
  params.append("openid.mode", "checkid_setup")
  params.append("openid.return_to", redirectUrl)
  params.append("openid.realm", new URL(redirectUrl).origin)
  params.append("openid.response_nonce", new Date().toISOString())
  params.append("openid.assoc_handle", `{HMAC-SHA1}{${Date.now()}}{random}`)

  return `https://steamcommunity.com/openid/login?${params.toString()}`
}

export async function verifySteamAuth(params: URLSearchParams) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  const response = await fetch(`${supabaseUrl}/functions/v1/steam-auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(Object.fromEntries(params)),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Steam verification failed")
  }

  return response.json()
}

export function extractSteamParams(url: URL): URLSearchParams | null {
  const params = new URLSearchParams()
  let hasSteamParams = false

  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith("openid.")) {
      params.append(key, value)
      hasSteamParams = true
    }
  }

  return hasSteamParams ? params : null
}
