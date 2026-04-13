import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const provider = searchParams.get("provider")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  if (provider === "steam") {
    const steamParams = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("openid.")) {
        steamParams.append(key, value)
      }
    }

    if (steamParams.size > 0) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/steam-auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${anonKey}`,
          },
          body: JSON.stringify(Object.fromEntries(steamParams)),
        })

        if (response.ok) {
          const steamData = await response.json() as { steam_id: string; username: string; avatar: string }
          const supabase = await createClient()

          const { data: existingUser } = await supabase
            .from("user_profiles")
            .select("id")
            .eq("steam_id", steamData.steam_id)
            .maybeSingle()

          if (existingUser) {
            await supabase.auth.signInAnonymously()
          } else {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: `${steamData.steam_id}@steam.local`,
              password: Math.random().toString(36).slice(2),
              options: {
                data: {
                  steam_id: steamData.steam_id,
                  username: steamData.username,
                  avatar: steamData.avatar,
                },
              },
            })

            if (signUpError) throw signUpError
            if (signUpData.user) {
              await supabase
                .from("user_profiles")
                .insert({
                  id: signUpData.user.id,
                  steam_id: steamData.steam_id,
                  username: steamData.username,
                  avatar: steamData.avatar,
                })
            }
          }

          return NextResponse.redirect(`${origin}${next}`)
        }
      } catch (error) {
        console.error("Steam auth error:", error)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
