import { createClient } from "@/lib/supabase/server"
import { MatchesList } from "@/components/matches-list"
import { Swords, Filter } from "lucide-react"

export const metadata = {
  title: "Matches | FRAGG.GG",
  description: "Browse recent CS2 matches and game history",
}

export default async function MatchesPage() {
  const supabase = await createClient()

  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      match_players (
        *,
        users (id, username, avatar_url, rank_tier)
      )
    `)
    .order("played_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen px-4 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
            <Swords className="h-4 w-4" />
            Match History
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Recent Matches
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse community matches and game results
          </p>
        </div>

        {/* Matches List */}
        <MatchesList matches={matches || []} />
      </div>
    </div>
  )
}
