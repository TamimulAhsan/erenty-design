export const WORKSHOPS = [
  {
    id: "bbs",
    featured: true,
    title: "Budapest Bike Service Kft.",
    type: "Full service",
    location: "Budapest",
    description: "Authorised E-renty service centre offering full mechanical overhauls, firmware updates and same-day turnaround for every model in the fleet.",
    address: "1083 Budapest, Corvin utca 15.",
    tiers: ["Basic", "Extra"],
    initials: "BB",
    hours: "Mon - Fri: 8:00 - 18:00 | Sat: 9:00 - 14:00",
    phone: "+36 1 456 7890",
    email: "corvin@budapestbike.hu",
    businessHours: [
      { day: "Monday", hours: "09:00 – 18:00" },
      { day: "Tuesday", hours: "09:00 – 18:00" },
      { day: "Wednesday", hours: "09:00 – 18:00" },
      { day: "Thursday", hours: "09:00 – 18:00" },
      { day: "Friday", hours: "09:00 – 17:00" },
      { day: "Saturday", hours: "Closed" },
      { day: "Sunday", hours: "Closed" },
    ],
    features: ["Free repair coverage", "Rentals"],
    models: ["Basic", "Courier+", "Extra"],
    capacity: "Accepts up to 1 repair appointment per hour",
  },
  {
    id: "fbr",
    featured: true,
    title: "Fish Bike repair",
    type: "Full service",
    location: "Budapest",
    description: "Certified E-renty repair partner in Pest offering complete drivetrain diagnostics, brake fluid flushes, gear adjustments, chain lubrication, puncture repairs, and electronic systems integration for all standard commuting and cargo e-bikes. Friendly technicians and fast turnaround times guaranteed for all local riders.",
    address: "1142 Budapest, Egressy út 23.",
    tiers: ["Basic", "Extra"],
    initials: "FB",
    hours: "Mon - Fri: 9:00 - 19:00 | Sat: 10:00 - 15:00",
    phone: "+36 30 123 4567",
    email: "egressy@fishbikerepair.hu",
  },
  {
    id: "rv",
    featured: true,
    title: "Roller Világ",
    type: "Battery & motor",
    location: "Zalaegerszeg",
    description: "Battery cell reconditioning, range testing and certified pack recycling — the go-to specialist for high-mileage delivery e-bikes in Northern Hungary.",
    address: "8900 Zalaegerszeg, Tüttőssy Ferenc utca 7.",
    tiers: ["Extra", "Max"],
    initials: "RV",
    hours: "Mon - Fri: 8:30 - 17:30",
    phone: "+36 92 345 678",
    email: "zalaegerszeg@rollervilag.hu",
  },
  {
    id: "vg",
    featured: true,
    title: "Volt Garázs",
    type: "Battery & motor",
    location: "Budapest",
    description: "Battery health checks, motor diagnostics and same-day controller swaps — certified for every E-renty model currently in the fleet.",
    address: "1061 Budapest, Király utca 32.",
    tiers: ["Extra", "Max"],
    initials: "VG",
    hours: "Mon - Fri: 9:00 - 18:00 | Sat: 9:00 - 13:00",
    phone: "+36 1 876 5432",
    email: "kiraly@voltgarazs.hu",
  },
  {
    id: "fk",
    featured: false,
    title: "Fék & Kerék",
    type: "Wheels & brakes",
    location: "Szeged",
    description: "Wheel truing, hydraulic brake service and tubeless conversions done while you wait — no appointment needed on weekdays.",
    address: "6720 Szeged, Kárász utca 9.",
    tiers: ["Basic", "Plus", "Max", "Extra"],
    initials: "FK",
    hours: "Mon - Fri: 8:00 - 18:00 | Sat: 9:00 - 12:00",
    phone: "+36 62 123 456",
    email: "szeged@fekeskerek.hu",
  },
  {
    id: "kk",
    featured: false,
    title: "Kerékpár Klinika",
    type: "Full service",
    location: "Debrecen",
    description: "Family-run workshop handling drivetrain rebuilds, brake bleeds and seasonal storage for daily commuters across the Debrecen region.",
    address: "4025 Debrecen, Piac utca 45.",
    tiers: ["Basic", "Plus"],
    initials: "KK",
    hours: "Mon - Fri: 8:00 - 17:00 | Sat: 8:00 - 12:00",
    phone: "+36 52 987 654",
    email: "debrecen@kerekparklinika.hu",
  },
  {
    id: "mp",
    featured: false,
    title: "MobilSzerviz Pest",
    type: "Mobile repair",
    location: "Budapest",
    description: "Van-based repair crew covering all of Budapest — punctures, firmware updates and emergency fixes dispatched to your door within 90 minutes.",
    address: "1139 Budapest, Váci út 99.",
    tiers: ["Basic", "Extra", "Max"],
    initials: "MP",
    hours: "Mon - Sun: 7:00 - 22:00 (Emergency Dispatch)",
    phone: "+36 30 999 8888",
    email: "pest@mobilszerviz.hu",
  },
  {
    id: "pd",
    featured: false,
    title: "Pedál Doktor",
    type: "Full service",
    location: "Győr",
    description: "Complete tune-ups, gear indexing and pre-season readiness inspections for trekking and cargo e-bikes throughout Western Hungary.",
    address: "9021 Győr, Baross Gábor út 21.",
    tiers: ["Basic", "Plus", "Extra"],
    initials: "PD",
    hours: "Mon - Fri: 8:00 - 18:00",
    phone: "+36 96 555 444",
    email: "gyor@pedaldoktor.hu",
  },
  {
    id: "tm",
    featured: false,
    title: "Test Map repair",
    type: "Full service",
    location: "Miskolc",
    description: "Comprehensive frame alignment checkups, electronic drive repairs, software upgrades, and battery diagnostics for the Miskolc region.",
    address: "Miskolc, Klapka György u. 22, 3524",
    tiers: ["Max"],
    initials: "TM",
    hours: "Mon - Fri: 9:00 - 17:00",
    phone: "+36 46 222 333",
    email: "miskolc@testmap.hu",
  },
  {
    id: "tt",
    featured: false,
    title: "Töltő & Tekerő",
    type: "Battery & motor",
    location: "Pécs",
    description: "Charger diagnostics, motor rewinds and BMS reflashing for high-mileage delivery fleets — fast turnaround with loaner chargers available.",
    address: "7621 Pécs, Széchenyi tér 1.",
    tiers: ["Extra", "Max"],
    initials: "TT",
    hours: "Mon - Fri: 8:00 - 18:00 | Sat: 9:00 - 13:00",
    phone: "+36 72 333 444",
    email: "pecs@toltotekero.hu",
  },
  {
    id: "vm",
    featured: false,
    title: "Váz Műhely",
    type: "Frame & bodywork",
    location: "Pécs",
    description: "Frame alignment, weld repair and full respray for crash-damaged and heavily used bikes — all finishes colour-matched to original.",
    address: "7621 Pécs, Király utca 5.",
    tiers: ["Plus", "Max"],
    initials: "VM",
    hours: "Mon - Fri: 8:00 - 16:30",
    phone: "+36 72 777 888",
    email: "pecs@vazmuhely.hu",
  },
  {
    id: "zl",
    featured: false,
    title: "Zöld Lánc Szerviz",
    type: "Full service",
    location: "Debrecen",
    description: "Eco-minded workshop using reconditioned parts — chain, cassette and bearing overhauls with a focus on reducing waste and extending component life.",
    address: "4025 Debrecen, Simonffy utca 4/B.",
    tiers: ["Basic", "Extra"],
    initials: "ZL",
    hours: "Mon - Fri: 8:30 - 17:30 | Sat: 9:00 - 12:00",
    phone: "+36 52 444 555",
    email: "debrecen@zoldlanc.hu",
  },
];

// Helper to parse day ranges like "Mon - Fri" or individual days like "Sat" or "Mon - Sun"
const getDaysFromRange = (dayRange) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayAbbrs = {
    mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
    monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday"
  };

  const cleanRange = dayRange.toLowerCase().trim();
  if (cleanRange.includes("-")) {
    const [start, end] = cleanRange.split("-").map(d => d.trim());
    const startFull = dayAbbrs[start];
    const endFull = dayAbbrs[end];
    if (startFull && endFull) {
      const startIndex = daysOfWeek.indexOf(startFull);
      const endIndex = daysOfWeek.indexOf(endFull);
      if (startIndex !== -1 && endIndex !== -1) {
        if (startIndex <= endIndex) {
          return daysOfWeek.slice(startIndex, endIndex + 1);
        } else {
          return [...daysOfWeek.slice(startIndex), ...daysOfWeek.slice(0, endIndex + 1)];
        }
      }
    }
  }

  const singleDay = dayAbbrs[cleanRange];
  return singleDay ? [singleDay] : [];
};

// Ensure all workshops have rich data for the UI
WORKSHOPS.forEach((w) => {
  if (!w.freeCoverage) {
    w.freeCoverage = [
      { type: "Rentals", tiers: ["Basic"] },
      { type: "Courier+", tiers: w.tiers || ["Basic", "Extra"] },
    ];
  }
  if (!w.businessHours && w.hours) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const schedule = {};
    daysOfWeek.forEach(d => { schedule[d] = "Closed"; });

    const parts = w.hours.split(" | ");
    parts.forEach((p) => {
      const colonIdx = p.indexOf(":");
      if (colonIdx > -1) {
        const dayPart = p.substring(0, colonIdx).trim();
        let hourPart = p.substring(colonIdx + 1).trim();
        if (hourPart.includes("(Emergency Dispatch)")) {
          hourPart = hourPart.replace("(Emergency Dispatch)", "").trim();
        }
        const targetDays = getDaysFromRange(dayPart);
        targetDays.forEach(d => {
          schedule[d] = hourPart;
        });
      }
    });

    w.businessHours = daysOfWeek.map(d => ({
      day: d,
      hours: schedule[d]
    }));
  }
});

export const CITIES = [
  { name: "Budapest", count: 4, isHub: true },
  { name: "Debrecen", count: 2, isHub: true },
  { name: "Győr", count: 1, isHub: false },
  { name: "Miskolc", count: 1, isHub: false },
  { name: "Pécs", count: 2, isHub: true },
  { name: "Szeged", count: 1, isHub: false },
  { name: "Zalaegerszeg", count: 1, isHub: false },
];

export const CITY_COORDINATES = {
  "Budapest": { x: 348.8, y: 157.2 },
  "Debrecen": { x: 666.8, y: 152.5 },
  "Győr": { x: 176.1, y: 131.3 },
  "Miskolc": { x: 563.1, y: 73.2 },
  "Pécs": { x: 249.5, y: 356.3 },
  "Szeged": { x: 484.2, y: 331.1 },
  "Zalaegerszeg": { x: 78.9, y: 249.1 },
};

export const WORKSHOP_TYPES = [
  "Full service",
  "Battery & motor",
  "Wheels & brakes",
  "Mobile repair",
  "Frame & bodywork",
];

export const getInitialsBg = (type) => {
  switch (type) {
    case "Battery & motor": return "linear-gradient(135deg, var(--primary), #143132)";
    case "Wheels & brakes": return "linear-gradient(135deg, #E03030, #9A1F1F)";
    case "Mobile repair": return "linear-gradient(135deg, #00D8A4, var(--primary))";
    case "Frame & bodywork": return "linear-gradient(135deg, #667370, #22191B)";
    default: return "linear-gradient(135deg, #00D8A4, #00FFCA)";
  }
};
