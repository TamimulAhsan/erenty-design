import styles from "../privacy/Privacy.module.css";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.termsPage?.metaTitle || "Terms & Conditions | E-Renty",
    description: dict.termsPage?.metaDesc || "Terms and Conditions (ÁSZF) of E-Renty Kft.",
  };
}

export default async function TermsPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.termsPage;

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroUpdated}>{t.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <div className={styles.content}>
        {/* Intro */}
        <div className={styles.section}>
          <p className={styles.sectionText}>{t.intro}</p>
        </div>

        {/* Full document download callout */}
        <a href="/gtc.pdf" target="_blank" rel="noopener noreferrer" className={styles.docCallout}>
          <div className={styles.docIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          </div>
          <div className={styles.docText}>
            <p className={styles.docTitle}>{t.fullDocTitle}</p>
            <p className={styles.docDesc}>{t.fullDocDesc}</p>
          </div>
          <span className={styles.docBtn}>{t.fullDocBtn}</span>
        </a>

        {/* Sections */}
        {t.sections.map((section, i) => (
          <div key={i} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.card && (
              <div className={styles.infoCard}>
                {section.card.map((line, j) => (
                  <p key={j} dangerouslySetInnerHTML={{ __html: line }} />
                ))}
              </div>
            )}
            {section.paragraphs && section.paragraphs.map((p, j) => (
              <p key={j} className={styles.sectionText}>{p}</p>
            ))}
            {section.items && (
              <ul className={styles.dataList}>
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
            {section.afterItems && section.afterItems.map((p, j) => (
              <p key={j} className={styles.sectionText}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
