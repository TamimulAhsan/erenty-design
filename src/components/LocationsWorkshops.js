"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./LocationsWorkshops.module.css";

const WORKSHOPS = [
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
    location: "Egressy Út 23",
    description: "A big description with 50 words in it most probably. This includes complete drivetrain diagnostics, brake fluid flushes, gear adjustments, chain lubrication, puncture repairs, and electronic systems integration for all standard commuting and cargo e-bikes. Friendly technicians and fast turnaround times guaranteed for all local riders.",
    address: "Egressy Út 23",
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

// Ensure all workshops have rich data for the UI
WORKSHOPS.forEach(w => {
  if (!w.freeCoverage) {
    w.freeCoverage = [
      { type: "Rentals", tiers: ["Basic"] },
      { type: "Courier+", tiers: w.tiers || ["Basic", "Extra"] }
    ];
  }
  if (!w.businessHours && w.hours) {
    const parts = w.hours.split(" | ");
    w.businessHours = parts.map(p => {
      // Split by first colon
      const colonIdx = p.indexOf(":");
      if (colonIdx > -1) {
        return { day: p.substring(0, colonIdx).trim(), hours: p.substring(colonIdx + 1).trim() };
      }
      return { day: p, hours: "Open" };
    });
  }
});

const CITIES = [
  { name: "Budapest", count: 3, isHub: true },
  { name: "Debrecen", count: 2, isHub: true },
  { name: "Egressy Út 23", count: 1, isHub: false },
  { name: "Győr", count: 1, isHub: false },
  { name: "Miskolc", count: 1, isHub: false },
  { name: "Pécs", count: 2, isHub: true },
  { name: "Szeged", count: 1, isHub: false },
  { name: "Zalaegerszeg", count: 1, isHub: false },
];

const CITY_COORDINATES = {
  "Budapest": { x: 348.8, y: 157.2 },
  "Debrecen": { x: 666.8, y: 152.5 },
  "Egressy Út 23": { x: 358.3, y: 155.3 },
  "Győr": { x: 176.1, y: 131.3 },
  "Miskolc": { x: 563.1, y: 73.2 },
  "Pécs": { x: 249.5, y: 356.3 },
  "Szeged": { x: 484.2, y: 331.1 },
  "Zalaegerszeg": { x: 78.9, y: 249.1 },
};

export default function LocationsWorkshops() {
  const [selectedCity, setSelectedCity] = useState("Budapest");
  const [hoveredCity, setHoveredCity] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setIsDrawerOpen(true);
    setExpandedCard(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setExpandedCard(null);
  };

  const toggleExpandCard = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  const handleBookingSubmit = (e, workshopId) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookingDate = formData.get("bookingDate");
    const bookingTime = formData.get("bookingTime");

    if (!bookingDate || !bookingTime) return;

    setBookingStatus((prev) => ({
      ...prev,
      [workshopId]: {
        status: "success",
        date: bookingDate,
        time: bookingTime,
      },
    }));
  };

  const resetBooking = (workshopId) => {
    setBookingStatus((prev) => ({
      ...prev,
      [workshopId]: null,
    }));
  };

  const filteredWorkshops = WORKSHOPS.filter((workshop) => {
    const matchesCity = workshop.location === selectedCity;
    const matchesPriority =
      filterPriority === "All" ||
      (filterPriority === "Priority" && workshop.featured) ||
      (filterPriority === "Standard" && !workshop.featured);
    return matchesCity && matchesPriority;
  });

  const getInitialsBg = (type) => {
    switch (type) {
      case "Battery & motor": return "linear-gradient(135deg, var(--primary), #143132)";
      case "Wheels & brakes": return "linear-gradient(135deg, #E03030, #9A1F1F)";
      case "Mobile repair": return "linear-gradient(135deg, #00D8A4, var(--primary))";
      case "Frame & bodywork": return "linear-gradient(135deg, #667370, #22191B)";
      default: return "linear-gradient(135deg, #00D8A4, #00FFCA)";
    }
  };

  return (
    <section
      className={`${styles.section} ${isVisible ? styles.animated : ""}`}
      id="workshops"
      ref={sectionRef}
    >
      <div className={styles.stickyContainer}>
        <div className={styles.container}>

          <div className={styles.heroContainer}>
          {/* ========================================================================= */}
          {/* TOP 80%: THE HERO MAP */}
          {/* ========================================================================= */}
          <div className={styles.mapHero}>
            <svg
              viewBox="0 0 800 420"
              className={styles.mapSvg}
              preserveAspectRatio="xMidYMid meet"
            >

              {/* 3D Depth Extrusion Layer */}
              <path
                d="M 0.0 247.4 L 40.8 157.5 L 17.0 127.2 L 86.2 126.9 L 95.6 69.9 L 158.1 105.6 L 203.4 120.9 L 306.6 103.7 L 316.5 75.7 L 365.3 71.6 L 425.2 49.9 L 438.5 58.8 L 496.2 41.4 L 525.0 8.5 L 565.3 0.0 L 697.0 42.4 L 723.2 28.2 L 791.4 66.1 L 800.0 103.6 L 724.9 132.9 L 666.8 227.6 L 592.4 322.3 L 493.9 348.6 L 417.2 342.4 L 323.0 379.1 L 277.0 400.0 L 175.5 373.1 L 83.6 313.3 L 44.6 296.1 L 20.7 248.9 Z"
                fill="var(--brand-dark)"
                className={styles.map3DLayer}
              />

              {/* Blended Map Path */}
              <path
                d="M 0.0 247.4 L 40.8 157.5 L 17.0 127.2 L 86.2 126.9 L 95.6 69.9 L 158.1 105.6 L 203.4 120.9 L 306.6 103.7 L 316.5 75.7 L 365.3 71.6 L 425.2 49.9 L 438.5 58.8 L 496.2 41.4 L 525.0 8.5 L 565.3 0.0 L 697.0 42.4 L 723.2 28.2 L 791.4 66.1 L 800.0 103.6 L 724.9 132.9 L 666.8 227.6 L 592.4 322.3 L 493.9 348.6 L 417.2 342.4 L 323.0 379.1 L 277.0 400.0 L 175.5 373.1 L 83.6 313.3 L 44.6 296.1 L 20.7 248.9 Z"
                fill="var(--card)"
                stroke="var(--border)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.mapPath}
              />

              {/* Active Connection Line (To Drawer) */}
              {isDrawerOpen && selectedCity && CITY_COORDINATES[selectedCity] && (
                <line
                  x1={CITY_COORDINATES[selectedCity].x}
                  y1={CITY_COORDINATES[selectedCity].y}
                  x2="800" /* Screen right edge to connect to drawer */
                  y2={CITY_COORDINATES[selectedCity].y}
                  className={styles.connectionLine}
                />
              )}

              {/* Map Circle Markers */}
              {CITIES.map((city, index) => {
                const coord = CITY_COORDINATES[city.name];
                const isActive = selectedCity === city.name;
                const isHovered = hoveredCity === city.name;
                const radius = city.count > 1 ? 14 : 9;

                return (
                  <g
                    key={city.name}
                    transform={`translate(${coord.x}, ${coord.y}) scale(${radius / 10})`}
                    onClick={() => handleCitySelect(city.name)}
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <g
                      className={`${styles.markerGroup} ${isActive ? styles.markerActive : ""} ${isHovered ? styles.markerHovered : ""}`}
                      style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                    >
                      {/* Hover Tooltip */}
                      {(isHovered || city.name === "Budapest") && (
                        <g className={styles.pinTooltip} transform={`translate(0, -36) scale(${10 / radius})`}>
                          <rect x="-40" y="-20" width="80" height="18" rx="4" fill="var(--brand-dark)" opacity="0.9" />
                          <text x="0" y="-7" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="600">
                            {city.name}
                          </text>
                        </g>
                      )}

                      {/* Teardrop Pin Shape */}
                      <path
                        d="M0,0 C-7.5,-7.5 -12,-12 -12,-18 C-12,-24.627 -6.627,-30 0,-30 C6.627,-30 12,-24.627 12,-18 C12,-12 7.5,-7.5 0,0 Z"
                        className={styles.pinShape}
                      />

                      {/* Number inside or Dot */}
                      {city.count > 1 ? (
                        <text
                          x="0"
                          y="-14"
                          textAnchor="middle"
                          className={styles.markerText}
                        >
                          {city.count}
                        </text>
                      ) : (
                        <circle cx="0" cy="-18" r="4" className={styles.pinDot} />
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM 20%: MINIMAL TEXT FOOTER */}
          {/* ========================================================================= */}
          <div className={styles.heroFooter}>
            <div className={styles.footerText}>
              <h2 className={`${styles.headline} h2`}>Certified Repair Network</h2>
              <p className={`${styles.subline} body-sm`}>
                12 service centres across Hungary
              </p>
            </div>
            <div className={styles.footerActions}>
              <Link href="/service" className="btn-primary">
                Courier+
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
              <button className="btn-outline" onClick={() => setIsDrawerOpen(true)}>
                Book a service
              </button>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* ========================================================================= */}
      {/* UPWORK-STYLE SIDE-OVER DRAWER & BACKDROP */}
      {/* ========================================================================= */}

      <div
        className={`${styles.drawerBackdrop} ${isDrawerOpen ? styles.backdropVisible : ""}`}
        onClick={closeDrawer}
      />

      <div className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ""}`}>

        <div className={styles.drawerHeader}>
          <button className={styles.backBtn} onClick={closeDrawer} aria-label="Close details">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className={styles.drawerHeaderMeta}>
            <span className={`${styles.drawerEyebrow} eyebrow`}>Service Hub</span>
            <h3 className={`${styles.drawerTitle} h3`}>{selectedCity}</h3>
            <p className={styles.drawerSubtitle}>
              <span className="mono-num">{filteredWorkshops.length}</span> certified repair {filteredWorkshops.length === 1 ? "partner" : "partners"} found
            </p>
          </div>
        </div>

        <div className={styles.drawerContent}>

          <div className={styles.drawerFilters}>
            <button onClick={() => setFilterPriority("All")} className={`${styles.drawerToggleBtn} ${filterPriority === "All" ? styles.drawerToggleBtnActive : ""}`}>
              All Partners
            </button>
            <button onClick={() => setFilterPriority("Priority")} className={`${styles.drawerToggleBtn} ${filterPriority === "Priority" ? styles.drawerToggleBtnActive : ""}`}>
              Priority / Featured
            </button>
            <button onClick={() => setFilterPriority("Standard")} className={`${styles.drawerToggleBtn} ${filterPriority === "Standard" ? styles.drawerToggleBtnActive : ""}`}>
              Standard
            </button>
          </div>

          <div className={styles.drawerWorkshopsList}>
            {filteredWorkshops.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No workshops match the selected filters.</p>
              </div>
            ) : (
              filteredWorkshops.map((workshop) => {
                const isExpanded = expandedCard === workshop.id;
                const booking = bookingStatus[workshop.id];

                return (
                  <div key={workshop.id} className={`${styles.drawerCard} ${workshop.featured ? styles.drawerFeaturedCard : ""} ${isExpanded ? styles.drawerCardExpanded : ""}`}>
                    <div className={styles.drawerCardHeader} onClick={() => toggleExpandCard(workshop.id)}>
                      <div className={styles.initialsAvatar} style={{ background: getInitialsBg(workshop.type) }}>
                        <span className="mono-num">{workshop.initials}</span>
                      </div>

                      <div className={styles.drawerCardMeta}>
                        <div className={styles.drawerTitleRow}>
                          <h4 className={styles.drawerWorkshopTitle}>{workshop.title}</h4>
                          {workshop.featured && <span className={styles.featuredBadge}>Featured</span>}
                        </div>
                        <p className={styles.drawerWorkshopSubtitle}>{workshop.type}</p>
                      </div>

                      <div className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    <div className={`${styles.drawerCardBody} ${isExpanded ? styles.drawerCardBodyOpen : ""}`}>
                      <div className={styles.drawerCardBodyInner}>

                        <p className={styles.workshopDesc}>{workshop.description}</p>

                        {/* Free Repair Coverage */}
                        <div className={styles.coverageBlock}>
                          <h5 className={styles.coverageTitle}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            Free repair coverage
                          </h5>
                          <div className={styles.coverageGrid}>
                            {workshop.freeCoverage?.map((cov, idx) => (
                              <div key={idx} className={styles.coverageRow}>
                                <span className={styles.coverageType}>{cov.type}</span>
                                <span className={styles.coverageTiers}>{cov.tiers.join(", ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Business Hours & Location Split */}
                        <div className={styles.infoSplit}>
                          <div className={styles.hoursBlock}>
                            <h5 className={`${styles.blockTitle} eyebrow`}>Business Hours</h5>
                            {workshop.businessHours ? (
                              <div className={styles.hoursTable}>
                                {workshop.businessHours.map((bh, idx) => (
                                  <div key={idx} className={`${styles.hourRow} ${bh.hours === 'Closed' ? styles.hourClosed : ''}`}>
                                    <span className={styles.hourDay}>{bh.day}</span>
                                    <span className={styles.hourTime}>{bh.hours}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={styles.fallbackHours}>{workshop.hours}</p>
                            )}
                          </div>

                          <div className={styles.contactBlock}>
                            <h5 className={`${styles.blockTitle} eyebrow`}>Contact</h5>
                            <div className={styles.detailRow}>
                              <svg className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                              <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                <span className={styles.detailText}>{workshop.address}</span>
                                <Link href={`https://maps.google.com/?q=${encodeURIComponent(workshop.address)}`} target="_blank" className={styles.mapLink}>
                                  View on Map ↗
                                </Link>
                              </div>
                            </div>
                            <div className={styles.detailRow}>
                              <svg className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                              <span className={styles.detailText}>{workshop.phone}</span>
                            </div>
                            <div className={styles.detailRow}>
                              <svg className={styles.detailIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                              <span className={styles.detailText}>{workshop.email}</span>
                            </div>
                          </div>
                        </div>

                        {workshop.capacity && (
                          <p className={styles.capacityText}>{workshop.capacity}</p>
                        )}

                        <div className={styles.bookingContainer}>
                          {booking && booking.status === "success" ? (
                            <div className={styles.bookingSuccess}>
                              <div className={styles.successIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                              </div>
                              <div className={styles.successMeta}>
                                <h5>Booking Successful</h5>
                                <p>Scheduled for {booking.date} at {booking.time}.</p>
                              </div>
                              <button onClick={() => resetBooking(workshop.id)} className={styles.resetBtn}>Reschedule</button>
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleBookingSubmit(e, workshop.id)} className={styles.bookingForm}>
                              <h5 className={`${styles.blockTitle} eyebrow`}>Book Appointment</h5>
                              <div className={styles.formGrid}>
                                <input type="date" name="bookingDate" required className={styles.bookingInput} min={new Date().toISOString().split("T")[0]} />
                                <input type="time" name="bookingTime" required className={styles.bookingInput} min="08:00" max="18:00" />
                              </div>
                              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                                Confirm Appointment
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                              </button>
                            </form>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
