import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  // Standard OAuth code exchange (keep this)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Steam OpenID callback
  const steamParams = new URLSearchParams()
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("openid.")) {
      steamParams.append(key, value)
    }
  }

  if (steamParams.size > 0) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    try {
      // Verify with Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/steam-auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify(Object.fromEntries(steamParams)),
      })

      if (!response.ok) {
        throw new Error("Steam verification failed")
      }

      const steamData = await response.json() as {
        steam_id: string
        username: string
        avatar: string
      }

      // Use admin client to manage users
      const adminSupabase = createAdminClient(supabaseUrl, serviceRoleKey)

      // Check if user exists
      const { data: existingProfile } = await adminSupabase
        .from("user_profiles")
        .select("id")
        .eq("steam_id", steamData.steam_id)
        .maybeSingle()

      let userId: string

      if (existingProfile) {
        // User exists - get their auth user id
        userId = existingProfile.id
      } else {
        // New user - create auth account
        const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
          email: `${steamData.steam_id}@steam.fragg.gg`,
          password: crypto.randomUUID(),
          email_confirm: true,
          user_metadata: {
            steam_id: steamData.steam_id,
            username: steamData.username,
            avatar_url: steamData.avatar,
          },
        })

        if (createError || !newUser.user) throw createError

        userId = newUser.user.id

        // Create profile
        await adminSupabase
          .from("user_profiles")
          .insert({
            id: userId,
            steam_id: steamData.steam_id,
            username: steamData.username,
            avatar_url: steamData.avatar,
          })
      }

      // Generate magic link to sign in as this user
      const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
        type: "magiclink",
        email: `${steamData.steam_id}@steam.fragg.gg`,
      })

      if (linkError || !linkData) throw linkError

      // Extract token from magic link and redirect
      const linkUrl = new URL(linkData.properties.action_link)
      const token = linkUrl.searchParams.get("token")
      const type = linkUrl.searchParams.get("type")

      return NextResponse.redirect(
        `${origin}/auth/callback?token=${token}&type=${type}&next=${next}`
      )

    } catch (error) {
      console.error("Steam auth error:", error)
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
