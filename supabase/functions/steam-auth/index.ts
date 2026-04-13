import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

const STEAM_API_KEY = Deno.env.get("STEAM_API_KEY")

Deno.serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  const url = new URL(req.url)
  console.log(`Incoming request: ${req.method} at ${url.pathname}`)

  try {
    // 2. LOGIN ROUTE (GET)
    // Matches if the request is a GET, regardless of the exact path string
    if (req.method === "GET") {
      const returnTo = url.searchParams.get("return_to") || `https://fragg.xyz/auth/callback`
      
      const steamParams = new URLSearchParams({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": returnTo,
        "openid.realm": new URL(returnTo).origin,
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
      })

      console.log("Redirecting user to Steam...")
      return Response.redirect(`https://steamcommunity.com/openid/login?${steamParams.toString()}`, 302)
    }

    // 3. VERIFY ROUTE (POST)
    if (req.method === "POST") {
      const body = await req.json()
      
      // Verify with Steam OpenID
      const verifyParams = new URLSearchParams(body)
      verifyParams.set("openid.mode", "check_auth")
      
      const vRes = await fetch("https://steamcommunity.com/openid/verify", {
        method: "POST",
        body: verifyParams.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      
      const vText = await vRes.text()
      if (!vText.includes("is_valid:true")) {
        return new Response(JSON.stringify({ error: "Steam validation failed" }), { status: 401, headers: corsHeaders })
      }

      const steamID = (body["openid.claimed_id"] as string).match(/\/(\d+)$/)?.[1]
      
      // Get User Info from Steam API
      const sRes = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamID}`)
      const sData = await sRes.json()
      const player = sData.response?.players?.[0]

      return new Response(JSON.stringify({
        steam_id: steamID,
        username: player?.personaname,
        avatar: player?.avatarfull,
      }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      })
    }
  } catch (e) {
    console.error(`Error: ${e.message}`)
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders })
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders })
})
