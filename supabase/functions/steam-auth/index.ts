import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

const STEAM_API_KEY = Deno.env.get("STEAM_API_KEY")
const STEAM_API_URL = "https://steamcommunity.com/openid/login"
const STEAM_VERIFY_URL = "https://steamcommunity.com/openid/verify"

async function verifySteamOpenID(params: URLSearchParams) {
  const verifyParams = new URLSearchParams()
  verifyParams.append("openid.ns", "http://specs.openid.net/auth/2.0")
  verifyParams.append("openid.identity", params.get("openid.identity") || "")
  verifyParams.append("openid.claimed_id", params.get("openid.claimed_id") || "")
  verifyParams.append("openid.mode", "check_auth")
  verifyParams.append("openid.op_endpoint", params.get("openid.op_endpoint") || "")
  verifyParams.append("openid.response_nonce", params.get("openid.response_nonce") || "")
  verifyParams.append("openid.return_to", params.get("openid.return_to") || "")
  verifyParams.append("openid.response_time", params.get("openid.response_time") || "")
  verifyParams.append("openid.assoc_handle", params.get("openid.assoc_handle") || "")
  verifyParams.append("openid.signed", params.get("openid.signed") || "")
  verifyParams.append("openid.sig", params.get("openid.sig") || "")

  for (const key of params.keys()) {
    if (key.startsWith("openid.ext1.")) {
      verifyParams.append(key, params.get(key) || "")
    }
  }

  const verifyResponse = await fetch(STEAM_VERIFY_URL, {
    method: "POST",
    body: verifyParams.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  const verifyText = await verifyResponse.text()
  return verifyText.includes("is_valid:true")
}

function extractSteamID(claimedID: string): string | null {
  const match = claimedID.match(/\/(\d+)$/)
  return match ? match[1] : null
}

async function getSteamUserInfo(steamID: string) {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const data = await response.json() as { response: { players: Array<{ personaname: string; avatarfull: string }> } }
  const players = data.response.players
  if (players && players.length > 0) {
    return {
      username: players[0].personaname,
      avatar: players[0].avatarfull,
    }
  }

  return null
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const url = new URL(req.url)
    const params = url.searchParams

    if (req.method === "GET" && url.pathname === "/functions/v1/steam-auth") {
      // Initiate login
      const returnTo = params.get("return_to") || `${url.origin}/auth/callback`
      const loginParams = new URLSearchParams()
      loginParams.append("openid.ns", "http://specs.openid.net/auth/2.0")
      loginParams.append("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select")
      loginParams.append("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select")
      loginParams.append("openid.mode", "checkid_setup")
      loginParams.append("openid.return_to", returnTo)
      loginParams.append("openid.realm", new URL(returnTo).origin)
      loginParams.append("openid.response_nonce", new Date().toISOString())
      loginParams.append("openid.assoc_handle", "{HMAC-SHA1}{" + Date.now() + "}{random}")

      const loginUrl = `${STEAM_API_URL}?${loginParams.toString()}`

      return new Response(
        JSON.stringify({ login_url: loginUrl }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    if (req.method === "POST" && url.pathname === "/functions/v1/steam-auth/verify") {
      // Verify Steam response
      const body = await req.json() as Record<string, unknown>
      const openidParams = new URLSearchParams()

      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          openidParams.append(key, value)
        }
      }

      const isValid = await verifySteamOpenID(openidParams)

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Steam verification failed" }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        )
      }

      const claimedID = body["openid.claimed_id"] as string
      const steamID = extractSteamID(claimedID)

      if (!steamID) {
        return new Response(
          JSON.stringify({ error: "Invalid Steam ID" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        )
      }

      const userInfo = await getSteamUserInfo(steamID)

      if (!userInfo) {
        return new Response(
          JSON.stringify({ error: "Failed to retrieve Steam user info" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        )
      }

      return new Response(
        JSON.stringify({
          steam_id: steamID,
          username: userInfo.username,
          avatar: userInfo.avatar,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error("Steam auth error:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})
