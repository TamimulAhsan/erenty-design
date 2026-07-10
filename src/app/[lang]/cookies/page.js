import styles from "../privacy/Privacy.module.css";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.cookiesPage?.metaTitle || "Cookie Policy | E-Renty",
    description: dict.cookiesPage?.metaDesc || "Cookie Policy of E-Renty Kft.",
  };
}

export default async function CookiesPage({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.cookiesPage;

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
