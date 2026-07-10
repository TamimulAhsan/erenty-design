import React from 'react';
import Image from 'next/image';
import Link from '@/components/LocalizedLink';
import styles from './TrustedBy.module.css';

const outerLogos = [
  { name: 'SDG', src: '/companies/sdg.png' },
  { name: 'Foodora', src: '/companies/foodora.png' },
  { name: 'Gorilla Delivery', src: '/companies/gorilladelivery.png' },
  { name: 'Indotek Group', src: '/companies/indotekgroup.png' },
  { name: 'Wolt', src: '/companies/wolt.png' },
  { name: 'Everness Festival', src: '/companies/evernessfestival.png' },
  { name: 'Movenpick', src: '/companies/movenpick.png' },
  { name: 'Tourinform', src: '/companies/tourinform.png' },
  { name: 'Hotel Napfeny', src: '/companies/hotelnapfeny.png' },
  { name: 'Accent Hotels', src: '/companies/accenthotels.png' },
  { name: 'Bukfurdo Spa', src: '/companies/bukfurdo.png' }
];

const innerLogos = [
  { name: 'Cardoner Hotel', src: '/companies/cardoner.png' },
  { name: 'Club Hotels', src: '/companies/clubhotels.png' },
  { name: 'Lelle Hotel', src: '/companies/lelle%20hotel.png' },
  { name: 'Sonepar', src: '/companies/sonepar.png' },
  { name: 'Wantop Futar', src: '/companies/wantopfutar.png' }
];

export default function TrustedBy({ dict }) {
  return (
    <section className={styles.trustedBySection}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>{dict.headingLine1}<br/>{dict.headingLine2}</h2>
          <div className={styles.buttonGroup}>
            <Link href="/business" className={styles.primaryButton}>
              {dict.forBusiness}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
            <Link href="/fleets" className={styles.secondaryButton}>
              {dict.rentNow}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>

        <div className={styles.visualContent}>
          <div className={styles.bikeWrapper}>
            <Image 
              src="/images/c29_pro.png" 
              alt="E-Renty Fleet" 
              fill
              sizes="(max-width: 992px) 700px, 1100px"
              className={styles.bikeImage}
            />
          </div>

          <div className={styles.rotatingWheel}>
            {/* Outer Ring */}
            {outerLogos.map((logo, index) => {
              const angle = (index / outerLogos.length) * 360;
              return (
                <div 
                  key={`outer-${logo.name}`} 
                  className={styles.logoWrapper}
                  style={{ '--angle': `${angle}deg`, '--radius': 'var(--radius-outer)' }}
                >
                  <div 
                    className={styles.logoReverser}
                    style={{ transform: `rotate(-${angle}deg)` }}
                  >
                    <div className={styles.logoInnerWrapper}>
                      <div className={styles.logoInner}>
                        <div className={styles.imageContainer}>
                          <Image 
                            src={logo.src} 
                            alt={logo.name} 
                            fill
                            sizes="(max-width: 992px) 105px, 150px"
                            className={styles.companyImage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Inner Ring */}
            {innerLogos.map((logo, index) => {
              // Offset angle so they interleave slightly with the outer ones
              const angle = ((index / innerLogos.length) * 360) + 20;
              return (
                <div 
                  key={`inner-${logo.name}`} 
                  className={styles.logoWrapper}
                  style={{ '--angle': `${angle}deg`, '--radius': 'var(--radius-inner)' }}
                >
                  <div 
                    className={styles.logoReverser}
                    style={{ transform: `rotate(-${angle}deg)` }}
                  >
                    <div className={styles.logoInnerWrapper}>
                      <div className={styles.logoInner}>
                        <div className={styles.imageContainer}>
                          <Image 
                            src={logo.src} 
                            alt={logo.name} 
                            fill
                            sizes="(max-width: 992px) 105px, 150px"
                            className={styles.companyImage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
