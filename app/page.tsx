import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Users, TrendingUp, Crosshair, ChevronRight, Zap, Shield, BarChart3 } from "lucide-react"

const features = [
  { icon: Trophy, title: "Competitive Rankings", description: "Track your ELO rating and climb the leaderboards against the best CS2 players." },
  { icon: BarChart3, title: "Detailed Analytics", description: "Deep dive into your performance with K/D, headshot percentage, and more." },
  { icon: Users, title: "Community Driven", description: "Join a thriving community of competitive players and find your next team." },
  { icon: Shield, title: "Verified Matches", description: "All matches are verified to ensure fair play and accurate statistics." },
]

const stats = [
  { value: "50K+", label: "Active Players" },
  { value: "1.2M", label: "Matches Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-4 w-4" />
            <span>Season 4 Now Live</span>
            <ChevronRight className="h-4 w-4" />
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Dominate the <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Competition</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The ultimate CS2 stats tracker. Track your matches, analyze your performance, 
            and climb the ranks with FRAGG.GG&apos;s competitive leaderboards.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/auth">
                <Target className="h-5 w-5" />
                Start Tracking
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
              <Link href="/leaderboard">
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features... (truncated for brevity, keep your original features section here) */}
      
      <section className="relative overflow-hidden px-4 py-24">
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to Frag?</h2>
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link href="/auth">
              <TrendingUp className="h-5 w-5" />
              Create Free Account
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
