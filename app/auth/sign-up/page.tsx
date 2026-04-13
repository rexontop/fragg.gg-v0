import { Button } from "@/components/ui/button"
import { Crosshair, ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"

// REPLACE [YOUR-PROJECT-REF] with your Supabase Project ID
const STEAM_LOGIN_URL = "https://[rfhszhfatgcyphiwrmzb].supabase.co/functions/v1/steam-auth"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-10 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Crosshair className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
            <p className="mt-3 text-muted-foreground text-balance">
              Join FRAGG.GG and start tracking your CS2 journey today.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <Button 
              size="lg" 
              className="w-full gap-3 bg-[#1b2838] py-7 text-lg hover:bg-[#2a475e] transition-all border border-white/5" 
              asChild
            >
              <Link href={STEAM_LOGIN_URL}>
                <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                  <path d="M12 .002a11.996 11.996 0 00-11.233 7.828l6.19 2.557a3.593 3.593 0 014.244-.224l3.193-4.576a3.57 3.57 0 11.536.374l-3.21 4.598a3.585 3.585 0 11-4.82 5.04l-6.14-2.536A12 12 0 1012 .002z"/>
                </svg>
                Continue with Steam
              </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground uppercase tracking-widest pt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Secure OpenID Authentication</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By clicking continue, you agree to our <br />
              <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
