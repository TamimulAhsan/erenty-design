// Single source of truth for the fleet catalog.
// Shared by the fleets listing client (FleetsClient) and the /fleets/[id]
// detail route (for per-bike SEO metadata + deep-linking into the rental flow).

export const FLEET_BIKES = [
  {
    id: "kukirin-g3-pro",
    brand: "Kukirin",
    model: "G3 Pro",
    category: "scooter",
    price: 40000,
    range: "80 km",
    rangeNum: 80,
    topSpeed: "65 km/h",
    motor: "1200W",
    motorNum: 1200,
    image: "/images/g3_pro.png",
    slug: "kukirin-g3-pro"
  },
  {
    id: "eleglide-m2",
    brand: "ELEGLIDE",
    model: "M2",
    category: "courier",
    price: 45000,
    range: "125 km",
    rangeNum: 125,
    topSpeed: "25 km/h",
    motor: "250 W",
    motorNum: 250,
    image: "/images/m2.png",
    slug: "eleglide-m2"
  },
  {
    id: "duotts-c29-pro",
    brand: "DUOTTS",
    model: "C29 Pro",
    category: "urban",
    price: 45000,
    range: "100 km",
    rangeNum: 100,
    topSpeed: "50 km/h",
    motor: "250W - 750W",
    motorNum: 750,
    image: "/images/c29_pro.png",
    slug: "duotts-c29-pro"
  },
  {
    id: "znen-e-crusie",
    brand: "ZNEN",
    model: "E-Crusie",
    category: "scooter",
    price: 50000,
    range: "80 km",
    rangeNum: 80,
    topSpeed: "45 km/h",
    motor: "3000 W",
    motorNum: 3000,
    image: "/images/e_crusie.png",
    slug: "znen-e-crusie"
  },
  {
    id: "equickey-q8-pro",
    brand: "Equickey",
    model: "Q8 - Pro",
    category: "courier",
    price: 50000,
    range: "120 km",
    rangeNum: 120,
    topSpeed: "50 km/h",
    motor: "2000 W",
    motorNum: 2000,
    image: "/images/q8_pro.png",
    slug: "equickey-q8-pro"
  },
  {
    id: "duotts-f26-lite",
    brand: "DUOTTS",
    model: "F26 Lite",
    category: "courier",
    price: 52000,
    range: "120 km",
    rangeNum: 120,
    topSpeed: "45 km/h",
    motor: "250 - 750 W",
    motorNum: 750,
    image: "/images/f26_lite.png",
    slug: "duotts-f26-lite"
  },
  {
    id: "vok-s",
    brand: "VOK",
    model: "S",
    category: "cargo",
    price: 120000,
    range: "100 km",
    rangeNum: 100,
    topSpeed: "25 km/h",
    motor: "250W",
    motorNum: 250,
    image: "/images/S.png",
    slug: "vok-s"
  }
];

// Look up a bike by its URL slug (used by the /fleets/[id] route).
export function getBikeBySlug(slug) {
  return FLEET_BIKES.find((bike) => bike.slug === slug) || null;
}
