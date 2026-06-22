"use client";

import styles from "./WeHandleItAll.module.css";

const SERVICES = [
  {
    title: "Always in top shape",
    description: "Periodic servicing, detailed inspections, electrical system repairs, tire replacement & seasonal storage are fully managed.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Zero downtime guarantee",
    description: "We keep you moving. If your bike needs off-site service, we provide an immediate replacement bike to eliminate downtime.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 17.5 11.5 12h-4L5.5 17.5" />
        <path d="M12 7.5V12" />
        <path d="M8 7.5h8" />
        <path d="M18.5 17.5 15.5 8.5H12" />
      </svg>
    ),
  },
  {
    title: "Worry-free protection",
    description: "Fully covered with mandatory insurance, detailed damage assessment, and liability settlement included in one package.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 11 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Smart theft monitoring",
    description: "Every fleet bike features integrated high-precision GPS tracking, active theft monitoring, and remote security controls.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Always there to help",
    description: "Reach our support team anytime via the digital customer portal for real-time fleet assistance and diagnostics.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8" />
        <path d="M8 14h6" />
      </svg>
    ),
  },
  {
    title: "Nationwide partner network",
    description: "Access our certified service partner network of mobile mechanics and local workshops across Hungary.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function WeHandleItAll() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left-Aligned Header */}
        <div className={styles.header}>
          <h2 className={`${styles.headerTitle} h2`}>We Handle It All</h2>
          <p className={`${styles.headerSub} body`}>
            With our nationwide service partner network, every operational burden is lifted from your shoulders.
          </p>
        </div>

        {/* Minimalist Typographic Grid */}
        <div className={styles.grid}>
          {SERVICES.map((service, index) => (
            <div key={index} className={styles.cell}>
              <div className={styles.cellIcon}>{service.icon}</div>
              <div className={styles.cellContent}>
                <h3 className={styles.cellTitle}>{service.title}</h3>
                <p className={styles.cellDesc}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
