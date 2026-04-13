import { SkinsBrowser } from "@/components/skins-browser"
import { Crosshair, Sparkles } from "lucide-react"

export const metadata = {
  title: "Skins | FRAGG.GG",
  description: "Browse CS2 weapon skins and cosmetics",
}

// Mock skin data - in production this would come from an API or database
const skins = [
  {
    id: "1",
    name: "AWP | Dragon Lore",
    weapon: "AWP",
    collection: "Cobblestone Collection",
    rarity: "covert",
    price: 15000,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-KmsjwPKvBmm5u5Mx2gv2P9o-s21Xm-UVtYTr3I4OXdgc3YFzV-wC6xOy7h8K7uszOnXFn7HQrs3bfyhC2gktPbOJqgPWdVxzAULVXrqhT/256fx256f",
    statTrak: false,
    wear: "Factory New",
  },
  {
    id: "2",
    name: "AK-47 | Fire Serpent",
    weapon: "AK-47",
    collection: "Bravo Collection",
    rarity: "covert",
    price: 3500,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Rd6dd2j6fA54-h21Xm-UVtYTr3I4OXdgc3YFzV-wC6xOy7h8K7uszOnXFn7HQrs3bfyhC2gktPbOJqgPWdVxzAULVXrqhT/256fx256f",
    statTrak: true,
    wear: "Minimal Wear",
  },
  {
    id: "3",
    name: "M4A4 | Howl",
    weapon: "M4A4",
    collection: "Contraband",
    rarity: "contraband",
    price: 8000,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCkP_gDLfQhFRd4cJ5nqeQ9N6t0AXs_0VoZD3xdYGRcwE6YF_Y_FS3l-i6hJbq757MnCRq7nNxtyiJzkG200odYuNsgPWdVxzAUO-cS7Fc/256fx256f",
    statTrak: false,
    wear: "Factory New",
  },
  {
    id: "4",
    name: "Karambit | Fade",
    weapon: "Karambit",
    collection: "Knives",
    rarity: "covert",
    price: 2200,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJl4G0k_jkI7fUhFRB4MRij7j--YXygED6-kVlMmj3J4WQdlA2aF3Z-VO_xO3t0JS1vJ7Imntgvygh4irfzRe3gUpLbOBxxavJNQyFOQ/256fx256f",
    statTrak: false,
    wear: "Factory New",
  },
  {
    id: "5",
    name: "Desert Eagle | Blaze",
    weapon: "Desert Eagle",
    collection: "Dust Collection",
    rarity: "restricted",
    price: 450,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH7du6kb-FlvD1DLfYkWNF18l4jeHVu9T33QDs-UBqYzvzd4LEdVA3aFqG81bqxOvt1JO_tZjNzSAy7HNwsGGdwUIBSBYVRQ/256fx256f",
    statTrak: true,
    wear: "Factory New",
  },
  {
    id: "6",
    name: "USP-S | Kill Confirmed",
    weapon: "USP-S",
    collection: "Shadow Collection",
    rarity: "covert",
    price: 180,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8dqj2wbh_kE5YT2hI9XDdA8_MF_U-VO9l-jmgJC5vcnPzidrvD5iuyi_lkOpwUYb0DFDLAQ/256fx256f",
    statTrak: false,
    wear: "Minimal Wear",
  },
  {
    id: "7",
    name: "Glock-18 | Fade",
    weapon: "Glock-18",
    collection: "Assault Collection",
    rarity: "restricted",
    price: 1200,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0Ob3djFN79eJnY6PnvD7DLbUkmJE5YtwjLGVpd2k3AfsrkdkMWn3cteTJhg3NwnT_Fm2w-vp0J_v6MicySRr7Cgl5C3D30vgJmxXuQ/256fx256f",
    statTrak: true,
    wear: "Factory New",
  },
  {
    id: "8",
    name: "Butterfly Knife | Doppler",
    weapon: "Butterfly Knife",
    collection: "Knives",
    rarity: "covert",
    price: 1800,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf0ebcZThQ6tCvq4GGqOT1I6vZn3lU18hwmOvN85-h3lLh_0dvZG-nJoSVclA6YlnY_lC6wO_s18K77p-dmXpjuSMi5HaPlxa1hU5PYuJxxavJN7D2xw/256fx256f",
    statTrak: false,
    wear: "Phase 2",
  },
  {
    id: "9",
    name: "M4A1-S | Hyper Beast",
    weapon: "M4A1-S",
    collection: "Falchion Collection",
    rarity: "covert",
    price: 85,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-jxcjhwwPjFfwJE4dCJhYWdlcj1OLPQhGle5cR5g_LVrYmjiwDm-UBqZWqlIoSXcgU6NA6B_Fe9xu-608K-uJTLyXB9-n51D1dhZw/256fx256f",
    statTrak: true,
    wear: "Field-Tested",
  },
  {
    id: "10",
    name: "AWP | Asiimov",
    weapon: "AWP",
    collection: "Phoenix Collection",
    rarity: "covert",
    price: 120,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-KmsjwPKvBmm5u5Mx2gv2P9o-s21Xm-UVtYTr3I4OXdgc3YFzV-wC6xOy7h8K7uszOnXFn7HQrs3bfyhC2gktPbOJqgPWdVxzAULVXrqhT/256fx256f",
    statTrak: false,
    wear: "Battle-Scarred",
  },
  {
    id: "11",
    name: "AK-47 | Neon Rider",
    weapon: "AK-47",
    collection: "Prisma Collection",
    rarity: "covert",
    price: 95,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV092lnYmGmOHLPr7Vn35cpsYh3uvErdyg0VHmrhVrZzz0JYOddAI3aFqG-VO-xOrs15a0u8nXySBluSIl4ivfyhCwhRNPOrBs0PWPXA/256fx256f",
    statTrak: true,
    wear: "Factory New",
  },
  {
    id: "12",
    name: "P250 | Muertos",
    weapon: "P250",
    collection: "Vanguard Collection",
    rarity: "classified",
    price: 12,
    image: "https://community.fastly.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpopuP1FABz7ODYfi9W9eOJl4-SkOf8NoTdn2xZ_Pp9i_vG8MKm21Dl8kNrZ23xco-ddwI3aFyDqQDvxO3sgsS6vprOnXs16SIlsyzfmEe11x5NOuRq1fKcVxzAUJKtjYAR/256fx256f",
    statTrak: false,
    wear: "Minimal Wear",
  },
]

export default function SkinsPage() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Skin Marketplace
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Weapon Skins
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse the most popular CS2 skins and cosmetics
          </p>
        </div>

        {/* Skins Browser */}
        <SkinsBrowser skins={skins} />
      </div>
    </div>
  )
}
