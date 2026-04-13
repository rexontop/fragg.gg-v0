"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, DollarSign, Sparkles, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Skin {
  id: string
  name: string
  weapon: string
  collection: string
  rarity: string
  price: number
  image: string
  statTrak: boolean
  wear: string
}

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  consumer: { bg: "bg-zinc-500/10", border: "border-zinc-500/30", text: "text-zinc-400", glow: "" },
  industrial: { bg: "bg-blue-400/10", border: "border-blue-400/30", text: "text-blue-400", glow: "" },
  milspec: { bg: "bg-blue-600/10", border: "border-blue-600/30", text: "text-blue-500", glow: "" },
  restricted: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
  classified: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", glow: "shadow-pink-500/20" },
  covert: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20" },
  contraband: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
}

const weapons = ["All", "AWP", "AK-47", "M4A4", "M4A1-S", "Desert Eagle", "USP-S", "Glock-18", "P250", "Karambit", "Butterfly Knife"]
const rarities = ["All", "Consumer", "Industrial", "Mil-Spec", "Restricted", "Classified", "Covert", "Contraband"]
const sortOptions = [
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
]

export function SkinsBrowser({ skins }: { skins: Skin[] }) {
  const [search, setSearch] = useState("")
  const [weaponFilter, setWeaponFilter] = useState("All")
  const [rarityFilter, setRarityFilter] = useState("All")
  const [sort, setSort] = useState("price-desc")
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null)

  const filtered = skins
    .filter((skin) => {
      const matchesSearch = search === "" || 
        skin.name.toLowerCase().includes(search.toLowerCase()) ||
        skin.weapon.toLowerCase().includes(search.toLowerCase())
      const matchesWeapon = weaponFilter === "All" || skin.weapon === weaponFilter
      const matchesRarity = rarityFilter === "All" || skin.rarity.toLowerCase() === rarityFilter.toLowerCase()
      return matchesSearch && matchesWeapon && matchesRarity
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-desc":
          return b.price - a.price
        case "price-asc":
          return a.price - b.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Weapon Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {weaponFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
              {weapons.map((weapon) => (
                <DropdownMenuItem key={weapon} onClick={() => setWeaponFilter(weapon)}>
                  {weapon}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rarity Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {rarityFilter}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {rarities.map((rarity) => (
                <DropdownMenuItem key={rarity} onClick={() => setRarityFilter(rarity)}>
                  {rarity}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => setSort(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {skins.length} skins
      </div>

      {/* Skins Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((skin) => {
          const colors = rarityColors[skin.rarity] || rarityColors.consumer
          return (
            <button
              key={skin.id}
              onClick={() => setSelectedSkin(skin)}
              className={`group relative overflow-hidden rounded-xl border text-left transition-all hover:shadow-lg ${colors.border} ${colors.bg} ${colors.glow} hover:scale-[1.02]`}
            >
              {/* StatTrak Badge */}
              {skin.statTrak && (
                <div className="absolute left-2 top-2 z-10 rounded bg-orange-500/90 px-1.5 py-0.5 text-xs font-bold text-white">
                  ST
                </div>
              )}

              {/* Rarity Badge */}
              <div className={`absolute right-2 top-2 z-10 rounded px-1.5 py-0.5 text-xs font-medium capitalize ${colors.bg} ${colors.text}`}>
                {skin.rarity}
              </div>

              {/* Image */}
              <div className="relative flex h-40 items-center justify-center p-4">
                <img
                  src={skin.image}
                  alt={skin.name}
                  className="h-full w-auto object-contain transition-transform group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <div className="border-t border-border/30 p-4">
                <h3 className="font-semibold truncate">{skin.name}</h3>
                <p className="text-sm text-muted-foreground">{skin.wear}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${skin.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{skin.collection}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card py-16 text-center">
          <Search className="mb-4 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No skins found</p>
          <p className="text-sm text-muted-foreground">Try different filters or search terms</p>
        </div>
      )}

      {/* Skin Detail Modal */}
      {selectedSkin && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedSkin(null)}
        >
          <div 
            className={`w-full max-w-lg overflow-hidden rounded-2xl border ${rarityColors[selectedSkin.rarity]?.border || "border-border"} bg-card shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className={`relative flex h-64 items-center justify-center ${rarityColors[selectedSkin.rarity]?.bg || "bg-muted"} p-8`}>
              <img
                src={selectedSkin.image}
                alt={selectedSkin.name}
                className="h-full w-auto object-contain"
              />
              {selectedSkin.statTrak && (
                <div className="absolute left-4 top-4 rounded bg-orange-500 px-2 py-1 text-sm font-bold text-white">
                  StatTrak
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedSkin.name}</h2>
                  <p className="text-muted-foreground">{selectedSkin.weapon}</p>
                </div>
                <span className={`rounded px-2 py-1 text-sm font-medium capitalize ${rarityColors[selectedSkin.rarity]?.bg || ""} ${rarityColors[selectedSkin.rarity]?.text || ""}`}>
                  {selectedSkin.rarity}
                </span>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Collection</p>
                  <p className="font-medium">{selectedSkin.collection}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Wear</p>
                  <p className="font-medium">{selectedSkin.wear}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  ${selectedSkin.price.toLocaleString()}
                </span>
                <Button onClick={() => setSelectedSkin(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
