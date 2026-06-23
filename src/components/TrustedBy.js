import React from 'react';
import Image from 'next/image';
import styles from './TrustedBy.module.css';

const outerLogos = [
  { name: 'SDG', src: '/companies/Sdg.jpeg' },
  { name: 'Foodora', src: '/companies/foodora.png' },
  { name: 'Gorilla Delivery', src: '/companies/gorilla_delivery.png' },
  { name: 'Indotek Group', src: '/companies/indotek_group.webp' },
  { name: 'Wolt', src: '/companies/wolt.jpeg' },
  { name: 'Sziget', src: '/companies/sziget.png' },
  { name: 'Everness Festival', src: '/companies/everness_festival.png' },
  { name: 'Movenpick', src: '/companies/movenpick.png' },
  { name: 'Tourinform', src: '/companies/Tourinform.jpeg' },
  { name: 'Hotel Napfeny', src: '/companies/hotel_napfeny.png' },
  { name: 'Accent Hotels', src: '/companies/Accent_hotels.jpeg' },
  { name: 'Bukfurdo Spa', src: '/companies/Bukfurdo%20Thermal%20&%20Spa.jpeg' }
];

const innerLogos = [
  { name: 'Cardoner Hotel', src: '/companies/cardoner_hotel.jpeg' },
  { name: 'Club Hotels', src: '/companies/club_hotels.jpeg' },
  { name: 'Giggle', src: '/companies/giggle.png' },
  { name: 'Lele Hotel', src: '/companies/lele_hotel.png' },
  { name: 'Roksh', src: '/companies/roksh.webp' },
  { name: 'Sonepar', src: '/companies/sonepar.png' },
  { name: 'Wantop Futar', src: '/companies/wantop_futar.jpeg' },
  { name: 'R73', src: '/companies/r73.webp' }
];

export default function TrustedBy() {
  return (
    <section className={styles.trustedBySection}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>Trusted by<br/>leading companies</h2>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>
              For Business
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
            <button className={styles.secondaryButton}>
              Rent now
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
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
                            sizes="(max-width: 992px) 80px, 120px"
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
                            sizes="(max-width: 992px) 80px, 120px"
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
